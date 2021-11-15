import createSberidSDK, {
    SberidSDK,
    SberidButton,
    NotificationBanner,
    FastLogin,
    SberidUniversalLink,
    UserHelper,
    successWindowListener,
} from './index';

/**
 * @ignore
 */
const wrapper = createSberidSDK as any;

wrapper.SberidSDK = SberidSDK;
wrapper.createSberidSDK = createSberidSDK;
wrapper.SberidButton = SberidButton;
wrapper.NotificationBanner = NotificationBanner;
wrapper.FastLogin = FastLogin;
wrapper.SberidUniversalLink = SberidUniversalLink;
wrapper.UserHelper = UserHelper;
wrapper.successWindowListener = successWindowListener;

export default wrapper;
