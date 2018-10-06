import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Classrooms } from '../api/classrooms.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      freeClassrooms: []
    };
  }

  computeFreeClassrooms() {

    const freeClassrooms = [];

    //integer time format (same as course's time format) i.e. [1350, 0743, 1822]
    const now = this.state.time.getHours() * 100 + this.state.time.getMinutes();

    console.log(this.props.dateClassrooms);

    if (this.props.dateClassrooms) {
      console.log(typeof(this.props.dateClassrooms.classrooms));
      
      for (const clasroom of this.props.dateClassrooms.classrooms) {

        let isFree = true;
        let minutesLeft = 'Todo el día';

        for (const schedule of clasroom.schedules) {

          const start = parseInt(schedule.start);
          const end = parseInt(schedule.end);

          if (start <= now && now < end) {
            isFree = false;
            break;
          }

          if (start > now) {
            const startHour = parseInt(schedule.start.substr(0, 2));
            const startMinute = parseInt(schedule.start.substr(-2));
            const diff = (startHour - this.state.time.getHours()) * 60 + startMinute - this.state.time.getMinutes();
            if (minutesLeft === 'Todo el día' || diff < minutesLeft) {
              minutesLeft = diff;
            }
          }
        }
        if (isFree && clasroom.name !== '.' && clasroom.name !== '.NOREQ') {

          let freeClasroom = {
            name: clasroom.name,
            minutesLeft
          };

          freeClassrooms.push(freeClasroom);
        }
      }
    }

    return freeClassrooms;

  }

  updateClassrooms() {
    const ch = new Date(2018, 10, 5, parseInt(this.hour.value), parseInt(this.min.value), 20, 20);
    this.setState({ time: ch });
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: new Date() });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    const freeClassrooms = this.computeFreeClassrooms();

    return (
      <div>
        <h1>Welcome!</h1>
        <span>{this.state.time.getMinutes()}</span>
        <p>Hours</p>
        <input ref={ref => this.hour = ref} type="text" />
        <p>Minutes</p>
        <input ref={ref => this.min = ref} type="text" />
        <button onClick={() => this.updateClassrooms()}>Update</button>
        <ul>
          {freeClassrooms.map(free =>
            <li key={free.name}>
              {free.name}: {free.minutesLeft}
            </li>
          )}
        </ul>
      </div>
    );
  }

}

App.propTypes = {
  dateClassrooms: PropTypes.array.isRequired
};

export default withTracker(() => {
  let d = new Date();
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yy = d.getFullYear().toString().substr(-2);
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  console.log(dd + '-' + mm + '-' + yy + '.json');
  return {
    dateClassrooms: Classrooms.findOne({ date: dd + '-' + mm + '-' + yy + '.json' })
  };
})(App);