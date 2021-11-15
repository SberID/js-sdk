export declare type NotificationPosition = 'right' | 'left' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
export interface NotificationProps {
    enable: boolean;
    onNotificationBannerClose?: () => void;
    onNotificationBannerOpen?: () => void;
    animation?: boolean;
    position?: NotificationPosition;
    autoCloseDelay?: number;
    autoClose?: boolean;
    offset?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}
export interface NotificationConfig {
    enable: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    animation: boolean;
    position: NotificationPosition;
    autoCloseDelay: number;
    autoClose: boolean;
    offset: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    sa: boolean;
    debug: boolean;
    fastLogin: boolean;
}
export declare type fadeFn = (el: HTMLDivElement, time: number) => Promise<void>;
