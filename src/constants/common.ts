import {FetchProps} from '../interfaces/common';

export const BROWSER_MAP: Record<string, string> = {
    amazon_silk: 'Amazon Silk',
    android: 'Android Browser',
    bada: 'Bada',
    blackberry: 'BlackBerry',
    chrome: 'Chrome',
    chromium: 'Chromium',
    electron: 'Electron',
    epiphany: 'Epiphany',
    firefox: 'Firefox',
    focus: 'Focus',
    generic: 'Generic',
    googlebot: 'Googlebot',
    ie: 'Internet Explorer',
    k_meleon: 'K-Meleon',
    maxthon: 'Maxthon',
    edge: 'Microsoft Edge',
    mz: 'MZ Browser',
    naver: 'NAVER Whale Browser',
    opera: 'Opera',
    opera_coast: 'Opera Coast',
    opera_touch: 'Opera Touch',
    phantomjs: 'PhantomJS',
    puffin: 'Puffin',
    qupzilla: 'QupZilla',
    safari: 'Safari',
    sailfish: 'Sailfish',
    samsung_internet: 'Samsung Internet for Android',
    seamonkey: 'SeaMonkey',
    sleipnir: 'Sleipnir',
    swing: 'Swing',
    tizen: 'Tizen',
    uc: 'UC Browser',
    vivaldi: 'Vivaldi',
    webos: 'WebOS Browser',
    wechat: 'WeChat',
    yandex: 'Yandex Browser',
};

export const PLATFORMS_MAP: Record<string, string> = {
    tablet: 'tablet',
    mobile: 'mobile',
    desktop: 'desktop',
    tv: 'tv',
};

export const VERSION = '3.0.2';
export const BASE_URL = 'https://online.sberbank.ru';
export const BASE_DEEPLINK_URL = 'sberbankidlogin://sberbankidsso';
export const DEFAULT_REQUEST_TIMEOUT_MS = 10000;
export const defaultFethProps: FetchProps = {
    method: 'GET',
    credentials: 'include',
};

export const getAuthUrl = (baseUrl = BASE_URL): string => {
    return `${baseUrl}/CSAFront/oidc/authorize.do`;
};

export const getUniversalLinkAuthUrl = (baseUrl = BASE_URL): string => {
    return `${baseUrl}/CSAFront/oidc/sberbank_id/authorize.do`;
};

export enum BrowserName {
    SAFARI = 'Safari',
    PLAYSTATION_4 = 'PlayStation 4',
    ANDROID_BROWSER = 'Android Browser',
    CHROME = 'Chrome',
    CHROMIUM = 'Chromium',
    ELECTRON = 'Electron',
    FIREFOX = 'Firefox',
    QUPZILLA = 'QupZilla',
    TIZEN = 'Tizen',
    BADA = 'Bada',
    WEBOS_BROWSER = 'WebOS Browser',
    BLACKBERRY = 'BlackBerry',
    SLIMERJS = 'SlimerJS',
    PHANTOMJS = 'PhantomJS',
    AMAZON_SILK = 'Amazon Silk',
    SAILFISH = 'Sailfish',
    SEAMONKEY = 'SeaMonkey',
    VIVALDI = 'Vivaldi',
    MICROSOFT_EDGE = 'Microsoft Edge',
    INTERNET_EXPLORER = 'Internet Explorer',
    WECHAT = 'WeChat',
    K_MELEON = 'K-Meleon',
    SLEIPNIR = 'Sleipnir',
    PUFFIN = 'Puffin',
    EPIPHANY = 'Epiphany',
    MAXTHON = 'Maxthon',
    UC_BROWSER = 'UC Browser',
    YANDEX_BROWSER = 'Yandex Browser',
    OPERA_COAST = 'Opera Coast',
    SWING = 'Swing',
    FOCUS = 'Focus',
    MZ_BROWSER = 'MZ Browser',
    NAVER_WHALE_BROWSER = 'NAVER Whale Browser',
    SAMSUNG_INTERNET_FOR_ANDROID = 'Samsung Internet for Android',
    OPERA_TOUCH = 'Opera Touch',
    OPERA = 'Opera',
    GOOGLEBOT = 'Googlebot',
    WINDOWS_PHONE = 'windows phone',
    GENERIC = 'Generic',
    ROKU = 'Roku',
}

export const MAX_STATE_LENGTH = 43;
