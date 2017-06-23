import React, { Component } from 'react';

import {
  Row, Col,
  FormGroup, FormControl, ControlLabel, Checkbox
} from 'react-bootstrap';

class SettingsMailing extends Component {
  constructor(props) {
    super(props);

    this.disableRefs = {};

    this.onEnableNotificationsChange = this.onEnableNotificationsChange.bind(this);
  }
  onEnableNotificationsChange(ev) {
    this.props.onSettingChange("mail_enablenotifications", true, {target:{value:ev.target.checked}});
    console.log(ev.target.checked);
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
        <form data-disabled={!(this.props.settings.mail_enablenotifications == "1")}>
          <Row>
            <Col xs={12}>
              <FormGroup controlId="inputEnableNotifications">
                <Col xs={12}>
                  <Checkbox checked={this.props.settings.mail_enablenotifications == "1"} onChange={this.onEnableNotificationsChange}>E-Mail Benachrichtigungen versenden</Checkbox>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSendFrom">
                <ControlLabel bsClass="col-sm-5 control-label">Versender E-Mail-Adresse</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_address} placeholder="email@example.com" onChange={this.props.onSettingChange.bind(this, "mail_address", false)} onBlur={this.props.onSettingChange.bind(this, "mail_address", true)} inputRef={ref => { this.disableRefs["mail_address"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputFromName">
                <ControlLabel bsClass="col-sm-5 control-label">Anzeigename</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_from} placeholder="Max Mustermann" onChange={this.props.onSettingChange.bind(this, "mail_from", false)} onBlur={this.props.onSettingChange.bind(this, "mail_from", true)} inputRef={ref => { this.disableRefs["mail_from"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPHost">
                <ControlLabel bsClass="col-sm-5 control-label">SMTP-Host</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_host} placeholder="stmp.example.com" onChange={this.props.onSettingChange.bind(this, "mail_host", false)} onBlur={this.props.onSettingChange.bind(this, "mail_host", true)} inputRef={ref => { this.disableRefs["mail_host"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPPort">
                <ControlLabel bsClass="col-sm-5 control-label">Port</ControlLabel>
                <Col xs={4}>
                  <FormControl type="text" value={this.props.settings.mail_port} placeholder="587" onChange={this.props.onSettingChange.bind(this, "mail_port", false)} onBlur={this.props.onSettingChange.bind(this, "mail_port", true)} inputRef={ref => { this.disableRefs["mail_port"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPUsername">
                <ControlLabel bsClass="col-sm-5 control-label">Benutzername</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.mail_username} placeholder="(nur wenn Authentifizierung benötigt)" onChange={this.props.onSettingChange.bind(this, "mail_username", false)} onBlur={this.props.onSettingChange.bind(this, "mail_username", true)} inputRef={ref => { this.disableRefs["mail_username"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup controlId="inputSMTPPassword">
                <ControlLabel bsClass="col-sm-5 control-label">Passwort</ControlLabel>
                <Col xs={7}>
                  <FormControl type="password" value={this.props.settings.mail_password} placeholder="(nur wenn Authentifizierung benötigt)" onChange={this.props.onSettingChange.bind(this, "mail_password", false)} onBlur={this.props.onSettingChange.bind(this, "mail_password", true)} inputRef={ref => { this.disableRefs["mail_password"] = ref; }} />
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
