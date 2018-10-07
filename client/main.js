/*global AccountsTemplates*/
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import FreeClassrooms from '../imports/ui/FreeClassrooms';
import App from '../imports/ui/App.js';
import Profile from '../imports/ui/Profile';
import '../imports/startup/accounts-config.js';
import './main.html';
import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper';
import NotFound from '../imports/ui/NotFound.js';
import ReportFree from '../imports/ui/ReportFree.js';

AccountsTemplates.configure({
  texts: {
    title: {
      signIn: 'Inicia sesión',
      signUp: 'Crea una cuenta',
    },
    errors:{
      loginForbidden: 'Login incorrecto'
    },
    button: {
      signIn: 'Iniciar sesión',
      signUp: 'Crear una cuenta',
    },
    signInLink_pre: '¿Ya tienes una cuenta?',
    signInLink_link: 'Inicia sesión',
    signUpLink_pre: '¿No tienes una cuenta?',
    signUpLink_link: '¡Regístrate!',
    requiredField: 'Campo requerido'
  },
  onSubmitHook(err){
    //Don't redirect on failed submit
    if(err) return;
    //Redirect on successful submit
    FlowRouter.go('home');
    
  }
});

let pwd = AccountsTemplates.removeField('password');
pwd.displayName = 'Contraseña';
pwd.placeholder = ' ';
pwd.errStr = 'La contraseña debe tener al menos 6 caracteres de longitud';

//Configure access form -------
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'email',
    type: 'email',
    required: true,
    placeholder: 'p.perez@uniandes.edu.co',
    displayName: 'E-mail',
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'E-mail no válido',
  },
  {
    _id: 'username',
    type: 'text',
    displayName: 'Usuario',
    placeholder: 'perez.pep',
    required: true,
    minLength: 5,
    errStr: 'El usuario debe tener al menos 5 caracteres de longitud'
  },
  {
    _id: 'username_and_email',
    type: 'text',
    required: true,
    displayName: 'Usuario o email',
    placeholder: 'perez.pep // p.perez@uniandes.edu.co'
  },
  pwd,
  {
    _id: 'password_again',
    type: pwd.type,
    displayName: 'Confirmar contraseña',
    placeholder: ' ',
    required: true,
  }
]);
//-----------------------------
//Router will mount React app and change it's contents accordingly
FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(App, {
      main: <FreeClassrooms />,
    });
  },
});

FlowRouter.route('/access', {
  name: 'access',
  action() {
    mount(App, {
      main: <AccountsUIWrapper />
    });
  }
});

FlowRouter.route('/profiles/:id', {
  name: 'profiles.explore',
  action(params) {
    mount(App, {
      main: <Profile profile={params.id} />,
    });
  },
});

FlowRouter.route('/reportFree', {
  name: 'profiles.explore',
  action() {
    mount(App, {
      main: <ReportFree />,
    });
  },
});

FlowRouter.notFound = {
  action() {
    mount(App, {
      main: (() => {
        return <NotFound />;
      })()
    });
  }
};
