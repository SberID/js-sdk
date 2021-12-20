import { OidcParams } from '../interfaces/common';
import { AbstractFastLogin, FastAuthorizationResponse, FastLoginConfig } from './interfaces';
import { SberidSDKProps } from '../sberid-sdk';
export declare class FastLogin implements AbstractFastLogin {
    isFastLoginIframeRegistered: boolean;
    isFastLoginDataFetched: boolean;
    fastLoginIframe: HTMLIFrameElement;
    config: FastLoginConfig;
    iFrameName: string;
    removeLoadDataListener(): void;
    constructor(config: SberidSDKProps);
    authorization(oidcParams?: OidcParams): Promise<FastAuthorizationResponse>;
    buildUrl(oidcParams: OidcParams): string;
    createIFrame(url: string): Promise<FastAuthorizationResponse>;
    onFastLoginIframeCreateSuccess(r?: Event): void;
    loadFastLoginData(): Promise<FastAuthorizationResponse>;
    fetchFastLoginData(): Promise<void>;
    destroyFastLogin(): void;
}
