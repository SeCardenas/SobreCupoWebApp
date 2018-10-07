/*global AccountsTemplates*/
import { Meteor } from 'meteor/meteor';

import '../imports/api/classrooms.js';
import { Profiles } from '../imports/api/profiles.js';

const onSignUp = (id, info) => {
  console.log(id);
  Profiles.insert({name: info.username, history: []});
};

AccountsTemplates.configure({
  postSignUpHook: onSignUp
});

Meteor.startup(() => {
  // code to run on server at startup
});
