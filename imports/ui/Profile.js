import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '../api/profiles.js';
import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numElements: 5
    };
  }

  showMore() {
    this.setState({
      numElements: this.state.numElements+5
    });
  }

  render() {

    return (
      this.props.info ? 
        <div>
          <h2>{this.props.info.name}</h2>
          <p>número de contribuciones: {this.props.info.history.length}</p>
          <h3>Últimas contribuciones:</h3>
          <div className='history'>
            {this.props.info.history.slice(-this.state.numElements).reverse().map((c, i) => {
              return (
                <div key={i} className='history-item'>
                  <span className='history-item-date'> {c.date}: </span>
                  <div className='history-item-info'>
                    <span> {c.classroom}: </span>
                    <span> {c.start.substr(0,2)+':'+c.start.substr(2)} - {c.end.substr(0,2)+':'+c.end.substr(2)} </span>
                    <span> {c.type} </span>
                  </div>
                </div>
              );
            })}
            {this.state.numElements < this.props.info.history.length ? <span className='show-more-button' onClick={() => this.showMore()}>show more</span> : null}
          </div>
        </div> : null
    );
  }
}

Profile.propTypes = {
  info: PropTypes.object,
  profile: PropTypes.string.isRequired
};

export default withTracker((props) => {
  Meteor.subscribe('profiles', props.profile);

  return {
    info: Profiles.findOne()
  };
})(Profile);