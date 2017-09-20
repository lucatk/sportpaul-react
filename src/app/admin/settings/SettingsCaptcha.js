import React, { Component } from 'react';

import {
  Row, Col,
  FormGroup, FormControl, ControlLabel, Checkbox
} from 'react-bootstrap';

class SettingsCaptcha extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="settings-tab" data-tab="Captcha">
        <form>
          <Row>
            <Col xs={8}>
              <FormGroup controlId="inputRecaptchaSiteKey">
                <ControlLabel bsClass="col-sm-5 control-label">ReCaptcha Site-Key</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.general_recaptcha_site} onChange={this.props.onSettingChange.bind(this, "general_recaptcha_site", false)} onBlur={this.props.onSettingChange.bind(this, "general_recaptcha_site", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <FormGroup controlId="inputRecaptchaSecretKey">
                <ControlLabel bsClass="col-sm-5 control-label">ReCaptcha Secret-Key</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.general_recaptcha_secret} onChange={this.props.onSettingChange.bind(this, "general_recaptcha_secret", false)} onBlur={this.props.onSettingChange.bind(this, "general_recaptcha_secret", true)} />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default SettingsCaptcha;
