import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

// import ProductEditModal from './modals/ProductEditModal';
// import ProductRemovalModal from './modals/ProductRemovalModal';

class OrderDisplay extends Component {
  constructor(props) {
    super(props);

    this.openEditProductModal = this.openEditProductModal.bind(this);
    this.openRemoveProductModal = this.openRemoveProductModal.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }
  openEditProductModal(e) {
    this.refs.productEditModal.openModal(e);
  }
  openRemoveProductModal(e) {
    this.refs.productRemovalModal.openModal(e);
  }
  editProduct(e) {
    this.closeEditProductModal();
  }
  removeProduct(e) {
    this.closeRemoveProductModal();
  }
  render() {
    return (
      <div className="container" data-page="OrderDisplay">
        <h1 className="page-header">
          Bestellung im Detail
          <small> ID: {this.props.params.clubid}/{this.props.params.orderid}</small>
          <Button bsStyle="danger" bsSize="small"><Glyphicon glyph="remove" /> Löschen</Button>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11">FC Steinhofen</ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputCustomer">
            <ControlLabel bsClass="col-sm-1 control-label">Kunde</ControlLabel>
            <ControlLabel bsClass="col-sm-11">Max Mustermann</ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputDate">
            <ControlLabel bsClass="col-sm-1 control-label">Bestelldatum</ControlLabel>
            <ControlLabel bsClass="col-sm-11">02.01.2017 16:53 Uhr</ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputProducts">
            <ControlLabel bsClass="col-sm-1 control-label">Produkte</ControlLabel>
            <div className="col-sm-11">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Produkt #</th>
                    <th>Name</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Gesamtpreis</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr data-id="0" data-name="Testprodukt 1">
                    <td>0</td>
                    <td className="product-name">Testprodukt 1</td>
                    <td>M</td>
                    <td>M. Mustermann</td>
                    <td>52,48 €</td>
                    <td className="buttons">
                      <ButtonToolbar>
                        <Button bsSize="small" onClick={this.openEditProductModal}><Glyphicon glyph="pencil" /></Button>
                        <Button bsSize="small" bsStyle="danger" onClick={this.openRemoveProductModal}><Glyphicon glyph="remove" /></Button>
                      </ButtonToolbar>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default OrderDisplay;
