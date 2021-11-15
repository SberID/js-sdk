import { NotificationProps } from '../notification-banner';
import { FastloginProps } from '../fast-login';
import { SberidButtonProps } from '../sberid-button';
import { UniversalLinkProps } from '../universal-link';
import { Deeplink, OidcParams } from '../interfaces/common';
import { SberVisorProps } from '../sberid-analytics';
export declare type SdkResponse = (Response & {
    data: string | any;
}) | undefined;
export interface ExtendedError extends Error {
    code: number | null;
    request: XMLHttpRequest | null;
    response: SdkResponse;
}
export interface SberidSDKErrorResult {
    description: string;
    code: string;
    error: string;
    state?: string;
}
export interface SberidSDKSuccessResult {
    state: string;
    code: string;
}
export interface SberidSDKProps {
    oidc: OidcParams;
    baseUrl?: string;
    container?: string | HTMLDivElement;
    mweb2app?: boolean;
    personalization?: boolean;
    changeUser?: boolean;
    notification?: NotificationProps;
    display?: 'popup' | 'page';
    universalLink?: UniversalLinkProps;
    debug?: boolean;
    sa?: SberVisorProps;
    fastLogin?: FastloginProps;
    utmProxyDisabled?: boolean;
    generateState?: boolean;
    deeplink?: Deeplink;
    onButtonClick?: (e: Event, link?: HTMLElement) => Promise<boolean>;
    onSuccessCallback?: (data?: SberidSDKSuccessResult) => void;
    onErrorCallback?: (data?: SberidSDKErrorResult) => void;
    buttonProps?: SberidButtonProps;
}
export interface SberidSDKConfig {
    oidc: OidcParams;
    baseUrl: string;
    container?: string | HTMLDivElement;
    mweb2app: boolean;
    personalization: boolean;
    changeUser: boolean;
    fastLogin: boolean;
    sa: boolean;
    fastLoginMode?: string;
    notification: boolean;
    display: 'popup' | 'page';
    debug: boolean;
    generateState: boolean;
    deeplink: Deeplink;
}
export interface SberidSDKDialogConfig {
    directories: string;
    status: string;
    menubar: string;
    scrollbars: string;
    resizable: string;
    width: number;
    height: number;
    centered: boolean;
}
