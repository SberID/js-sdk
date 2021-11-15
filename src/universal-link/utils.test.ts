import {BROWSER_ALIASES_MAP} from './constants';
import {getBrowserAlias} from './utils';

describe('./utils/getBrowserAlias', () => {
    const browsers = Object.entries(BROWSER_ALIASES_MAP).map((elem) => ({
        browserName: elem[0],
        alias: elem[1],
    }));

    browsers.forEach((browser) => {
        test(`${browser.browserName} fixed`, () => {
            expect(getBrowserAlias(browser.browserName)).toBe(browser.alias);
        });
    });
});
