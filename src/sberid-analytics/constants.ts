import {SberVisorConfig} from './interfaces';

export const SA_API_KEY = 'da8570065d949a8a3ee551b99f31f7774909575e702289b2743fab0aad0ffe41';
export const SA_URL = 'https://sa.online.sberbank.ru:8098/metrics/partners';

export const defaultSberVisorConfig: SberVisorConfig = {
    url: SA_URL,
    init: 'auto',
    enable: true,
    buffer: 1,
    apiKey: SA_API_KEY,
    subId: '',
};
