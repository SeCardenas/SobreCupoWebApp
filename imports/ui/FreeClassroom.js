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
      confirmedUpvote: this.props.classroom.wasUpvoted,
      confirmedReport: false,
      errorMessage: '',
      successMessage: ''
    };
  }

  formatClassroomName(classroom) {
    const formattedName = classroom.substr(1).split('_').join(' ');
    return formattedName;
  }

  reportOccupied() {

    this.setState({ errorMessage: '' });

    const name = this.props.classroom.name;
    const reason = this.input.value;

    if (!reason) {
      this.setState({ errorMessage: 'Es necesario incluir un motivo para reportar el salón' });
      return;
    }

    Meteor.call('classrooms.reportOccupied', name, (err) => {
      if (err) { this.setState({ errorMessage: err.message }); return; }
      this.setState({ reporting: false, confirmedReport: true, successMessage: 'Reporte enviado' });
    });

    Meteor.call('profiles.reportOccupied', name, reason, (err) => {
      if (err) this.setState({ errorMessage: err.message });
    });
  }

  generateUserReportList(reportList) {
    let userList = [];

    for (const report of reportList) {
      userList.push(report.user);
    }

    const jsx = userList.map((el, i) => {
      //Return without comma the last element
      if (i === userList.length - 1)
        return (<cite key={i + el}><a href={`/profiles/${el}`}> {el} </a></cite>);
      return (<cite key={i + el}><a href={`/profiles/${el}`}> {el} </a>,</cite>);
    });

    return (<p className='error-message'>
      Este salón fue reportado ocupado por: {jsx}
    </p>);
  }

  confirmClassroom() {
    //Only confirm if user exists
    if (this.props.user) {
      this.setState({ confirming: true });
      Meteor.call('classrooms.upvote', this.props.classroom.name, (err) => {
        if (err) { this.setState({ errorMessage: err.message, confirming: false }); return; }
        this.setState({ confirmedUpvote: true, successMessage: '¡Voto registrado!' });
      });
    }
    else{
      this.setState({ confirming: !this.state.confirming });
    }
  }

  hasUserSentReport() {
    //If the user is logged in, check if it has sent reports
    if (this.props.user)
      for (const report of this.props.classroom.occupiedReports) {
        if (report.user === this.props.user.username)
          return true;
      }
    return false;
  }

  render() {
    const {classroom, user} = this.props;
    const {confirmedReport, confirmedUpvote, reporting, confirming, errorMessage, successMessage} = this.state
    return (
      <li className='free-classroom-container'>
        <strong>
          {this.formatClassroomName(classroom.name)}
        </strong>
        <p>
          {classroom.minutesLeft}
        </p>

        {classroom.freeReport &&
          <p className='success-message'>Este salón fue reportado libre por: 
            <a href={`/profiles/${classroom.freeReport.user}`}>
              {classroom.freeReport.user}
            </a>
          </p>}

        {!!classroom.occupiedReports.length &&
          this.generateUserReportList(classroom.occupiedReports)}

        <div className='icons-container'>
          <div className='icon'>
            <i className={confirmedReport || this.hasUserSentReport() ? 'material-icons disabled' : 'material-icons'}
              onClick={() => confirmedReport || this.hasUserSentReport() ? null : this.setState({ reporting: !reporting })}>
              error_outline
            </i>
            <small>Reportar</small>
            <span>
              Este salón no está disponible...
            </span>
          </div>
          <div className='icon'>
            <i className={confirmedUpvote ? 'material-icons disabled' : 'material-icons'}
              onClick={() => confirmedUpvote ? null : this.confirmClassroom()}>
              check_circle_outline
            </i>
            <small className={confirmedUpvote ? 'disabled' : null}>Confirmar</small>
            <span>
              ¡Este salón está disponible!
            </span>
          </div>
        </div>
        {reporting ?
          <div>
            {user ?
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

        {confirming &&
          <div>
            {user ?
              null :
              <div>
                <p>Únicamente los usuarios pueden confirmar salones. <a href="/access">Inicia sesión</a></p>
              </div>
            }
          </div>}

        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        {successMessage && <p className='success-message'>{successMessage}</p>}
        <small className='classroom-score'>
          +{classroom.upvotes}
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