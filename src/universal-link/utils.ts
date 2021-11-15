import {BROWSER_ALIASES_MAP} from './constants';

export const getBrowserAlias = (browserName: string): string => {
    return BROWSER_ALIASES_MAP[browserName];
};
