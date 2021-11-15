import React, {FC, useCallback, useLayoutEffect, useRef, useState} from 'react';

import {
    NotificationProps,
    SberidSDK,
    SberidSDKErrorResult,
    SberidSDKProps,
    SberidSDKSuccessResult,
    UniversalLinkProps,
} from 'sberid-js-sdk';

import {Log, LogProps, Navigation} from '../components';
import {oidcParams, sa, baseUrl} from '../constants/common';

export const SdkDemo: FC = () => {
    const [messages, setMessages] = useState<LogProps[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const onSuccessCallback = useCallback(
        (result?: SberidSDKSuccessResult): void => {
            setMessages([
                ...messages,
                ...[
                    {
                        message: `Вы успешно вошли:  \n ${JSON.stringify(result, null, '  ')}`,
                        importance: 'success' as const,
                    },
                ],
            ]);
        },
        [messages, setMessages],
    );

    const onErrorCallback = useCallback(
        (result?: SberidSDKErrorResult): void => {
            setMessages([
                ...messages,
                ...[
                    {
                        message: `Что-то пошло не так:  \n ${JSON.stringify(result, null, '  ')}`,
                        importance: 'error' as const,
                    },
                ],
            ]);
        },
        [messages, setMessages],
    );

    const universalLinkParams: UniversalLinkProps = {
        needAdditionalRedirect: true,
        universalLinkUrl: `${baseUrl}/CSAFront/oidc/sberbank_id/authorize.do`,
        baseUrl: `${baseUrl}/CSAFront/oidc/authorize.do`,
    };

    const notification: NotificationProps = {
        enable: true,
        onNotificationBannerClose: () => {
            // eslint-disable-next-line no-console
            console.log('Баннер закрыт');
        },
        onNotificationBannerOpen: () => {
            // eslint-disable-next-line no-console
            console.log('Баннер открыт');
        },
    };

    useLayoutEffect(() => {
        const params: SberidSDKProps = {
            oidc: oidcParams,
            baseUrl,
            container: containerRef.current as HTMLDivElement,
            mweb2app: true,
            personalization: true,
            display: 'popup',
            universalLink: universalLinkParams,
            debug: true,
            sa: sa,
            changeUser: true,
            fastLogin: {
                enable: true,
                timeout: 1000,
                mode: 'default',
            },
            notification: notification,
            buttonProps: {
                type: 'default',
                custom: {
                    anonymous: 'Вход',
                    personal: 'Вход как {{userName}}',
                },
            },
            onSuccessCallback,
            onErrorCallback,
        };

        new SberidSDK(params);
    }, []);

    return (
        <div className="layout">
            <div className="header">
                <Navigation />
                <div className="typography typography--body">SDK</div>
            </div>
            <div className="content">
                <div ref={containerRef} className="container"></div>
                <div className="logger">
                    {messages.length > 0 &&
                        messages.map((item, i) => (
                            <Log key={i} message={item.message} importance={item.importance} />
                        ))}
                </div>
            </div>
        </div>
    );
};
