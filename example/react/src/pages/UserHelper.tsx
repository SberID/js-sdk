import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { UserHelper, BASE_URL } from 'sberid-js-sdk';

import { Log, Navigation, LogProps } from '../components';


export const UserHelperDemo = () => {
    const [baseUrl, setBaseUrl] = useState(BASE_URL)
    const [clientId, setClientId] = useState('3BA14915-C78C-F687-77C0-71784F4797B1')
    const config = useMemo(() => ({
        baseUrl: baseUrl,
        clientId: clientId,
    }), [baseUrl, clientId])

    const [messages, setMessages] = useState<LogProps[]>([]);

    const userHelper = useRef(UserHelper.getInstance());

    useEffect(() => {
        userHelper.current.setConfig(config);
    }, [config])

    const handleGetUserClick = useCallback(async () => {
        const user = await userHelper.current.getUser();

        if (user) {
            setMessages([...messages, ...[{
                message: `Получена информаия о пользователе с помощью async/await:  \n ${JSON.stringify(user, null, '\t')}`,
                importance: 'success' as const,
            }]])
        } else {
            setMessages([...messages, ...[{
                message: 'Ошибка при получении данных о пользователе',
                importance: 'error' as const,
            }]])
        }

    }, [userHelper, messages])

    const handleResetUserClick = useCallback(async () => {
        if (await userHelper.current.resetUser()) {
            setMessages([...messages, ...[{
                message: 'Информаия о пользователе удалена',
                importance: 'success' as const,
            }]])
        } else {
            setMessages([...messages, ...[{
                message: 'Ошибка при удалении данных о пользователе',
                importance: 'error' as const,
            }]])
        }

    }, [userHelper, messages])

    return (
        <div className="layout">
            <div className="header">
                <Navigation />
                <div className="typography typography--headline">Информация о пользователе:</div>
            </div>
            <div className="form">
                <div className="form-group">
                    <label className="label">Адрес стенда:</label>
                    <input
                        type="text"
                        className="input input--default"
                        name="baseUrl"
                        onChange={({target}) => setBaseUrl(target.value)}
                        value={config.baseUrl}
                    />
                </div>
                <div className="form-group">
                    <label className="label">Client ID:</label>
                    <input
                        type="text"
                        onChange={({target}) => setClientId(target.value)}
                        className="input input--default"
                        name="clientId"
                        value={config.clientId}
                    />
                </div>
                <div className="form-group form-group--footer">
                    <div className="form-button">
                        <button type="button" onClick={handleGetUserClick} className="button">Получить инфорацию</button>
                    </div>
                    <div className="form-button">
                        <button type="button" onClick={handleResetUserClick} className="button">Удалить инфорацию</button>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="logger">
                    {messages.length > 0 && messages.map((item, i) => <Log key={i} message={item.message} importance={item.importance} />)}
                </div>
            </div>
        </div>
    )
}