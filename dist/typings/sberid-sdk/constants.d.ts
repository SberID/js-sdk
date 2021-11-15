import { UniversalLinkConfig } from '../universal-link';
export declare type ERROR_CODE = 'invalid_request' | 'unauthorized_client' | 'unsupported_response_type' | 'invalid_scope' | 'access_denied' | 'invalid_state' | 'window_closed';
export declare const ERROR_MESSAGES: {
    [key in ERROR_CODE]: string;
};
export declare const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export declare const defaultUniversalLinkConfig: UniversalLinkConfig;
