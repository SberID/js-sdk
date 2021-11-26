import React, {FC, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

import {
    SberidSDK,
    SberidSDKErrorResult,
    SberidSDKProps,
    SberidSDKSuccessResult,
    showLoader,
    hideLoader,
} from '@sberid/js-sdk';

import {Log, LogProps, Navigation} from '../components';
import {oidcParams, notification, sa, baseUrl, universalLinkParams} from '../constants/common';

export const SdkDemo: FC = () => {
    const [messages, setMessages] = useState<LogProps[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const sdk = useRef<SberidSDK>();

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

    

    useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }

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

        sdk.current = new SberidSDK(params);
    }, [onSuccessCallback, onErrorCallback]);

    useEffect(() => {
        if (sdk.current) {
            if (disabled) {
                sdk.current.disable();
            } else {
                sdk.current.enable();
            }
        }

    }, [disabled, sdk]);

    useEffect(() => {
        if (loading) {
            showLoader();
        } else {
            hideLoader();
        }

    }, [loading]);

    return (
        <div className="layout">
            <Navigation />
            <div className="header">
                <div className="typography typography--title">Инициализация SDK</div>
            </div>
            <div className="content">
                <div ref={containerRef} className="button-container"></div>
                <div className="typography typography--body">Настройки кнопки:</div>
                <div className="form">
                    <div className="form-group">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                className="checkbox__input"
                                name="disabled"
                                onChange={({target}) => setDisabled(target.checked)}
                                checked={disabled}
                            />
                            <span className="checkbox__icon"></span>
                            <span className="checkbox__label">Disabled</span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                className="checkbox__input"
                                name="loading"
                                onChange={({target}) => setLoading(target.checked)}
                                checked={loading}
                            />
                            <span className="checkbox__icon"></span>
                            <span className="checkbox__label">Loading</span>
                        </label>
                    </div>
                </div>
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
