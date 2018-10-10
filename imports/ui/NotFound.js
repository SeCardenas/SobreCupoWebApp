import React from 'react';
import './NotFound.css';

const NotFound = () => (
    <div className="not-found">
        <img src="assets/aqua.png" alt="Aqua Not Found" width="300" />
        <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Page not found!</h2>
            <span className="not-found-msg">
                La página que buscas no existe.
            </span>
            <h3><a href="http://sobrecupo.herokuapp.com/">Volver al inicio</a></h3>
        </div>
    </div>
);

export default NotFound;
