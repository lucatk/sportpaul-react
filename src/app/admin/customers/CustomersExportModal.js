import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Radio, Checkbox, ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class CustomersExportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      exportMode: 0,
      columns: {
        "id": true,
        "clubname": true,
        "firstname": true,
        "lastname": true,
        "address": true,
        "postcode": true,
        "town": true,
        "email": true,
        "phone": true,
        "amountOrders": true
      }
    };

    this.closeModal = this.closeModal.bind(this);
    this.export = this.export.bind(this);
    this.onChangeExportMode = this.onChangeExportMode.bind(this);
    this.onChangeColumnState = this.onChangeColumnState.bind(this);
  }
  closeModal() {
    this.props.onClose();
    this.setState({
      data: null,
      exportMode: 0,
      columns: {
        "id": true,
        "clubname": true,
        "firstname": true,
        "lastname": true,
        "address": true,
        "postcode": true,
        "town": true,
        "email": true,
        "phone": true,
        "amountOrders": true
      }
    });
  }
  export() {
    this.props.onClose(this.state);
    this.setState({
      data: null,
      exportMode: 0,
      columns: {
        "id": true,
        "clubname": true,
        "firstname": true,
        "lastname": true,
        "address": true,
        "postcode": true,
        "town": true,
        "email": true,
        "phone": true,
        "amountOrders": true
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.scope || nextProps.scope == null) return;
    this.setState({
      data: nextProps.scope,
      exportMode: 0,
      columns: {
        "id": true,
        "clubname": true,
        "firstname": true,
        "lastname": true,
        "address": true,
        "postcode": true,
        "town": true,
        "email": true,
        "phone": true,
        "amountOrders": true
      }
    });
  }
  onChangeExportMode(mode) {
    this.setState({
      exportMode: mode
    });
  }
  onChangeColumnState(column, ev) {
    var columns = this.state.columns;
    columns[column] = ev.target.checked;
    this.setState({columns:columns});
  }
  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Exportieren...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="customers-export">
              <FormGroup controlId="inputExportMode">
                <ControlLabel bsClass="col-sm-4 control-label">Export-Modus</ControlLabel>
                <div className="col-sm-8">
                  <Radio name="groupExportMode" checked={this.state.exportMode == 0} onChange={this.onChangeExportMode.bind(this, 0)} inline>Alle Vereine zusammenführen</Radio>
                  <Radio name="groupExportMode" checked={this.state.exportMode == 1} onChange={this.onChangeExportMode.bind(this, 1)} inline>Kunden der Vereine in separate Dateien</Radio>
                </div>
              </FormGroup>
              <FormGroup controlId="inputColumns">
                <ControlLabel bsClass="col-sm-4 control-label">Spalten</ControlLabel>
                <div className="col-sm-8">
                  {Object.keys(this.state.columns).map(c => (
                    <Checkbox checked={this.state.columns[c]} onChange={this.onChangeColumnState.bind(this, c)}>{Statics.CustomersExportColumns[c]}</Checkbox>
                  ))}
                </div>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Abbrechen</Button>
            <Button bsStyle="success" onClick={this.export}>Exportieren</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CustomersExportModal;
