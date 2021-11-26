import React, { useCallback, useMemo, useRef, useState } from 'react';

import { FastLogin } from '@sberid/js-sdk';

import { Log, LogProps, Navigation } from '../components';
import { oidcParams, baseUrl } from '../constants/common';


export const FastLoginDemo = () => {
    const params = useMemo(() => ({
        oidc: oidcParams,
        baseUrl,
    }), [])

    const [messages, setMessages] = useState<LogProps[]>([]);

    const fastLogin = useRef(new FastLogin(params));

    const handleClick = useCallback(async () => {
        const resulst = await fastLogin.current.authorization()

        if (resulst.success) {
            setMessages([...messages, ...[{
                message: `Вы успешно вошли:  \n${JSON.stringify(resulst.data, null, '  ')}`,
                importance: 'success' as const,
            }]])
        } else {
            setMessages([...messages, ...[{
                message: `Что-то пошло не так: \n${JSON.stringify(resulst.data, null, '  ')}`,
                importance: 'error' as const,
            }]])
        }

    }, [fastLogin, messages])
    

    return (
        <div className="layout">
            <Navigation />
            <div className="header">
                <div className="typography typography--title">Быстрый вход</div>
            </div>
            <div className="content">
                <div className="form">
                    <div className="form-button">
                        <button type="button" onClick={handleClick} className="button">Войти</button>
                    </div>
                </div>
                <div className="logger">
                    {messages.length > 0 && messages.map((item, i) => <Log key={i} message={item.message} importance={item.importance} />)}
                </div>
            </div>
        </div>
    )
}