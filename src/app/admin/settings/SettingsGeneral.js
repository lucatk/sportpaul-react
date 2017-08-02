import React, { Component } from 'react';

import crypto from 'crypto';
import {
  Row, Col,
  FormGroup, FormControl, ControlLabel, Checkbox, Button
} from 'react-bootstrap';

class SettingsGeneral extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminpassword: ""
    };
    this.disableRefs = {};

    this.onEnableNotificationsChange = this.onEnableNotificationsChange.bind(this);
    this.onAdminPasswordInput = this.onAdminPasswordInput.bind(this);
    this.onAdminPasswordChange = this.onAdminPasswordChange.bind(this);
  }
  onEnableNotificationsChange(ev) {
    this.props.onSettingChange("mail_enablenotifications", true, {target:{value:ev.target.checked}});
  }
  onAdminPasswordInput(ev) {
    this.setState({adminpassword:ev.target.value});
  }
  onAdminPasswordChange() {
    if(this.state.adminpassword.length > 0) {
      this.props.onSettingChange("general_adminpassword", true, {target:{value:crypto.createHash('md5').update(this.state.adminpassword).digest('hex')}});
      this.setState({adminpassword:""});
    }
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
      <div className="settings-tab" data-tab="General">
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
            <Col xs={8}>
              <FormGroup controlId="inputSubjectOrderConfirmed">
                <ControlLabel bsClass="col-sm-5 control-label">Betreff "Bestellung bestätigt"-Info</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.subject_orderconfirmed} placeholder="Ihre Bestellung wurde bestätigt." onChange={this.props.onSettingChange.bind(this, "subject_orderconfirmed", false)} onBlur={this.props.onSettingChange.bind(this, "subject_orderconfirmed", true)} inputRef={ref => { this.disableRefs["subject_orderconfirmed"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <FormGroup controlId="inputSubjectArticleReceivedInfo">
                <ControlLabel bsClass="col-sm-5 control-label">Betreff "Artikel abholbar"-Info</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.subject_articlereceivedinfo} placeholder="Ihre Bestellung ist abholbar!" onChange={this.props.onSettingChange.bind(this, "subject_articlereceivedinfo", false)} onBlur={this.props.onSettingChange.bind(this, "subject_articlereceivedinfo", true)} inputRef={ref => { this.disableRefs["subject_articlereceivedinfo"] = ref; }} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <FormGroup controlId="inputAdminPassword">
                <ControlLabel bsClass="col-sm-5 control-label">Administrator Passwort</ControlLabel>
                <Col xs={5}>
                  <FormControl type="text" value={this.state.adminpassword} placeholder="Neues Passwort eingeben..." onChange={this.onAdminPasswordInput} />
                </Col>
                <Col xs={2}>
                  {this.state.adminpassword.length > 0 && <Button bsStyle="primary" onClick={this.onAdminPasswordChange}>Passwort ändern</Button>}
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default SettingsGeneral;
