import React, { Component } from 'react';

import {
  Row, Col,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

class SettingsGeneral extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="settings-tab" data-tab="General">
        <form>
          <Row>
            <Col xs={8}>
              <FormGroup controlId="inputSubject">
                <ControlLabel bsClass="col-sm-5 control-label">Betreff "Artikel abholbar"-Info</ControlLabel>
                <Col xs={7}>
                  <FormControl type="text" value={this.props.settings.subject_articlereceivedinfo} placeholder="Ihre Bestellung ist abholbar!" onChange={this.props.onSettingChange.bind(this, "subject_articlereceivedinfo", false)} onBlur={this.props.onSettingChange.bind(this, "subject_articlereceivedinfo", true)} />
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
