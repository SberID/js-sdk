import { Parser } from './parser';
export declare type BrowserMode = 'normal' | 'incognito' | 'unknown';
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
    test: RegExp[] | ((parser: Parser) => boolean);
    describe: ((ua: string) => T) | (() => T);
}
export interface ParsedResult {
    browser: BrowserDetail;
    os: OSDetail;
    platform: PlatformDetail;
    app: AppDetail;
}
