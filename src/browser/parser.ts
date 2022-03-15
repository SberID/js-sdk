import {
    AbstractParser,
    AppDetail,
    BrowserDetail,
    OSDetail,
    ParsedResult,
    ParserConfig,
    PlatformDetail,
} from './interfaces';
import {
    appParsersList,
    browserParsersList,
    osParsersList,
    platformParsersList,
    textToLowerCase,
} from './utils';

export class Parser implements AbstractParser {
    private ua: string;
    parsedResult: ParsedResult;

    constructor(UA: string | undefined) {
        if (!UA) {
            throw new Error("UserAgent parameter can't be empty ");
        }

        this.ua = UA;
        this.parsedResult = {} as ParsedResult;
        this.parse();
    }

    getUA(): string {
        return this.ua;
    }

    test(regex: RegExp): boolean {
        return regex.test(this.ua);
    }

    getDetailInfo<T>(parsersList: ParserConfig<T>[]): ParserConfig<T> | undefined {
        return parsersList.find((item) => {
            if (typeof item.test === 'function') {
                return item.test(this);
            }
            if (item.test instanceof Array) {
                return item.test.some((condition) => this.test(condition));
            }
            throw new Error("Browser's test function is not valid");
        });
    }

    parseBrowser(): BrowserDetail {
        this.parsedResult.browser = {};
        const browserDetail = this.getDetailInfo(browserParsersList);

        if (browserDetail) {
            this.parsedResult.browser = browserDetail.describe(this.getUA());
        }

        return this.parsedResult.browser;
    }

    getBrowser(): BrowserDetail {
        if (this.parsedResult.browser) {
            return this.parsedResult.browser;
        }

        return this.parseBrowser();
    }

    getBrowserName(toLowerCase?: boolean): string {
        if (toLowerCase) {
            return textToLowerCase(this.getBrowser().name);
        }

        return this.getBrowser().name || '';
    }

    getBrowserVersion(): string | undefined {
        return this.getBrowser().version;
    }

    parseOS(): OSDetail {
        this.parsedResult.os = {};
        const osDetail = this.getDetailInfo(osParsersList);

        if (osDetail) {
            this.parsedResult.os = osDetail.describe(this.getUA());
        }

        return this.parsedResult.os;
    }

    getOS(): OSDetail {
        if (this.parsedResult.os) {
            return this.parsedResult.os;
        }

        return this.parseOS();
    }

    getOSName(toLowerCase?: boolean): string {
        const name = this.getOS().name;

        if (toLowerCase) {
            return textToLowerCase(name);
        }

        return name || '';
    }

    getOSVersion(): string | undefined {
        return this.getOS().version;
    }

    parseApp(): AppDetail {
        this.parsedResult.app = {};
        const appDetail = this.getDetailInfo(appParsersList);

        if (appDetail) {
            this.parsedResult.app = appDetail.describe(this.getUA());
        }

        return this.parsedResult.app;
    }

    getApp(): AppDetail {
        if (this.parsedResult.app) {
            return this.parsedResult.app;
        }

        return this.parseApp();
    }

    getAppName(toLowerCase?: boolean): string {
        if (toLowerCase) {
            return textToLowerCase(this.getApp().name);
        }

        return this.getApp().name || '';
    }

    parsePlatform(): PlatformDetail {
        this.parsedResult.platform = {};
        const platformDetail = this.getDetailInfo<PlatformDetail>(platformParsersList);

        if (platformDetail) {
            this.parsedResult.platform = platformDetail.describe(this.getUA());
        }

        return this.parsedResult.platform;
    }

    getPlatform(): PlatformDetail {
        if (this.parsedResult.platform) {
            return this.parsedResult.platform;
        }
        return this.parsePlatform();
    }

    getPlatformType(toLowerCase?: boolean): string {
        const type = this.getPlatform().type;

        if (toLowerCase) {
            return textToLowerCase(type);
        }

        return type || '';
    }

    parse(): AbstractParser {
        this.parseBrowser();
        this.parseOS();
        this.parsePlatform();
        this.parseApp();

        return this;
    }

    getResult(): ParsedResult {
        return {...this.parsedResult};
    }
}
