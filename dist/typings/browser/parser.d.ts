import { AppDetail, BrowserDetail, OSDetail, ParsedResult, ParserConfig, PlatformDetail } from './interfaces';
export declare class Parser {
    private ua;
    parsedResult: ParsedResult;
    constructor(UA: string | undefined);
    getUA(): string;
    test(regex: RegExp): boolean;
    getDetailInfo<T>(parsersList: ParserConfig<T>[]): ParserConfig<T> | undefined;
    parseBrowser(): BrowserDetail;
    getBrowser(): BrowserDetail;
    getBrowserName(toLowerCase?: boolean): string;
    getBrowserVersion(): string | undefined;
    parseOS(): OSDetail;
    getOS(): OSDetail;
    getOSName(toLowerCase?: boolean): string;
    getOSVersion(): string | undefined;
    parseApp(): AppDetail;
    getApp(): AppDetail;
    getAppName(toLowerCase?: boolean): string;
    parsePlatform(): PlatformDetail;
    getPlatform(): PlatformDetail;
    getPlatformType(toLowerCase?: boolean): string;
    parse(): Parser;
    getResult(): ParsedResult;
}
