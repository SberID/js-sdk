import {OidcParams} from '../interfaces/common';

export interface UniversalLinkProps {
    needAdditionalRedirect?: boolean;
    params?: OidcParams;
    universalLinkUrl?: string;
    baseUrl?: string;
    deeplinkUrl?: string;
}
export interface UniversalLinkResponse {
    isPrivate: boolean;
    isUniversalLink: boolean;
    isWebview: boolean;
    os: string;
    browser: string;
    app?: string;
    link: string;
    deeplink: string;
    oidc: OidcParams;
}

export interface UniversalLinkConfig {
    needAdditionalRedirect: boolean;
    params?: OidcParams;
    universalLinkUrl: string;
    baseUrl: string;
    deeplinkUrl: string;
    debug: boolean;
    generateState: boolean;
    display: 'popup' | 'page';
}

export interface UniversalLinkRedirect {
    android: {
        [browser: string]: string;
    };
    ios: {
        [browser: string]: {
            https: string;
            http: string;
        };
    };
}

export interface AddionalRedirectParams {
    package?: string;
    redirect_uri?: string;
    ext_redirect_uri?: string;
}
