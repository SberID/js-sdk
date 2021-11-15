export type Cacheable<T> = {
    data: T;
};

export interface ICache {
    set<T>(key: string, entry: T): void;
    get<T>(key: string): Promise<T | undefined>;
    remove(key: string): void;
    all?(): string[];
}

export class SberidCache implements ICache {
    private static instance: SberidCache;
    private cache: Record<string, unknown> = {};

    constructor() {
        if (!!SberidCache.instance) {
            return SberidCache.instance;
        }

        SberidCache.instance = this;

        return this;
    }

    public set = <T>(key: string, data: T): void => {
        const record: Cacheable<T> = {
            data,
        };
        this.cache[key] = record;
    };

    public get = <T>(key: string): Promise<T | undefined> => {
        const cacheRecord = this.cache[key] as Cacheable<T>;

        if (cacheRecord) {
            return new Promise((resolve) => resolve(cacheRecord.data));
        }

        return new Promise((resolve) => resolve(undefined));
    };

    public remove = (key: string): void => {
        delete this.cache[key];
    };

    public all = (): string[] => {
        return Object.keys(this.cache);
    };
}
