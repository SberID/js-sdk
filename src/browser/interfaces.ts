export type BrowserMode = 'normal' | 'incognito' | 'unknown';

export interface AbstractParser {
    parsedResult: ParsedResult;
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
    parse(): AbstractParser;
    getResult(): ParsedResult;
}

export interface AbstractBrowserModeDetector {
    browserMode: BrowserMode;
    retry: (ready: () => boolean) => Promise<boolean>;
    run: () => Promise<BrowserMode>;
}

export interface AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;
    detectBrowsingMode: () => void;
}

export interface AppDetail {
    name?: string;
}

export interface OSDetail extends AppDetail {
    versionName?: string;
    version?: string;
}

export interface BrowserDetail extends AppDetail {
    version?: string;
}

export interface PlatformDetail {
    type?: string;
    vendor?: string;
    model?: string;
}

export interface ParserConfig<T> {
    test: RegExp[] | ((parser: AbstractParser) => boolean);
    describe: ((ua: string) => T) | (() => T);
}

export interface ParsedResult {
    browser: BrowserDetail;
    os: OSDetail;
    platform: PlatformDetail;
    app: AppDetail;
}
