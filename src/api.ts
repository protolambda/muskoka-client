import {JsonDecoder} from "ts.data.json";

export const clientNames = [
    'artemis', 'harmony', 'lighthouse', 'lodestar', 'nimbus', 'prysm', 'pyspec', 'shasper', 'trinity', 'yeeth', 'zrnt'
];

export type ResultFilesData = {
    postStateURL: string,
    outLogURL: string,
    errLogURL: string,
}

const filesDec = JsonDecoder.object<ResultFilesData>({
    postStateURL: JsonDecoder.string,
    outLogURL: JsonDecoder.string,
    errLogURL: JsonDecoder.string,
}, 'result-files', {
    postStateURL: 'post-state',
    outLogURL: 'out-log',
    errLogURL: 'err-log',
});

export type ResultData = {
    success: boolean,
    created: string,
    clientName: string,
    clientVersion: string,
    postHash: string,
    files: ResultFilesData,
}

export type TaskData = {
    index: number,
    blocks: number,
    specVersion: string,
    specConfig: string,
    created: string,
    key: string, // to retrieve storage data with
    results: Record<string, ResultData>,
};

const resultDec = JsonDecoder.object<ResultData>({
    success: JsonDecoder.boolean,
    created: JsonDecoder.string,
    clientName: JsonDecoder.string,
    clientVersion: JsonDecoder.string,
    postHash: JsonDecoder.string,
    files: filesDec,
}, 'result', {
    clientName: 'client-name',
    clientVersion: 'client-version',
    postHash: 'post-hash'
});

const resultsDec = JsonDecoder.dictionary<ResultData>(resultDec, 'results');

const taskDec = JsonDecoder.object<TaskData>({
    index: JsonDecoder.number,
    blocks: JsonDecoder.number,
    specVersion: JsonDecoder.string,
    specConfig: JsonDecoder.string,
    created: JsonDecoder.string,
    key: JsonDecoder.string,
    results: JsonDecoder.oneOf<Record<string, ResultData>>([JsonDecoder.isUndefined({}), resultsDec], 'optional result-dict'),
}, 'task', {
    specVersion: 'spec-version',
    specConfig: 'spec-config'
});

const listingTasksDec = JsonDecoder.array<TaskData>(taskDec, 'listing tasks');

// TODO change to '', to query from site root url. (api running on same domain as website is hosted)
// const apiEndpoint = 'https://muskoka.cloud/api';
const apiEndpoint = 'http://localhost:8080';

export type ListingResult = {
    tasks: Array<TaskData>,
    totalTaskCount: number,
}

const listingResultsDec = JsonDecoder.object<ListingResult>({
    tasks: listingTasksDec,
    totalTaskCount: JsonDecoder.number,
}, 'listing result', {
    totalTaskCount: 'total-task-count',
});

export const queryListing = async (searchState: ListingSearchState): Promise<{listing: ListingResult, params: URLSearchParams}> => {
    const apiURL = new URL(apiEndpoint + '/listing');
    const params = apiURL.searchParams;
    listingSearchStateToParams(searchState, params);
    let resp;
    try {
        const url = apiURL.toString();
        console.log(url);
        resp = await fetch(url);
    } catch (err) {
        console.log("fetch err", err);
        throw err
    }
    if(resp.status !== 200) {
        // throw with body (describes error)
        throw new Error("failed to get data from listing api: "+resp.body);
    }

    const data = await resp.json();
    return listingResultsDec.decodePromise(data).then(res => ({listing: res, params: params}));
};

export type ListingSearchState = {
    // if undefined, all spec versions are listed
    specVersion?: string,
    // if undefined, all spec configs are listed
    specConfig?: string,
    // <clientName> --> <clientVersion>. If none, all versions apply.
    clients: Record<string, string | undefined>,
    // if the results should be filtered to only contain fails.
    hasFail: boolean,
    // paginate backwards by stopping *before* (i.e. excl) a given index
    before?: number,
    // paginate forwards by continuing *after* (i.e. excl) a given index
    after?: number
}

