import {ERROR_MESSAGES} from './constants';
import {openDialog} from './utils';
import {
    SberidSDKConfig,
    SberidSDKErrorResult,
    SberidSDKSuccessResult,
    SberidSDKProps,
} from './interfaces';

import {initSA, sendSberAnalytics} from '../sberid-analytics';
import {OidcParams, User} from '../interfaces/common';
import {buildUrl, getVersion, log, showLoader, hideLoader} from '../utils/common';
import {Browser} from '../browser';
import {Cookies} from '../services/cookies';
import {SberidUniversalLink} from '../universal-link';
import {getAuthUrl, BASE_URL, BrowserName} from '../constants/common';
import {FastLogin, AbstractFastLogin} from '../fast-login';
import {NotificationBanner} from '../notification-banner';
import {SberidButton} from '../sberid-button';
import {UserHelper} from '../helper';
import {FastAuthorizationResponse} from '../fast-login/interfaces';

export class SberidSDK {
    buttons: SberidButton[] = [];
    user: User | undefined;
    oidcParams!: OidcParams;
    config!: SberidSDKConfig;
    onSuccessCallback: (data?: SberidSDKSuccessResult) => void = () => {};
    onErrorCallback: (data?: SberidSDKErrorResult) => void = () => {};
    parser = Browser.getParser(window.navigator.userAgent);
    windowStatus = 'closed';
    w: any;
    fastLogin!: AbstractFastLogin;
    universalLinkDetect!: SberidUniversalLink;
    theme: any;
    notifyBanner!: NotificationBanner;
    removeWindowListener(): void {}
    private userHelper: UserHelper = UserHelper.getInstance();

    constructor(config: SberidSDKProps) {
        if (config.onSuccessCallback) {
            this.onSuccessCallback = config.onSuccessCallback;
        }

        if (config.onErrorCallback) {
            this.onErrorCallback = config.onErrorCallback;
        }

        this.updateConfig(config);

        this.onInit(config);
    }

    updateConfig(config: SberidSDKProps): void {
        const deeplinkParams = {
            enable: false,
            allowSberIDRedirects: [],
            mode: 'default',
            ...config.deeplink,
        };

        const browserName = this.parser.getBrowserName();
        const display =
            config.display && browserName !== BrowserName.INTERNET_EXPLORER
                ? config.display
                : 'page';

        this.config = {
            personalization: !!config.personalization,
            changeUser: !!config.changeUser,
            baseUrl: config.baseUrl ?? BASE_URL,
            debug: !!config.debug,
            mweb2app: !!config.mweb2app,
            fastLogin: !!config.fastLogin?.enable,
            sa: !!config.sa?.enable,
            fastLoginMode: config.fastLogin?.mode,
            notification: !!config.notification?.enable,
            display,
            generateState: !!config.generateState,
            oidc: config.oidc,
            container: config.container,
            deeplink: deeplinkParams,
        };
    }

    onInit(config: SberidSDKProps): void {
        if (this.config.sa) {
            if (config?.sa?.init === 'auto') {
                initSA(config);
            }
        }

        if (this.config.debug) {
            log(['Инициализируем SDK'], 'info');
            log(['Параметры инициализации: ', this.config], 'info');
        }

        this.userHelper.setConfig({
            baseUrl: this.config.baseUrl,
            clientId: this.config.oidc.client_id,
        });
        this.userHelper.setListener(this.handleUserChange.bind(this));

        this.fastLogin = new FastLogin(config);

        if (this.config.notification) {
            this.notifyBanner = new NotificationBanner({
                onButtonClick: this.handleButtonClick.bind(this),
                ...config,
            });
        }

        this.universalLinkDetect = new SberidUniversalLink(config);

        if (this.config.container) {
            let container: HTMLDivElement[] = [];

            if (this.config.container instanceof HTMLDivElement) {
                container = container.concat(this.config.container);
            } else {
                container = Array.from(
                    document.querySelectorAll<HTMLDivElement>(this.config.container),
                );
            }

            for (let i = 0; i < container.length; i += 1) {
                this.createButton(config, container[i]);
            }

            if (this.config.sa) {
                sendSberAnalytics({
                    eventCategory: 'Login',
                    eventAction: 'sberid_Login_Show',
                    eventType: 'Show',
                    extendedProperties: {},
                });
            }
        }

        this.setOIDCParams(this.config.oidc);

        if (this.config.personalization) {
            this.getUser();
        }
    }

    createButton(config: SberidSDKProps, container: HTMLElement): void {
        const button = new SberidButton(
            config,
            container,
            config.onButtonClick || this.handleButtonClick.bind(this),
        );
        this.buttons.push(button);
    }

    handleUserChange(user?: User): void {
        this.user = user;

        if (!user) {
            this.notifyBanner?.hide();
        }
    }

    async silentAuthorization(): Promise<FastAuthorizationResponse> {
        return await this.fastLogin.authorization(this.oidcParams);
    }

