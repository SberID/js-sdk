import { AbstractParser, ParsedResult } from './interfaces';
export declare class Browser {
    static getParser(UA: string): AbstractParser;
    static parse(UA: string): ParsedResult;
}
