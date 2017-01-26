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
      show: false,
      scope: {
        name: '',
        id: -1
      }
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }
  closeModal() {
    this.setState({
      show: false,
      scope: {
        name: '',
        id: -1
      }
    });
  }
  openModal(e) {
    this.setState({
      show: true,
      scope: e.target.parentElement.parentElement.parentElement.dataset
    });
  }
  removeProduct(e) {
    this.props.onRemove(e);
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.closeModal} data-scope={this.state.scope.id}>
        <Modal.Header closeButton>
          <Modal.Title>Produkt löschen...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Möchten Sie das Produkt &quot;{this.state.scope.name}&quot; mit der ID {this.state.scope.id} unwiderruflich löschen?</p>
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
