import React, { Component } from 'react';
import { withRouter } from 'react-router';

import $ from 'jquery';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import ProductEditModal from './modals/ProductEditModal.js';
import ProductRemovalModal from './modals/ProductRemovalModal';
import ProductAddModal from './modals/ProductAddModal';

class ClubEditing extends Component {
  constructor(props) {
    super(props);

    this.loadedInfo = false;
    this.loadedProducts = false;
    this.state = {
      id: -1,
      name: '',
      logopath: '',
      products: [],
      showProductEditModal: false,
      scopeProductEditModal: -1,
      showProductRemoveModal: false,
      scopeProductRemoveModal: -1,
      showProductAddModal: false,
      toUpdateProducts: [],
      loadedInfo: false,
      loadedProducts: false
    }

    $.post({
      url: 'php/load_club_info.php',
      data: {
        id: this.props.params.clubid
      },
      success: function(data) {
        var parsed = JSON.parse(data);
        this.setState({
          ...parsed,
          loadedInfo: true
        });
        this.oldName = parsed.name;
      }.bind(this)
    });
    $.post({
      url: 'php/load_club_products.php',
      data: {
        id: this.props.params.clubid
      },
      success: function(data) {
        var products = JSON.parse(data);
        var productsArray = [];
        for(var key in products) {
          if(products.hasOwnProperty(key)) {
            productsArray[key] = products[key];
            productsArray[key].id = key;
          }
        }
        this.setState({
          products: productsArray,
          loadedProducts: true
        });
      }.bind(this)
    });

    this.onNameChange = this.onNameChange.bind(this);
    this.openProductEditModal = this.openProductEditModal.bind(this);
    this.openProductRemoveModal = this.openProductRemoveModal.bind(this);
    this.openProductAddModal = this.openProductAddModal.bind(this);
    this.onCloseProductEditModal = this.onCloseProductEditModal.bind(this);
    this.onCloseProductRemoveModal = this.onCloseProductRemoveModal.bind(this);
    this.onCloseProductAddModal = this.onCloseProductAddModal.bind(this);
  }
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if(this.state.name && this.state.name.length > 0 && ((this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0) || this.state.name !== this.oldName))
        return 'Sie haben ungesicherte Änderungen, sind Sie sicher, dass Sie diese Seite verlassen wollen?';
    })
  }
  onNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  openProductEditModal(id, e) {
    this.setState({
      showProductEditModal: true,
      scopeProductEditModal: this.state.products[id]
    });
  }
  openProductRemoveModal(id, e) {
    this.setState({
      showProductRemoveModal: true,
      scopeProductRemoveModal: this.state.products[id]
    });
  }
  openProductAddModal(id) {
    this.setState({showProductAddModal: true});
  }
  onCloseProductEditModal(e) {
    if(e) {
      var products = this.state.products;

      var product = products[e.id];
      product.flockingPrice = e.flockingPrice;
      product.name = e.name;
      product.pricegroups = JSON.stringify(e.pricegroups);
      products[e.id] = product;

      var toUpdate = this.state.toUpdateProducts;
      toUpdate[e.id] = product;

      this.setState({
        showProductEditModal: false,
        scopeProductEditModal: -1,
        products: products,
        toUpdateProducts: toUpdate
      });
    } else {
      this.setState({
        showProductEditModal: false,
        scopeProductEditModal: -1
      });
    }
  }
  onCloseProductRemoveModal(e) {
    if(e) {
      var products = this.state.products;
      products.splice(e.id, 1);

      var toUpdate = this.state.toUpdateProducts;
      toUpdate[e.id] = {};

      this.setState({
        showProductRemoveModal: false,
        scopeProductRemoveModal: -1,
        products: products,
        toUpdateProducts: toUpdate
      });
    } else {
      this.setState({
        showProductRemoveModal: false,
        scopeProductRemoveModal: -1
      });
    }
  }
  onCloseProductAddModal(e) {
    if(e) {
      // ..
    } else {
      this.setState({showProductAddModal: false});
    }
  }
  render() {
    if(this.state.loadedInfo && this.state.loadedProducts) {
      return (
        <div className="container" data-page="ClubEditing">
          <h1 className="page-header">
            Verein bearbeiten <small>ID: {this.state.id}</small>
            {((this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0) || this.state.name !== this.oldName) &&
              <div className="unsaved-changes">
                <small>Sie haben ungesicherte Änderungen!</small>
                <Button bsStyle="success" bsSize="small" onClick={this.save}
                        disabled={!this.state.name || this.state.name.length < 1}>Speichern</Button>
              </div>}
          </h1>
          <form>
            <FormGroup controlId="inputName" validationState={!this.state.name || this.state.name.length < 1 ? 'error' : null}>
              <ControlLabel bsClass="col-sm-1 control-label">Name</ControlLabel>
              <div className="col-sm-11">
                <FormControl type="text" value={this.state.name} placeholder="Geben Sie dem Verein einen Namen..." onChange={this.onNameChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="inputLogo">
              <ControlLabel bsClass="col-sm-1 control-label">Logo</ControlLabel>
              <div className="col-sm-11">
                <input type="file" className="form-control" />
                <img className="file-preview img-thumbnail" src={this.state.logopath} />
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
                      <th>Preisgruppen</th>
                      <th>Beflockung</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.products && Object.keys(this.state.products).length > 0
                      ? this.state.products.map((row, i) =>
                          <tr key={i} data-id={row.id} data-name={row.name}>
                            <td>{row.id}</td>
                            <td className="product-name">{row.name}</td>
                            <td className="pricegroups">
                              {JSON.parse(row.pricegroups).map((group, i) =>
                                <div key={i}>
                                  <p className="sizes">{group.sizes.join(", ")}:</p>
                                  <p className="price">{group.price.toFixed(2).replace('.', ',')} €</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {row.flockingPrice && parseFloat(row.flockingPrice) >= 0
                                    ? (parseFloat(row.flockingPrice) > 0
                                      ? 'Aufpreis: ' + parseFloat(row.flockingPrice).toFixed(2).replace('.', ',') + ' €'
                                      : 'kostenlos')
                                    : 'keine Beflockung'}
                            </td>
                            <td className="buttons">
                              <ButtonToolbar>
                                <Button bsSize="small" onClick={this.openProductEditModal.bind(this, i)}><Glyphicon glyph="pencil" /> Bearbeiten</Button>
                                <Button bsSize="small" bsStyle="danger" onClick={this.openProductRemoveModal.bind(this, i)}><Glyphicon glyph="trash" /> Löschen</Button>
                              </ButtonToolbar>
                            </td>
                          </tr>
                    ) : <tr className="no-data"><td colSpan="5">Keine Produkte vorhanden</td></tr>}
                  </tbody>
                </Table>
                <Button bsSize="small" bsStyle="success" onClick={this.openProductAddModal}><Glyphicon glyph="plus" /> Hinzufügen...</Button>
              </div>
            </FormGroup>
          </form>

          <ProductEditModal show={this.state.showProductEditModal} scope={this.state.scopeProductEditModal} onClose={this.onCloseProductEditModal} />
          <ProductRemovalModal show={this.state.showProductRemoveModal} scope={this.state.scopeProductRemoveModal} onClose={this.onCloseProductRemoveModal} />
          <ProductAddModal show={this.state.showProductAddModal} onClose={this.onCloseProductAddModal} />
        </div>
      );
    } else {
      return (
        <div className="container" data-page="ClubEditing">
          <h1 className="page-header">
            Verein bearbeiten <small>ID: {this.state.id}</small>
          </h1>
          <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>
        </div>
      );
    }
  }
}

export default withRouter(ClubEditing);
