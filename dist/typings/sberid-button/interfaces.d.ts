export declare type SberidButtonTextType = 'default' | 'resume' | 'login' | 'fill' | 'custom';
export declare type SberidButtonSizeType = 'default' | 'long' | 'small';
export interface SberidButtonProps {
    type?: SberidButtonTextType;
    loader?: boolean;
    logo?: boolean;
    custom?: SberidButtonText;
    size?: SberidButtonSizeType;
}
export interface SberidButtonText {
    anonymous: string;
    personal: string;
}
export interface SberidButtonConfig {
    personalization: boolean;
    sa: boolean;
    debug: boolean;
    type: SberidButtonTextType;
    changeUser: boolean;
    loader: boolean;
    logo: boolean;
    size: SberidButtonSizeType;
}