    async getUser(): Promise<void> {
        showLoader();

        if (this.config.debug) {
            log(['Получаем информацию о пользователе'], 'info');
        }

        const user = await this.userHelper.getUser().catch((e) => {
            if (this.config.debug) {
                log(['Ошибка при получении данных о пользователе', e], 'error');
            }
        });

        if (user) {
            await this.onGetUserSuccess(user);
        } else {
            if (this.config.debug) {
                log(['Ошибка при получении данных о пользователе'], 'error');
            }
        }

        hideLoader();
    }

    disable(): void {
        for (let i = 0; i < this.buttons.length; i += 1) {
            this.buttons[i].disable();
        }
    }

    enable(): void {
        for (let i = 0; i < this.buttons.length; i += 1) {
            this.buttons[i].enable();
        }
    }

    async handleButtonClick(e: Event, link?: HTMLElement): Promise<boolean> {
        this.w = void 0;

        if (link?.getAttribute('disabled') === 'true') {
            return false;
        }

        e.preventDefault();
        e.stopPropagation();

        showLoader();
        this.disable();

        if (this.config.sa) {
            const params = {
                personalization: link?.dataset?.personalization === 'true',
            };
            sendSberAnalytics({
                eventCategory: 'Login',
                eventAction: 'sberid_Login_Button_Click',
                eventType: 'Result',
                extendedProperties: params,
            });
        }

        const url =
            (<HTMLAnchorElement>e.target).closest('.sbid-button')?.getAttribute('href') || '';

        if (this.user && this.config.fastLogin) {
            const response = await this.silentAuthorization();

            if (response.success) {
                if (this.config.debug) {
                    log(['Успешный быстрый вход', response.data], 'success');
                }

                this.onSuccessCallback(response.data as SberidSDKSuccessResult);
                this.notifyBanner?.onClose();
            } else {
                if (this.config.debug) {
                    log(['Ошибка быстрого входа', response.data], 'error');
                }

                if (
                    this.config.display === 'popup' &&
                    this.parser.getPlatformType(true) === 'desktop'
                ) {
                    this.openDialog(url);
                    return false;
                } else {
                    window.location.href = url;
                }
            }

            hideLoader();
            this.enable();
        } else if (
            this.config.display === 'popup' &&
            this.parser.getPlatformType(true) === 'desktop'
        ) {
            this.openDialog(url);
            return false;
        } else {
            window.location.href = url;
        }

        return false;
    }

    async onGetUserSuccess(user?: User): Promise<void> {
        this.user = user;

        if (this.config.debug) {
            log(['Данные о пользователе получены', user], 'success');
        }

        const isBannerClosed = parseInt(Cookies.get('sbid_notification_banner_closed') ?? '0', 10);

        if (!isBannerClosed && this.user) {
            await this.notifyBanner?.show(user);
        }

        if (this.user && this.config.fastLogin && this.config.fastLoginMode === 'auto') {
            showLoader();
            this.disable();

            try {
                const response = await this.silentAuthorization();

                if (response.success) {
                    if (this.config.debug) {
                        log(['Успешный быстрый вход', response.data], 'success');
                    }

                    if (this.onSuccessCallback) {
                        this.onSuccessCallback(response.data as SberidSDKSuccessResult);
                    }
                    this.notifyBanner?.onClose();
                }
            } catch (e: any) {
                if (this.config.debug) {
                    log(['Автоматический вход не удался', e], 'error');
                }
            } finally {
                hideLoader();
                this.enable();
            }
        }
    }

    static getVersion(): string {
        return getVersion();
    }

    async setOIDCParams(oidc: OidcParams): Promise<void> {
        const params = this.universalLinkDetect.buildOidcParams(oidc);
        const paramsKeys = Object.keys(params);

        let isForceUniversalLinkDisable =
            (paramsKeys.includes('app_redirect_uri') && paramsKeys.includes('authApp')) ||
            paramsKeys['is_universal_link'] === 'false';

        this.oidcParams = {...params};

        const isMobile = this.parser.getPlatformType(true) === 'mobile';
        let baseUrl = getAuthUrl(this.config.baseUrl);

        if (isMobile && this.config.deeplink.enable && params.sberIDRedirect) {
            const sberIDRedirect = decodeURIComponent(params.sberIDRedirect);
            const isAllowSberIDRedirect =
                (this.config.deeplink.allowSberIDRedirects.length > 0 &&
                    this.config.deeplink.allowSberIDRedirects.indexOf(sberIDRedirect) !== -1) ||
                this.config.deeplink.allowSberIDRedirects.length === 0;

            if (isAllowSberIDRedirect) {
                baseUrl = sberIDRedirect;
                isForceUniversalLinkDisable = true;

                if (this.config.deeplink.mode === 'auto') {
                    if (this.config.debug) {
                        log([
                            'Автоматический переход по deeplink: ',
                            buildUrl(baseUrl, this.oidcParams),
                        ]);
                    }

                    window.location.href = buildUrl(baseUrl, this.oidcParams);
                } else if (this.config.debug) {
                    log([
                        'Будет осуществлен переход по deeplink: ',
                        buildUrl(baseUrl, this.oidcParams),
                    ]);
                }
            }
        }

        if (this.config.mweb2app && !isForceUniversalLinkDisable) {
            const universalLinkResponse = await this.universalLinkDetect.run(this.oidcParams);

            if (this.config.debug) {
                log(['Получаем данные для формирования ссылки: ', universalLinkResponse]);
            }
            this.sbUniversalLinkCallback(universalLinkResponse);
        } else {
            this.sbUniversalLinkCallback({
                isUniversalLink: false,
                link: buildUrl(baseUrl, this.oidcParams),
            });
        }
    }

