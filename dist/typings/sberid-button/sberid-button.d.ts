import { UserHelper } from '../helper';
import { User } from '../interfaces/common';
import { SberidButtonText, SberidButtonConfig } from './interfaces';
import { SberidSDKProps } from '../sberid-sdk';
export declare class SberidButton {
    link: HTMLElement | undefined;
    config: SberidButtonConfig;
    userHelper: UserHelper;
    user: User | undefined;
    container: HTMLElement;
    changeUserElement: HTMLElement | undefined;
    changeUserPopupElement: HTMLElement | undefined;
    text: SberidButtonText;
    constructor(config: SberidSDKProps, container: HTMLElement, onClick: (e: Event, link?: HTMLElement) => void);
    initChangeUser(): void;
    changeUser(e: Event): Promise<void>;
    handleUserChange(user?: User): void;
    getSize(): DOMRect;
    isEnoughSpaceFromPersonalization(): boolean;
    create(): HTMLElement;
    getText(): {
        text: string;
        personalization: boolean;
    };
    setText(): void;
    disable(): void;
    enable(): void;
    isDisabled(): boolean | undefined;
    setUrl(url: string): void;
    getButtonElement(): HTMLElement | undefined;
}
export declare class SberidNotificationBannerButton extends SberidButton {
    constructor(props: SberidSDKProps, container: HTMLElement, onClick: (e: Event) => void);
    isEnoughSpaceFromPersonalization(): boolean;
}
