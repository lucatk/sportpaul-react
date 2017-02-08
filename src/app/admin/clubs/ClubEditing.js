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

import LoadingOverlay from '../../utils/LoadingOverlay.js';
import ProductEditModal from './modals/ProductEditModal.js';
import ProductRemovalModal from './modals/ProductRemovalModal';
import ProductAddModal from './modals/ProductAddModal';

class ClubEditing extends Component {
  constructor(props) {
    super(props);

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({logoPreview: e.target.result});
    }).bind(this);

    this.state = {
      id: -1,
      name: '',
      logodata: '',
      logoPreview: '',
      products: [],
      showProductEditModal: false,
      scopeProductEditModal: -1,
      showProductRemoveModal: false,
      scopeProductRemoveModal: -1,
      showProductAddModal: false,
      toUpdateProducts: [],
      toRemoveProducts: [],
      toAddProducts: [],
      loadedInfo: false,
      loadedProducts: false,
      loading: false
    }

    this.componentWillReceiveProps(this.props);

    this.onNameChange = this.onNameChange.bind(this);
    this.onLogodataChange = this.onLogodataChange.bind(this);
    this.openProductEditModal = this.openProductEditModal.bind(this);
    this.openProductRemoveModal = this.openProductRemoveModal.bind(this);
    this.openProductAddModal = this.openProductAddModal.bind(this);
    this.onCloseProductEditModal = this.onCloseProductEditModal.bind(this);
    this.onCloseProductRemoveModal = this.onCloseProductRemoveModal.bind(this);
    this.onCloseProductAddModal = this.onCloseProductAddModal.bind(this);
    this.save = this.save.bind(this);
  }
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if(this.state.name && this.state.name.length > 0
          && ((this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0)
              || (this.state.toRemoveProducts && this.state.toRemoveProducts.length > 0)
              || (this.state.toAddProducts && this.state.toAddProducts.length > 0)
              || this.state.name !== this.oldName
              || this.state.logodata !== this.oldLogodata))
        return 'Sie haben ungesicherte Änderungen, sind Sie sicher, dass Sie diese Seite verlassen wollen?';
    })
  }
  onNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  onLogodataChange(e) {
    this.setState({
      logodata: e.target.files[0]
    });
    this.fileReader.readAsDataURL(e.target.files[0]);
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
  openProductAddModal() {
    this.setState({showProductAddModal: true});
  }
  onCloseProductEditModal(e) {
    if(e) {
      var products = this.state.products;

      var product = products[e.id];
      product.name = e.name;
      product.internalid = e.internalid;
      product.pricegroups = e.pricegroups;
      product.flockingPrice = e.flockingPrice;
      products[e.id] = product;
      this.setState({products: products});

      if(product.new) {
        var toAdd = this.state.toAddProducts;
        toAdd[e.id] = product;
        this.setState({toAddProducts: toAdd});
      } else {
        var toUpdate = this.state.toUpdateProducts;
        toUpdate[e.id] = product;
        this.setState({toUpdateProducts: toUpdate});
      }
    }

    this.setState({
      showProductEditModal: false,
      scopeProductEditModal: -1
    });
  }
  onCloseProductRemoveModal(e) {
    if(e) {
      var products = this.state.products;
      if(products[e.id].new) {
        var toAdd = this.state.toAddProducts;
        toAdd.splice(e.id, 1);
        this.setState({toAddProducts: toAdd});
      } else {
        var toRemove = this.state.toRemoveProducts;
        toRemove[toRemove.length] = {
          id: e.id,
          clubid: this.state.id
        };
        this.setState({toRemoveProducts: toRemove});
      }

      products.splice(e.id, 1);
      this.setState({products: products});
    }

    this.setState({
      showProductRemoveModal: false,
      scopeProductRemoveModal: -1
    });
  }
  onCloseProductAddModal(e) {
    if(e) {
      var products = this.state.products;
      var newId = products.length;
      products[newId] = {
        new: true,
        id: newId,
        clubid: this.state.id,
        ...e
      };
      var toAdd = this.state.toAddProducts;
      toAdd[newId] = products[newId];
      this.setState({
        products: products,
        toAddProducts: toAdd
      })
    }

    this.setState({showProductAddModal: false});
  }
  save() {
    var updatedClubInfo = false;
    var error = false;
    var toUpdateCount = this.state.toUpdateProducts.filter((value) => {return value !== undefined && value !== null}).length;
    var toRemoveCount = this.state.toRemoveProducts.filter((value) => {return value !== undefined && value !== null}).length;
    var toAddCount = this.state.toAddProducts.filter((value) => {return value !== undefined && value !== null}).length;

    var doneProcess = () => {
      if(!updatedClubInfo || toUpdateCount > 0 || toRemoveCount > 0 || toAddCount > 0) return;

      this.oldName = this.state.name;
      this.oldLogodata = this.state.logodata;
      this.setState({
        toUpdateProducts: [],
        toAddProducts: [],
        toRemoveProducts: [],
        loading: false
      });

      if(error) {
        console.log("error");
      } else {
        this.props.router.push("/admin/clubs");
      }
    };

    this.setState({loading: true});

    if(this.state.name !== this.oldName || this.state.logodata !== this.oldLogodata) {
      var data = new FormData();
      data.append("id", this.state.id);
      data.append("name", this.state.name);
      if(typeof this.state.logodata === "object")
        data.append("logodata", this.state.logodata);
      $.post({
        url: 'php/clubs/update.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          console.log(data);
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1)
            error = true;
          console.log(result, error);
          updatedClubInfo = true;
          doneProcess();
        }.bind(this)
      });
    } else {
      updatedClubInfo = true;
      doneProcess();
    }

    this.state.toUpdateProducts.forEach((product, id) => {
      if(product == undefined || product == null) return;
      $.post({
        url: 'php/products/update.php',
        data: product,
        success: function(data) {
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1)
            error = true;
          console.log(result, error);
          toUpdateCount--;
          doneProcess();
        }
      });
    });
    this.state.toAddProducts.forEach((product, id) => {
      if(product == undefined || product == null) return;
      $.post({
        url: 'php/products/add.php',
        data: {
          clubid: product.clubid,
          internalid: product.internalid,
          name: product.name,
          pricegroups: product.pricegroups,
          flockingPrice: product.flockingPrice
        },
        success: function(data) {
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1)
            error = true;
          console.log(result, error);
          toAddCount--;
          doneProcess();
        }
      });
    });
    this.state.toRemoveProducts.forEach((product, id) => {
      if(product == undefined || product == null) return;
      $.post({
        url: 'php/products/remove.php',
        data: {
          id: product.id,
          clubid: product.clubid
        },
        success: function(data) {
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1)
            error = true;
          console.log(result, error);
          toRemoveCount--;
          doneProcess();
        }
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      loadedInfo: false,
      loadedProducts: false,
      loading: true
    });

    var loadedInfo = false;
    var loadedProducts = false;
    var doneProcess = (() => {
      if(loadedInfo && loadedProducts)
        this.setState({loading: false});
    }).bind(this);

    $.post({
      url: 'php/clubs/load.php',
      data: {
        id: nextProps.params.clubid
      },
      success: function(data) {
        var parsed = JSON.parse(data);

        loadedInfo = true;
        doneProcess();

        this.setState({
          ...parsed,
          loadedInfo: true
        });
        this.oldName = parsed.name;
        this.oldLogodata = parsed.logodata;
      }.bind(this)
    });
    $.post({
      url: 'php/products/load.php',
      data: {
        id: nextProps.params.clubid
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

        loadedProducts = true;
        doneProcess();

        this.setState({
          products: productsArray,
          loadedProducts: true
        });
      }.bind(this)
    });
  }
  render() {
    if((this.state.loadedInfo && this.state.loadedProducts) || this.state.loading) {
      return (
        <div className="container" data-page="ClubEditing">
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">
            Verein bearbeiten <small>ID: {this.state.id}</small>
            {(this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0) || (this.state.toRemoveProducts && this.state.toRemoveProducts.length > 0) || (this.state.toAddProducts && this.state.toAddProducts.length > 0) || this.state.name !== this.oldName || this.state.logodata !== this.oldLogodata ?
              <div className="unsaved-changes">
                <small>Sie haben ungesicherte Änderungen!</small>
                <Button bsStyle="success" bsSize="small" onClick={this.save}
                        disabled={!this.state.name || this.state.name.length < 1}>Speichern</Button>
              </div> : ''}
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
                <input type="file" className="form-control" onChange={this.onLogodataChange} />
                <img className="file-preview img-thumbnail" src={typeof this.state.logodata === "string" ? "clublogos/" + this.state.logodata : this.state.logoPreview} />
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
                      <th>Artikelnummer</th>
                      <th>Preisgruppen</th>
                      <th>Beflockung</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.products && Object.keys(this.state.products).length > 0
                      ? this.state.products.map((row, i) =>
                          <tr key={i} data-id={row.id} data-name={row.name}>
                            <td>{row.new?'':row.id}</td>
                            <td className="product-name">{row.name}</td>
                            <td className="internalid">{row.internalid}</td>
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
                              <Button bsSize="small" onClick={this.openProductEditModal.bind(this, row.id)}><Glyphicon glyph="pencil" /> Bearbeiten</Button>
                              <Button bsSize="small" bsStyle="danger" onClick={this.openProductRemoveModal.bind(this, row.id)}><Glyphicon glyph="trash" /> Löschen</Button>
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
