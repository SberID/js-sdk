import {Message, MessageToIframe} from './interfaces';

const sendMessage = (
    message: Message,
    target: Window | HTMLIFrameElement['contentWindow'],
    targetOrigin = '*',
) => {
    if (target) {
        target.postMessage(JSON.stringify(message), targetOrigin);
    }
};

export const listenWindowMessages = (cb: (v: Message, m: MessageEvent) => void): (() => void) => {
    const listener = (m: MessageEvent) => {
        let data;
        try {
            data = JSON.parse(m.data);
        } catch (error) {
            return;
        }

        cb(data, m);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
};

export const postMessageToIframe = (
    m: MessageToIframe,
    target: HTMLIFrameElement['contentWindow'],
): void => {
    sendMessage(m, target);
};

export const createIframe = (
    src: string,
    name = 'sberid-iframe',
    onCreate: (r?: Event) => void,
    onError: () => void,
): HTMLIFrameElement => {
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', src);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('name', name);
    iframe.setAttribute('id', name);
    iframe.width = '0';
    iframe.height = '0';
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';

    if (typeof onCreate === 'function') {
        iframe.onload = onCreate;
    }
    if (typeof onError === 'function') {
        iframe.onerror = onError;
    }

    return iframe;
};
