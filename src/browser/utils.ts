import {
    BrowserDetail,
    OSDetail,
    ParserConfig,
    PlatformDetail,
    AppDetail,
    AbstractParser,
} from './interfaces';
import {APP_MAP, commonVersionIdentifier, OS_MAP, PLATFORMS_MAP} from './constants';
import {Parser} from './parser';
import {BrowserName} from 'constants/common';

const getFirstMatch = (regexp: RegExp, ua: string): string => {
    const match = ua.match(regexp);

    return (match && match.length > 0 && match[1]) || '';
};

const getSecondMatch = (regexp: RegExp, ua: string): string => {
    const match = ua.match(regexp);

    return (match && match.length > 1 && match[2]) || '';
};

export const browserParsersList: ParserConfig<BrowserDetail>[] = [
    /* Googlebot */
    {
        test: [/googlebot/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.GOOGLEBOT,
            };
            const version =
                getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Opera < 13.0 */
    {
        test: [/opera/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.OPERA,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Opera > 13.0 */
    {
        test: [/opr\/|opios/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.OPERA,
            };
            const version =
                getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Opera Touch */
    {
        test: [/opt/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.OPERA_TOUCH,
            };
            const version =
                getFirstMatch(/(?:opt)[\s/](\S+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/SamsungBrowser/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SAMSUNG_INTERNET_FOR_ANDROID,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/Whale/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.NAVER_WHALE_BROWSER,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/MZBrowser/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.MZ_BROWSER,
            };
            const version =
                getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/focus/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.FOCUS,
            };
            const version =
                getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/swing/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SWING,
            };
            const version =
                getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/coast/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.OPERA_COAST,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/yabrowser/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.YANDEX_BROWSER,
            };
            const version =
                getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/ucbrowser/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.UC_BROWSER,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/Maxthon|mxios/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.MAXTHON,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/epiphany/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.EPIPHANY,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/puffin/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.PUFFIN,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/sleipnir/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SLEIPNIR,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/k-meleon/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.K_MELEON,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/micromessenger/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.WECHAT,
            };
            const version =
                getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/msie|trident/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.INTERNET_EXPLORER,
            };
            const version = getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/\sedg\//i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.MICROSOFT_EDGE,
            };
            const version = getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/edg([ea]|ios)/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.MICROSOFT_EDGE,
            };
            const version = getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/vivaldi/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.VIVALDI,
            };
            const version = getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/seamonkey/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SEAMONKEY,
            };
            const version = getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/sailfish/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SAILFISH,
            };
            const version = getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/silk/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.AMAZON_SILK,
            };
            const version = getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/phantom/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.PHANTOMJS,
            };
            const version = getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/slimerjs/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SLIMERJS,
            };
            const version = getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.BLACKBERRY,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/(web|hpw)[o0]s/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.WEBOS_BROWSER,
            };
            const version =
                getFirstMatch(commonVersionIdentifier, ua) ||
                getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/bada/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.BADA,
            };
            const version = getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/tizen/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.TIZEN,
            };
            const version =
                getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/qupzilla/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.QUPZILLA,
            };
            const version =
                getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/firefox|iceweasel|fxios/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.FIREFOX,
            };
            const version = getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/electron/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.ELECTRON,
            };
            const version = getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);

            if (version) {
                browser.version = version;
            }

            return browser;
        },
    },
    {
        test: [/chromium/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.CHROMIUM,
            };
            const version =
                getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) ||
                getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    {
        test: [/chrome|crios|crmo/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.CHROME,
            };
            const version = getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Android Browser */
    {
        test: (parser: AbstractParser): boolean => {
            const notLikeAndroid = !parser.test(/like android/i);
            const butAndroid = parser.test(/android/i);
            return notLikeAndroid && butAndroid;
        },
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.ANDROID_BROWSER,
            };
            const version = getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* PlayStation 4 */
    {
        test: [/playstation 4/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.PLAYSTATION_4,
            };
            const version = getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Safari */
    {
        test: [/safari|applewebkit/i],
        describe: (ua: string): BrowserDetail => {
            const browser: BrowserDetail = {
                name: BrowserName.SAFARI,
            };
            const version = getFirstMatch(commonVersionIdentifier, ua);
            if (version) {
                browser.version = version;
            }
            return browser;
        },
    },
    /* Something else */
    {
        test: [/.*/i],
        describe: (ua: string): BrowserDetail => {
            /* Here we try to make sure that there are explicit details about the device
             * in order to decide what regexp exactly we want to apply
             * (as there is a specific decision based on that conclusion)
             */
            const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
            const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
            const hasDeviceSpec = ua.search('\\(') !== -1;
            const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
            return {
                name: getFirstMatch(regexp, ua),
                version: getSecondMatch(regexp, ua),
            };
        },
    },
];

export const appParsersList: ParserConfig<AppDetail>[] = [
    /* Facebook Messenger */
    {
        test: [/\bFB[\w_]+\/(Messenger|MESSENGER)/],
        describe: (): AppDetail => ({
            name: APP_MAP.messenger,
        }),
    },
    /* Facebook */
    {
        test: [/\bFB[\w_]+\//],
        describe: (): AppDetail => ({
            name: APP_MAP.facebook,
        }),
    },
    /* Twitter */
    {
        test: [/\bTwitter/i],
        describe: (): AppDetail => ({
            name: APP_MAP.twitter,
        }),
    },
    /* Line */
    {
        test: [/\bLine\//i],
        describe: (): AppDetail => ({
            name: APP_MAP.line,
        }),
    },
    /* Wechat */
    {
        test: [/\bMicroMessenger\//i],
        describe: (): AppDetail => ({
            name: APP_MAP.wechat,
        }),
    },
    /* Instagram */
    {
        test: [/\bInstagram/i],
        describe: (): AppDetail => ({
            name: APP_MAP.instagram,
        }),
    },
    /* Electron Application */
    {
        test: [/\bElectron/i],
        describe: (): AppDetail => ({
            name: APP_MAP.electron,
        }),
    },
    /* Outlook */
    {
        test: [/\bOutlook/i],
        describe: (): AppDetail => ({
            name: APP_MAP.outlook,
        }),
    },
    /* Pinterest App */
    {
        test: [/\bPinterest/i],
        describe: (): AppDetail => ({
            name: APP_MAP.pinterest,
        }),
    },
    /* Thunderbird App */
    {
        test: [/\bThunderbird/i],
        describe: (): AppDetail => ({
            name: APP_MAP.thunderbird,
        }),
    },
    /* Webview Based Browser */
    {
        test: [/\bwebview/i, /; wv/],
        describe: (): AppDetail => ({
            name: APP_MAP.webview,
        }),
    },
    /* Yandex App Browser */
    {
        test: [/\bYaApp/i, /\bYandexSearch/i],
        describe: (): AppDetail => ({
            name: APP_MAP.yaapp,
        }),
    },
];

export const osParsersList: ParserConfig<OSDetail>[] = [
    {
        test: [/Roku\/DVP/],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
            return {
                name: OS_MAP.Roku,
                version: version,
            };
        },
    },
    /* Windows Phone */
    {
        test: [/windows phone/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
            return {
                name: OS_MAP.WindowsPhone,
                version: version,
            };
        },
    },
    /* Windows */
    {
        test: [/windows/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
            return {
                name: OS_MAP.Windows,
                version: version,
            };
        },
    },
    /* Firefox on iPad */
    {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe: (ua: string): OSDetail => {
            const result: BrowserDetail = {
                name: OS_MAP.iOS,
            };
            const version = getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
            if (version) {
                result.version = version;
            }
            return result;
        },
    },
    /* macOS */
    {
        test: [/macintosh/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, '.');
            return {
                name: OS_MAP.MacOS,
                version: version,
            };
        },
    },
    /* iOS */
    {
        test: [/(ipod|iphone|ipad)/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(
                /[_\s]/g,
                '.',
            );
            return {
                name: OS_MAP.iOS,
                version: version,
            };
        },
    },
    /* Android */
    {
        test: (parser: AbstractParser): boolean => {
            const notLikeAndroid = !parser.test(/like android/i);
            const butAndroid = parser.test(/android/i);
            return notLikeAndroid && butAndroid;
        },
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
            const os = {
                name: OS_MAP.Android,
                version: version,
            };
            return os;
        },
    },
    /* WebOS */
    {
        test: [/(web|hpw)[o0]s/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
            const os: BrowserDetail = {
                name: OS_MAP.WebOS,
            };
            if (version) {
                os.version = version;
            }
            return os;
        },
    },
    /* BlackBerry */
    {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe: (ua: string): OSDetail => {
            const version =
                getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) ||
                getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) ||
                getFirstMatch(/\bbb(\d+)/i, ua);
            return {
                name: OS_MAP.BlackBerry,
                version: version,
            };
        },
    },
    /* Bada */
    {
        test: [/bada/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
            return {
                name: OS_MAP.Bada,
                version: version,
            };
        },
    },
    /* Tizen */
    {
        test: [/tizen/i],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
            return {
                name: OS_MAP.Tizen,
                version: version,
            };
        },
    },
    /* Linux */
    {
        test: [/linux/i],
        describe: (): OSDetail => ({
            name: OS_MAP.Linux,
        }),
    },
    /* Chrome OS */
    {
        test: [/CrOS/],
        describe: (): OSDetail => ({
            name: OS_MAP.ChromeOS,
        }),
    },
    /* Playstation 4 */
    {
        test: [/PlayStation 4/],
        describe: (ua: string): OSDetail => {
            const version = getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
            return {
                name: OS_MAP.PlayStation4,
                version: version,
            };
        },
    },
];

