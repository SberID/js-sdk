export declare type Cacheable<T> = {
    data: T;
};
export interface ICache {
    set<T>(key: string, entry: T): void;
    get<T>(key: string): Promise<T | undefined>;
    remove(key: string): void;
    all?(): string[];
}
export declare class SberidCache implements ICache {
    private static instance;
    private cache;
    constructor();
    set: <T>(key: string, data: T) => void;
    get: <T>(key: string) => Promise<T | undefined>;
    remove: (key: string) => void;
    all: () => string[];
}
