import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

class ProductRemovalModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      name: ''
    };

    this.closeModal = this.closeModal.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }
  closeModal() {
    this.props.onClose();
  }
  removeProduct(e) {
    this.props.onClose({id: this.state.id});
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.scope || nextProps.scope === -1) return;
    this.setState({
      id: nextProps.scope.id,
      name: nextProps.scope.name
    });
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.closeModal} data-scope={this.state.id}>
        <Modal.Header closeButton>
          <Modal.Title>Produkt löschen...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Möchten Sie das Produkt &quot;{this.state.name}&quot; mit der ID {this.state.id} unwiderruflich löschen?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>Abbrechen</Button>
          <Button bsStyle="danger" onClick={this.removeProduct}>Ja, löschen</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductRemovalModal;
