import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import FreeClassrooms from '../imports/ui/FreeClassrooms';
import App from '../imports/ui/App.js';
import Profile from '../imports/ui/Profile';
import '../imports/startup/accounts-config.js';
import './main.html';
import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper';

//Router will mount React app and change it's contents accordingly
FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(App, {
      main: <FreeClassrooms />,
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action(){
    if(Meteor.user()){
      console.log('Redirecting...');
      FlowRouter.go('home');
    }
    mount(App, {
      main: <AccountsUIWrapper />
    });
  }
});

FlowRouter.route('/profiles/:id', {
  name: 'profiles.explore',
  action(params) {
    mount(App, {
      main: <Profile profile={params.id} />,
    });
  },
});
