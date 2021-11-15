import { SberidSDKConfig, SberidSDKErrorResult, SberidSDKSuccessResult, SberidSDKProps } from './interfaces';
import { OidcParams, User } from '../interfaces/common';
import { SberidUniversalLink } from '../universal-link';
import { AbstractFastLogin } from '../fast-login';
import { NotificationBanner } from '../notification-banner';
import { SberidButton } from '../sberid-button';
import { FastAuthorizationResponse } from '../fast-login/interfaces';
export declare class SberidSDK {
    buttons: SberidButton[];
    user: User | undefined;
    oidcParams: OidcParams;
    config: SberidSDKConfig;
    onSuccessCallback: (data?: SberidSDKSuccessResult) => void;
    onErrorCallback: (data?: SberidSDKErrorResult) => void;
    parser: import("../browser/parser").Parser;
    windowStatus: string;
    w: any;
    fastLogin: AbstractFastLogin;
    universalLinkDetect: SberidUniversalLink;
    theme: any;
    notifyBanner: NotificationBanner;
    removeWindowListener(): void;
    private userHelper;
    constructor(config: SberidSDKProps);
    updateConfig(config: SberidSDKProps): void;
    onInit(config: SberidSDKProps): void;
    createButton(config: SberidSDKProps, container: HTMLElement): void;
    handleUserChange(user?: User): void;
    silentAuthorization(): Promise<FastAuthorizationResponse>;
    getUser(): Promise<void>;
    disable(): void;
    enable(): void;
    handleButtonClick(e: Event, link?: HTMLElement): Promise<boolean>;
    onGetUserSuccess(user?: User): Promise<void>;
    static getVersion(): string;
    setOIDCParams(oidc: OidcParams): Promise<void>;
    sbUniversalLinkCallback(params: {
        link: string;
        isUniversalLink: boolean;
    }): void;
    checkState(state: string): boolean;
    listener(event: Event & {
        data?: any;
    }): void;
    addWindowListener(): () => void;
    openDialog(url: string, params?: Record<string, string>): void;
    closeCallback(): void;
}
