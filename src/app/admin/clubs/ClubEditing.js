import React, { Component } from 'react';
import { withRouter } from 'react-router';

import $ from 'jquery';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button, Radio,
  Glyphicon
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import LoadingOverlay from '../../utils/LoadingOverlay';
import ImageLightbox from '../../utils/ImageLightbox';
import ProductEditModal from './modals/ProductEditModal';
import ProductRemovalModal from './modals/ProductRemovalModal';
import ProductAddModal from './modals/ProductAddModal';
import ImageUploadControl from './ImageUploadControl';

import * as Statics from "../../utils/Statics";

class ClubEditing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      name: '',
      logodata: '',
      displaymode: -1,
      products: [],
      showProductEditModal: false,
      scopeProductEditModal: -1,
      showProductRemoveModal: false,
      scopeProductRemoveModal: -1,
      showProductAddModal: false,
      picturePreview: null,
      toUpdateProducts: [],
      toRemoveProducts: [],
      toAddProducts: [],
      loadedInfo: false,
      loadedProducts: false,
      loading: false
    }

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({picturePreview: e.target.result});
    }).bind(this);

    this.componentWillReceiveProps(this.props);

    this.onNameChange = this.onNameChange.bind(this);
    this.onLogodataChange = this.onLogodataChange.bind(this);
    this.openProductEditModal = this.openProductEditModal.bind(this);
    this.openProductRemoveModal = this.openProductRemoveModal.bind(this);
    this.openProductAddModal = this.openProductAddModal.bind(this);
    this.onCloseProductEditModal = this.onCloseProductEditModal.bind(this);
    this.onCloseProductRemoveModal = this.onCloseProductRemoveModal.bind(this);
    this.onCloseProductAddModal = this.onCloseProductAddModal.bind(this);
    this.onPicturePreviewRequest = this.onPicturePreviewRequest.bind(this);
    this.onClosePicturePreview = this.onClosePicturePreview.bind(this);
    this.save = this.save.bind(this);
  }
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if(this.state.name && this.state.name.length > 0
          && ((this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0)
              || (this.state.toRemoveProducts && this.state.toRemoveProducts.length > 0)
              || (this.state.toAddProducts && this.state.toAddProducts.length > 0)
              || this.state.name !== this.oldName
              || this.state.logodata !== this.oldLogodata
              || this.state.displaymode != this.oldDisplaymode))
        return 'Sie haben ungesicherte Änderungen, sind Sie sicher, dass Sie diese Seite verlassen wollen?';
    })
  }
  onNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  onLogodataChange(newLogodata) {
    this.setState({
      logodata: newLogodata
    });
  }
  onChangeDisplayMode(mode) {
    this.setState({
      displaymode: mode
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
  openProductAddModal() {
    this.setState({showProductAddModal: true});
  }
  onPicturePreviewRequest(picture) {
    if(picture && typeof picture === "object")
      this.fileReader.readAsDataURL(picture);
    this.setState({picturePreview: picture});
  }
  onClosePicturePreview() {
    this.setState({picturePreview: null});
  }
  onCloseProductEditModal(e) {
    if(e) {
      var products = this.state.products;

      var product = products[e.id];
      product.name = e.name;
      product.internalid = e.internalid;
      product.colours = e.colours;
      product.pricegroups = e.pricegroups;
      product.flockingPrice = e.flockingPrice;
      product.picture = e.picture;
      product.defaultFlocking = e.defaultFlocking;
      product.defaultFlockingInfo = e.defaultFlockingInfo;
      product.coloursPictures = e.coloursPictures;
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

      delete products[e.id];
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
      this.oldDisplaymode = this.state.displaymode;
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

    if(this.state.name !== this.oldName || this.state.logodata !== this.oldLogodata || this.state.displaymode != this.oldDisplaymode) {
      var data = new FormData();
      data.append("id", this.state.id);
      data.append("name", this.state.name);
      if(typeof this.state.logodata === "object")
        data.append("logodata", this.state.logodata);
      data.append("displaymode", this.state.displaymode);
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
      var data = new FormData();
      data.append("id", product.id);
      data.append("clubid", product.clubid);
      data.append("name", product.name);
      data.append("internalid", product.internalid);
      data.append("colours", product.colours);
      data.append("pricegroups", product.pricegroups);
      data.append("flockingPrice", product.flockingPrice);
      data.append("defaultFlocking", product.defaultFlocking?1:0);
      data.append("defaultFlockingInfo", product.defaultFlockingInfo);
      if(product.coloursPictures) {
        product.coloursPictures.forEach((picture, i) => {
          if(picture != null && picture instanceof File)
            data.append(i, picture);
        });
      } else {
        if(typeof product.picture === "object")
          data.append("picture", product.picture);
      }
      $.post({
        url: 'php/products/update.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          console.log(data);
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
      var data = new FormData();
      data.append("clubid", product.clubid);
      data.append("name", product.name);
      data.append("internalid", product.internalid);
      data.append("colours", product.colours);
      data.append("pricegroups", product.pricegroups);
      data.append("flockingPrice", product.flockingPrice);
      data.append("defaultFlocking", product.defaultFlocking?1:0);
      data.append("defaultFlockingInfo", product.defaultFlockingInfo);
      if(product.coloursPictures) {
        product.coloursPictures.forEach((picture, i) => {
          if(picture != null && picture instanceof File)
            data.append(i, picture);
        });
      } else {
        if(typeof product.picture === "object")
          data.append("picture", product.picture);
      }
      $.post({
        url: 'php/products/add.php',
        contentType: false,
        processData: false,
        data: data,
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
        this.oldDisplaymode = parsed.displaymode;
      }.bind(this)
    });
    $.post({
      url: 'php/products/load.php',
      data: {
        id: nextProps.params.clubid
      },
      success: function(data) {
        var products = JSON.parse(data);

        var parsedProducts = [];
        for(var i in products) {
          parsedProducts[i] = products[i];
          parsedProducts[i].defaultFlocking = parsedProducts[i].defaultFlocking == 1;
        }

        loadedProducts = true;
        doneProcess();

        this.setState({
          products: parsedProducts,
          loadedProducts: true
        });
      }.bind(this)
    });
  }
  render() {
    if((this.state.loadedInfo && this.state.loadedProducts) || this.state.loading) {
      return (
        <div className="container" data-page="ClubEditing">
          <Helmet>
            <title>{"ID: " + this.state.id + " | Verein bearbeiten | Sport-Paul Vereinsbekleidung"}</title>
          </Helmet>
          {this.state.picturePreview && <ImageLightbox image={this.state.picturePreview.startsWith("data:image/") ? this.state.picturePreview : "clublogos/" + this.state.picturePreview} onClose={this.onClosePicturePreview} />}
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">
            Verein bearbeiten <small>ID: {this.state.id}</small>
            {(this.state.toUpdateProducts && this.state.toUpdateProducts.length > 0) || (this.state.toRemoveProducts && this.state.toRemoveProducts.length > 0) || (this.state.toAddProducts && this.state.toAddProducts.length > 0) || this.state.name !== this.oldName || this.state.logodata !== this.oldLogodata || this.state.displaymode != this.oldDisplaymode ?
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
                <div className="upload-control"><ImageUploadControl showPreview={false} value={this.state.logodata} searchPath="clublogos/" onChange={this.onLogodataChange} /></div>
                <Button bsSize="small" bsClass="mini-btn btn" onClick={this.onPicturePreviewRequest.bind(this, this.state.logodata)} disabled={this.state.logodata == null || this.state.logodata.length < 1}><Glyphicon glyph="search" /></Button>
              </div>
            </FormGroup>
            <FormGroup controlId="inputDisplayMode">
              <ControlLabel bsClass="col-sm-1 control-label">Anzeigemodus</ControlLabel>
              <div className="col-sm-11">
                {Object.keys(Statics.ClubDisplayMode).map((key, i) =>
                <Radio key={i} name="groupDisplayMode" checked={this.state.displaymode == key} onChange={this.onChangeDisplayMode.bind(this, key)}>{Statics.ClubDisplayMode[key]}</Radio>)}
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
                      ? Object.keys(this.state.products).map((key, i) =>
                          <tr key={i} data-id={key} data-name={this.state.products[key].name}>
                            <td>{this.state.products[key].new?'':key}</td>
                            <td className="product-name">{this.state.products[key].name}</td>
                            <td className="internalid">
                              {this.state.products[key].internalid}
                              {(this.state.products[key].colours && (this.colours = JSON.parse(this.state.products[key].colours)) && this.colours.length > 0)
                              ? [<br />, this.colours.length > 1 ? this.colours.length + " Farben" : this.colours[0].id + " " + this.colours[0].name]
                              : ''}
                            </td>
                            <td className="pricegroups">
                              {JSON.parse(this.state.products[key].pricegroups).map((group, i) =>
                                <div key={i}>
                                  <p className="sizes">{group.sizes.join(", ")}:</p>
                                  <p className="price">{group.price.toFixed(2).replace('.', ',')} €</p>
                                </div>
                              )}
                            </td>
                            <td>
                              {this.state.products[key].defaultFlocking ? <p>mit Standardbeflockung,</p> : ''}
                              <p>
                              {this.state.products[key].flockingPrice !== null && parseFloat(this.state.products[key].flockingPrice) >= 0
                                    ? (parseFloat(this.state.products[key].flockingPrice) > 0
                                      ? 'Zusatz Aufpreis: ' + parseFloat(this.state.products[key].flockingPrice).toFixed(2).replace('.', ',') + ' €'
                                      : 'Zusatz kostenlos')
                                    : 'kein Zusatz'}
                              </p>
                            </td>
                            <td className="buttons">
                              <Button bsSize="small" onClick={this.openProductEditModal.bind(this, key)}><Glyphicon glyph="pencil" /> Bearbeiten</Button>
                              <Button bsSize="small" bsStyle="danger" onClick={this.openProductRemoveModal.bind(this, key)}><Glyphicon glyph="trash" /> Löschen</Button>
                            </td>
                          </tr>
                    ) : <tr className="no-data"><td colSpan="6">Keine Produkte vorhanden</td></tr>}
                  </tbody>
                </Table>
                <Button bsSize="small" bsStyle="success" onClick={this.openProductAddModal}><Glyphicon glyph="plus" /> Hinzufügen...</Button>
              </div>
            </FormGroup>
          </form>

          <ProductEditModal show={this.state.showProductEditModal} scope={this.state.scopeProductEditModal} onClose={this.onCloseProductEditModal} onPicturePreviewRequest={this.onPicturePreviewRequest} />
          <ProductRemovalModal show={this.state.showProductRemoveModal} scope={this.state.scopeProductRemoveModal} onClose={this.onCloseProductRemoveModal} />
          <ProductAddModal show={this.state.showProductAddModal} onClose={this.onCloseProductAddModal} />
        </div>
      );
    } else {
      return (
        <div className="container" data-page="ClubEditing">
          <Helmet>
            <title>{"ID: " + this.state.id + " | Verein bearbeiten | Sport-Paul Vereinsbekleidung"}</title>
          </Helmet>
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