    sbUniversalLinkCallback(params: {link: string; isUniversalLink: boolean}): void {
        for (let i = 0; i < this.buttons.length; i += 1) {
            this.buttons[i].setUrl(params.link);
        }
    }

    checkState(state: string): boolean {
        const sbidState = Cookies.get('sbid_state');

        if (state && sbidState !== state) {
            if (this.w) {
                this.windowStatus = 'closed';
                this.w.close();
            }

            if (typeof this.onErrorCallback === 'function') {
                this.onErrorCallback({
                    code: 'error',
                    error: 'invalid_state',
                    description: ERROR_MESSAGES['invalid_state'],
                });
            }

            Cookies.delete('sbid_state');

            return false;
        }

        return true;
    }

    listener(event: Event & {data?: any}): void {
        let message = {} as SberidSDKSuccessResult & {
            state: string;
            status: string;
            error: string;
            description: string;
        };

        try {
            message = JSON.parse(event.data);
        } catch (error) {
            if (this.config.debug) {
                log(['Ошибка при обработке postMessage', event.data], 'info');
            }
        }

        if (this.config.generateState && !this.checkState(message?.state)) {
            return;
        }

        if (message && (message.status === 'success' || message.status === 'error')) {
            if (this.w) {
                this.windowStatus = 'closed';
                this.w.close();
                this.w = void 0;
            }

            if (message.status === 'success' && typeof this.onSuccessCallback === 'function') {
                if (this.config.sa) {
                    sendSberAnalytics({
                        eventCategory: 'Login',
                        eventAction: 'sberid_Login_Auth_Result',
                        eventType: 'Result',
                        result: 'success',
                    });
                }

                hideLoader();
                this.enable();

                this.onSuccessCallback(message as SberidSDKSuccessResult);
            }

            if (message.status === 'error' && typeof this.onErrorCallback === 'function') {
                if (this.config.sa) {
                    const description = message.error + '_' + message.description;
                    sendSberAnalytics({
                        eventCategory: 'Login',
                        eventAction: 'sberid_Login_Auth_Result',
                        eventType: 'Result',
                        result: 'fail',
                        description,
                    });
                }

                hideLoader();
                this.enable();

                this.onErrorCallback(message as SberidSDKErrorResult);
            }
        }
    }

    addWindowListener(): () => void {
        const listener = this.listener.bind(this);
        window.addEventListener('message', listener);

        if (this.config.debug) {
            log(['Добавляем обработчики при открытии окна.'], 'info');
        }

        return function () {
            log(['Удаляем обработчики открытого окна.'], 'info');

            return window.removeEventListener('message', listener);
        };
    }

    openDialog(url: string, params?: Record<string, string>): void {
        if (this.config.debug) {
            log(['Открываем окно авторизации через Сбер ID.'], 'info');
        }

        this.w = openDialog(url, params);

        if (this.w) {
            this.windowStatus = 'opened';
            this.removeWindowListener = this.addWindowListener();

            const i = setInterval(() => {
                if (!this.w || this.w.closed) {
                    clearInterval(i);
                    this.closeCallback();
                }
            }, 100);
        }
    }

    closeCallback(): void {
        if (this.config.debug) {
            log(['Вызываем функцию обратного вызова при закрытии окна.'], 'info');
        }
        if (this.windowStatus !== 'closed') {
            this.windowStatus = 'closed';
            this.w = void 0;
            if (typeof this.onErrorCallback === 'function') {
                if (this.config.sa) {
                    const description = 'window_closed_' + ERROR_MESSAGES['window_closed'];
                    sendSberAnalytics({
                        eventCategory: 'Login',
                        eventAction: 'sberid_Login_Auth_Result',
                        eventType: 'Result',
                        result: 'fail',
                        description,
                    });
                }

                hideLoader();
                this.enable();

                this.onErrorCallback({
                    code: 'error',
                    error: 'window_closed',
                    description: ERROR_MESSAGES['window_closed'],
                });
            }
        }

        this.removeWindowListener();
    }
}
