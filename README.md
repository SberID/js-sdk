# @sberid/js-sdk

Javascript SDK для Партнеров Сбер ID, упрощающая подключение Сбер ID на сайте.

[![version][version-badge]][package]
[![Total Downloads][downloads-badge]][package]
[![PRs Welcome][prs-badge]][prs]

## Оглавление
- [@sberid/js-sdk](#sberidjs-sdk)
  - [Оглавление](#оглавление)
  - [Общие сведения](#общие-сведения)
  - [Установка](#установка)
  - [Подключение на сайте](#подключение-на-сайте)
    - [Пример](#пример)
    - [Описание параметров](#описание-параметров)
      - [Параметры для инициализации SDK _(params)_](#параметры-для-инициализации-sdk-params)
      - [Параметры для инициализации OIDC _(params.oidc)_](#параметры-для-инициализации-oidc-paramsoidc)
      - [Параметры для генерации универсальных ссылок _(params.universalLink)_](#параметры-для-генерации-универсальных-ссылок-paramsuniversallink)
      - [Параметры для отправки Sberbank Analytics _(params.sa)_](#параметры-для-отправки-sberbank-analytics-paramssa)
      - [Параметры для отправки Sberbank Analytics _(params.buttonProps)_](#параметры-для-отправки-sberbank-analytics-paramsbuttonprops)
      - [Параметры для функции обратного вызова](#параметры-для-функции-обратного-вызова)
      - [Параметры для персонализированного баннера _(params.notification)_](#параметры-для-персонализированного-баннера-paramsnotification)
      - [Параметры для быстрого входа _(params.fastLogin)_](#параметры-для-быстрого-входа-paramsfastlogin)
        - [Успешная авторизация по Сбер ID](#успешная-авторизация-по-сбер-id)
        - [Ошибка при входе по Сбер ID](#ошибка-при-входе-по-сбер-id)
      - [Описание кодов ошибки](#описание-кодов-ошибки)
    - [Копирайт](#копирайт)

## Общие сведения

Javascript SDK для Партнеров Сбер ID, упрощающая получение кода авторизации (AuthCode).

Для получения access token и данных клиента рекомендуется воспользоваться Java SDK или Python SDK.

SDK позволяет:

-   генерировать стилизованную кнопку «Войти по Сбер ID»;
-   выбирать способ отображения страницы авторизации Сбер ID (модальное окно, обычный переход);
-   включить режим формирования универсальных ссылок для авторизации в мобильной версии браузера через мобильное приложение Сбербанк Онлайн;
-   включить генерацию и проверку state в процессе аутентификации;
-   отравлять в Sberbank Analytics события по показу кнопки, нажатию на кнопку и успешном/не успешном входе по Сбер ID.
-   быстрый вход без необходимости перехода на страницу OIDC
-   персонализированная кнопка входа

## Установка

Используя [npm](https://npmjs.org):

```sh
npm i --save @sberid/js-sdk
```

Используя [yarn](https://yarnpkg.com):

```sh
yarn add @sberid/js-sdk
```

## Подключение на сайте

Подключите продуктовую версию ([sberid-sdk.production.js][production]) или добавить ([index.esm.js][esm]) в проект для импорта небходимых зависимостей. Подключить файл стилей ([common.css][css]) в блок head.

[production]: ../sberid-sdk.production.js
[esm]: ../dist/index.esm.js
[css]: ../dist/styles/common.css

```html
<link href="js/libs/sberid-sdk/styles/common.css" rel="stylesheet">
<script src="js/libs/sberid-sdk/sberid-sdk.production.js"></script>
```

После загрузки страницы для инициализации приложения необходимо создать новый экземпляр SberidSDK. Функция создания принимает следующие параметры:

-   **params** _(Object)_ - параметры для инициализации SDK

### Пример

```javascript
const oidcParams = {
    response_type: 'code',
    client_type: 'PRIVATE',
    client_id: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    redirect_uri: 'https://example.com/oidc/success',
    state: 'ut8Ar4MUZEMDPIiD2ko914y37s0Q0VKJgxeCkU0yzTY',
    scope: 'openid name',
    nonce: 'NfZscgwxPY7v0kYvuPfnFHA57bqHxQc3lV51Oiaxlo4',
};

const sa = {
    enable: true,
    init: 'auto',
    clientId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    clientName: 'ООО Ромашка',
};

const onSuccessCallback = (result) => {
    console.log('Вы успешно вошли: ', result);
}
const onErrorCallback = (result) => {
    console.log('Что-то пошло не так: ', result);
}

const params = {
    oidc: oidcParams,
    container: '.preview',
    display: 'popup',
    mweb2app: false,
    generateState: false,
    sa: sa,
    notification: {
        enable: false,
        onNotificationBannerClose: () => {
            console.log('Баннер закрыт');
        },
        onNotificationBannerOpen: () => {
            console.log('Баннер открыт');
        },
        animation: true,
        position: 'right',
    },
    personalization: true,
    fastLogin: {
        enable: true,
        timeout: 1000,
        mode: 'default',
    },
    utmProxyDisabled: false,
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

var sbSDK = new SberidSDK(params);
```

_Примечание: функции обратного вызова **onSuccessCallback** и **onErrorCallback** будут вызваны после успешной авторизации если страница Сбер ID была открыта в модальном окне_

### Описание параметров

Ниже будут приведены параметры для настройки отображение кнопок и режима работы SDK

#### Параметры для инициализации SDK _(params)_

-   **oidc** _(Object)_ - параметры OIDC
-   **container** _(String | HTMLDivElement)_ - селектор DOM-элемента или HTMLElement в котором будет размещена кнопка Войти по Сбер ID
-   **display** _(String)_ - режим отображения страницы авторизации по Сбер ID (_popup_ - высплывающе окно, _page_ - в текущем окне)
-   **mweb2app** _(Boolean)_ - включить возможность формирования универсальных ссылок. [Подробнее][m2a]
-   **generateState** _(Boolean)_ - включить генерацию и проверку state
-   **personalization** _(Boolean)_ - использовать ли персонализированную кнопку
-   **notification** _(Object)_ - настройки персонализированного баннера
-   **changeUser** _(Boolean)_ - настройки включения функционала смены пользователя
-   **fastLogin** _(Object)_ - настройки быстрого входа
-   **bottonProps** *(Object)* - настройки для стилизации кнопок
-   **utmProxyDisabled** *(Boolean)* - отключить проксирование переданых в url utm_меток в запрос к Сбер ID (Список меток: utm_source utm_medium utm_campaign utm_term utm_content)
-   **onSuccessCallback** _(Function)_ - функция обратного вызова при успешной авторизации
-   **onErrorCallback** _(Function)_ - функция обратного вызова при возникновении ошибок во время авторизации


[m2a]: https://developer.sberbank.ru/doc/v1/sberbank-id/reqparametrs

**Для работы персонализированной кнопки необходимо направить запрос на [support@ecom.sberbank.ru](mailto:support@ecom.sberbank.ru) для добавления ваших доменов в список доверенных. В запросе указывается client_id и список доменов, с которых будет выполняться запрос на получение данных для персонализации кнопки. Адрес домена не должен заканчиваться символом "/". Сотрудник банка добавит домен в список разрешенных.**
_Примечание: Работы персонализированной кнопки не гарантируется в браузере Safari при включенной настройке Конфиденциальность -> Предотвращать перекрестное отслеживание_

#### Параметры для инициализации OIDC _(params.oidc)_

**Подробнее про параметры OIDC можно прочитать [здесь](https://developer.sberbank.ru/doc/v1/sberbank-id/reqparametrs)**

-   **client_id** _(String)_ - идентификатор системы Партнера, выданный Партнеру при регистрации его системы в Банке (получено в письме от банка с адреса «support@ecom.sberbank.ru» с темой «Сбербанк Профиль»)
-   **scope** _(String)_ - наименование групп данных, на которые подписана система Партнера (выдается при регистрации системы в Банке). Значение openid является обязательным и располагается на первой позиции. Разделитель – пробел.
-   **redirect_uri** _(String)_ - адрес страницы Партнера, на которую будет перенаправлен клиент после успешной аутентификации в системе Банка. Временное ограничение: недопустимы символы “;” и “=“.
-   **state** _(String)_ - значение, включенное в запрос, которое также возвращается в ответе. Может быть строка любого контента. Для предотвращения подделки межсайтовых запросов используется генерируемое случайным образом уникальное значение.
-   **nonce** _(String)_ - если этот параметр сохранился на бэке sdk, то Партнер этот параметр не передает, параметр берется с бэка sdk
-   **code_challenge** _(String)_ - хешированное значение секретного кода code_verifier Партнера. Хеширование выполняется методом, указанным в code_challenge_method. code_challenge = BASE64URL-ENCODE (SHA256 (ASCII (code_verifier)))).

\*Примечание: Если данные запрашиваются асинхронно с сервера, то после получения ответа от сервера обновить параметры можно вызвав метод **setOIDCParams(oidc)\***

_Примечание: Для регистрации приложения в системе Сбер ID и получения своего **client_id** воспользуйтесь инструкцией на [сайте](https://www.sberbank.ru/ru/person/dist_services/sberbankid/forbusiness)_

```javascript
const sbSDK = new SberidSDK(
    {
        container: 'preview',
        display: 'popup',
    },
);

fetch('/params')
    .then((response) => response.json())
    .then((params) => {
        sbSDK.setOIDCParams(params);
    });
```

#### Параметры для генерации универсальных ссылок _(params.universalLink)_
-   **params** _(Object)_ - параметры OIDC
-   **baseUrl** _(String)_ - Базовый адрес адрес для формирования ссылки входа по Сбер ID. Адрес по умолчанию https://online.sberbank.ru/CSAFront/oidc/authorize.do. Если вы используйте тестовый режим, укажите адрес тестовой страницы без параметров.
-   **deeplinkUrl** _(String)_ - Базовый адрес адрес для формирования deeplink на мобальное приложение. Адрес по умолчанию sberbankidlogin://sberbankidsso. Если вы используйте тестовый режим, укажите тестовый deeplink без параметров.
-   **universalLinkUrl** _(String)_ - Базовый адрес адрес для формирования универсальной ссылки входа по Сбер ID. Адрес по умолчанию https://online.sberbank.ru/CSAFront/oidc/sberbank_id/authorize.do. Если вы используйте тестовый режим, укажите адрес тестовой страницы без параметров
-   **needAdditionalRedirect** _(Boolean)_ - Включить формирования адреса дополнительного редиректа у универсальных ссылках для возврата в браузер из которого начался сценарий авторизации.

_Подробнее про универсальные ссылки можно почитать на [странице][universallink]._

[universallink]: https://developer.sberbank.ru/doc/v1/sberbank-id/reqparametrs

#### Параметры для отправки Sberbank Analytics _(params.sa)_

-   **enable** _(Boolen)_ - включение отправки метрик в Sberbank Analytics
-   **init** _(String)_ - способ инициализации скрипта Sberbank Analytics: auto - скрипт инициализируется автоматически при создании SDK с параметрами по умолчанию, none - скрипт инициализируется Партнером.
-   **clientId** _(String)_ - идентификатор системы Партнера, выданный Партнеру при регистрации его системы в Банке. Если параметр не задан, то значение будет взято из параметра params.oidc.client_id.
-   **clientName** _(String)_ - название системы Партнера. Если параметр не задан, то значение будет взято из html элемента title страницы, на которой отображается кнопка.

#### Параметры для отправки Sberbank Analytics _(params.buttonProps)_

-   **type** _(String)_ - вариант отображаемого на кнопке текста (возможные значения: 'default' | 'resume' | 'login' | 'fill' | 'custom')
-   **loader** _(Boolean)_ - отображение лоадера на кнопках.
-   **logo** _(String)_ - отображение логотипа Сбер ID на кнопке.
-   **custom** _(Object)_ - тектовки кнопок при выбранном значение **_type_=_custom_**.
    -   **anonymous** _(String)_ - текст для обычной кнопки.
    -   **personal** _(String)_ - текст для персонализированной кнопки.

#### Параметры для функции обратного вызова

Если данные окно авторизации по Сбер ID открывалось в модальном окне, то на странице указанной в параметре redirect_uri необходимо вызвать метод **successWindowListener()**

#### Параметры для персонализированного баннера _(params.notification)_

-   **enable** _(Boolen)_ - включение персонализированного баннера
-   **onNotificationBannerClose** _(Function)_ - функция обратного вызова при закрытие баннера
-   **onNotificationBannerOpen** _(Function)_ - функция обратного вызова при открытие баннера
-   **animation** _(Boolen)_ - включение анимированного появления/исчезновения персонализированного баннера
-   **position** _(String)_ - расположение баннера (возможноные значения _left_, _right_)
-   **autoCloseDelay** _(Number)_ - задержка до скрытия баннера в мобильной версии в секундах
-   **autoClose** _(Boolen)_ - включение скрытия баннера в мобильной версии

**Для отображения баннера должна быть включена настройка персонализированной кнопки (_personalization = true_). Для работы персонализированной кнопки необходимо направить запрос на [support@ecom.sberbank.ru](mailto:support@ecom.sberbank.ru) для добавления ваших доменов в список доверенных. В запросе указывается client_id и список доменов, с которых будет выполняться запрос на получение данных для персонализации кнопки. Адрес домена не должен заканчиваться символом "/". Сотрудник банка добавит домен в список разрешенных.**

#### Параметры для быстрого входа _(params.fastLogin)_

-   **enable** _(Boolen)_ - включение быстрого входа
-   **timeout** _(Number)_ - задержка до принудительного завершения быстрого входа при проблемах с создание запроса на сервер
-   **mode** _(String)_ - режим работы быстрого входа (_auto_ - автоматически запускай быстрый вход после инициализации SDK, _default_ - запускай быстрый вход по нажатию на кнопку)

**Для выполнения быстрого входа должна быть включена настройка персонализированной кнопки (_personalization = true_). Для работы персонализированной кнопки необходимо направить запрос на [support@ecom.sberbank.ru](mailto:support@ecom.sberbank.ru) для добавления ваших доменов в список доверенных. В запросе указывается client_id и список доменов, с которых будет выполняться запрос на получение данных для персонализации кнопки. Адрес домена не должен заканчиваться символом "/". Сотрудник банка добавит домен в список разрешенных.**

##### Успешная авторизация по Сбер ID

Если страница авторизации по Сбер ID была открыта в модальном окне, то после редиректа по адресу, указанному в параметре **oidc.redirect_uri**, будет вызвана функция **onSuccessCallback** принимающая в качестве аргумента объект, содержащий следующие значения:

-   **code** _(String)_ - код авторизации для получение authToken'a
-   **state** _(String)_ - значение, включенное в запрос, которое было передано на страницу авторизации по Сбер ID.

_Примечание: полученные данные необходимо отправить на endpoint авторизации Вашего сайта, для получения информации о пользователе._

```javascript
function onSuccessCallback(result) {
    fetch('/login?' + new URLSearchParams(result))
        .then((response) => response.json())
        .then((params) => {
            console.log(params);
        });
}
```

##### Ошибка при входе по Сбер ID

Если страница авторизации по Сбер ID была открыта в модальном окне и во время процесса авторизации произошла ошибка, то после редиректа по адресу, указанному в параметре **oidc.redirect_uri**, будет вызвана функция **onErrorCallback** принимающая в качестве аргумента объект, содержащий следующие значения:

-   **code** _(String)_ - код ошибки
-   **error** _(String)_ - значение, включенное в запрос, которое было передано на страницу авторизации по Сбер ID.
-   **description** *(String)* - текстовое описание ошибки
    _Примечание: в зависимости от кода ошибки можно показать пользователю уведомление с возможной причиной ошибки_

#### Описание кодов ошибки

-   **invalid_request** - В запросе отсутствуют обязательные атрибуты
-   **unauthorized_client** - АС - источник запроса не зарегистрирована или заблокирована в банке либо значение атрибута client_id не соответствует формату
-   **unsupported_response_type** - Значение атрибута response_type не равно« code»
-   **invalid_scope** - Значение атрибута scope не содержит параметр openid в начальной позиции либо запрошенный scope содержит значения, недоступные для АС источника запроса
-   **access_denied** - Клиент отказался от передачи согласий
-   **invalid_state** - Значение атрибута state не соответствует изначальному
-   **window_closed** - Клиент закрыл окно авторизации по Сбер ID

### Копирайт

Автор: Сбер ID
Сайт: https://www.sberbank.ru/ru/person/dist_services/sberbankid/forbusiness

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: https://makeapullrequest.com
[version-badge]: https://img.shields.io/npm/v/@sberid/js-sdk.svg?style=flat-square
[package]: https://www.npmjs.com/package/@sberid/js-sdk
[downloads-badge]: https://img.shields.io/npm/dt/@sberid/js-sdk.svg?style=flat-square