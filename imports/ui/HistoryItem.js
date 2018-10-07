import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './HistoryItem.css';

export default class HistoryItem extends Component {
  render() {
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    let date = new Date(this.props.contribution.timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(hours<10) hours = '0'+hours;
    if(minutes<10) minutes = '0'+minutes;
    return (
      <div className='history-item'>
        <span className='date-span'>Reportado el {date.getDate()+' de '+monthNames[date.getMonth()]+' a las '+hours+':'+minutes}</span>
        <div className='history-item-full'>
          <div className='history-item-main-info'>
            <span className='history-item-classroom'> {this.props.contribution.classroom.substr(1)} </span>
            <span className='history-item-date'> {this.props.contribution.date} </span>
            <span className='from-to-span'> desde las {this.props.contribution.start.substr(0,2)+':'+this.props.contribution.start.substr(2)} hasta las {this.props.contribution.end.substr(0,2)+':'+this.props.contribution.end.substr(2)} </span>
          </div>
          <div className='history-item-info'>
            <span> Reporte: {this.props.contribution.type==='occupied' ? 'Salón ocupado' : 'Salón libre'} </span>
            <span className='reason-span'> Motivo: {this.props.contribution.reason} </span>
          </div>
        </div>
      </div>
    );
  }
}

HistoryItem.propTypes = {
  contribution: PropTypes.object
};