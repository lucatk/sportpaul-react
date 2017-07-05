import React, { Component } from 'react';

import {
  Row, Col,
  FormGroup, FormControl, ControlLabel, Checkbox
} from 'react-bootstrap';

class SettingsMailing extends Component {
  constructor(props) {
    super(props);

    this.disableRefs = {};
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    Object.keys(this.disableRefs).forEach((key) => {
      this.disableRefs[key].disabled = !(this.props.settings.mail_enablenotifications == "1");
    });
  }
  render() {
    return (
      <div className="settings-tab" data-tab="Mailing">
        <form>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSendFrom">
                <ControlLabel bsClass="col-sm-5 control-label">Versender E-Mail-Adresse</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_address} placeholder="email@example.com" onChange={this.props.onSettingChange.bind(this, "mail_address", false)} onBlur={this.props.onSettingChange.bind(this, "mail_address", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputFromName">
                <ControlLabel bsClass="col-sm-5 control-label">Anzeigename</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_from} placeholder="Max Mustermann" onChange={this.props.onSettingChange.bind(this, "mail_from", false)} onBlur={this.props.onSettingChange.bind(this, "mail_from", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPHost">
                <ControlLabel bsClass="col-sm-5 control-label">SMTP-Host</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_host} placeholder="stmp.example.com" onChange={this.props.onSettingChange.bind(this, "mail_host", false)} onBlur={this.props.onSettingChange.bind(this, "mail_host", true)} />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPPort">
                <ControlLabel bsClass="col-sm-5 control-label">Port</ControlLabel>
                <Col xs={4}>
                  <FormControl type="text" value={this.props.settings.mail_port} placeholder="587" onChange={this.props.onSettingChange.bind(this, "mail_port", false)} onBlur={this.props.onSettingChange.bind(this, "mail_port", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPUsername">
                <ControlLabel bsClass="col-sm-5 control-label">Benutzername</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_username} placeholder="(nur wenn Authentifizierung benötigt)" onChange={this.props.onSettingChange.bind(this, "mail_username", false)} onBlur={this.props.onSettingChange.bind(this, "mail_username", true)} />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPPassword">
                <ControlLabel bsClass="col-sm-5 control-label">Passwort</ControlLabel>
                <Col xs={7}>
                  <FormControl type="password" value={this.props.settings.mail_password} placeholder="(nur wenn Authentifizierung benötigt)" onChange={this.props.onSettingChange.bind(this, "mail_password", false)} onBlur={this.props.onSettingChange.bind(this, "mail_password", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default SettingsMailing;
