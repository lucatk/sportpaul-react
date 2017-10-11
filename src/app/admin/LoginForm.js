import React, { Component } from 'react';

import $ from 'jquery';
import crypto from 'crypto';
import {
  Nav, NavItem,
  FormGroup, FormControl, Button
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import LoadingOverlay from '../utils/LoadingOverlay'

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      password: ""
    };
    
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordLoginAction = this.onPasswordLoginAction.bind(this);
    this.login = this.login.bind(this);
  }
  onPasswordChange(ev) {
    this.setState({password:ev.target.value});
  }
  onPasswordLoginAction(ev) {
    if(ev.key === "Enter") {
      ev.preventDefault();
      this.login();
    }
  }
  login() {
    this.setState({loading:true});
    $.post({
      url: "php/auth/login.php",
      xhrFields: { withCredentials: true },
      data: {
        password: crypto.createHash('md5').update(this.state.password).digest('hex')
      },
      success: function(data) {
        this.setState({loading:false, password:""});
        this.props.onLogin();
      }.bind(this)
    })
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>Admin-Login | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        <div className="container" data-page="Login">
          <LoadingOverlay show={this.state.loading} />
          <div className="input-container">
            <form>
              <FormGroup controlId="inputPassword" validationState={!this.state.password || this.state.password.length < 1 ? 'error' : null}>
                <FormControl type="password" value={this.state.password} placeholder="Passwort" onChange={this.onPasswordChange} onKeyPress={this.onPasswordLoginAction} />
              </FormGroup>
              <Button bsStyle="primary" onClick={this.login}>Einloggen</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
