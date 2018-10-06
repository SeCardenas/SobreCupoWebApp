import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Classrooms = new Mongo.Collection('classrooms');

if (Meteor.isServer) {
  Meteor.publish('classrooms', () => {
    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yy = d.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return Classrooms.find({ date: dd + '-' + mm + '-' + yy });
  });
}

Meteor.methods({
  'classrooms.reportOccupied'(day, classroom, from, to, timestamp) {
    //day: string dd-mm-yy, classroom: string, from: string hhmm, to: string hhmm, timestamp: number
  },
  'classrooms.getClassroomSchedules'({ date, classroom }) {

    if (!date) return ({ error: 'Request should include a date' });
    if (!classroom) return ({ error: 'Request should include a classroom' });

    const dateInfo = Classrooms.findOne({ date });

    if (dateInfo) {
      let searchedClassroom = null;
      for (const sClassroom of dateInfo.classrooms) {
        if (sClassroom.name.includes(classroom)) {
          searchedClassroom = sClassroom;
          break;
        }
      }

      if (searchedClassroom) {
        return searchedClassroom.schedules;
      }
      else{
        return({error: 'Classroom does not exist'});
      }
    }
    else {
      return ({ error: 'Could not find registers for that day' });
    }
  },
  'classrooms.reportFree'(day, classroom, from, to, timestamp) {
    //day: string dd-mm-yy, classroom: string, from: string hhmm, to: string hhmm, timestamp: number
  }
});
