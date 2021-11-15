import { User } from '../interfaces/common';
import { ICache } from './cache';
interface UserHelperConfig {
    baseUrl?: string;
    clientId?: string;
}
export declare class UserHelper {
    private static instance;
    config: UserHelperConfig;
    cache: ICache;
    listeners: Array<(user?: User) => void>;
    constructor();
    static getInstance(): UserHelper;
    setConfig(config: UserHelperConfig): void;
    setListener(cb: () => void): void;
    private callListeners;
    getUser(ignoreCache?: boolean): Promise<User | undefined>;
    resetUser(): Promise<boolean>;
}
export {};
