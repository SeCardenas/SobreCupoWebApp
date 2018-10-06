import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import FreeClassrooms from './FreeClassrooms';
import App from './App';
import Profile from './Profile';


FlowRouter.route('/', {
  name: 'Lists.show',
  action() {
    mount(App, {
      main: <FreeClassrooms/>,
    });
  },
});

FlowRouter.route('/profiles', {
  name: 'Lists.show',
  action() {
    mount(App, {
      main: <Profile/>,
    });
  },
});