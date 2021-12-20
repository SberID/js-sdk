interface CookieProps {
    expires?: number | Date | string;
    path?: string;
    domain?: string;
    sameSite?: string;
    secure?: boolean;
}
export declare class Cookies {
    static get(name: string): string | undefined;
    static set(name: string, value: string, props?: CookieProps): void;
    static delete(name: string): void;
}
export {};
