import {ERROR_CODE, ERROR_MESSAGES} from '../sberid-sdk/constants';
import {BROWSER_MAP, VERSION} from '../constants/common';
import {CssObject, OidcParams} from '../interfaces/common';

export const getBrowserTypeByAlias = (browserAlias: string): string =>
    BROWSER_MAP[browserAlias] || '';

export const getVersion = (): string => VERSION;

export const getUrlSearchParams = (url = window.location.search.slice(1)): OidcParams => {
    return url
        ? (/^[?#]/.test(url) ? url.slice(1) : url).split('&').reduce((params: any, param) => {
              const [key, value] = param.split('=');
              params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';

              return params;
          }, {})
        : {};
};

export const buildUrl = (url: string, params: OidcParams): string => {
    const qs = Object.keys(params)
        .map((key) => [key, params[key]].map(encodeURIComponent).join('='))
        .join('&');

    if (url) {
        return `${url}${qs ? '?' : ''}${qs}`;
    }

    return qs;
};

type LogImportance = 'info' | 'success' | 'error';

type LogStyles = {
    [importance in LogImportance]: {
        color: string;
        background: string;
        border: string;
    };
};

const logStyles: LogStyles = {
    info: {
        color: '#0c5460',
        background: '#d1ecf1',
        border: '#bee5eb',
    },
    success: {
        color: '#155724',
        background: '#d4edda',
        border: '#c3e6cb',
    },
    error: {
        color: '#721c24',
        background: '#f8d7da',
        border: '#f5c6cb',
    },
};

export const log = (message: string | string[] | any, importance: LogImportance = 'info'): void => {
    const date = new Date();
    const info = `[${date.getHours()}:${date.getMinutes()}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}:${date.getMilliseconds()}] %c[${importance}]%c `;
    const style = `color: ${logStyles[importance].color};background-color: ${logStyles[importance].background};border: 1px solid ${logStyles[importance].border}`;

    // eslint-disable-next-line no-console
    console.info.apply(null, [info, style, ''].concat(message));
};

export const setCssStyle = (element: HTMLElement | null, styles: CssObject): void => {
    if (element?.style) {
        for (const property in styles) {
            element.style[property] = styles[property];
        }
    }
};

export const hideOnClickOutside = (element: HTMLElement, cb: () => void): void => {
    const outsideClickListener = (event: MouseEvent) => {
        if (!element.contains(event.target as Node) && isVisible(element)) {
            cb();
            removeClickListener();
        }
    };

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    };

    document.addEventListener('click', outsideClickListener);
};

const isVisible = (elem?: HTMLElement) =>
    !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

export const showLoader = (): void => {
    const loaders = document.querySelectorAll('.sbid-button-loader');

    for (let i = 0; i < loaders.length; i += 1) {
        const element = loaders[i];

        element.classList.add('sbid-button-loader--show');
    }
};

export const hideLoader = (): void => {
    const loaders = document.querySelectorAll('.sbid-button-loader');

    for (let i = 0; i < loaders.length; i += 1) {
        const element = loaders[i];

        element.classList.remove('sbid-button-loader--show');
    }
};

export const successWindowListener = (): void => {
    const params = getUrlSearchParams() as any;

    if (window.opener && (params.code || params.error)) {
        const message = {
            status: 'success',
            ...params,
        };

        if (message.error) {
            message.status = 'error';
            message.description =
                typeof message.code === 'string'
                    ? ERROR_MESSAGES[message.code as ERROR_CODE] || 'Что-то пошло не так'
                    : '';
        }
        try {
            window.opener.postMessage(
                JSON.stringify(Object.assign(message, params)),
                window.opener.location.href,
            );
        } catch (e) {
            log(['Ошибка при отправке сообщения из окна авторизации по Сбер ID', e], 'error');
        }
    }
};
