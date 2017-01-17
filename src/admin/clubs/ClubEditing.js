import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import ProductEditModal from './modals/ProductEditModal';
import ProductRemovalModal from './modals/ProductRemovalModal';

class ClubEditing extends Component {
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
      <div className="container">
        <h1 className="page-header">Verein bearbeiten <small>ID: {this.props.params.clubid}</small></h1>
        <form>
          <FormGroup controlId="inputName">
            <ControlLabel bsClass="col-sm-1 control-label">Name</ControlLabel>
            <div className="col-sm-11">
              <FormControl type="text" value="" placeholder="Geben Sie dem Verein einen Namen..." />
            </div>
          </FormGroup>
          <FormGroup controlId="inputLogo">
            <ControlLabel bsClass="col-sm-1 control-label">Logo</ControlLabel>
            <div className="col-sm-11">
              <input type="file" className="form-control" />
              <img className="file-preview img-thumbnail" src="clublogos/fc48.png"/>
            </div>
          </FormGroup>
          <FormGroup controlId="inputProducts">
            <ControlLabel bsClass="col-sm-1 control-label">Produkte</ControlLabel>
            <div className="col-sm-11">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Größen</th>
                    <th>Preis</th>
                    <th>Beflockung</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr data-id="0" data-name="Testprodukt 1">
                    <td>0</td>
                    <td className="product-name">Testprodukt 1</td>
                    <td>S, M, L, XL</td>
                    <td>49,99 €</td>
                    <td>Aufpreis: 2,49 €</td>
                    <td className="buttons">
                      <ButtonToolbar>
                        <Button bsSize="small" onClick={this.openEditProductModal}><Glyphicon glyph="pencil" /> Bearbeiten</Button>
                        <Button bsSize="small" bsStyle="danger" onClick={this.openRemoveProductModal}><Glyphicon glyph="remove" /> Löschen</Button>
                      </ButtonToolbar>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </FormGroup>
        </form>

        <ProductEditModal ref="productEditModal" onEdit={this.editProduct} />
        <ProductRemovalModal ref="productRemovalModal" onRemove={this.removeProduct} />
      </div>
    );
  }
}

export default ClubEditing;
