import React, { Component } from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';


class AccountsUIWrapper extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.user) {
      console.log('Redirecting...');
      FlowRouter.go('home');
    }
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.atForm, this.login);
  }

  componentDidUpdate(){
    if (this.props.user) {
      console.log('Redirecting...');
      FlowRouter.go('home');
    }
  }

  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }
  render() {
    // Just render a placeholder container that will be filled in
    return <span ref={login => this.login = login} />;
  }
}

AccountsUIWrapper.propTypes = {
  user: PropTypes.string
};

export default withTracker(() => {
  return {
    user: Meteor.userId()
  };
})(AccountsUIWrapper);