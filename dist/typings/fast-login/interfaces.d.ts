import { SberidSDKErrorResult, SberidSDKSuccessResult } from '../sberid-sdk';
import { OidcParams } from '../interfaces/common';
export interface FastloginProps {
    enable?: boolean;
    changeUser?: boolean;
    timeout?: number;
    mode?: 'default' | 'auto';
}
export declare type FastAuthorizationSuccessResponse = {
    success: boolean;
    data: SberidSDKSuccessResult;
};
export declare type FastAuthorizationErrorResponse = {
    success: boolean;
    data: SberidSDKErrorResult;
};
export declare type FastAuthorizationResponse = FastAuthorizationSuccessResponse | FastAuthorizationErrorResponse;
export interface FastLoginConfig {
    baseUrl: string;
    debug?: boolean;
    enable: boolean;
    timeout: number;
    mode: 'default' | 'auto';
    oidcParams?: OidcParams;
}
export interface AbstractFastLogin {
    isFastLoginIframeRegistered: boolean;
    isFastLoginDataFetched: boolean;
    fastLoginIframe: HTMLIFrameElement;
    config: FastLoginConfig;
    iFrameName: string;
    removeLoadDataListener: () => void;
    onFastLoginIframeCreateSuccess: (r?: Event) => void;
    loadFastLoginData: () => Promise<any>;
    fetchFastLoginData: () => void;
    destroyFastLogin: () => void;
    createIFrame: (url: string) => Promise<FastAuthorizationResponse>;
    authorization: (oidcParams?: OidcParams) => Promise<FastAuthorizationResponse>;
}
export declare type MessageToParent = {
    type: 'iframe is registered';
} | {
    type: 'success';
    data: FastAuthorizationSuccessResponse;
} | {
    type: 'error';
    data: FastAuthorizationErrorResponse;
};
export declare type MessageToIframe = {
    type: 'fetch data';
};
export declare type Message = MessageToParent | MessageToIframe;
