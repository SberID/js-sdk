import equal from 'fast-deep-equal';
import {generateRandom} from '../sberid-sdk/utils';

import {UserHelper} from '../helper';
import {User} from '../interfaces/common';
import {BUTTON_TEXT} from './constants';
import {SberidButtonText, SberidButtonConfig} from './interfaces';
import {hideLoader, hideOnClickOutside, log, showLoader} from '../utils/common';
import {sendSberAnalytics} from '../sberid-analytics';
import {SberidSDKProps} from '../sberid-sdk';

export class SberidButton {
    link: HTMLElement | undefined;
    config: SberidButtonConfig;
    userHelper: UserHelper;
    user: User | undefined;
    container: HTMLElement;
    changeUserElement: HTMLElement | undefined;
    changeUserPopupElement: HTMLElement | undefined;
    text: SberidButtonText;

    constructor(
        config: SberidSDKProps,
        container: HTMLElement,
        onClick: (e: Event, link?: HTMLElement) => void,
    ) {
        this.config = {
            personalization: !!config.personalization,
            debug: !!config.debug,
            sa: !!config.sa?.enable,
            changeUser: !!config.changeUser,
            type: config.buttonProps?.type || 'default',
            loader: config.buttonProps?.loader ?? true,
            logo: config.buttonProps?.logo ?? true,
            size: config.buttonProps?.size || 'default',
        };
        this.container = container;
        this.text = {
            ...BUTTON_TEXT[this.config.type],
            ...(this.config.type === 'custom' ? config.buttonProps?.custom : {}),
        };

        this.userHelper = UserHelper.getInstance();
        this.userHelper.setListener(this.handleUserChange.bind(this));

        this.link = this.create();

        if (onClick) {
            this.link.addEventListener('click', (e) => {
                onClick(e, this.link);
            });
        }

        this.container.appendChild(this.link);

        if (this.config.changeUser) {
            this.initChangeUser();
        }
    }

    initChangeUser(): void {
        this.changeUserElement =
            (this.link && this.link.querySelector<HTMLElement>('.sbid-button-change-user')) ||
            undefined;

        if (this.changeUserElement) {
            this.changeUserPopupElement =
                this.changeUserElement.querySelector<HTMLElement>(
                    '.sbid-button-change-user__popup',
                ) || undefined;

            this.changeUserElement.addEventListener('click', (e) => {
                if (this.changeUserElement) {
                    const isClosed = this.changeUserElement.dataset.stage === 'none';
                    this.changeUserElement.dataset.stage = isClosed ? 'popup' : 'none';

                    if (isClosed) {
                        if (this.changeUserPopupElement) {
                            hideOnClickOutside(this.changeUserPopupElement, () => {
                                if (this.changeUserElement) {
                                    this.changeUserElement.dataset.stage = 'none';
                                }
                            });
                        }
                    }
                }

                e.preventDefault();
                e.stopPropagation();
            });

            if (this.changeUserPopupElement) {
                this.changeUserPopupElement.addEventListener('click', this.changeUser.bind(this));
            }
        }
    }

    async changeUser(e: Event): Promise<void> {
        showLoader();

        if (this.config.sa) {
            sendSberAnalytics({
                eventCategory: 'Login',
                eventAction: 'sberid_Change_User_Button_Click',
                eventType: 'Click',
            });
        }

        if (this.config.debug) {
            log(['Сбрасываем информацию о пользователе'], 'info');
        }

        if (await this.userHelper.resetUser()) {
            if (this.config.debug) {
                log(['Данные о пользователе удалены'], 'success');
            }

            if (this.config.sa) {
                sendSberAnalytics({
                    eventCategory: 'Login',
                    eventAction: 'sberid_Change_User_Result',
                    eventType: 'Result',
                    description: 'success',
                });
            }

            if (this.changeUserElement) {
                this.changeUserElement.dataset.stage = 'none';
            }
        } else {
            if (this.config.debug) {
                log(['Ошибка при удалении данных о пользователе'], 'error');
            }

            if (this.config.sa) {
                sendSberAnalytics({
                    eventCategory: 'Login',
                    eventAction: 'sberid_Change_User_Result',
                    eventType: 'Result',
                    description: 'fail',
                });
            }

            if (this.changeUserElement) {
                this.changeUserElement.dataset.stage === 'error';

                const errorElement =
                    this.changeUserElement.querySelector<HTMLElement>(
                        '.sbid-button-change-user__error',
                    ) || undefined;

                if (errorElement) {
                    errorElement.innerHTML = 'Сервис временно недоступен';

                    hideOnClickOutside(errorElement, () => {
                        if (this.changeUserElement) {
                            this.changeUserElement.dataset.stage = 'none';
                        }
                    });
                }
            }
        }

        hideLoader();

        e.preventDefault();
        e.stopPropagation();
    }

