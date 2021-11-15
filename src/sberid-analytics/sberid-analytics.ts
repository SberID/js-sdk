import {SberVisorConfig, SberVisorEventParams, SberVisorSubmitParams} from './interfaces';
import {getMeta} from './utils';

import {getVersion, log} from '../utils/common';
import {defaultSberVisorConfig} from './constants';
import {SberidSDKProps} from '../sberid-sdk';

export const initSA = (config: SberidSDKProps): void => {
    if (window.sberbankIdAnalytics) {
        log(['SberVisor уже иницилизирован'], 'info');

        return;
    }

    const sberVisorConfig: SberVisorConfig = {
        ...defaultSberVisorConfig,
        ...config.sa,
        sberId: config?.oidc?.client_id || config?.sa?.clientId || '',
    };

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        import('./sa.bundle.js')
            .then(() => {
                window.sberbankIdAnalytics = new window.SberVisor(sberVisorConfig);
            })
            .catch((e) => log(['Ошибка при инициализации SberVisor', e], 'error'));
    } catch (e) {
        log(['Ошибка при инициализации SberVisor', e], 'error');
    }
};

export const sendSberAnalytics = <T>({
    eventCategory,
    eventAction,
    eventType,
    result,
    description,
    extendedProperties,
    clientName,
}: SberVisorSubmitParams<T>): void => {
    if (!window.sberbankIdAnalytics) {
        return;
    }

    const sdkVersion = 'js_' + getVersion();
    const merchantTitle = clientName || getMeta('title');
    const url = window.location.href;

    try {
        const params: SberVisorEventParams = {
            eventCategory,
            eventAction,
            eventType,
            properties: {
                merchUrl: url,
                merchantTitle,
                sdkVersion,
                result,
                errorDescription: description,
                ...extendedProperties,
            },
        };

        window.sberbankIdAnalytics.push(params);
    } catch (e) {
        log(
            [
                `Ошибка при отправке события (${eventCategory}, ${eventAction}, ${eventType}) в SberVisor`,
                e,
            ],
            'error',
        );
    }
};
