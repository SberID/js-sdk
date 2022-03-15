import {Parser} from './parser';
import {AbstractParser, ParsedResult} from './interfaces';

export class Browser {
    static getParser(UA: string): AbstractParser {
        if (typeof UA !== 'string') {
            throw new Error('UserAgent should be a string');
        }

        return new Parser(UA);
    }

    static parse(UA: string): ParsedResult {
        return new Parser(UA).getResult();
    }
}
