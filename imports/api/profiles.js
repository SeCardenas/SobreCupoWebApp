import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  Meteor.publish('profiles', () => {
    return Profiles.find({name: Meteor.user().username});
  });
}

Meteor.methods({
  'profiles.reportOccupied'(date, classroom, start, end, timestamp) {
    const name = Meteor.user().username;
    if(!name) {
      throw Meteor.Error('Not authorized');
    }
    Profiles.upsert({name}, {$push: {history: {date, classroom, start, end, timestamp}}});
  }
});
