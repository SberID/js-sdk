import { AbstractBrowserItemModeDetect, AbstractBrowserModeDetector, BrowserMode } from './interfaces';
export declare class BrowserModeDetector implements AbstractBrowserModeDetector {
    browserMode: BrowserMode;
    retry(ready: () => boolean): Promise<boolean>;
    run(): Promise<BrowserMode>;
}
export declare class BrowserFactory {
    private browserData;
    browser(BrowserModeDetector: AbstractBrowserModeDetector): any;
    private resolve;
}
export declare class WebkitBrowser implements AbstractBrowserItemModeDetect {
    private navigator;
    private readonly STORAGE_QUOTA_LIMIT;
    private readonly TEMP_STORAGE_QUOTA_LIMIT;
    BrowserModeDetector: AbstractBrowserModeDetector;
    constructor(BrowserModeDetector: AbstractBrowserModeDetector);
    private callbackWhenWebkitTemporaryStorageQuotaNotLimited;
    private callbackWhenWebkitTemporaryStorageQuotaLimited;
    private callbackWhenWebkitStorageQuotaLimited;
    private checkWebkitTemporaryStorageQuota;
    private checkStorageQuota;
    private callbackWhenWebkitStorageQuotaNotLimited;
    detectBrowsingMode(): void;
}
export declare class FirefoxBrowser implements AbstractBrowserItemModeDetect {
    private db;
    BrowserModeDetector: AbstractBrowserModeDetector;
    constructor(BrowserModeDetector: AbstractBrowserModeDetector);
    private callbackWhenIndexedDBNotWorking;
    private callbackWhenIndexedDBWorking;
    detectBrowsingMode(): void;
}
export declare class IE10EdgeBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;
    constructor(BrowserModeDetector: AbstractBrowserModeDetector);
    detectBrowsingMode(): void;
}
export declare class SafariBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;
    constructor(BrowserModeDetector: AbstractBrowserModeDetector);
    private tryFillLocalStorage;
    detectBrowsingMode(): void;
}
export declare class OtherBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;
    constructor(BrowserModeDetector: AbstractBrowserModeDetector);
    detectBrowsingMode(): void;
}
