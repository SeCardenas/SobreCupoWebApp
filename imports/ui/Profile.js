import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '../api/profiles.js';

class Profile extends Component {
  render() {
    return (
      this.props.info ? 
        <div>
          <h2>{this.props.info.name}</h2>
          <p>número de contribuciones: {this.props.info.history.length}</p>
          <p>Últimas contribuciones:</p>
          <div>
            {this.props.info.history.slice(-5).map((c, i) => {
              return (
                <div key={i}>
                  <span>fecha: {c.date} </span>
                  <span>salón: {c.classroom} </span>
                  <span>hora de inicio: {c.start} </span>
                  <span>hora de fin: {c.end} </span>
                  <span>timestamp: {c.timestamp} </span>
                </div>
              );
            })}
          </div>
        </div> : null
    );
  }
}

Profile.propTypes = {
  info: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('profiles');

  return {
    info: Profiles.findOne()
  };
})(Profile);