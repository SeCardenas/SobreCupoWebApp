import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  Meteor.publish('profiles', profile => {
    if(!profile)
      return [];
    return Profiles.find({ name: profile });
  });
}

Meteor.methods({
  'profiles.reportOccupied'(date, classroom, start, end) {
    const timestamp = Date.now();
    if (!Meteor.user()) {
      throw new Meteor.Error('Not authorized');
    }
    Profiles.upsert({ name: Meteor.user().username }, 
      { 
        $push: { 
          history: { 
            date, type: 'occupied', classroom, start, end, timestamp 
          } 
        } 
      }
    );
  },
  'profiles.upvote'() {
    if (!Meteor.user()) {
      throw new Meteor.Error('Not authorized');
    }
    Profiles.upsert({ name: Meteor.user().username }, 
      {$inc: {upvotes: 1}}
    );
  },
  'profiles.reportFree'({ date, classroom, schedule }) {
    const timestamp = Date.now();
    if (!Meteor.user()) {
      throw new Meteor.Error('Not authorized');
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
