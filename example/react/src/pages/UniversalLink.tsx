import React, { useEffect, useMemo, useRef, useState } from 'react';

import { SberidUniversalLink } from 'sberid-js-sdk';

import { Log, LogProps, Navigation } from '../components';
import { oidcParams } from '../constants/common';


export const UniversalLinkDemo = () => {
    const params = useMemo(() => ({
        oidc: oidcParams,
    }), [])

    const [messages, setMessages] = useState<LogProps[]>([{
        message: navigator.userAgent,
        importance: 'info',
    }]);

    const sberidUniversalLink = useRef(new SberidUniversalLink(params));

    useEffect(() => {
        sberidUniversalLink.current.run(oidcParams).then((result) => {
            setMessages([...messages, ...[{
                message: `\n${JSON.stringify(result, null, '  ')}`,
                importance: 'success' as const,
            }]])
        });
    }, [])
    

    return (
        <div className="layout">
            <div className="header">
                <Navigation />
                <div className="typography typography--body">Аутентификация на веб-странице Партнера через мобильное приложение Сбербанк Онлайн (mWeb to App)</div>
            </div>
            <div className="content">
            <div className="logger">
                    {messages.length > 0 && messages.map((item, i) => <Log key={i} message={item.message} importance={item.importance} />)}
                </div>
            </div>
        </div>
    )
}