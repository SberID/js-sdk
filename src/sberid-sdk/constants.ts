import {UniversalLinkConfig} from '../universal-link';
import {BASE_DEEPLINK_URL, getUniversalLinkAuthUrl, getAuthUrl} from '../constants/common';

export type ERROR_CODE =
    | 'invalid_request'
    | 'unauthorized_client'
    | 'unsupported_response_type'
    | 'invalid_scope'
    | 'access_denied'
    | 'invalid_state'
    | 'window_closed';

export const ERROR_MESSAGES: {[key in ERROR_CODE]: string} = {
    invalid_request: 'В запросе отсутствуют обязательные атрибуты',
    unauthorized_client:
        'АС - источник запроса не зарегистрирована или заблокирована в банке либо значение атрибута client_id не соответствует формату',
    unsupported_response_type: 'Значение атрибута response_type не равно «code»',
    invalid_scope:
        'Значение атрибута scope не содержит параметр openid в начальной позиции либо запрошенный scope содержит значения, недоступные для АС - источника запроса',
    access_denied: 'Клиент отказался от передачи согласий',
    invalid_state: 'Значение атрибута state не соответствует изначальному',
    window_closed: 'Клиент закрыл окно авторизации через Сбер ID',
};

export const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const defaultUniversalLinkConfig: UniversalLinkConfig = {
    needAdditionalRedirect: true,
    universalLinkUrl: getUniversalLinkAuthUrl(),
    baseUrl: getAuthUrl(),
    deeplinkUrl: BASE_DEEPLINK_URL,
    debug: false,
    generateState: false,
    display: 'page',
};