    handleUserChange(user?: User): void {
        if (!equal(user, this.user)) {
            this.user = user;
            this.setText();
        }
    }

    getSize(): DOMRect {
        const container = document.createElement('div');
        const body = document.getElementsByTagName('body')[0];
        const link = this.create();

        container.className = 'sbid-check-button-container';
        container.id = 'i-sbid-check-button-container';
        container.appendChild(link);
        body.appendChild(container);
        const size = link.getBoundingClientRect();
        container.remove();

        return size;
    }

    isEnoughSpaceFromPersonalization(): boolean {
        const buttonSize = this.getSize();

        const changeUserBlockWidth = this.config.changeUser ? 24 : 0;

        if (
            buttonSize.width + changeUserBlockWidth >=
            this.container.getBoundingClientRect()?.width
        ) {
            return false;
        }

        return true;
    }

    create(): HTMLElement {
        const link = document.createElement('a');
        link.className = `sbid-button sbid-button--${this.config.size}`;
        link.id = `i-sbid-button-${generateRandom(6)}`;
        link.dataset.personalization = 'false';
        link.innerHTML = `
        ${
            this.config.logo
                ? '<span class="sbid-button__logo"><svg style="display: block" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 0C16.0927 0 18.9337 1.08103 21.1657 2.88421L18.6371 4.74793C17.0315 3.64848 15.0899 3.00354 13 3.00354C7.48924 3.00354 3.00587 7.48999 3.00587 13.0013C3.00587 18.5126 7.48924 22.9965 13 22.9965C18.5134 22.9965 22.9968 18.5126 22.9968 13.0013C22.9968 12.9118 22.9941 12.8223 22.9924 12.7328L25.7912 10.6699C25.9289 11.4245 26 12.2055 26 13.0013C26 20.1807 20.1795 26 13 26C5.82135 26 0 20.1807 0 13.0013C0 5.81931 5.82135 0 13 0ZM23.2856 5.05241C23.9006 5.84651 24.4262 6.71169 24.8456 7.63565L13.0002 16.3673L8.05093 13.2628V9.52921L13.0002 12.6337L23.2856 5.05241Z" fill=":logoFill:"/></svg></span>'
                : ''
        }
            <span class="sbid-button__text">${this.getText().text}</span>
            ${
                this.config.changeUser
                    ? '<span class="sbid-button-change-user" data-stage="none"><svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="2" fill="white"/><circle cx="2" cy="9" r="2" fill="white"/><circle cx="2" cy="16" r="2" fill="white"/></svg><span class="sbid-button-change-user__popup">Сменить пользователя</span></span><span class="sbid-button-change-user__error"></span></span>'
                    : ''
            }
            ${
                this.config.loader
                    ? '<span class="sbid-button-loader"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="0.2" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg></span>'
                    : ''
            }
        `;

        return link;
    }

    getText(): {
        text: string;
        personalization: boolean;
    } {
        if (this.config.personalization && this.user) {
            const userName: string[] = [];

            if (this.user.firstname) {
                userName.push(this.user.firstname);
            }

            if (this.user.surname) {
                userName.push(this.user.surname);
            }

            return {
                text: this.text.personal.replace('{{userName}}', userName.join(' ')),
                personalization: true,
            };
        }

        return {
            text: this.text.anonymous,
            personalization: false,
        };
    }

    setText(): void {
        if (this.isEnoughSpaceFromPersonalization() && this.link) {
            const buttonText = this.link.querySelector('.sbid-button__text');
            const text = this.getText();

            if (buttonText) {
                buttonText.innerHTML = text.text;
            }

            this.link.dataset.personalization = text.personalization.toString();
        }
    }

    disable(): void {
        this.link?.setAttribute('disabled', 'disabled');
    }

    enable(): void {
        this.link?.removeAttribute('disabled');
    }

    isDisabled(): boolean | undefined {
        return this.link?.hasAttribute('disabled');
    }

    setUrl(url: string): void {
        this.link?.setAttribute('href', url);
    }

    getButtonElement(): HTMLElement | undefined {
        return this.link;
    }
}

export class SberidNotificationBannerButton extends SberidButton {
    constructor(props: SberidSDKProps, container: HTMLElement, onClick: (e: Event) => void) {
        const config: SberidSDKProps = {
            ...props,
            buttonProps: {
                type: 'resume',
            },
        };

        super(config, container, onClick);
    }

    isEnoughSpaceFromPersonalization(): boolean {
        return true;
    }
}
