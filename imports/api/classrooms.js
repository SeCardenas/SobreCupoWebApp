import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Classrooms = new Mongo.Collection('classrooms');

if (Meteor.isServer) {
  Meteor.publish('classrooms', () => {
    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth()+1;
    let yy = d.getFullYear().toString().substr(-2);
    if(dd<10) dd = '0'+dd;
    if(mm<10) mm = '0'+mm;
    return Classrooms.find({date: dd+'-'+mm+'-'+yy+'.json'});
  });
}

Meteor.methods({
  'classrooms.reportOccupied'(day, classroom, from, to, timestamp) {
    //day: string dd-mm-yy, classroom: string, from: string hhmm, to: string hhmm, timestamp: number
    Classrooms.update(
      {'date': day+'.json', 'classrooms.classroom': classroom}, 
      {$push: {'classrooms.$.schedules': {start: from, end: to}}}
    );
  },
  'classrooms.reportFree'(day, classroom, from, to, timestamp) {
    //day: string dd-mm-yy, classroom: string, from: string hhmm, to: string hhmm, timestamp: number
  }
});
