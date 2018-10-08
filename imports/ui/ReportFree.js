import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Classrooms } from '../api/classrooms.js';
import './ReportFree.css';

class ReportFree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedClassroom: undefined,
      selectedSchedule: undefined,
      errorMessage: 'test borrra plx',
      successMessage: '',
      sendingReport: false
    };
  }

  formatClassroomName(classroom) {
    const formattedName = classroom.substr(1).split('_').join(' ');
    return formattedName;
  }

  computeTodayClassroomList() {
    const classroomList = [];

    if (this.props.dateClassrooms)
      for (const classroom of this.props.dateClassrooms.classrooms) {
        classroomList.push(classroom.name);
      }

    classroomList.sort((a, b) => a.localeCompare(b));

    return classroomList;
  }

  getClassroomSchedules(classroom) {

    if (!classroom) return;

    let searchedClassroom = undefined;

    if (this.props.dateClassrooms)
      for (const srchClasroom of this.props.dateClassrooms.classrooms) {
        if (classroom === srchClasroom.name) {
          searchedClassroom = srchClasroom;
          break;
        }
      }

    searchedClassroom.schedules.sort((a, b) => parseInt(a.start) - parseInt(b.start));

    return searchedClassroom.schedules;
  }

  scheduleToString(schedule) {
    return `[${schedule.start} - ${schedule.end}]`;
  }

  reportFree() {
    this.setState({ sendingReport: true });
    if (!this.props.user) {
      this.setState({ errorMessage: 'Es necesario iniciar sesión para reportar un salón libre', sendingReport: false });
    }
    else if (this.state.selectedClassroom && this.state.selectedSchedule) {
      const schedule = this.getClassroomSchedules(this.state.selectedClassroom)[this.state.selectedSchedule];
      console.log(schedule);
      Meteor.call('classrooms.reportFree', { classroom: this.state.selectedClassroom, schedule }, (err) => {
        if (err) this.setState({ errorMessage: err.message, sendingReport: false });
        this.setState({ successMessage: 'Reporte enviado correctamente' });
      });

      Meteor.call('profile.reportFree', { classroom: this.state.selectedClassroom, schedule }, (err) => {
        if (err) this.setState({ errorMessage: err.message, sendingReport: false });
      });
    }
    else {
      this.setState({ errorMessage: 'Hubo un error en la página extrayendo los datos del formulario', sendingReport: false });
    }
  }

  render() {
    const clasroomSchedules = this.getClassroomSchedules(this.state.selectedClassroom);
    if (this.state.selectedSchedule) {
      console.log('Schedule: ', clasroomSchedules[this.state.selectedSchedule]);

    }
    return (
      <div className='report-free-container'>
        <h3>Reportar un salón disponible: </h3>
        {!this.props.user ?
          <p>
            Para reportar un salón disponible es necesario <a href="/access">iniciar sesión</a>
          </p> :
          <div>
            <small>Por ahora, solo se pueden reportar disponibles salones de hoy</small>
            <h4>¿Qué salón quieres reportar?</h4>
            <select 
              onChange={() => this.setState({ selectedClassroom: this.selectClassroom.value })}
              ref={ref => this.selectClassroom = ref}
              defaultValue='$$%%invalid%%$$'>
              <option disabled value='$$%%invalid%%$$'> -- Escoge un salón -- </option>
              {this.computeTodayClassroomList().map(el =>
                <option key={el} value={el}>{this.formatClassroomName(el)}</option>
              )}
            </select>
            {this.state.selectedClassroom ?
              <div>
                <h4>Estos son los horarios que tenemos registrados en los que el salón está ocupado: </h4>
                <ul>
                  {clasroomSchedules.map(el =>
                    <li key={el.NRC}>
                      {this.scheduleToString(el)}
                    </li>
                  )}
                </ul>
                <h4>¿Cuál horario quieres reportar? (Este es el horario en que el salón se mostraría como libre)</h4>
                <select 
                  onChange={() => this.setState({ selectedSchedule: this.selectSchedule.value })}
                  ref={ref => this.selectSchedule = ref} defaultValue="$$%%invalid%%$$">
                  <option disabled value="$$%%invalid%%$$"> -- Escoge un horario -- </option>
                  {clasroomSchedules.map((el, i) =>
                    <option key={el.NRC} value={i}>{this.scheduleToString(el)}</option>
                  )}
                </select>
                {this.state.errorMessage ? <p className='error-message'>{this.state.errorMessage}</p> : null}
                {this.selectSchedule ?
                  <button onClick={() => this.reportFree()} disabled={this.state.sendingReport}>Reportar salón disponible</button>
                  : null}
                {this.state.successMessage ?
                  <div>
                    <p className='success-message'>{this.state.successMessage}</p><a href="/">Volver al inicio</a>
                  </div> : null}
              </div>
              : null}
          </div>}
      </div>
    );
  }
}

ReportFree.propTypes = {
  dateClassrooms: PropTypes.object,
  user: PropTypes.object
};

export default withTracker(() => {
  Meteor.subscribe('classrooms');

  return {
    dateClassrooms: Classrooms.findOne(),
    user: Meteor.user()
  };
})(ReportFree);