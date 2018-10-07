import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  Meteor.publish('profiles', profile => {
    if (!profile)
      return [];
    return Profiles.find({ name: profile });
  });
}

const generateUTC_5 = () => {
  const localDate = new Date();

  const offsetMillis = localDate.getTimezoneOffset()/*m*/*60/*s*/*1000/*ms*/;
  const UTC0 = Date.now() + offsetMillis;
  const UTC_5 = UTC0 - (5/*h*/*60/*m*/*60/*s*/*1000/*ms*/);

  return new Date(UTC_5);
};

Meteor.methods({
  'profiles.reportOccupied'(classroom, reason) {

    if (!Meteor.user()) return new Meteor.Error('Unauthorized');

    const time = generateUTC_5();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let start = hours * 100 + minutes;
    let end = Math.min(2359, (hours + 1) * 100 + minutes);
    if (start < 1000) start = '0' + start;
    if (end < 1000) end = '0' + end;
    start = start+'';
    end = end+'';

    let dd = time.getDate() - 4;
    let mm = time.getMonth() + 1;
    let yy = time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '-' + mm + '-' + yy;
    const timestamp = Date.now();

    Profiles.upsert({ name: Meteor.user().username },
      {
        $push: {
          history: {
            date, type: 'occupied', classroom, start, end, timestamp, reason
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
  'profiles.reportFree'({ classroom, schedule }) {
    const timestamp = Date.now();
    const time = generateUTC_5();

    let dd = time.getDate() - 4;
    let mm = time.getMonth() + 1;
    let yy = time.getFullYear().toString().substr(-2);
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '-' + mm + '-' + yy;
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
