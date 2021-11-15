import fetch from 'unfetch';
import {FetchProps} from '../interfaces/common';

export type FetchResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        code?: string;
        description?: string;
    };
};

export const createAbortController = (): AbortController => new AbortController();

const doFetch = async <T>(url: string, props: FetchProps): Promise<FetchResponse<T>> => {
    const response: FetchResponse<T> = await fetch(url, props)
        .then(async (r: fetch.IsomorphicResponse) => {
            if (!r.ok) {
                return {
                    success: false,
                };
            }

            let data = undefined;

            try {
                data = await r.json();
            } catch (e) {
            } finally {
            }

            return {
                success: true,
                data,
            };
        })
        .catch(() => {
            return {
                success: false,
            };
        });

    return response;
};

export const sendRequest = async <T>(
    url: string,
    props: FetchProps,
    timeout: number,
): Promise<FetchResponse<T>> => {
    const controller = createAbortController();
    props.signal = controller.signal;

    let timeoutId: NodeJS.Timeout;

    return Promise.race([
        doFetch<T>(url, props),
        new Promise<FetchResponse<T>>((_, reject) => {
            timeoutId = setTimeout(() => {
                controller.abort();
                const error: FetchResponse<T> = {
                    success: false,
                    error: {
                        description: `Ошибка при выполнении запроса ${url}`,
                        code: 'request_fail',
                    },
                };

                reject(error);
            }, timeout);
        }),
    ]).finally(() => {
        clearTimeout(timeoutId);
    });
};
