import {JsonDecoder} from "ts.data.json";

export type ResultData = {
    success: boolean,
    created: string,
    clientVendor: string,
    clientVersion: string,
    postHash: string
}

export type TaskData = {
    blocks: number,
    specVersion: string,
    specConfig: string,
    created: string,
    key: string, // to retrieve storage data with
    result: Record<string, ResultData>,
};

const resultDec = JsonDecoder.object<ResultData>({
    success: JsonDecoder.boolean,
    created: JsonDecoder.string,
    clientVendor: JsonDecoder.string,
    clientVersion: JsonDecoder.string,
    postHash: JsonDecoder.string,
}, 'result', {
    clientVendor: 'client-vendor',
    clientVersion: 'client-version',
    postHash: 'post-hash'
});

const resultsDec = JsonDecoder.dictionary<ResultData>(resultDec, 'results');

const taskDec = JsonDecoder.object<TaskData>({
    blocks: JsonDecoder.number,
    specVersion: JsonDecoder.string,
    specConfig: JsonDecoder.string,
    created: JsonDecoder.string,
    key: JsonDecoder.string,
    result: JsonDecoder.oneOf<Record<string, ResultData>>([JsonDecoder.isUndefined({}), resultsDec], 'optional result-dict'),
}, 'task', {
    specVersion: 'spec-version',
    specConfig: 'spec-config'
});

const listingDec = JsonDecoder.array<TaskData>(taskDec, 'listing');

// TODO change to '', to query from site root url. (api running on same domain as website is hosted)
const apiEndpoint = 'http://localhost:8080';

export type ClientQuery = {
    name: string,
    version: undefined | string,
};

export const queryListing = async (args: {
    clients?: Array<ClientQuery>, specVersion?: string, specConfig?: string,
    hasFail?: boolean, startAfter?: string, endBefore?: string}): Promise<Array<TaskData>> => {
    const apiURL = new URL(apiEndpoint + '/listing');
    const params = apiURL.searchParams;
    const {clients, specVersion, specConfig, hasFail, startAfter, endBefore} = args;
    if(clients !== undefined) {
        for (const q of clients) {
            params.set('client_'+q.name, q.version || 'all')
        }
    }
    if(specVersion !== undefined) {
        params.set('spec-version', specVersion);
    }
    if(specConfig !== undefined) {
        params.set('spec-config', specConfig);
    }
    if(hasFail) {
        params.set('has-fail', 'true');
    }
    if(startAfter !== undefined) {
        params.set('after', startAfter);
    }
    if(endBefore !== undefined) {
        params.set('before', endBefore);
    }
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
    return listingDec.decodePromise(data);
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
    return taskDec.decodePromise(data);
};

export const uploadEndpoint = apiEndpoint + '/upload';
