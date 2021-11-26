import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SberidUniversalLink } from '@sberid/js-sdk';

import { Log, LogProps, Navigation } from '../components';
import { oidcParams } from '../constants/common';


export const UniversalLinkDemo = () => {
    const params = useMemo(() => ({
        oidc: oidcParams,
    }), []);

    const [messages, setMessages] = useState<LogProps[]>([]);

    const sberidUniversalLink = useRef(new SberidUniversalLink(params));

    const runUniversalLink = useCallback(() => {
        sberidUniversalLink.current.run(oidcParams).then((result) => {
            setMessages([{
                message: `\n${JSON.stringify(result, null, '  ')}`,
                importance: 'success' as const,
            }]);
        });
    }, [setMessages, sberidUniversalLink])

    useEffect(() => {
        runUniversalLink();
    }, [runUniversalLink]);

    return (
        <div className="layout">
            <div className="header">
                <Navigation />
                <div className="typography typography--title">Аутентификация на веб-странице Партнера через мобильное приложение Сбербанк Онлайн (mWeb to App)</div>
            </div>
            <div className="content">
                <div className="logger">
                    <Log message={navigator.userAgent} importance='info' />
                    {messages.length > 0 && messages.map((item, i) => <Log key={i} message={item.message} importance={item.importance} />)}
                </div>
                <div className="typography typography--body">Описание объекта response:</div>
                <table className="table">
                    <tr>
                        <td>
                            <b>№</b>
                        </td>
                        <td>
                            Наименование параметра
                        </td>
                        <td>
                            Описание
                        </td>
                        <td>
                            Пример
                        </td>
                    </tr>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>
                            isPrivate
                        </td>
                        <td>
                            Режим браузера. <br /> <b>true</b> - приватный <br /><b>false</b> - обычный
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">false</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            2
                        </td>
                        <td>
                            isUniversalLink
                        </td>
                        <td>
                            <b>true</b> - из данного браузера можно запускать универсальную ссылку <br />
                            <b>false</b> - универсальную ссылку запускать нельзя, т.к. это может привести к ошибке на стороне Партнера
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">true</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            3
                        </td>
                        <td>
                            os
                        </td>
                        <td>
                            Операционная система
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">ios</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            4
                        </td>
                        <td>
                            browser
                        </td>
                        <td>
                            Браузер
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">safari</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            5
                        </td>
                        <td>
                            link
                        </td>
                        <td>
                            Полная ссылка запроса кода авторизации
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">
                                    https://online.sberbank.ru/CSAFront/oidc/sberbank_id/authorize.do?<br />
                                    response_type=code&amp;<br />
                                    scope=openid+gender+snils&amp;<br />
                                    client_id=AAAABBBB-XXXX-YYYY-ZZZZ-A12A618A4C3C&amp;<br />
                                    state=7bQfJTePBhlW&amp;<br />
                                    nonce=w9H8bh2yN4mQ&amp;<br />
                                    redirect_uri=https://example.com/external_login
                                </span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            6
                        </td>
                        <td>
                            deeplink
                        </td>
                        <td>
                            Deeplink без параметров (для вызова МП СБОЛ в сценарии App2Webview)
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">sberbankidlogin://sberbankid/sso</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            7
                        </td>
                        <td>
                            universalLinkUrl
                        </td>
                        <td>
                            Универсальная ссылка без параметров
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">https://online.sberbank.ru/CSAFront/oidc/sberbank_id/authorize.do</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            8
                        </td>
                        <td>
                            defaultLinkUrl
                        </td>
                        <td>
                            Обычная ссылка без параметров
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">https://online.sberbank.ru/CSAFront/oidc/authorize.do</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            9
                        </td>
                        <td>
                            deepLinkUrl
                        </td>
                        <td>
                            Полный deeplink (для вызова МП СБОЛ в сценарии App2Webview)
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">
                                    sberbankidlogin://sberbankid/sso?<br />
                                    response_type=code&amp;<br />
                                    scope=openid+gender+snils&amp;<br />
                                    client_id=AAAABBBB-XXXX-YYYY-ZZZZ-4C3C&amp;<br />
                                    state=7bQfJTePBhlW&amp;<br />
                                    nonce=w9H8bh2yN4mQ&amp;<br />
                                    redirect_uri=https://example.com/external_login
                                    </span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            10
                        </td>
                        <td>
                            oidc
                        </td>
                        <td>
                            Объект. Содержит oidc параметры, переданные в скрипт при вызове.
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            11
                        </td>
                        <td>
                            ext_redirect_uri
                        </td>
                        <td>
                            Параметр, вложенный в объект oidc. <br />
                            Deeplink для вызова браузера в котором находился клиент при нажатии на кнопку "Войти по Сбер ID" и открытия в нем ссылки, указанной в redirect_uri. <br />
                            Указывается только если os=ios
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">googlechrome://example.com/external_login</span>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            12
                        </td>
                        <td>
                            package
                        </td>
                        <td>
                            Параметр, вложенный в объект oidc. <br />
                            Deeplink для вызова браузера в котором находился клиент при нажатии на кнопку "Войти по Сбер ID" и открытия в нем ссылки, указанной в redirect_uri. <br />
                            Указывается только если os=android
                        </td>
                        <td>
                            <span className="logger logger--inline">
                                <span className="logger__item logger__item--info">com.android.chrome</span>
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}