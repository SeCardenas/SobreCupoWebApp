import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  Meteor.publish('profiles', profile => {
    if(!profile)
      return [];
    if(Meteor.user())
      return Profiles.find({ name: profile });
  });
}

Meteor.methods({
  'profiles.reportOccupied'(date, classroom, start, end) {
    const timestamp = Date.now();
    if (!Meteor.user()) {
      throw Meteor.Error('Not authorized');
    }
    Profiles.upsert({ name: Meteor.user().username }, { $push: { history: { date, type: 'occupied', classroom, start, end, timestamp } } });
  },
  'profiles.reportFree'({ date, classroom, schedule }) {
    const timestamp = Date.now();
    if (!Meteor.user()) {
      throw Meteor.Error('Not authorized');
    }
    Profiles.upsert({ name: Meteor.user().username },
      {
        $push: {
          history: {
            date, type: 'free', classroom, start: schedule.start, end: schedule.end, timestamp
          }
        }
      });
  }
});
