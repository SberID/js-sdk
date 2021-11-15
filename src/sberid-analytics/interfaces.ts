export interface SberVisorProps {
    enable?: boolean;
    init?: 'auto' | 'none';
    url?: string;
    clientId?: string;
    clientName?: string;
}

export interface SberVisorConfig {
    enable: boolean;
    init: 'auto' | 'none';
    buffer: number;
    url: string;
    clientId?: string;
    clientName?: string;
    subId?: string;
    sberId?: string;
    apiKey: string;
    appId?: string;
}

export interface SberVisorEventParams {
    eventCategory: string;
    eventAction: string;
    eventType: string;
    properties: {
        merchUrl: string;
        merchantTitle: string;
        sdkVersion: string;
        result?: 'success' | 'fail';
        errorDescription?: string;
        extendedProperties?: {[key: string]: string};
    };
}

export interface SberVisorSubmitParams<T> {
    eventCategory: string;
    eventAction: string;
    eventType: string;
    result?: 'success' | 'fail';
    description?: string;
    extendedProperties?: T;
    clientName?: string;
}

interface CSberAnalytics {
    new (config: SberVisorConfig): {
        push: (event: SberVisorEventParams) => void;
    };
}

declare global {
    interface Window {
        sberbankIdAnalytics: InstanceType<CSberAnalytics> | null;
        attachEvent?: (event: string, listener: (event: Event) => any) => any;
        SberVisor: any;
    }
}
