import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import './Navigation.css';


export const Navigation: FC = () => {
    return <nav className="nav">
        <Link className="link" to="/sdk">SDK</Link>
        <Link className="link" to="/fast-login">FastLogin</Link>
        <Link className="link" to="/universallink">Universal Link</Link>
        <Link className="link" to="/user-helper">User Helper</Link>
    </nav>
}