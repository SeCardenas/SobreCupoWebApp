import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Classrooms } from '../api/classrooms.js';

class FreeClassrooms extends Component {
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
      console.log(typeof (this.props.dateClassrooms.classrooms));

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

  fetchSchedules() {
    Meteor.call('test', {
      date: '05-10-18', classroom: '.ML_603', schedule: {
        start: '1400',
        end: '1650',
        NRC: '34279'
      }
    }, (err, res) => {
      if (err) return alert(err);
      console.log(res);
    });
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
        <button onClick={() => this.fetchSchedules()}>Test method</button>
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

FreeClassrooms.propTypes = {
  dateClassrooms: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('classrooms');

  return {
    dateClassrooms: Classrooms.findOne()
  };
})(FreeClassrooms);