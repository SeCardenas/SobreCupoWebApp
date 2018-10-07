import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FreeClassroom.css';

class FreeClassroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reporting: false
    };
  }

  formatClassroomName(classroom) {
    const formattedName = classroom.substr(1).split('_').join(' ');
    return formattedName;
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
              onClick={() => this.setState({ reporting: !this.state.reporting })}>
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
                <input type="text" placeholder='(Reserva) Monitoría de cálculo diferencial' />
                <button>Enviar</button>
              </div> :
              <div>
                <p>Únicamente los usuarios pueden reportar salones. <a href="/access">Inicia sesión</a></p>
              </div>
            }
          </div> : null}
        <small className='classroom-score'>
          ±0
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