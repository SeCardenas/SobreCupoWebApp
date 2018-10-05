import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Classrooms = new Mongo.Collection('classrooms');

Meteor.methods({
  'classrooms.reportOccupied'(day, classroom, from, to) {

  },
  'classrooms.reportFree'(day, classroom, from, to) {

  }
});
