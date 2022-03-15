import { OidcParams } from '../interfaces/common';
import { AddionalRedirectParams, UniversalLinkResponse } from './interfaces';
import { AbstractParser, BrowserMode } from '../browser/interfaces';
import { SberidSDKProps } from '../sberid-sdk';
export declare class SberidUniversalLink {
    private config;
    proxyParams: string[];
    parser: AbstractParser;
    constructor(config: SberidSDKProps);
    isAllowedBrowser(alias: string): boolean;
    getAdditionalRedirectParams(os: string, browser: string, redirect_uri: string): AddionalRedirectParams;
    generateState(length?: number): string;
    buildOidcParams(oidcParams: OidcParams): OidcParams;
    run(params?: OidcParams): Promise<UniversalLinkResponse>;
    detect(): Promise<BrowserMode>;
}
