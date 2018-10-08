import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Classrooms = new Mongo.Collection('classrooms');

const generateUTC_5 = () => {
  const localDate = new Date();

  const offsetMillis = localDate.getTimezoneOffset()/*m*/*60/*s*/*1000/*ms*/;
  const UTC0 = Date.now() + offsetMillis;
  const UTC_5 = UTC0 - (5/*h*/*60/*m*/*60/*s*/*1000/*ms*/);

  return new Date(UTC_5);
};

if (Meteor.isServer) {
  Meteor.publish('classrooms', () => {
    const d = generateUTC_5();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yy = d.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return Classrooms.find({ date: dd + '-' + mm + '-' + yy });
  });
}


Meteor.methods({
  'classrooms.reportOccupied'(classroom) {
    if(!Meteor.user()) return new Meteor.Error('Unauthorized');
    const time = generateUTC_5();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let start = hours * 100 + minutes;
    let end = Math.min(2359, (hours + 1) * 100 + minutes);
    if (start < 1000) start = '0' + start;
    if (end < 1000) end = '0' + end;
    start = start+'';
    end = end+'';

    let dd = time.getDate();
    let mm = time.getMonth() + 1;
    let yy = time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '-' + mm + '-' + yy;
    const timestamp = Date.now();

    Classrooms.update(
      {'date': date, 'classrooms.name': classroom}, 
      {$push: {'classrooms.$.schedules': {start, end, report:{
        type: 'occupied',
        user: Meteor.user().username,
        timestamp
      }}}}
    );
  },
  'classrooms.upvote'(classroom) {
    if(!Meteor.user()) return new Meteor.Error('Unauthorized');
    const time = generateUTC_5();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let start = hours * 100 + minutes;
    let end = Math.min(2359, (hours + 1) * 100 + minutes);

    let dd = time.getDate();
    let mm = time.getMonth() + 1;
    let yy = time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '-' + mm + '-' + yy;

    const timestamp = Date.now();
    Classrooms.update(
      {'date': date, 'classrooms.name': classroom}, 
      {$push: {'classrooms.$.schedules': {start, end, report:{
        type: 'upvote',
        user: Meteor.user().username,
        timestamp
      }}}}
    );
  },/* Not neede, client already has all the info
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
  } */
  'classrooms.reportFree'({ classroom, schedule }) {
    const time = generateUTC_5();
    let dd = time.getDate();
    let mm = time.getMonth() + 1;
    let yy = time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '-' + mm + '-' + yy;

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
              user: Meteor.user().username,
              timestamp: postedOn
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
