import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import './Router.js';
import './App.css';


class App extends React.Component {

  render() {
    return (
      <div className='app-container'>
        <div>
          <h1>Sobrecupo</h1>
        </div>
        {this.props.main}
      </div>
    );
  }
}

App.propTypes = {
  main: PropTypes.object
};
export default withTracker(() => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {
    user: Meteor.user(),
  };
})(App);
