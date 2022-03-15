import {BrowserName} from 'constants/common';
import {Browser} from './browser';
import {
    AbstractBrowserItemModeDetect,
    AbstractBrowserModeDetector,
    BrowserMode,
} from './interfaces';

type WebkitNavigatorExtended = Navigator & {webkitTemporaryStorage?: any};
type SafariWindowExtended = Window &
    typeof globalThis & {
        safariIncognito?: any;
        openDatabase?: (a: any, b: any, c: any, d: any) => void;
    };
type safariBlob = {
    size: number;
    payload: string;
    lastModifiedDate: Date;
    name: string;
};

export class BrowserModeDetector implements AbstractBrowserModeDetector {
    browserMode: BrowserMode = 'unknown';

    retry(ready: () => boolean): Promise<boolean> {
        return new Promise((resolve) => {
            let iteration = 0;
            const maxRetry = 50;
            const interval = 10;
            let isTimeout = false;

            const id = window.setInterval(() => {
                if (ready()) {
                    window.clearInterval(id);
                    resolve(isTimeout);
                }
                if (iteration++ > maxRetry) {
                    window.clearInterval(id);
                    isTimeout = true;
                    resolve(isTimeout);
                }
            }, interval);
        });
    }

    run(): Promise<BrowserMode> {
        return new Promise((resolve) => {
            new BrowserFactory().browser(this).detectBrowsingMode();

            this.retry(() => this.browserMode !== 'unknown').then(() => {
                resolve(this.browserMode);
            });
        });
    }
}

export class BrowserFactory {
    private browserData: any = undefined;

    browser(BrowserModeDetector: AbstractBrowserModeDetector): any {
        if (this.browserData && typeof this.browserData === 'object') {
            return this.browserData;
        }

        this.browserData = this.resolve(BrowserModeDetector);

        return this.browserData;
    }

    private resolve(BrowserModeDetector: AbstractBrowserModeDetector) {
        const browserName = Browser.getParser(window.navigator.userAgent).getBrowserName();

        switch (browserName) {
            case BrowserName.SAFARI:
                return new SafariBrowser(BrowserModeDetector);
            case BrowserName.FIREFOX:
                return new FirefoxBrowser(BrowserModeDetector);
            case BrowserName.INTERNET_EXPLORER:
                return new IE10EdgeBrowser(BrowserModeDetector);
            default:
                if ('webkitRequestFileSystem' in window || 'requestFileSystem' in window) {
                    return new WebkitBrowser(BrowserModeDetector);
                } else if (window.PointerEvent || 'MSPointerEvent' in window) {
                    return new IE10EdgeBrowser(BrowserModeDetector);
                }

                return new OtherBrowser(BrowserModeDetector);
        }
    }
}

export class WebkitBrowser implements AbstractBrowserItemModeDetect {
    private navigator: WebkitNavigatorExtended = navigator;
    private readonly STORAGE_QUOTA_LIMIT = 120000000;
    private readonly TEMP_STORAGE_QUOTA_LIMIT = 110000000;
    BrowserModeDetector: AbstractBrowserModeDetector;

    constructor(BrowserModeDetector: AbstractBrowserModeDetector) {
        this.BrowserModeDetector = BrowserModeDetector;
    }

    private callbackWhenWebkitTemporaryStorageQuotaNotLimited() {
        this.BrowserModeDetector.browserMode = 'normal';

        return;
    }

    private callbackWhenWebkitTemporaryStorageQuotaLimited() {
        this.BrowserModeDetector.browserMode = 'incognito';

        return;
    }

    private callbackWhenWebkitStorageQuotaLimited() {
        this.BrowserModeDetector.browserMode = 'incognito';

        return;
    }

    private checkWebkitTemporaryStorageQuota() {
        if (
            typeof this.navigator.webkitTemporaryStorage !== 'undefined' &&
            typeof this.navigator.webkitTemporaryStorage.queryUsageAndQuota !== 'undefined'
        ) {
            this.navigator.webkitTemporaryStorage.queryUsageAndQuota(
                (usedBytes: number, grantedBytes: number): void => {
                    if (grantedBytes < this.TEMP_STORAGE_QUOTA_LIMIT) {
                        this.callbackWhenWebkitTemporaryStorageQuotaLimited();
                    } else {
                        this.callbackWhenWebkitTemporaryStorageQuotaNotLimited();
                    }
                },
                () => {
                    this.callbackWhenWebkitTemporaryStorageQuotaNotLimited();
                },
            );
        } else {
            this.callbackWhenWebkitTemporaryStorageQuotaNotLimited();
        }
    }

    private checkStorageQuota() {
        if (
            typeof navigator.storage !== 'undefined' &&
            typeof navigator.storage.estimate !== 'undefined'
        ) {
            navigator.storage.estimate().then((estimate) => {
                if (estimate?.quota && estimate?.quota < this.STORAGE_QUOTA_LIMIT) {
                    this.callbackWhenWebkitStorageQuotaLimited();
                } else {
                    this.callbackWhenWebkitStorageQuotaNotLimited();
                }
            });
        } else {
            this.callbackWhenWebkitStorageQuotaNotLimited();
        }
    }

