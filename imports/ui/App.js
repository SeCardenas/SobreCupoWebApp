import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Classrooms } from '../api/classrooms.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  render() {
    const hour = this.state.time.getHours()*100 + this.state.time.getMinutes();
    console.log(hour);
    return (
      <div>
        <h1>Welcome!</h1>
        <ul>
          {
            this.props.classrooms ? this.props.classrooms.clasrooms.map(cl => {
              let isFree = true;
              let minutesLeft = 'Todo el día';
              for(let i = 0; i<cl.schedules.length; i++) {
                const start = parseInt(cl.schedules[i].start);
                const end = parseInt(cl.schedules[i].end);
                if(start <= hour && end > hour) {
                  isFree = false;
                  break;
                }
                if(start > hour) {
                  const startHour = parseInt(cl.schedules[i].start.substr(0,2));
                  const startMinute = parseInt(cl.schedules[i].start.substr(-2));
                  const diff = (startHour-this.state.time.getHours())*60 + startMinute - this.state.time.getMinutes();
                  if(minutesLeft === 'Todo el día' || diff < minutesLeft) minutesLeft = diff;
                }
              }
              if(isFree && cl.classroom !== '.' && cl.clasroom !== '.NOREQ') {
                return (
                  <li key={cl.classroom}>
                    {cl.classroom} {minutesLeft}
                  </li>
                );
              }
            }) : undefined
          }
        </ul>
      </div>
    );
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: new Date() }), 60000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

App.propTypes = {
  classrooms: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('classrooms');

  return {
    classrooms: Classrooms.findOne()
  };
})(App);