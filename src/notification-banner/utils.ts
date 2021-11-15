import {fadeFn} from './interfaces';

const fadeToggle = (
    startOpacity: string,
    stepDirection: number,
    el: HTMLDivElement,
    time: number,
): Promise<void> => {
    return new Promise((resolve) => {
        let last = +new Date();
        el.style.opacity = startOpacity;

        const tick = () => {
            el.style.opacity = `${
                +el.style.opacity + (stepDirection * (+new Date() - last)) / time
            }`;
            last = +new Date();

            if (+el.style.opacity < 1) {
                (requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            } else {
                resolve();
            }
        };

        tick();
    });
};

export const fadeIn: fadeFn = fadeToggle.bind(null, '0', 1);

export const fadeOut: fadeFn = fadeToggle.bind(null, '1', -1);
