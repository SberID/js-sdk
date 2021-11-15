import {BASE_URL, defaultFethProps, DEFAULT_REQUEST_TIMEOUT_MS} from '../constants/common';
import {User} from '../interfaces/common';
import {sendRequest} from './http';
import {ICache, SberidCache} from './cache';

interface UserHelperConfig {
    baseUrl?: string;
    clientId?: string;
}
export class UserHelper {
    private static instance: UserHelper = new UserHelper();

    config: UserHelperConfig = {
        baseUrl: BASE_URL,
    };
    cache: ICache = new SberidCache();
    listeners: Array<(user?: User) => void> = [];

    constructor() {
        if (UserHelper.instance) {
            throw new Error(
                'Error: Instantiation failed: Use UserHelper.getInstance() instead of new.',
            );
        }
        UserHelper.instance = this;
    }

    public static getInstance(): UserHelper {
        return UserHelper.instance;
    }

    public setConfig(config: UserHelperConfig): void {
        this.config = {
            ...this.config,
            ...config,
        };
    }

    public setListener(cb: () => void): void {
        this.listeners.push(cb);
    }

    private callListeners(user?: User): void {
        for (let i = 0; i < this.listeners.length; i += 1) {
            this.listeners[i].call(this, user);
        }
    }

    async getUser(ignoreCache = true): Promise<User | undefined> {
        if (!this.config.baseUrl || !this.config.clientId) {
            return;
        }

        const url = `${this.config.baseUrl}/CSAFront/api/oidc/sbid?client_id=${this.config.clientId}`;
        let user = await this.cache.get<User>('user');

        if (!ignoreCache && user) {
            return user;
        }

        const response = await sendRequest<User>(url, defaultFethProps, DEFAULT_REQUEST_TIMEOUT_MS);

        if (response.success) {
            user = response.data;
        }

        if (user) {
            this.cache.set<User>('user', user);
            this.callListeners(user);

            return user;
        }

        return;
    }

    async resetUser(): Promise<boolean> {
        if (!this.config.baseUrl || !this.config.clientId) {
            return false;
        }

        const url = `${this.config.baseUrl}/CSAFront/api/oidc/sbid/reset?client_id=${this.config.clientId}`;
        const response = await sendRequest<User>(url, defaultFethProps, DEFAULT_REQUEST_TIMEOUT_MS);

        if (response.success) {
            this.cache.remove('user');
            this.callListeners();

            return true;
        }

        return false;
    }
}
