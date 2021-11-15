import {FastLoginConfig} from './interfaces';
import {BASE_URL} from '../constants/common';

export const defaultFastLoginConfig: FastLoginConfig = {
    enable: false,
    debug: false,
    mode: 'default',
    timeout: 1500,
    baseUrl: BASE_URL,
};
