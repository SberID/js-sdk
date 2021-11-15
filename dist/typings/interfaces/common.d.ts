export declare interface AnyObject {
    [key: string]: any;
}
export declare interface CssObject {
    [property: string]: number | string;
}
export interface OidcParams {
    response_type: string;
    client_type: string;
    client_id: string;
    state: string;
    redirect_uri: string;
    scope: string;
    nonce: string;
    [key: string]: string;
}
export interface Deeplink {
    enable: boolean;
    mode: string;
    allowSberIDRedirects: Array<string>;
}
export interface User {
    firstname?: string;
    partname?: string;
    surname?: string;
}
export declare type FetchProps = {
    method?: 'GET' | 'POST';
    credentials?: 'include' | 'omit';
    body?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
};
