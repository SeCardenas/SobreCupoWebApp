import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '../api/profiles.js';
import HistoryItem from './HistoryItem.js';
import './Profile.css';
//Zulma: mientras navegaba por la app no encontre una forma de acceder a este perfil (que no fuera creando un reporte y luego viendolo) La informacion que esta aqui es valiosa! deberia ser mas accesible para los usuarios.  
//Tambien seria chevere si pudiera aprobar o rechazar los reportes de otros usuarios 
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numElements: 10
    };
  }

  showMore() {
    this.setState({
      numElements: this.state.numElements+10
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
                <div key={i}>
                  <HistoryItem contribution={c}/>
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
