import {BrowserName} from '../constants/common';
import {UniversalLinkRedirect} from './interfaces';

export const BROWSER_ALIASES_MAP: Record<string, string> = {
    [BrowserName.AMAZON_SILK]: 'amazon_silk',
    [BrowserName.ANDROID_BROWSER]: 'android',
    [BrowserName.BADA]: 'bada',
    [BrowserName.BLACKBERRY]: 'blackberry',
    [BrowserName.CHROME]: 'chrome',
    [BrowserName.CHROMIUM]: 'chromium',
    [BrowserName.ELECTRON]: 'electron',
    [BrowserName.EPIPHANY]: 'epiphany',
    [BrowserName.FIREFOX]: 'firefox',
    [BrowserName.FOCUS]: 'focus',
    [BrowserName.GENERIC]: 'generic',
    [BrowserName.GOOGLEBOT]: 'googlebot',
    [BrowserName.INTERNET_EXPLORER]: 'ie',
    [BrowserName.K_MELEON]: 'k_meleon',
    [BrowserName.MAXTHON]: 'maxthon',
    [BrowserName.MICROSOFT_EDGE]: 'edge',
    [BrowserName.MZ_BROWSER]: 'mz',
    [BrowserName.NAVER_WHALE_BROWSER]: 'naver',
    [BrowserName.OPERA]: 'opera',
    [BrowserName.OPERA_COAST]: 'opera_coast',
    [BrowserName.OPERA_TOUCH]: 'opera_touch',
    [BrowserName.PHANTOMJS]: 'phantomjs',
    [BrowserName.PUFFIN]: 'puffin',
    [BrowserName.QUPZILLA]: 'qupzilla',
    [BrowserName.SAFARI]: 'safari',
    [BrowserName.SAILFISH]: 'sailfish',
    [BrowserName.SAMSUNG_INTERNET_FOR_ANDROID]: 'samsung_internet',
    [BrowserName.SEAMONKEY]: 'seamonkey',
    [BrowserName.SLEIPNIR]: 'sleipnir',
    [BrowserName.SWING]: 'swing',
    [BrowserName.TIZEN]: 'tizen',
    [BrowserName.UC_BROWSER]: 'uc',
    [BrowserName.VIVALDI]: 'vivaldi',
    [BrowserName.WEBOS_BROWSER]: 'webos',
    [BrowserName.WECHAT]: 'wechat',
    [BrowserName.YANDEX_BROWSER]: 'yandex',
    [BrowserName.ROKU]: 'roku',
};

export const BROWSERS = ['chrome', 'yandex', 'firefox', 'samsung_internet', 'opera', 'opera_touch'];

export enum Os {
    ANDROID = 'android',
    IOS = 'ios',
}

export enum Protocol {
    HTTP = 'http',
    HTTPS = 'https',
}

export const appRedirects: UniversalLinkRedirect = {
    android: {
        chrome: 'com.android.chrome',
        yandex: 'com.yandex.browser',
        opera: 'com.opera.browser',
        firefox: 'org.mozilla.firefox',
        samsung_internet: 'com.sec.android.app.sbrowser',
    },
    ios: {
        chrome: {
            https: 'googlechromes://',
            http: 'googlechrome://',
        },
        yandex: {
            https: 'yandexbrowser-open-url://https://',
            http: 'yandexbrowser-open-url://http://',
        },
        opera_touch: {
            https: 'touch-https://',
            http: 'touch-http://',
        },
        firefox: {
            https: 'firefox://open-url%3Furl%3Dhttps%3A%2F%2F',
            http: 'firefox://open-url%3Furl%3Dhttp%3A%2F%2F',
        },
    },
};
