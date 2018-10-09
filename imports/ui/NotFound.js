import React from 'react';
import './NotFound.css';

const NotFound = () => (
    <div className="not-found">
        <img src="assets/aqua.png" alt="Aqua Not Found" width="300" />
        <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Page not found!</h2>
            <span className="not-found-msg">
                The page you are trying to access does not exist.
            </span>
        </div>
    </div>
);

export default NotFound;
