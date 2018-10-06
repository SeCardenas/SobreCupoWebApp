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
  'classrooms.reportOccupied'(date, classroom, from, to, time) {
    //day: string dd-mm-yy, classroom: string, from: string hhmm, to: string hhmm
    Classrooms.update(
      {'date': date, 'classrooms.name': classroom}, 
      {$push: {'classrooms.$.schedules': {start: from, end: to, report:{
        type: 'occupied',
        user: Meteor.user() ? Meteor.user().username : 'Manrique',
        time
      }}}}
    );
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
      else {
        return ({ error: 'Classroom does not exist' });
      }
    }
    else {
      return ({ error: 'Could not find registers for that day' });
    }
  },
  'classrooms.reportFree'({ date, classroom, schedule }) {

    if(!Meteor.user()) return new Meteor.Error('Unauthorized');
    //Workaround to meteor's outdated mongoDB version
    const postedOn = Date.now();
    //Get complete document from DB
    const newDoc = Classrooms.findOne({ date });

    //Find the classroom to upload the report
    for (const docClassroom of newDoc.classrooms) {
      if (docClassroom.name === classroom) {
        //Find the schedule to upload the report
        for (let docSchedule of docClassroom.schedules) {
          if (docSchedule.start === schedule.start && docSchedule.end === schedule.end && docSchedule.NRC === schedule.NRC) {
            //Modify it
            docSchedule.report = {
              type: 'free',
              user: Meteor.user() ? Meteor.user().username : 'Manrique',
              time: postedOn
            };
            //Found, break cycle
            break;
          }
        }
        //Found, break cycle
        break;
      }
    }

    //Document has been modified, update it into the DB
    Classrooms.update({ date }, newDoc);
  }
});
