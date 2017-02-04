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

class ProductEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      name: '',
      pricegroups: [],
      flockingEnabled: false,
      flockingPrice: 0
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onInternalIDChange = this.onInternalIDChange.bind(this);
    this.onPricegroupsChange = this.onPricegroupsChange.bind(this);
    this.onFlockingPriceChange = this.onFlockingPriceChange.bind(this);
    this.onFlockingEnabledChange = this.onFlockingEnabledChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editProduct = this.editProduct.bind(this);
  }
  onPricegroupsChange(newPricegroups) {
    this.setState({pricegroups: newPricegroups});
  }
  onNameChange(event) {
    this.setState({name: event.target.value});
  }
  onInternalIDChange(event) {
    this.setState({internalid:event.target.value});
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
  editProduct() {
    if(!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1)
      return;
    this.props.onClose({
      id: this.state.id,
      name: this.state.name,
      internalid: this.state.internalid,
      pricegroups: JSON.stringify(this.state.pricegroups),
      flockingPrice: this.state.flockingEnabled?this.state.flockingPrice:null
    });
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.scope || nextProps.scope === -1) return;
    var pricegroups = JSON.parse(nextProps.scope.pricegroups);
    this.setState({
      id: nextProps.scope.id,
      name: nextProps.scope.name,
      internalid: nextProps.scope.internalid,
      pricegroups: pricegroups,
      flockingEnabled: parseFloat(nextProps.scope.flockingPrice) >= 0,
      flockingPrice: parseFloat(nextProps.scope.flockingPrice)
    });
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.closeModal} data-scope={this.state.id}>
        <Modal.Header closeButton>
          <Modal.Title>Produkt bearbeiten...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FormGroup controlId="inputProductName" validationState={!this.state.name || this.state.name.length < 1 ? 'error' : null}>
              <ControlLabel bsClass="col-sm-3 control-label">Name</ControlLabel>
              <div className="col-sm-9">
                <FormControl type="text" value={this.state.name} placeholder="Produkt-Name" onChange={this.onNameChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="inputProductInternalID" validationState={!this.state.internalid || this.state.internalid.length < 1 ? 'error' : null}>
              <ControlLabel bsClass="col-sm-3 control-label">Artikelnummer</ControlLabel>
              <div className="col-sm-9">
                <FormControl type="text" value={this.state.internalid} placeholder="Interne Artikelnummer" onChange={this.onInternalIDChange} />
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
          <Button bsStyle="success" onClick={this.editProduct}
                  disabled={!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1}>Übernehmen</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductEditModal;
