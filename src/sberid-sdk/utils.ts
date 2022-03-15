import {CHARSET} from './constants';
import {getUrlSearchParams} from '../utils/common';
import {AnyObject} from '../interfaces/common';
import {SberidSDKDialogConfig} from './interfaces';

const postMessage = (
    message: AnyObject,
    target: Window | HTMLIFrameElement['contentWindow'],
    targetOrigin: string,
): void => {
    if (target) {
        target.postMessage(JSON.stringify(message), targetOrigin);
    }
};

export const postMessageToParent = (m: AnyObject, targetOrigin: string): void => {
    postMessage(m, window.parent, targetOrigin);
};

export const openDialog = (url: string, params: AnyObject = {}): Window | null => {
    const defaultParams: SberidSDKDialogConfig = {
        directories: 'no',
        status: 'no',
        menubar: 'no',
        scrollbars: 'yes',
        resizable: 'no',
        width: 600,
        height: 600,
        centered: true,
    };

    Object.keys(defaultParams).forEach((k: string): void => {
        params[k] = params.hasOwnProperty(k)
            ? params[k]
            : defaultParams[<keyof SberidSDKDialogConfig>k];
    });

    if (params.centered) {
        const screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
        const screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;

        params.left = parseInt(`${screenX + (window.innerWidth - params.width) / 2}`, 10);
        params.top = parseInt(`${screenY + (window.innerHeight - params.height) / 2}`, 10);
    }
    const w = window.open(
        url,
        '_blank',
        Object.keys(params)
            .map((k) => k + '=' + params[k])
            .join(','),
    );

    const closeCallbacks: any[] = [];
    const closeInterval = setInterval(() => {
        if (w && w.closed) {
            clearInterval(closeInterval);
            closeCallbacks.forEach((c) => {
                c && c();
            });
        }
    });

    if (w) {
        w.onclose = (callback: any): void => {
            closeCallbacks.push(callback);
        };
    }

    return w;
};

export const isOIDCRedirect = (): boolean => {
    const params = getUrlSearchParams();

    return !!((params.code || params.error) && params.state);
};

const bufferToString = (buffer: Uint8Array): string => {
    const state: string[] = [];
    for (let i = 0; i < buffer.byteLength; i += 1) {
        const index = buffer[i] % CHARSET.length;
        state.push(CHARSET[index]);
    }
    return state.join('');
};

export const getCrypto = (): Crypto => {
    //ie 11.x uses msCrypto
    return (window.crypto || (window as any).msCrypto) as Crypto;
};

export const generateRandom = (size: number): string => {
    const buffer = new Uint8Array(size);
    if (typeof window !== 'undefined' && !!getCrypto()) {
        getCrypto().getRandomValues(buffer);
    } else {
        for (let i = 0; i < size; i += 1) {
            buffer[i] = (Math.random() * CHARSET.length) | 0;
        }
    }

    return bufferToString(buffer);
};
