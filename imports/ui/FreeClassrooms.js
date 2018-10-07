import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Classrooms } from '../api/classrooms.js';
import './FreeClassrooms.css';
import FreeClassroom from './FreeClassroom';

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

    if (this.props.dateClassrooms) {

      for (const classroom of this.props.dateClassrooms.classrooms) {

        let isFree = true;
        let minutesLeft = 'Todo el día';
        let upvotes = 0;
        let wasUpvoted = false;

        for (const schedule of classroom.schedules) {

          const start = parseInt(schedule.start);
          const end = parseInt(schedule.end);

          if (start <= now && now < end) {
            if(schedule.report.type === 'occupied') {
              isFree = false;
              break;
            }
            else if(schedule.report.type === 'upvote') {
              upvotes++;
              if(Meteor.user()) {
                if(Meteor.user().username === schedule.report.user) {
                  wasUpvoted = true;
                }
              }
            }
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
        if (isFree && classroom.name !== '.' && classroom.name !== '.NOREQ' && classroom.name !== '.LIGA_ATLET') {

          let freeclassroom = {
            name: classroom.name,
            minutesLeft,
            upvotes,
            wasUpvoted
          };

          freeClassrooms.push(freeclassroom);
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
      <div className='classrooms-container'>
        <h3>Salones disponibles en este momento:</h3>
        <ul className='classroom-list'>
          {freeClassrooms.map(free =>
            <FreeClassroom 
              key={free.name}
              classroom={free}
              user={this.props.user}/>
          )}
        </ul>
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