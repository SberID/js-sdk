import { AnyObject } from '../interfaces/common';
export declare const postMessageToParent: (m: AnyObject, targetOrigin: string) => void;
export declare const openDialog: (url: string, params?: AnyObject) => Window | null;
export declare const isOIDCRedirect: () => boolean;
export declare const getCrypto: () => Crypto;
export declare const generateRandom: (size: number) => string;
