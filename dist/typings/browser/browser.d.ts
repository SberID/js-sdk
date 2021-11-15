import { Parser } from './parser';
import { ParsedResult } from './interfaces';
export declare class Browser {
    static getParser(UA: string): Parser;
    static parse(UA: string): ParsedResult;
}
