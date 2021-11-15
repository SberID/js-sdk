import { SberVisorSubmitParams } from './interfaces';
import { SberidSDKProps } from '../sberid-sdk';
export declare const initSA: (config: SberidSDKProps) => void;
export declare const sendSberAnalytics: <T>({ eventCategory, eventAction, eventType, result, description, extendedProperties, clientName, }: SberVisorSubmitParams<T>) => void;
