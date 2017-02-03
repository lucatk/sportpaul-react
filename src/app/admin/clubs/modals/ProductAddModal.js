import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import ProductPriceInput from '../ProductPriceInput';
import ProductPricegroupsControl from '../ProductPricegroupsControl';

class ProductAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      pricegroups: [],
      flockingEnabled: false,
      flockingPrice: 0
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onPricegroupsChange = this.onPricegroupsChange.bind(this);
    this.onFlockingPriceChange = this.onFlockingPriceChange.bind(this);
    this.onFlockingEnabledChange = this.onFlockingEnabledChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }
  onPricegroupsChange(newPricegroups) {
    this.setState({pricegroups:newPricegroups});
  }
  onNameChange(event) {
    this.setState({name:event.target.value});
  }
  onFlockingEnabledChange(event) {
    this.setState({flockingEnabled:event.target.checked});
  }
  onFlockingPriceChange(newPrice) {
    this.setState({flockingPrice:newPrice});
  }
  closeModal() {
    this.props.onClose();
  }
  addProduct() {
    if(!this.state.name || this.state.name.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1)
      return;
    this.props.onClose({
      name: this.state.name,
      pricegroups: this.state.pricegroups,
      flockingPrice: this.state.flockingEnabled?this.state.flockingPrice:null
    });
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Neues Produkt hinzufügen...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup controlId="inputProductName" validationState={!this.state.name || this.state.name.length < 1 ? 'error' : null}>
              <ControlLabel bsClass="col-sm-3 control-label">Name</ControlLabel>
              <div className="col-sm-9">
                <FormControl type="text" value={this.state.name} placeholder="Produkt-Name" onChange={this.onNameChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="inputProductPricegroups" validationState={!this.state.pricegroups || this.state.pricegroups.length < 1 ? 'error' : null}>
              <ControlLabel bsClass="col-sm-3 control-label">Preisgruppen</ControlLabel>
              <div className="col-sm-9 pricegroups-edit">
                <ProductPricegroupsControl value={this.state.pricegroups} onValueChange={this.onPricegroupsChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="inputFlocking">
              <ControlLabel bsClass="col-sm-3 control-label">Beflockung</ControlLabel>
              <div className="col-sm-9 flocking-edit">
                <label><input type="checkbox" value="" checked={this.state.flockingEnabled} onChange={this.onFlockingEnabledChange} /> aktiv</label>
                <ProductPriceInput enabled={this.state.flockingEnabled} value={this.state.flockingPrice} onValueChange={this.onFlockingPriceChange} />
              </div>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>Abbrechen</Button>
          <Button bsStyle="success" onClick={this.addProduct}
                  disabled={!this.state.name || this.state.name.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1}>Hinzufügen</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductAddModal;
