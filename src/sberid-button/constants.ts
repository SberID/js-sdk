import {SberidButtonText, SberidButtonTextType} from './interfaces';

export const BUTTON_TEXT: {[key in SberidButtonTextType]: SberidButtonText} = {
    default: {
        anonymous: 'Войти по Сбер ID',
        personal: 'Войти как {{userName}}',
    },
    resume: {
        anonymous: 'Продолжить со Сбер ID',
        personal: 'Продолжить как {{userName}}',
    },
    login: {
        anonymous: 'Сбер ID',
        personal: 'Войти как {{userName}}',
    },
    fill: {
        anonymous: 'Заполнить со Сбер ID',
        personal: 'Войти как {{userName}}',
    },
    custom: {
        anonymous: 'Войти по Сбер ID',
        personal: 'Войти как {{userName}}',
    },
};
