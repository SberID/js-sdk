import { BrowserDetail, OSDetail, ParserConfig, PlatformDetail, AppDetail, AbstractParser } from './interfaces';
export declare const browserParsersList: ParserConfig<BrowserDetail>[];
export declare const appParsersList: ParserConfig<AppDetail>[];
export declare const osParsersList: ParserConfig<OSDetail>[];
export declare const platformParsersList: ({
    test: RegExp[];
    describe: (ua: string) => PlatformDetail;
} | {
    test: (parser: AbstractParser) => boolean;
    describe: (ua: string) => PlatformDetail;
})[];
export declare const textToLowerCase: (text?: string | undefined) => string;
