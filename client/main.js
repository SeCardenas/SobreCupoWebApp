import React from 'react'; 
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import FreeClassrooms from '../imports/ui/FreeClassrooms';
import App from '../imports/ui/App.js';
import Profile from '../imports/ui/Profile';
import '../imports/startup/accounts-config.js';
import './main.html';


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
