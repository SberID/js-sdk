import {NotificationConfig} from './interfaces';

export const defaultNotificationConfig: NotificationConfig = {
    autoCloseDelay: 90,
    autoClose: true,
    enable: false,
    animation: true,
    sa: false,
    position: 'bottom-right',
    offset: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
    },
    debug: false,
    fastLogin: false,
};
