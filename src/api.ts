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
}, 'result');

const resultsDec = JsonDecoder.dictionary<ResultData>(resultDec, 'results');

const taskDec = JsonDecoder.object<TaskData>({
    blocks: JsonDecoder.number,
    specVersion: JsonDecoder.string,
    created: JsonDecoder.string,
    key: JsonDecoder.string,
    result: resultsDec,
}, 'task');

const listingDec = JsonDecoder.array<TaskData>(taskDec, 'listing');

// TODO change to '', to query from site root url. (api running on same domain as website is hosted)
const apiEndpoint = 'http://localhost:8080';

export type ClientQuery = {
    name: string,
    version: undefined | string,
};

export const queryListing = async (args: {clients?: Array<ClientQuery>, specVersion?: string, crashesOnly?: boolean, startAfter?: string, endBefore?: string}): Promise<Array<TaskData>> => {
    const apiURL = new URL(apiEndpoint + '/listing');
    const params = apiURL.searchParams;
    const {clients, specVersion, crashesOnly, startAfter, endBefore} = args;
    if(clients !== undefined) {
        for (const q of clients) {
            params.set('client_'+q.name, q.version || 'all')
        }
    }
    if(specVersion !== undefined) {
        params.set('spec-version', specVersion);
    }
    if(crashesOnly !== undefined) {
        params.set('crashes-only', 'true');
    }
    if(startAfter !== undefined) {
        params.set('after', startAfter);
    }
    if(endBefore !== undefined) {
        params.set('before', endBefore);
    }
    const resp = await fetch(apiURL.toString());
    if(resp.status != 200) {
        // throw with body (describes error)
        throw "failed to get data from listing api: "+resp.body;
    }

    return listingDec.decodePromise(resp.body);
};

export const queryTask = async (taskKey: string): Promise<TaskData> => {
    const apiURL = new URL(apiEndpoint + '/listing');
    const params = apiURL.searchParams;
    params.set('key', taskKey);
    const resp = await fetch(apiURL.toString());
    if(resp.status != 200) {
        // throw with body (describes error)
        throw "failed to get data from listing api: "+resp.body;
    }

    return taskDec.decodePromise(resp.body);
};