export const platformParsersList = [
    /* Googlebot */
    {
        test: [/googlebot/i],
        describe: (): PlatformDetail => ({
            type: 'bot',
            vendor: 'Google',
        }),
    },
    /* Huawei */
    {
        test: [/huawei/i],
        describe: (ua: string): PlatformDetail => {
            const model = getFirstMatch(/(can-l01)/i, ua) && 'Nova';
            const platform = {
                type: PLATFORMS_MAP.mobile,
                vendor: 'Huawei',
                model: '',
            };
            if (model) {
                platform.model = model;
            }
            return platform;
        },
    },
    /* Nexus Tablet */
    {
        test: [/nexus\s*(?:7|8|9|10).*/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
            vendor: 'Nexus',
        }),
    },
    /* iPad */
    {
        test: [/ipad/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
            vendor: 'Apple',
            model: 'iPad',
        }),
    },
    /* Firefox on iPad */
    {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
            vendor: 'Apple',
            model: 'iPad',
        }),
    },
    /* Amazon Kindle Fire */
    {
        test: [/kftt build/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
            vendor: 'Amazon',
            model: 'Kindle Fire HD 7',
        }),
    },
    /* Another Amazon Tablet with Silk */
    {
        test: [/silk/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
            vendor: 'Amazon',
        }),
    },
    /* Tablet */
    {
        test: [/tablet/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
        }),
    },
    /* iPod/iPhone */
    {
        test: (parser: AbstractParser): boolean => {
            const iDevice = parser.test(/ipod|iphone/i);
            const likeIDevice = parser.test(/like (ipod|iphone)/i);

            return iDevice && !likeIDevice;
        },
        describe: (ua: string): PlatformDetail => {
            const model = getFirstMatch(/(ipod|iphone)/i, ua);

            return {
                type: PLATFORMS_MAP.mobile,
                vendor: 'Apple',
                model: model,
            };
        },
    },
    /* Nexus Mobile */
    {
        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
            vendor: 'Nexus',
        }),
    },
    /* Mobile */
    {
        test: [/[^-]mobi/i],
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
        }),
    },
    /* BlackBerry */
    {
        test: (parser: AbstractParser): boolean =>
            parser.getBrowserName() === BrowserName.BLACKBERRY,
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
            vendor: 'BlackBerry',
        }),
    },
    /* Bada */
    {
        test: (parser: AbstractParser): boolean => parser.getBrowserName() === BrowserName.BADA,
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
        }),
    },
    /* Windows Phone */
    {
        test: (parser: AbstractParser): boolean =>
            parser.getBrowserName() === BrowserName.WINDOWS_PHONE,
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
            vendor: 'Microsoft',
        }),
    },
    /* Android Tablet */
    {
        test: (parser: AbstractParser): boolean => {
            const osMajorVersion = Number(String(parser.getOSVersion())?.split('.')[0]);

            return parser.getOSName(true) === 'android' && osMajorVersion >= 3;
        },
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tablet,
        }),
    },
    /* Android Mobile */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'android',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.mobile,
        }),
    },
    /* desktop */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'macos',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.desktop,
            vendor: 'Apple',
        }),
    },
    /* Windows */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'windows',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.desktop,
        }),
    },
    /* Linux */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'linux',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.desktop,
        }),
    },
    /* PlayStation 4 */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'playstation 4',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tv,
        }),
    },
    /* Roku */
    {
        test: (parser: AbstractParser): boolean => parser.getOSName(true) === 'roku',
        describe: (): PlatformDetail => ({
            type: PLATFORMS_MAP.tv,
        }),
    },
];

export const textToLowerCase = (text?: string): string => {
    return String(text).toLowerCase() || '';
};