export const listingSearchParamsToState = (paramsStr: string): ListingSearchState => {
    const params = new URLSearchParams(paramsStr);
    const version = params.get('spec-version');
    const config = params.get('spec-config');
    const after = params.get('after');
    const before = params.get('before');
    const state: ListingSearchState = {
        specVersion: version ? version : undefined,
        specConfig: config ? config : undefined,
        clients: {},
        hasFail: params.get('has-fail') === 'true',
        after: after ? parseInt(after) : undefined,
        before: before ? parseInt(before) : undefined,
    };
    params.forEach((v, k) => {
        if (k.startsWith('client-')) {
            state.clients[k.substring('client-'.length)] = v;
        }
    });
    return state;
};

export const listingSearchStateToParams = (state: ListingSearchState, params: URLSearchParams) => {
    if(state.specVersion !== undefined) {
        params.set('spec-version', state.specVersion);
    } else {
        params.delete('spec-version');
    }
    if(state.specConfig !== undefined) {
        params.set('spec-config', state.specConfig);
    } else {
        params.delete('spec-config');
    }
    params.forEach((v, k) => {
        if (k.startsWith('client-')) {
            const name = k.substring('client-'.length);
            params.delete(name);
        }
    });
    Object.entries(state.clients).forEach(([k, v]) => {
        params.set('client-'+k, v ? v : 'all');
    });
    if (state.hasFail) {
        params.set('has-fail', 'true');
    } else {
        // default to false, just leave it out.
        params.delete('has-fail');
    }
    if(state.after !== undefined) {
        params.set('after', state.after.toString());
    } else {
        params.delete('after');
    }
    if(state.before !== undefined) {
        params.set('before', state.before.toString());
    } else {
        params.delete('before')
    }
};

export const queryTask = async (taskKey: string): Promise<TaskData> => {
    const apiURL = new URL(apiEndpoint + '/task');
    const params = apiURL.searchParams;
    params.set('key', taskKey);
    const resp = await fetch(apiURL.toString());
    if(resp.status !== 200) {
        // throw with body (describes error)
        throw new Error("failed to get data from task api: "+resp.body);
    }

    const data = await resp.json();
    data['key'] = taskKey;
    return taskDec.decodePromise(data);
};

export const uploadEndpoint = apiEndpoint + '/upload';


const storageAPI = "https://storage.googleapis.com";
const inputBucketName = "muskoka-transitions";

const getInputUrl = (inputKey: string) => (taskKey: string, specVersion: string, specConfig: string) => [storageAPI, inputBucketName, specVersion, specConfig, taskKey, inputKey].join("/");

export const getPreStateInputURL = getInputUrl("pre.ssz");
export const getBlocksInputURL = (blockIndex: number) => getInputUrl("block_" + blockIndex + ".ssz");

export const orderedResults = (results: Record<string, ResultData>): Array<{postHash: string, results: Array<{key: string, data: ResultData}>}> => {
    const byPostHash: Record<string, Array<{key: string, data: ResultData}>> = {};
    mainLoop: for (const [k, r] of Object.entries(results)) {
        if (!byPostHash.hasOwnProperty(r.postHash)) {
            byPostHash[r.postHash] = [];
        }
        const arr = byPostHash[r.postHash];
        // some tasks may run more than once because of pubsub delivery acknowledgement delays. Spot them (if they have the same data), and ignore the duplicates
        for (const other of arr) {
            if (other.data.success === r.success && other.data.clientName === r.clientName && other.data.clientVersion === r.clientVersion) {
                continue mainLoop;
            }
        }
        arr.push({key: k, data: r});
    }
    const orderedPostHashes = Object.keys(byPostHash).sort((ka, kb) => {
        const a = byPostHash[ka];
        const b = byPostHash[kb];
        for (const v of a) {
            // canonical spec to the left
            if (v.data.clientName === "pyspec") {
                return -1;
            }
            // failures to the right
            if (!v.data.success) {
                return 1;
            }
        }
        for (const v of b) {
            // canonical spec to the left
            if (v.data.clientName === "pyspec") {
                return 1;
            }
            // failures to the right
            if (!v.data.success) {
                return -1;
            }
        }
        return ka.localeCompare(kb);
    });
    return orderedPostHashes.map(h => ({
        postHash: h,
        results: byPostHash[h]
    }));
};
