import equal from 'fast-deep-equal';

import {initSA, sendSberAnalytics} from '../sberid-analytics';
import {Browser} from '../browser';
import {CssObject, OidcParams, User} from '../interfaces/common';
import {SberidNotificationBannerButton} from '../sberid-button';
import {Cookies} from '../services/cookies';
import {buildUrl, hideLoader, log, setCssStyle, showLoader} from '../utils/common';
import {NotificationConfig, NotificationPosition} from './interfaces';
import {defaultNotificationConfig} from './constants';
import {UserHelper} from '../helper';
import {fadeIn, fadeOut} from './utils';
import {getAuthUrl} from '../constants/common';
import {SberidUniversalLink} from '../universal-link';
import {SberidSDKErrorResult, SberidSDKSuccessResult, SberidSDKProps} from '../sberid-sdk';
import {FastAuthorizationResponse} from '../fast-login/interfaces';
import {FastLogin} from '../fast-login';

export class NotificationBanner {
    private config: NotificationConfig;
    private button!: SberidNotificationBannerButton;
    private notification: HTMLDivElement;
    private readonly parser = Browser.getParser(window.navigator.userAgent);
    private userHelper: UserHelper;
    universalLinkDetect: SberidUniversalLink;
    fastLogin: FastLogin;
    private user: User | undefined;
    private oidcParams!: OidcParams;
    onSuccessCallback: (data?: SberidSDKSuccessResult) => void = () => {};
    onErrorCallback: (data?: SberidSDKErrorResult) => void = () => {};

    constructor(config: SberidSDKProps) {
        this.notification = document.createElement('div');

        this.config = {
            ...defaultNotificationConfig,
            ...config.notification,
            position: NotificationBanner.getDefaultPosition(
                config.notification && config.notification.position,
            ),
            fastLogin: !!config.fastLogin?.enable,
            sa: !!config.sa?.enable,
            debug: !!config.debug,
        };

        this.userHelper = UserHelper.getInstance();
        this.userHelper.setConfig({
            baseUrl: config.baseUrl,
            clientId: config.oidc.client_id,
        });
        this.userHelper.setListener(this.handleUserChange.bind(this));

        this.universalLinkDetect = new SberidUniversalLink(config);
        this.fastLogin = new FastLogin(config);

        if (this.config.sa) {
            if (config?.sa?.init === 'auto') {
                initSA(config);
            }
        }

        if (config.onSuccessCallback) {
            this.onSuccessCallback = config.onSuccessCallback;
        }

        if (config.onErrorCallback) {
            this.onErrorCallback = config.onErrorCallback;
        }

        this.create(config);
        this.setOIDCParams(config);
    }

    handleUserChange(user?: User): void {
        if (!equal(this.user, user)) {
            this.user = user;

            if (!user) {
                this.hide();
            }
        }
    }

    async setOIDCParams(config: SberidSDKProps): Promise<void> {
        const params = this.universalLinkDetect.buildOidcParams(config.oidc);
        const paramsKeys = Object.keys(params);

        const isForceUniversalLinkDisable =
            paramsKeys.includes('app_redirect_uri') ||
            paramsKeys.includes('authApp') ||
            paramsKeys['is_universal_link'] === 'false';

        if (config.mweb2app && !isForceUniversalLinkDisable) {
            const universalLinkResponse = await this.universalLinkDetect.run(params);

            this.button.setUrl(universalLinkResponse.link);
        } else {
            this.button.setUrl(buildUrl(getAuthUrl(config.baseUrl), params));
        }

        this.oidcParams = {...params};
    }

    async silentAuthorization(): Promise<FastAuthorizationResponse> {
        return await this.fastLogin.authorization(this.oidcParams);
    }

    async create(config: SberidSDKProps): Promise<void> {
        if (!this.notification) {
            this.notification = document.createElement('div');
        }
        const body = document.getElementsByTagName('body')[0];

        const container = document.createElement('div');
        container.className = 'sbid-notification-banner';
        /*if (this.isMobile()) {
            container.classList.add('sbid-notification-banner--mobile');
        }*/
        container.id = 'i-sbid-notification-banner';
        setCssStyle(container, this.getStyle());

        const label = document.createElement('div');
        label.innerHTML = 'Вход по Сбер ID';
        label.className = 'sbid-notification-banner__label';
        container.appendChild(label);

        const closeButton = document.createElement('a');
        closeButton.innerHTML =
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 4.65094L10.3675 0.282877C10.7431 -0.0927631 11.3485 -0.0942703 11.721 0.27826C12.0961 0.653395 12.0914 1.25686 11.7164 1.63195L7.34886 6L11.7164 10.368C12.0914 10.7431 12.0961 11.3466 11.721 11.7217C11.3485 12.0943 10.7431 12.0928 10.3675 11.7171L6 7.34906L1.63247 11.7171C1.25688 12.0928 0.651469 12.0943 0.278986 11.7217C-0.0960822 11.3466 -0.0914182 10.7431 0.283602 10.368L4.65114 6L0.283602 1.63195C-0.0914182 1.25686 -0.0960822 0.653395 0.278986 0.27826C0.651469 -0.0942703 1.25688 -0.0927631 1.63247 0.282877L6 4.65094Z" fill="#767676"/></svg>';
        closeButton.className = 'sbid-notification-banner__close';
        container.appendChild(closeButton);

        closeButton.addEventListener('click', this.onClose.bind(this));

        this.button = new SberidNotificationBannerButton(
            config,
            container,
            config.onButtonClick || this.handleButtonClick.bind(this),
        );

        body.appendChild(container);

        this.notification = container;
    }

