import { FetchProps } from '../interfaces/common';
export declare const BROWSER_MAP: Record<string, string>;
export declare const PLATFORMS_MAP: Record<string, string>;
export declare const VERSION = "3.0.2";
export declare const BASE_URL = "https://online.sberbank.ru";
export declare const BASE_DEEPLINK_URL = "sberbankidlogin://sberbankidsso";
export declare const DEFAULT_REQUEST_TIMEOUT_MS = 10000;
export declare const defaultFethProps: FetchProps;
export declare const getAuthUrl: (baseUrl?: string) => string;
export declare const getUniversalLinkAuthUrl: (baseUrl?: string) => string;
export declare enum BrowserName {
    SAFARI = "Safari",
    PLAYSTATION_4 = "PlayStation 4",
    ANDROID_BROWSER = "Android Browser",
    CHROME = "Chrome",
    CHROMIUM = "Chromium",
    ELECTRON = "Electron",
    FIREFOX = "Firefox",
    QUPZILLA = "QupZilla",
    TIZEN = "Tizen",
    BADA = "Bada",
    WEBOS_BROWSER = "WebOS Browser",
    BLACKBERRY = "BlackBerry",
    SLIMERJS = "SlimerJS",
    PHANTOMJS = "PhantomJS",
    AMAZON_SILK = "Amazon Silk",
    SAILFISH = "Sailfish",
    SEAMONKEY = "SeaMonkey",
    VIVALDI = "Vivaldi",
    MICROSOFT_EDGE = "Microsoft Edge",
    INTERNET_EXPLORER = "Internet Explorer",
    WECHAT = "WeChat",
    K_MELEON = "K-Meleon",
    SLEIPNIR = "Sleipnir",
    PUFFIN = "Puffin",
    EPIPHANY = "Epiphany",
    MAXTHON = "Maxthon",
    UC_BROWSER = "UC Browser",
    YANDEX_BROWSER = "Yandex Browser",
    OPERA_COAST = "Opera Coast",
    SWING = "Swing",
    FOCUS = "Focus",
    MZ_BROWSER = "MZ Browser",
    NAVER_WHALE_BROWSER = "NAVER Whale Browser",
    SAMSUNG_INTERNET_FOR_ANDROID = "Samsung Internet for Android",
    OPERA_TOUCH = "Opera Touch",
    OPERA = "Opera",
    GOOGLEBOT = "Googlebot",
    WINDOWS_PHONE = "windows phone",
    GENERIC = "Generic",
    ROKU = "Roku"
}
export declare const MAX_STATE_LENGTH = 43;
