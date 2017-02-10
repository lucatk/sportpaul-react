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
import ImageUploadControl from '../ImageUploadControl';

class ProductAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      internalid: '',
      pricegroups: [],
      flockingEnabled: false,
      flockingPrice: 0,
      picture: null
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onInternalIDChange = this.onInternalIDChange.bind(this);
    this.onPricegroupsChange = this.onPricegroupsChange.bind(this);
    this.onFlockingPriceChange = this.onFlockingPriceChange.bind(this);
    this.onFlockingEnabledChange = this.onFlockingEnabledChange.bind(this);
    this.onPictureChange = this.onPictureChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }
  onPricegroupsChange(newPricegroups) {
    this.setState({pricegroups:newPricegroups});
  }
  onNameChange(event) {
    this.setState({name:event.target.value});
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
  onPictureChange(newPicture) {
    this.setState({picture:newPicture});
  }
  closeModal() {
    this.props.onClose();
    this.state = {
      name: '',
      internalid: '',
      pricegroups: [],
      flockingEnabled: false,
      flockingPrice: 0,
      picture: null
    };
  }
  addProduct() {
    if(!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !this.state.picture)
      return;
    this.props.onClose({
      name: this.state.name,
      internalid: this.state.internalid,
      pricegroups: JSON.stringify(this.state.pricegroups),
      flockingPrice: this.state.flockingEnabled?this.state.flockingPrice:null,
      picture: this.state.picture
    });
    this.state = {
      name: '',
      internalid: '',
      pricegroups: [],
      flockingEnabled: false,
      flockingPrice: 0,
      picture: null
    };
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
            <FormGroup controlId="inputPicture" validationState={!this.state.picture ? 'error' : null}>
              <ControlLabel bsClass="col-sm-3 control-label">Vorschaubild</ControlLabel>
              <div className="col-sm-9 flocking-edit">
                <ImageUploadControl value={this.state.picture} searchPath="productpics/" onChange={this.onPictureChange} />
              </div>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>Abbrechen</Button>
          <Button bsStyle="success" onClick={this.addProduct}
                  disabled={!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !this.state.picture}>Hinzufügen</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductAddModal;
