import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Classrooms } from '../api/classrooms.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

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
    Meteor.call('classrooms.reportFree', {
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

  reportOccupied(name) {
    let hours = this.state.time.getHours();
    let minutes = this.state.time.getMinutes();
    let start = hours*100+minutes;
    let end = Math.min(2359, (hours+1)*100+minutes);
    if(start<1000) start = '0'+start;
    if(end<1000) end = '0'+end;

    let dd = this.state.time.getDate();
    let mm = this.state.time.getMonth() + 1;
    let yy = this.state.time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    Meteor.call('classrooms.reportOccupied', dd + '-' + mm + '-' + yy, name, start+'', end+'', (err) =>{
      if(err) alert(err);
    });

    Meteor.call('profiles.reportOccupied', dd + '-' + mm + '-' + yy, name, start+'', end+'', (err) => {
      if(err) alert(err);
    });
  }

  render() {

    const freeClassrooms = this.computeFreeClassrooms();

    return (
      <div>
        <AccountsUIWrapper /> 
        <br/>
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
              {this.props.user ? <button onClick={() => this.reportOccupied(free.name)}>report occupied</button> : undefined }
            </li>
          )}
        </ul>
        {this.props.user ? <Profile profile={this.props.user.username} /> : null}
      </div>
    );
  }

}

FreeClassrooms.propTypes = {
  dateClassrooms: PropTypes.object,
  user: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('classrooms');

  return {
    dateClassrooms: Classrooms.findOne(),
    user: Meteor.user()
  };
})(FreeClassrooms);