import {BASE_URL} from '../constants/common';
import {defaultFastLoginConfig} from './constants';
import {OidcParams} from '../interfaces/common';
import {buildUrl, log} from '../utils/common';
import {AbstractFastLogin, FastAuthorizationResponse, Message, FastLoginConfig} from './interfaces';
import {createIframe, listenWindowMessages, postMessageToIframe} from './utils';
import {ERROR_MESSAGES} from '../sberid-sdk/constants';
import {SberidSDKProps} from '../sberid-sdk';

export class FastLogin implements AbstractFastLogin {
    isFastLoginIframeRegistered = false;
    isFastLoginDataFetched = false;
    fastLoginIframe!: HTMLIFrameElement;

    config: FastLoginConfig;
    iFrameName: string;
    removeLoadDataListener(): void {}

    constructor(config: SberidSDKProps) {
        this.iFrameName = 'sberid-iframe';
        this.isFastLoginIframeRegistered = false;
        this.isFastLoginDataFetched = false;

        this.config = {
            ...defaultFastLoginConfig,
            ...config.fastLogin,
            debug: config.debug,
            baseUrl: config.baseUrl || BASE_URL,
            oidcParams: config.oidc,
        };
    }

    async authorization(oidcParams?: OidcParams): Promise<FastAuthorizationResponse> {
        const params = oidcParams || this.config.oidcParams;

        if (!params) {
            return new Promise((_, reject) => {
                reject({
                    code: 'error',
                    error: 'invalid_request',
                    description: ERROR_MESSAGES['invalid_request'],
                });
            });
        }

        const url = this.buildUrl(params);

        return await this.createIFrame(url).catch((err) => err);
    }

    buildUrl(oidcParams: OidcParams): string {
        const params: OidcParams = {
            prompt: 'none',
            ...oidcParams,
        };

        return buildUrl(`${this.config.baseUrl}/CSAFront/oidc/authorizelow.do`, params);
    }

    async createIFrame(url: string): Promise<FastAuthorizationResponse> {
        this.fastLoginIframe = createIframe(
            url,
            this.iFrameName,
            (e) => {
                this.onFastLoginIframeCreateSuccess(e);
            },
            () => {
                this.destroyFastLogin();
                throw {
                    success: false,
                    error: {
                        code: 'error',
                        error: 'iframe_error',
                        description: 'Ошибка при создании iframe',
                    },
                };
            },
        );

        document.body.append(this.fastLoginIframe);

        return new Promise((resolve, reject) => {
            const timeoutID = setTimeout(() => {
                this.destroyFastLogin();
                reject({
                    success: false,
                    error: {
                        type: 'timeout',
                        description: 'Ошибка при создании iframe',
                    },
                });
            }, this.config.timeout);

            const removeRegisterIframeListener = listenWindowMessages((v: Message) => {
                if (v.type === 'iframe is registered') {
                    clearTimeout(timeoutID);
                    this.isFastLoginIframeRegistered = true;
                    this.loadFastLoginData()
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((data) => {
                            reject(data);
                        })
                        .finally(() => {
                            this.destroyFastLogin();
                        });
                    removeRegisterIframeListener();
                }
            });
        });
    }

    onFastLoginIframeCreateSuccess(r?: Event): void {
        if (this.config.debug) {
            log(['Iframe для быстрого входа создан', r]);
        }
    }

    async loadFastLoginData(): Promise<FastAuthorizationResponse> {
        if (this.isFastLoginIframeRegistered) {
            await this.fetchFastLoginData();
        }

        return new Promise((resolve, reject) => {
            this.removeLoadDataListener = listenWindowMessages(async (v: Message) => {
                switch (v.type) {
                    case 'iframe is registered':
                        await this.fetchFastLoginData();
                        break;
                    case 'success':
                        if (this.config.debug) {
                            log(['Успешно получены данные при быстром входе', v.data], 'success');
                        }
                        resolve(v.data);
                        break;
                    case 'error':
                        if (this.config.debug) {
                            log(['Ошибка получения данных при быстром входе', v.data], 'error');
                        }
                        reject(v.data);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    async fetchFastLoginData(): Promise<void> {
        if (this.isFastLoginDataFetched || !this.fastLoginIframe) {
            return;
        }

        postMessageToIframe({type: 'fetch data'}, this.fastLoginIframe?.contentWindow);
        this.isFastLoginDataFetched = true;
    }

    destroyFastLogin(): void {
        if (this.config.debug) {
            log(['Iframe для быстрого входа удален']);
        }

        if (this.fastLoginIframe) {
            this.fastLoginIframe.remove();
        }
        if (this.removeLoadDataListener) {
            this.removeLoadDataListener();
        }

        this.isFastLoginIframeRegistered = false;
        this.isFastLoginDataFetched = false;
    }
}