    async handleButtonClick(e: Event): Promise<boolean> {
        e.preventDefault();
        e.stopPropagation();

        if ((<HTMLElement>e.target)?.getAttribute('disabled') === 'true') {
            return false;
        }

        showLoader();
        this.button.disable();

        if (this.config.sa) {
            sendSberAnalytics({
                eventCategory: 'Login',
                eventAction: 'sberid_Banner_Login_Button_Click',
                eventType: 'Click',
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
                this.onClose();
            } else {
                if (this.config.debug) {
                    log(['Ошибка быстрого входа', response.data], 'error');
                }

                window.location.href = url;
            }

            hideLoader();
            this.button.enable();
        } else {
            window.location.href = url;
        }

        return false;
    }

    private isMobile(): boolean {
        return this.parser.getPlatformType(true) === 'mobile';
    }

    isNotification(): boolean {
        return !!this.notification;
    }

    async show(user?: User): Promise<void> {
        if (!this.user && !user) {
            const u = await this.userHelper.getUser().catch((e) => {
                if (this.config.debug) {
                    log(['Ошибка при получении данных о пользователе', e], 'error');
                }
            });

            if (!u) {
                return;
            }

            this.user = u;
        }

        const animationDelay = this.config.animation ? 500 : 12;

        this.notification.classList.add('sbid-notification-banner--show');

        fadeIn(this.notification, animationDelay);

        if (this.config.sa) {
            sendSberAnalytics({
                eventCategory: 'Login',
                eventAction: 'sberid_Notification_Banner_Show',
                eventType: 'Show',
                description: 'success',
            });
        }

        if (this.isMobile() && this.config.autoClose) {
            if (this.config.debug) {
                log(`Баннер будет скрыт через ${this.config.autoCloseDelay} секунд.`);
            }

            setTimeout(this.onClose.bind(this), this.config.autoCloseDelay * 1000);
        }

        if (typeof this.config.onOpen === 'function') {
            this.config.onOpen();
        }
    }

    hide(): void {
        if (this.notification) {
            const animationDelay = this.config.animation ? 500 : 12;
            fadeOut(this.notification, animationDelay).then(() => {
                this.notification.remove();
            });

            this.notification.classList.remove('sbid-notification-banner--show');
        }
    }

    onClose(): void {
        if (this.notification) {
            this.hide();

            if (this.config.sa) {
                sendSberAnalytics({
                    eventCategory: 'Login',
                    eventAction: 'sberid_Notification_Banner_Close',
                    eventType: 'Close',
                    description: 'success',
                });
            }
        }
        const closeCount = +(<string>Cookies.get('sbid_notification_banner_close_count')) || 0;
        const currentDate = new Date();

        Cookies.set('sbid_notification_banner_closed', '1', {
            path: '/',
            expires: this.getCookieExpires(closeCount),
        });
        Cookies.set('sbid_notification_banner_close_count', `${closeCount + 1}`, {
            path: '/',
            expires: new Date(
                currentDate.getFullYear() + 1,
                currentDate.getMonth(),
                currentDate.getDate(),
            ),
        });

        if (this.config.onClose && typeof this.config.onClose === 'function') {
            this.config.onClose();
        }
    }

    getStyle(): CssObject {
        const defaultStyle: CssObject = {};

        if (!this.isMobile()) {
            if (['bottom-left', 'top-left'].includes(this.config.position)) {
                defaultStyle.left = `${this.config.offset.left}px`;
            }

            if (['bottom-right', 'top-right'].includes(this.config.position)) {
                defaultStyle.right = `${this.config.offset.right}px`;
            }

            if (['bottom-right', 'bottom-left'].includes(this.config.position)) {
                defaultStyle.bottom = `${this.config.offset.bottom}px`;
            }

            if (['top-right', 'top-left'].includes(this.config.position)) {
                defaultStyle.top = `${this.config.offset.top}px`;
            }
        }

        return defaultStyle;
    }

    getCookieExpires(countClose: number): number {
        const times = [7200, 86400, 604800, 2419200];
        let count = countClose || 0;

        if (countClose >= times.length) {
            count = times.length - 1;
        }

        return times[count];
    }

    destroy(): void {
        this.notification.remove();
    }

    static getDefaultPosition(pos?: NotificationPosition): NotificationPosition {
        let position: NotificationPosition = 'bottom-right';
        switch (pos) {
            case 'left':
                position = 'bottom-left';
                break;
            case 'right':
                position = 'bottom-right';
                break;
            default:
                break;
        }

        position =
            pos && ['bottom-left', 'bottom-right', 'top-left', 'top-right'].includes(pos)
                ? pos
                : position;

        return position;
    }
}
