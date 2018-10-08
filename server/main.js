/*global AccountsTemplates, Accounts*/
import { Meteor } from 'meteor/meteor';

import '../imports/api/classrooms.js';
import { Profiles } from '../imports/api/profiles.js';

const onSignUp = (id, info) => {
  Profiles.insert({name: info.username, history: [], upvotes: 0});
};

//Restrict e-mails only from uniandes:
Accounts.config({
  restrictCreationByEmailDomain: 'uniandes.edu.co'
});

AccountsTemplates.configure({
  postSignUpHook: onSignUp
});

Meteor.startup(() => {
  // code to run on server at startup
});
