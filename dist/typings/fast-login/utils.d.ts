import { Message, MessageToIframe } from './interfaces';
export declare const listenWindowMessages: (cb: (v: Message, m: MessageEvent) => void) => (() => void);
export declare const postMessageToIframe: (m: MessageToIframe, target: HTMLIFrameElement['contentWindow']) => void;
export declare const createIframe: (src: string, name: string | undefined, onCreate: (r?: Event | undefined) => void, onError: () => void) => HTMLIFrameElement;
