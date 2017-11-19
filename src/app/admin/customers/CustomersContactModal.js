import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Radio, Checkbox, ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class CustomersContactModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      inputSubject: "",
      inputText: ""
    };

    this.closeModal = this.closeModal.bind(this);
    this.send = this.send.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onInsertTextPreset = this.onInsertTextPreset.bind(this);
  }
  closeModal() {
    this.props.onClose();
    this.setState({
      data: null,
      inputSubject: "",
      inputText: ""
    });
  }
  send() {
    this.props.onClose(this.state);
    this.setState({
      data: null,
      inputSubject: "",
      inputText: ""
    });
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.scope || nextProps.scope == null) return;
    this.setState({
      data: nextProps.scope,
      inputSubject: "",
      inputText: ""
    });
  }
  onSubjectChange(ev) {
    this.setState({
      inputSubject: ev.target.value
    });
  }
  onTextChange(ev) {
    this.setState({
      inputText: ev.target.value
    });
  }
  onInsertTextPreset(key) {
    this.setState({
      inputText: this.state.inputText + "[" + Statics.CustomersContactTextPresets[key] + "]"
    });
  }
  render() {
    return (
      <div>
        <Modal show={this.props.show} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Kontaktieren...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="customers-contact">
              <FormGroup controlId="inputSubject" validationState={!this.state.inputSubject || this.state.inputSubject.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-3 control-label">Betreff</ControlLabel>
                <div className="col-sm-9">
                  <FormControl type="text" value={this.state.inputSubject} placeholder="Betreff eingeben..." onChange={this.onSubjectChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputText" validationState={!this.state.inputText || this.state.inputText.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-3 control-label">Nachricht</ControlLabel>
                <div className="col-sm-7">
                  <FormControl componentClass="textarea" value={this.state.inputText} placeholder="Geben Sie einen Nachrichten-Text ein..." onChange={this.onTextChange} />
                </div>
                <div className="col-sm-2">
                  <p className="text-presets-info">Vorgaben:</p>
                  {Object.keys(Statics.CustomersContactTextPresets).map((key, i) => <p className="text-preset" onClick={this.onInsertTextPreset.bind(this, key)}>[{Statics.CustomersContactTextPresets[key]}]</p>)}
                </div>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Abbrechen</Button>
            <Button bsStyle="success" onClick={this.send}
                    disabled={!this.state.inputSubject || this.state.inputSubject.length < 1 || !this.state.inputText || this.state.inputText.length < 1}>Senden</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CustomersContactModal;
