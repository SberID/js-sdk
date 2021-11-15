import {SberidSDKProps, SberidSDK} from './sberid-sdk';

export {NotificationBanner, NotificationProps} from './notification-banner';

export {OidcParams} from './interfaces/common';

export {SberidUniversalLink, UniversalLinkProps} from './universal-link';
export {
    SberidSDK,
    SberidSDKErrorResult,
    SberidSDKSuccessResult,
    SberidSDKProps,
} from './sberid-sdk';

export {initSA, sendSberAnalytics, SberVisorProps} from './sberid-analytics';

export {SberidButton, SberidButtonProps} from './sberid-button';

export {UserHelper} from './helper';

export {BASE_DEEPLINK_URL, BASE_URL, getUniversalLinkAuthUrl, getAuthUrl} from './constants/common';

export {FastLogin, FastloginProps} from './fast-login';

export {getVersion, hideLoader, showLoader, successWindowListener} from './utils/common';

/**
 * Создание SDK
 *
 * @param {SberidSDKProps} options - параметры инициализации SDK
 * @returns {SberidSDK} - объект SDK
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function createSberidSDK(options: SberidSDKProps) {
    const sbidSDK = new SberidSDK(options);

    return sbidSDK;
}
