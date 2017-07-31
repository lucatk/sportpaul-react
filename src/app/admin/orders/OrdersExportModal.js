import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Radio, Checkbox, ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class OrdersExportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      skipOrdered: true,
      exportMode: 0,
      columns: {
        "clubname": true,
        "id": true,
        "customer": true,
        "internalid": true,
        "name": true,
        "colour": true,
        "flocking": true,
        "size": true
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
      skipOrdered: true,
      exportMode: 0,
      columns: {
        "clubname": true,
        "id": true,
        "customer": true,
        "internalid": true,
        "name": true,
        "colour": true,
        "flocking": true,
        "size": true
      }
    });
  }
  export() {
    this.props.onClose(this.state);
    this.setState({
      data: null,
      skipOrdered: true,
      exportMode: 0,
      columns: {
        "clubname": true,
        "id": true,
        "customer": true,
        "internalid": true,
        "name": true,
        "colour": true,
        "flocking": true,
        "size": true
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.scope || nextProps.scope == null) return;
    this.setState({
      data: nextProps.scope,
      skipOrdered: true,
      exportMode: 0,
      columns: {
        "clubname": true,
        "id": true,
        "customer": true,
        "internalid": true,
        "name": true,
        "colour": true,
        "flocking": true,
        "size": true
      }
    });
  }
  onChangeExportMode(mode) {
    this.setState({
      exportMode: mode
    });
  }
  onChangeColumnState(column) {
    var columns = this.state.columns;
    columns[column] = !columns[column];
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
            <form className="orders-export">
              <FormGroup controlId="inputSkipOrdered">
                <div className="col-sm-12">
                  <Checkbox checked={this.state.skipOrdered} onChange={this.onChangeSkipOrdered}>Bereits bestellte Artikel überspringen</Checkbox>
                </div>
              </FormGroup>
                <FormGroup controlId="inputExportMode">
                  <ControlLabel bsClass="col-sm-4 control-label">Export-Modus</ControlLabel>
                  <div className="col-sm-8">
                    <Radio name="groupExportMode" checked={this.state.exportMode == 0} onChange={this.onChangeExportMode.bind(this, 0)} inline>Alle Bestellungen zusammenführen</Radio>
                    <Radio name="groupExportMode" checked={this.state.exportMode == 1} onChange={this.onChangeExportMode.bind(this, 1)} inline>Bestellungen der Vereine in separate Dateien</Radio>
                  </div>
                </FormGroup>
              <FormGroup controlId="inputColumns">
                <ControlLabel bsClass="col-sm-4 control-label">Spalten</ControlLabel>
                <div className="col-sm-8">
                  {Object.keys(this.state.columns).map(c => (
                    <Checkbox checked={this.state.columns[c]} onChange={this.onChangeColumnState.bind(this, c)}>{Statics.ExportColumns[c]}</Checkbox>
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

export default OrdersExportModal;