    private callbackWhenWebkitStorageQuotaNotLimited() {
        this.checkWebkitTemporaryStorageQuota();

        return;
    }

    detectBrowsingMode(): void {
        this.checkStorageQuota();
    }
}

export class FirefoxBrowser implements AbstractBrowserItemModeDetect {
    private db!: IDBOpenDBRequest;
    BrowserModeDetector: AbstractBrowserModeDetector;

    constructor(BrowserModeDetector: AbstractBrowserModeDetector) {
        this.BrowserModeDetector = BrowserModeDetector;
    }

    private callbackWhenIndexedDBNotWorking(): void {
        // On Firefox ESR versions, actually IndexedDB don't works.
        this.BrowserModeDetector.browserMode = 'incognito';
    }

    private callbackWhenIndexedDBWorking(): void {
        if (this.BrowserModeDetector.browserMode === 'unknown') {
            this.BrowserModeDetector.retry(() => this.db.readyState === 'done').then(
                (isTimeout: boolean) => {
                    if (isTimeout) {
                        return this.callbackWhenIndexedDBNotWorking();
                    }

                    if (this.db.result) {
                        this.BrowserModeDetector.browserMode = 'normal';
                    }
                },
            );
        }
    }

    detectBrowsingMode(): void {
        this.db = indexedDB.open('i');
        this.db.onsuccess = this.callbackWhenIndexedDBWorking.bind(this);
        this.db.onerror = this.callbackWhenIndexedDBNotWorking.bind(this);
    }
}

export class IE10EdgeBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;

    constructor(BrowserModeDetector: AbstractBrowserModeDetector) {
        this.BrowserModeDetector = BrowserModeDetector;
    }

    detectBrowsingMode(): void {
        this.BrowserModeDetector.browserMode = 'normal';

        try {
            if (!window.indexedDB) {
                this.BrowserModeDetector.browserMode = 'incognito';
            }
        } catch (e) {
            this.BrowserModeDetector.browserMode = 'incognito';
        }
    }
}

export class SafariBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;

    constructor(BrowserModeDetector: AbstractBrowserModeDetector) {
        this.BrowserModeDetector = BrowserModeDetector;
    }

    private tryFillLocalStorage(chunkSize: number): boolean {
        const size = chunkSize / 4;
        const content = new Array(size + 1).join('aあ');
        const blob: safariBlob = {
            size: chunkSize,
            payload: content,
            lastModifiedDate: new Date(),
            name: ~~(Math.random() * 100000) + 100000 + '.txt',
        };

        try {
            localStorage.setItem(blob.name, JSON.stringify(blob));
        } catch (e) {
            try {
                localStorage.removeItem(blob.name);
            } catch (e) {}

            return false;
        }

        try {
            localStorage.removeItem(blob.name);
        } catch (e) {}

        return true;
    }

    detectBrowsingMode(): void {
        const extendWindow: SafariWindowExtended = window;
        const browser = Browser.getParser(window.navigator.userAgent);
        const osMajorVersion = parseInt((<string>browser.getOSVersion())?.split('.')[0], 10) || 0;
        const browserMajorVersion =
            parseInt((<string>browser.getBrowserVersion())?.split('.')[0], 10) || 0;
        const osName = browser.getOSName(true);

        if (extendWindow.safariIncognito || !navigator.cookieEnabled) {
            this.BrowserModeDetector.browserMode = 'incognito';
            return;
        }

        try {
            extendWindow.openDatabase && extendWindow.openDatabase(null, null, null, null);
            extendWindow.localStorage.setItem('test', '1');
        } catch (e) {
            this.BrowserModeDetector.browserMode = 'incognito';
        }

        if (this.BrowserModeDetector.browserMode === 'unknown') {
            extendWindow.localStorage.removeItem('test');
            if (
                (osName === 'ios' && osMajorVersion >= 14) ||
                (osName === 'macos' && browserMajorVersion >= 14) ||
                (osName === 'ios' && browserMajorVersion === 0)
            ) {
                this.BrowserModeDetector.browserMode = 'normal';
            } else {
                const LOCAL_STORAGE_DATA_SIZE = 1024 * 1024 * 5; // 5MB

                if (this.tryFillLocalStorage(LOCAL_STORAGE_DATA_SIZE)) {
                    this.BrowserModeDetector.browserMode = 'incognito';
                } else {
                    this.BrowserModeDetector.browserMode = 'normal';
                }
            }
        }
    }
}

export class OtherBrowser implements AbstractBrowserItemModeDetect {
    BrowserModeDetector: AbstractBrowserModeDetector;

    constructor(BrowserModeDetector: AbstractBrowserModeDetector) {
        this.BrowserModeDetector = BrowserModeDetector;
    }

    detectBrowsingMode(): void {
        this.BrowserModeDetector.browserMode = 'normal';
    }
}
