/*global AccountsTemplates*/
import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import './App.css';
import { FlowRouter } from 'meteor/kadira:flow-router';

class App extends React.Component {

  logOut() {
    AccountsTemplates.logout();
  }

  render() {
    return (
      <div className='app-container'>
        <nav className='topbar'>
          <img src="assets/logo.png" alt="Logo"/>
          <h1>Sobrecupo</h1>
          {this.props.user ?
            <button onClick={() => this.logOut()}>Cerrar sesión</button> :
            FlowRouter.getRouteName() === 'access' ?
              <button onClick={() => FlowRouter.go('home')}>Volver al inicio</button> :
              <button onClick={() => FlowRouter.go('access')}>Iniciar sesión</button>}
        </nav>
        {this.props.main}
      </div>
    );
  }
}

App.propTypes = {
  main: PropTypes.object,
  user: PropTypes.object
};
export default withTracker(() => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {
    user: Meteor.user(),
  };
})(App);
