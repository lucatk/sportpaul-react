import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import ProductPriceInput from '../ProductPriceInput';

class ProductEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      scope: {
        name: '',
        id: -1
      },
      price: 0,
      flockingEnabled: false,
      flockingPrice: 1,
      sizeAddInput: '',
      sizeList: []
    };

    this.onPriceChange = this.onPriceChange.bind(this);
    this.onFlockingPriceChange = this.onFlockingPriceChange.bind(this);
    this.onFlockingEnabledChange = this.onFlockingEnabledChange.bind(this);
    this.onSizeAddInputChange = this.onSizeAddInputChange.bind(this);
    this.addSize = this.addSize.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.editProduct = this.editProduct.bind(this);
  }
  onPriceChange(newPrice) {
    this.setState({price:newPrice});
  }
  onFlockingEnabledChange(event) {
    this.setState({flockingEnabled:event.target.checked});
  }
  onFlockingPriceChange(newPrice) {
    this.setState({flockingPrice:newPrice});
  }
  onSizeAddInputChange(event) {
    this.setState({sizeAddInput: event.target.value});
  }
  addSize() {
    if(this.refs.sizeInput.props.value.length > 0) {
      var sizes = this.state.sizeList;
      sizes[sizes.length] = this.refs.sizeInput.props.value;
      this.setState({sizeList: sizes});
    }
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
  editProduct() {
    this.props.onEdit(this.state.scope.id, {
      name: this.state.scope.name,
      sizes: this.state.sizeList,
      price: this.state.price,
      flockingPrice: this.state.flockingEnabled?this.state.flockingPrice:null
    });
    this.closeModal();
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.closeModal} data-scope={this.state.scope.id}>
        <Modal.Header closeButton>
          <Modal.Title>Produkt bearbeiten...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup controlId="inputProductName">
              <ControlLabel bsClass="col-sm-2 control-label">Name</ControlLabel>
              <div className="col-sm-10">
                <FormControl type="text" value="" placeholder="Produkt-Name" />
              </div>
            </FormGroup>
            <FormGroup controlId="inputProductSizes">
              <ControlLabel bsClass="col-sm-2 control-label">Größen</ControlLabel>
              <div className="col-sm-10 sizes-edit">
                <ul>
                {this.state.sizeList && this.state.sizeList.length > 0
                  ? this.state.sizeList.map((size, i) => <p key={i}>{size} <button type="button" className="close" aria-label="Entfernen..."><span aria-hidden="true">×</span></button></p>)
                  : ''}
                </ul>
                <ButtonToolbar>
                  <FormControl ref="sizeInput" type="text" value={this.state.sizeAddInput} placeholder="S" onChange={this.onSizeAddInputChange} />
                  <Button bsSize="small" onClick={this.addSize}>Hinzufügen</Button>
                </ButtonToolbar>
              </div>
            </FormGroup>
            <FormGroup controlId="inputProductPrice">
              <ControlLabel bsClass="col-sm-2 control-label">Preis</ControlLabel>
              <div className="col-sm-10 price-edit">
                <ProductPriceInput onValueChange={this.onPriceChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="inputFlocking">
              <ControlLabel bsClass="col-sm-2 control-label">Beflockung</ControlLabel>
              <div className="col-sm-10 flocking-edit">
                <label><input type="checkbox" value="" checked={this.state.flockingEnabled} onChange={this.onFlockingEnabledChange} /> aktiv</label>
                <ProductPriceInput enabled={this.state.flockingEnabled} onValueChange={this.onFlockingPriceChange} />
              </div>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>Abbrechen</Button>
          <Button bsStyle="success" onClick={this.editProduct}>Speichern</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductEditModal;
