import React, { Component } from 'react';

import {
  Row, Col,
  FormGroup, FormControl, ControlLabel, Checkbox
} from 'react-bootstrap';

class SettingsGeneral extends Component {
  constructor(props) {
    super(props);

    this.disableRefs = {};

    this.onEnableNotificationsChange = this.onEnableNotificationsChange.bind(this);
  }
  onEnableNotificationsChange(ev) {
    this.props.onSettingChange("mail_enablenotifications", true, {target:{value:ev.target.checked}});
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
              <FormGroup controlId="inputExportCombineClubs">
                <ControlLabel bsClass="col-sm-5 control-label">Export: Bestellungen aller Vereine zusammenführen</ControlLabel>
                <Col xs={4}>
                  <FormControl componentClass="select" value={this.props.settings.export_combineclubs} onChange={this.props.onSettingChange.bind(this, "export_combineclubs", false)} onBlur={this.props.onSettingChange.bind(this, "export_combineclubs", true)} >
                    <option value={1}>Ja</option>
                    <option value={0}>Nein</option>
                  </FormControl>
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
