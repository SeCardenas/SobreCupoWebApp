import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import './FreeClassroom.css';

class FreeClassroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reporting: false,
      confirming: false,
      errorMessage: ''
    };
  }

  formatClassroomName(classroom) {
    const formattedName = classroom.substr(1).split('_').join(' ');
    return formattedName;
  }

  reportOccupied() {

    this.setState({errorMessage: ''});

    const name = this.props.classroom.name;
    const reason = this.input.value;

    if(!reason){
      this.setState({errorMessage: 'Es necesario incluir un motivo para reportar el salón ("La puerta está cerrada" es un motivo válido)'});
      return;
    }    

    Meteor.call('classrooms.reportOccupied', name, (err) => {
      if (err) this.setState({errorMessage: err.message});
    });

    Meteor.call('profiles.reportOccupied', name, (err) => {
      if (err) this.setState({errorMessage: err.message});
    });
  }

  render() {
    return (
      <li className='free-classroom-container'>
        <strong>
          {this.formatClassroomName(this.props.classroom.name)}
        </strong>
        <p>
          {this.props.classroom.minutesLeft}
        </p>
        <div className='icons-container'>
          <div className='icon'>
            <i className="material-icons"
              onClick={() => this.setState({ reporting: !this.state.reporting })}>
              error_outline
            </i>
            <small>Reportar</small>
            <span>
              Este salón no está disponible...
            </span>
          </div>
          <div className='icon'>
            <i className="material-icons"
              onClick={() => this.setState({ confirming: !this.state.confirming })}>
              check_circle_outline
            </i>
            <small>Confirmar</small>
            <span>
              ¡Este salón está disponible!
            </span>
          </div>
        </div>
        {this.state.reporting ?
          <div>
            {this.props.user ?
              <div>
                <h4>Reportar salón ocupado</h4>
                <p>¿Por qué el salón está ocupado?</p>
                <input type="text" ref={ref => this.input = ref} placeholder='(Reserva) Monitoría de cálculo diferencial' />
                <button onClick={() => this.reportOccupied()}>Enviar</button>
              </div> :
              <div>
                <p>Únicamente los usuarios pueden reportar salones. <a href="/access">Inicia sesión</a></p>
              </div>
            }
          </div> : null}

        {this.state.confirming ?
          <div>
            {this.props.user ?
              null :
              <div>
                <p>Únicamente los usuarios pueden confirmar salones. <a href="/access">Inicia sesión</a></p>
              </div>
            }
          </div> : null}

        {this.state.errorMessage ?
          <p className='error-message'>{this.state.errorMessage}</p>
          : null}
        <small className='classroom-score'>
          +{this.props.classroom.upvotes}
        </small>
      </li>
    );
  }
}

FreeClassroom.propTypes = {
  classroom: PropTypes.object.isRequired,
  user: PropTypes.object
};

export default FreeClassroom;