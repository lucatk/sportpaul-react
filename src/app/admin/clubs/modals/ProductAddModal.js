import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import FormPriceInput from '../../../utils/FormPriceInput';
import ImageLightbox from '../../../utils/ImageLightbox';
import ProductColoursControl from '../ProductColoursControl';
import ProductPricegroupsControl from '../ProductPricegroupsControl';
import ImageUploadControl from '../ImageUploadControl';

class ProductAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockingNameEnabled: false,
      flockingPriceName: 0,
      flockingLogoEnabled: false,
      flockingPriceLogo: 0,
      includedFlockingInfo: '',
      picture: null,
      picturePreview: null
    };

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({picturePreview: e.target.result});
    }).bind(this);

    this.onNameChange = this.onNameChange.bind(this);
    this.onInternalIDChange = this.onInternalIDChange.bind(this);
    this.onColoursChange = this.onColoursChange.bind(this);
    this.onPricegroupsChange = this.onPricegroupsChange.bind(this);
    this.onFlockingPriceNameChange = this.onFlockingPriceNameChange.bind(this);
    this.onFlockingNameEnabledChange = this.onFlockingNameEnabledChange.bind(this);
    this.onFlockingPriceLogoChange = this.onFlockingPriceLogoChange.bind(this);
    this.onFlockingLogoEnabledChange = this.onFlockingLogoEnabledChange.bind(this);
    this.onIncludedFlockingInfoChange = this.onIncludedFlockingInfoChange.bind(this);
    this.onPictureChange = this.onPictureChange.bind(this);
    this.onPicturePreviewRequest = this.onPicturePreviewRequest.bind(this);
    this.onClosePicturePreview = this.onClosePicturePreview.bind(this);
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
  onColoursChange(newColours) {
    this.setState({colours: newColours});
    setTimeout((() => { this.forceUpdate(); }).bind(this), 100);
  }
  onFlockingNameEnabledChange(event) {
    this.setState({flockingNameEnabled:event.target.checked});
  }
  onFlockingPriceNameChange(newPrice) {
    this.setState({flockingPriceName:newPrice});
  }
  onFlockingLogoEnabledChange(event) {
    this.setState({flockingLogoEnabled:event.target.checked});
  }
  onFlockingPriceLogoChange(newPrice) {
    this.setState({flockingPriceLogo:newPrice});
  }
  onIncludedFlockingInfoChange(event) {
    this.setState({includedFlockingInfo:event.target.value});
  }
  onPictureChange(newPicture) {
    this.setState({picture:newPicture});
  }
  onPicturePreviewRequest(picture) {
    if(picture && typeof picture === "object")
      this.fileReader.readAsDataURL(picture);
    this.setState({picturePreview: picture});
  }
  onClosePicturePreview() {
    this.setState({picturePreview: null});
  }
  closeModal() {
    this.props.onClose();
    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockingNameEnabled: false,
      flockingPriceName: 0,
      flockingLogoEnabled: false,
      flockingPriceLogo: 0,
      includedFlockingInfo: '',
      picture: null
    };
  }
  addProduct() {
    if(!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !(this.state.picture || this.getColourPictures().length > 0))
      return;

    var coloursPictures = [];
    this.state.colours.forEach((colour, i) => {
      if(colour.picture && colour.picture instanceof File) {
        coloursPictures[i] = colour.picture;
      }
    });
    this.props.onClose({
      name: this.state.name,
      internalid: this.state.internalid,
      colours: JSON.stringify(this.state.colours),
      pricegroups: JSON.stringify(this.state.pricegroups),
      flockingPriceName: this.state.flockingNameEnabled?this.state.flockingPriceName:null,
      flockingPriceLogo: this.state.flockingLogoEnabled?this.state.flockingPriceLogo:null,
      includedFlockingInfo: this.state.includedFlockingInfo,
      picture: this.state.picture,
      coloursPictures: coloursPictures
    });
    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockingNameEnabled: false,
      flockingPriceName: 0,
      flockingLogoEnabled: false,
      flockingPriceLogo: 0,
      includedFlockingInfo: '',
      picture: null
    };
  }
  render() {
    return (
      <div>
        {this.state.picturePreview && <ImageLightbox image={this.state.picturePreview.startsWith("data:image/") ? this.state.picturePreview : "productpics/" + this.state.picturePreview} onClose={this.onClosePicturePreview} />}
        <Modal show={this.props.show} onHide={this.closeModal}>
          {/*this.state.picturePreview && <div className="preview-backdrop"></div>*/}
          <Modal.Header closeButton>
            <Modal.Title>Neues Produkt hinzufügen...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="inputProductName" validationState={!this.state.name || this.state.name.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Name</ControlLabel>
                <div className="col-sm-8">
                  <FormControl type="text" value={this.state.name} placeholder="Produkt-Name" onChange={this.onNameChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputProductInternalID" validationState={!this.state.internalid || this.state.internalid.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Artikelnummer</ControlLabel>
                <div className="col-sm-8">
                  <FormControl type="text" value={this.state.internalid} placeholder="Interne Artikelnummer" onChange={this.onInternalIDChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputProductColours">
                <ControlLabel bsClass="col-sm-4 control-label">Farbe(n)</ControlLabel>
                <div className="col-sm-8 colours-edit">
                  <ProductColoursControl value={this.state.colours} onValueChange={this.onColoursChange} onPicturePreviewRequest={this.onPicturePreviewRequest} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputProductPricegroups" validationState={!this.state.pricegroups || this.state.pricegroups.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Preisgruppen</ControlLabel>
                <div className="col-sm-8 pricegroups-edit">
                  <ProductPricegroupsControl value={this.state.pricegroups} onValueChange={this.onPricegroupsChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputIncludedFlocking">
                <ControlLabel bsClass="col-sm-4 control-label">Inklusivbeflockung</ControlLabel>
                <div className="col-sm-8 included-flocking-edit">
                  <FormControl type="text" value={this.state.includedFlockingInfo} placeholder="Info-Text (z.B. &quot;inkl. Logo-Beflockung&quot;)" onChange={this.onIncludedFlockingInfoChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputFlocking">
                <ControlLabel bsClass="col-sm-4 control-label">Zusatzbeflockung</ControlLabel>
                <div className="col-sm-4 flocking-edit">
                  <label><input type="checkbox" value="" checked={this.state.flockingNameEnabled} onChange={this.onFlockingNameEnabledChange} /> Name</label>
                  <FormPriceInput enabled={this.state.flockingNameEnabled} value={this.state.flockingPriceName} onValueChange={this.onFlockingPriceNameChange} />
                </div>
                <div className="col-sm-4 flocking-edit">
                  <label><input type="checkbox" value="" checked={this.state.flockingLogoEnabled} onChange={this.onFlockingLogoEnabledChange} /> Logo</label>
                  <FormPriceInput enabled={this.state.flockingLogoEnabled} value={this.state.flockingPriceLogo} onValueChange={this.onFlockingPriceLogoChange} />
                </div>
              </FormGroup>
              {this.getColourPictures().length < 1 &&  <FormGroup controlId="inputPicture" validationState={!this.state.picture ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Vorschaubild</ControlLabel>
                <div className="col-sm-8 picture-edit">
                  <div className="upload-control"><ImageUploadControl showPreview={false} value={this.state.picture} searchPath="productpics/" onChange={this.onPictureChange} /></div>
                  <Button bsSize="small" bsClass="mini-btn btn" onClick={this.onPicturePreviewRequest.bind(this, this.state.picture)} disabled={this.state.picture == null}><Glyphicon glyph="search" /></Button>
                </div>
              </FormGroup>}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Abbrechen</Button>
            <Button bsStyle="success" onClick={this.addProduct}
                    disabled={!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !(this.state.picture || this.getColourPictures().length > 0)}>Hinzufügen</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  getColourPictures() {
    var pics = [];
    this.state.colours.forEach(function(colour) {
      if(colour.picture) {
        pics.push(colour.picture);
      }
    });
    return pics;
  }
}

export default ProductAddModal;
