import {OidcParams} from '../interfaces/common';
import {AddionalRedirectParams, UniversalLinkConfig, UniversalLinkResponse} from './interfaces';
import {AbstractParser, BrowserMode} from '../browser/interfaces';
import {buildUrl, getUrlSearchParams, log} from '../utils/common';
import {getBrowserAlias} from './utils';
import {BrowserModeDetector, Browser} from '../browser/';
import {BrowserName, MAX_STATE_LENGTH} from '../constants/common';
import {BROWSERS, Os, Protocol, appRedirects, BROWSER_ALIASES_MAP} from './constants';
import {defaultUniversalLinkConfig} from '../sberid-sdk/constants';
import {generateRandom, isOIDCRedirect} from '../sberid-sdk/utils';
import {SberidSDKProps} from '../sberid-sdk';
import {Cookies} from '../services/cookies';

export class SberidUniversalLink {
    private config: UniversalLinkConfig;
    proxyParams: string[] = ['authApp', 'app_redirect_uri'];
    parser: AbstractParser = Browser.getParser(window.navigator.userAgent);

    constructor(config: SberidSDKProps) {
        const browserName = this.parser.getBrowserName();
        const display =
            config.display && browserName !== BrowserName.INTERNET_EXPLORER
                ? config.display
                : 'page';

        this.config = {
            ...defaultUniversalLinkConfig,
            ...config.universalLink,
            debug: !!config.debug,
            generateState: !!config.generateState,
            display,
        };

        if (!config.utmProxyDisabled) {
            this.proxyParams = this.proxyParams.concat([
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_term',
                'utm_content',
            ]);
        }

        if (this.config.debug) {
            log(['Инициализируем модуль UniversalLink'], 'info');
            log(['Параметры инициализации: ', this.config], 'info');
        }
    }

    isAllowedBrowser(alias: string): boolean {
        return BROWSERS.includes(alias);
    }

    getAdditionalRedirectParams(
        os: string,
        browser: string,
        redirect_uri: string,
    ): AddionalRedirectParams {
        const params: AddionalRedirectParams = {};
        if (
            this.config.needAdditionalRedirect &&
            Object.prototype.hasOwnProperty.call(appRedirects, os) &&
            Object.prototype.hasOwnProperty.call(appRedirects[<Os>os], browser)
        ) {
            switch (os) {
                case Os.ANDROID:
                    params.package = appRedirects[os][browser];
                    break;
                case Os.IOS:
                    let redirectUri = '';
                    try {
                        redirectUri = decodeURIComponent(redirect_uri || '');
                    } catch (e) {
                        log(['Ошибка декодирования redirect_uri', e], 'error');
                    }
                    const protocol = redirectUri.includes(`${Protocol.HTTPS}://`)
                        ? Protocol.HTTPS
                        : Protocol.HTTP;

                    params.ext_redirect_uri = `${
                        appRedirects[os][browser][protocol]
                    }${redirectUri.replace(/^https?:\/\//, '')}`;
                    break;
            }
        }

        return params;
    }

    generateState(length = MAX_STATE_LENGTH): string {
        return generateRandom(length);
    }

    buildOidcParams(oidcParams: OidcParams): OidcParams {
        const params: Record<string, string> = {};

        for (const key in oidcParams) {
            if (Object.prototype.hasOwnProperty.call(oidcParams, key)) {
                try {
                    params[key] = decodeURIComponent(oidcParams[key]);
                } catch (e) {
                    params[key] = '';
                    if (this.config.debug) {
                        log(['Ошибка декодирования oidc параметра', e], 'error');
                    }
                }
            }
        }

        if (oidcParams.scope && oidcParams.scope.includes('+')) {
            oidcParams.scope = oidcParams.scope.split('+').join(' ');
        }

        const alias = getBrowserAlias(this.parser.getBrowserName());
        const os = this.parser.getOSName(true);
        const customParams = {
            ...this.getAdditionalRedirectParams(os, alias, params.redirect_uri),
        } as OidcParams;
        customParams.display = this.config.display || 'page';

        const searchParams = getUrlSearchParams();
        const searchParamKeys = Object.keys(searchParams);

        for (let i = 0; i < searchParamKeys.length; i += 1) {
            if (this.proxyParams.includes(searchParamKeys[i])) {
                customParams[searchParamKeys[i]] = searchParams[searchParamKeys[i]];
            }
        }

        if (this.config.generateState && this.config.display === 'popup' && !isOIDCRedirect()) {
            const state = this.generateState();
            Cookies.set('sbid_state', state, {
                path: '/',
            });

            customParams.state = state;
        }

        return {...params, ...customParams};
    }

    async run(params = {} as OidcParams): Promise<UniversalLinkResponse> {
        const oidcParams = {
            ...this.config.params,
            ...params,
        };
        const isPrivate = (await this.detect()) === 'incognito';
        const result = this.parser.getResult();
        const alias = getBrowserAlias(this.parser.getBrowserName());
        const os = this.parser.getOSName(true);
        const oidc = this.buildOidcParams(oidcParams);

        const isAllowedAndroidBrowser = os === Os.ANDROID && this.isAllowedBrowser(alias);
        const isAllowedIosBrowser =
            os === Os.IOS &&
            (alias === BROWSER_ALIASES_MAP[BrowserName.SAFARI] ||
                (this.isAllowedBrowser(alias) && this.config.needAdditionalRedirect));
        const isUniversalLink =
            !isPrivate && !result.app.name && (isAllowedIosBrowser || isAllowedAndroidBrowser);

        const deeplink = buildUrl(this.config.deeplinkUrl, params);
        const link = buildUrl(
            isUniversalLink ? this.config.universalLinkUrl : this.config.baseUrl,
            params,
        );

        const response: UniversalLinkResponse = {
            isPrivate,
            isUniversalLink,
            app: result.app.name,
            isWebview: !!result.app.name,
            os,
            browser: alias,
            link: link,
            deeplink: deeplink,
            oidc,
        };

        if (this.config.debug) {
            log(['Получены данные для формирования ссылки: ', response]);
        }

        return Promise.resolve(response);
    }

    detect(): Promise<BrowserMode> {
        try {
            const browsingModeDetector = new BrowserModeDetector();

            return browsingModeDetector.run();
        } catch (e) {
            return Promise.resolve('normal');
        }
    }
}
