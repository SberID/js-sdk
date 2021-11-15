import { FetchProps } from '../interfaces/common';
export declare type FetchResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        code?: string;
        description?: string;
    };
};
export declare const createAbortController: () => AbortController;
export declare const sendRequest: <T>(url: string, props: FetchProps, timeout: number) => Promise<FetchResponse<T>>;
