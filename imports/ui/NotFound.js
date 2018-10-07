import React , { Component } from 'react';
import './NotFound.css';

export default class NotFound extends Component {
  render() {
    return (
      <div className='not-found'>
        <img src='assets/aqua.png' alt='Aqua Not Found' width='300'/>
        <div className='not-found-content'>
          <h1 className='not-found-title'>404</h1>
          <h2 className='not-found-subtitle'>Page not found!</h2>
          <span className='not-found-msg'>The page you ar trying to access does not exist.</span>
        </div>
      </div>
    );
  }
}