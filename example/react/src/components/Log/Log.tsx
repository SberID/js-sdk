import React, { FC } from 'react';

import './Log.css';

type Importance = 'info' | 'success' | 'error';

export type LogProps = {
    message: string;
    importance: Importance;
}

export const Log: FC<LogProps> = ({
    message = '',
    importance = 'info',
}) => {
    const date = new Date();

    const logTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    return (
        <div className={`logger__item logger__item--${importance.toLowerCase()}`}>[{logTime}] [{importance}] {message}</div>
    )
}