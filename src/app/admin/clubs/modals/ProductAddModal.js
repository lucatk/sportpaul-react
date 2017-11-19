import React, { Component } from 'react';

import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import FormPriceInput from '../../../utils/FormPriceInput';
import ImageLightbox from '../../../utils/ImageLightbox';
import PopupModal from '../../../utils/PopupModal';
import ProductColoursControl from '../ProductColoursControl';
import ProductPricegroupsControl from '../ProductPricegroupsControl';
import ProductFlockingsControl from '../ProductFlockingsControl';
import ImageUploadControl from '../ImageUploadControl';

import UhlsportImageLoader from '../../../utils/UhlsportImageLoader';
import UhlsportLightbox from '../../../utils/UhlsportLightbox';

class ProductAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockings: [],
      includedFlockingInfo: '',
      picture: null,
      picturePreview: null,
      uhlsportImageIds: [],
      uhlsportImagesLoadedCount: 0,
      uhlsportLoading: false
    };

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({picturePreview: e.target.result});
    }).bind(this);

    this.uhlsportLoader = new UhlsportImageLoader();

    this.onNameChange = this.onNameChange.bind(this);
    this.onInternalIDChange = this.onInternalIDChange.bind(this);
    this.onColoursChange = this.onColoursChange.bind(this);
    this.onPricegroupsChange = this.onPricegroupsChange.bind(this);
    this.onFlockingsChange = this.onFlockingsChange.bind(this);
    this.onIncludedFlockingInfoChange = this.onIncludedFlockingInfoChange.bind(this);
    this.onPictureChange = this.onPictureChange.bind(this);
    this.onPicturePreviewRequest = this.onPicturePreviewRequest.bind(this);
    this.onClosePicturePreview = this.onClosePicturePreview.bind(this);
    this.onLoadedUhlsportLightbox = this.onLoadedUhlsportLightbox.bind(this);
    this.onLoadFromUhlsportClick = this.onLoadFromUhlsportClick.bind(this);
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
  onFlockingsChange(newFlockings) {
    this.setState({flockings:newFlockings});
  }
  onIncludedFlockingInfoChange(event) {
    this.setState({includedFlockingInfo:event.target.value});
  }
  onPictureChange(newPicture) {
    this.setState({picture:newPicture});
  }
  onPicturePreviewRequest(picture) {
    if(picture && typeof picture === "object") {
      this.fileReader.readAsDataURL(picture);
    } else if(picture == "uhlsport") {
      picture = "php/uhlsport/loadimage.php?id=" + this.state.internalid.replace(/[^A-Za-z0-9]/g, "");
    }
    this.setState({picturePreview: picture});
  }
  onClosePicturePreview() {
    this.setState({picturePreview: null});
  }
  onLoadFromUhlsportClick() {
    this.setState({uhlsportLoading: true});
    var toLoad = 0;
    var ids = [];
    var checksDone = function() {
      this.setState({uhlsportImageIds: ids, uhlsportImagesLoadedCount: 0});
      if(ids.length < 1) {
        this.setState({uhlsportLoading: false});
        this.popupModal.showModal("Keine Uhlsport-Bilder gefunden", "Es konnten keine Uhlsport-Bilder für diese(s) Produkt/Farbe(n) gefunden werden.", null, "Okay");
      }
    }.bind(this);
    var check = (success, id) => {
      toLoad--;
      if(success) {
        ids.push(id);
      }
      if(toLoad < 1)
        checksDone();
    };
    if(this.state.colours && this.state.colours.length > 0) {
      toLoad = this.state.colours.length;
      this.state.colours.forEach(((el) => {
        this.uhlsportLoader.checkImage(this.state.internalid + el.id, check);
      }).bind(this));
    } else {
      toLoad = 1;
      this.uhlsportLoader.checkImage(this.state.internalid, check);
    }
  }
  onLoadedUhlsportLightbox() {
    var newCount = this.state.uhlsportImagesLoadedCount+1;
    this.setState({uhlsportImagesLoadedCount: newCount});
    if(newCount >= this.state.uhlsportImageIds.length) {
      this.setState({uhlsportLoading: false});
    }
  }
  onCloseUhlsportLightbox(id, response) {
    var ids = this.state.uhlsportImageIds;
    var index = ids.indexOf(id);
    if(index !== -1) ids.splice(index);
    this.setState({uhlsportImageIds: ids});
    if(this.state.uhlsportImagesLoadedCount > 0 && this.state.uhlsportImagesLoadedCount >= ids.length) {
      this.setState({uhlsportLoading: false});
    }

    if(response) {
      var newColours = this.state.colours;
      if(newColours.length > 0) {
        this.state.colours.forEach((colour, i) => {
          if((this.state.internalid.replace(/[^A-Za-z0-9]/g, "") + colour.id) == id) {
            newColours[i].picture = "uhlsport";
          }
        });
        this.setState({colours: newColours});
      } else {
        this.setState({picture: "uhlsport"});
      }
    }
  }
  closeModal() {
    this.props.onClose();
    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockings: [],
      includedFlockingInfo: '',
      picture: null,
      picturePreview: null,
      uhlsportImageIds: [],
      uhlsportImagesLoadedCount: 0,
      uhlsportLoading: false
    };
  }
  addProduct() {
    if(!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !(this.state.picture || this.getColourPictures().length > 0))
      return;

    var coloursPictures = [];
    this.state.colours.forEach((colour, i) => {
      if(colour.picture && (colour.picture instanceof File || (colour.picture == "uhlsport"))) {
        coloursPictures[i] = colour.picture;
      }
    });
    this.props.onClose({
      name: this.state.name,
      internalid: this.state.internalid,
      colours: JSON.stringify(this.state.colours),
      pricegroups: JSON.stringify(this.state.pricegroups),
      flockings: JSON.stringify(this.state.flockings),
      includedFlockingInfo: this.state.includedFlockingInfo,
      picture: this.state.picture,
      coloursPictures: coloursPictures
    });
    this.state = {
      name: '',
      internalid: '',
      colours: [],
      pricegroups: [],
      flockings: [],
      includedFlockingInfo: '',
      picture: null,
      picturePreview: null,
      uhlsportImageIds: [],
      uhlsportImagesLoadedCount: 0,
      uhlsportLoading: false
    };
  }
  render() {
    return (
      <div>
        <PopupModal ref={(ref) => {this.popupModal = ref;}} />
        {this.state.picturePreview && <ImageLightbox image={(this.state.picturePreview.startsWith("data:image/") || this.state.picturePreview.startsWith("php/uhlsport/loadimage.php")) ? this.state.picturePreview : "productpics/" + this.state.picturePreview} onClose={this.onClosePicturePreview} />}
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
                  <ProductColoursControl productid={this.state.internalid} value={this.state.colours} onValueChange={this.onColoursChange} onPicturePreviewRequest={this.onPicturePreviewRequest} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputProductPricegroups" validationState={!this.state.pricegroups || this.state.pricegroups.length < 1 ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Preisgruppen</ControlLabel>
                <div className="col-sm-8 pricegroups-edit">
                  <ProductPricegroupsControl value={this.state.pricegroups} onValueChange={this.onPricegroupsChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputIncludedFlocking">
                <ControlLabel bsClass="col-sm-4 control-label">Beflockung Info-Text</ControlLabel>
                <div className="col-sm-8 included-flocking-edit">
                  <FormControl type="text" value={this.state.includedFlockingInfo} placeholder="Info-Text (z.B. &quot;inkl. Logo-Beflockung&quot;)" onChange={this.onIncludedFlockingInfoChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputFlocking">
                <ControlLabel bsClass="col-sm-4 control-label">Beflockungen</ControlLabel>
                <div className="col-sm-8 flocking-edit">
                  <ProductFlockingsControl value={this.state.flockings} onValueChange={this.onFlockingsChange} />
                </div>
              </FormGroup>
              <FormGroup controlId="inputPicture" validationState={(!this.state.picture && this.getColourPictures().length < 1) ? 'error' : null}>
                <ControlLabel bsClass="col-sm-4 control-label">Vorschaubild</ControlLabel>
                <div className="col-sm-8 picture-edit">
                  {this.getColourPictures().length < 1 && [
                    <div className="upload-control"><ImageUploadControl showPreview={false} value={this.state.picture} searchPath="productpics/" onChange={this.onPictureChange} /></div>,
                    <Button bsSize="small" bsClass="mini-btn btn" onClick={this.onPicturePreviewRequest.bind(this, this.state.picture)} disabled={this.state.picture == null}><Glyphicon glyph="search" /></Button>
                  ]}
                  <div className={"uhlsport-actions" + (this.getColourPictures().length > 0?" bind-left":"")}>
                    {this.state.uhlsportLoading && <FontAwesome name="spinner" pulse fixedWidth />}
                    <Button className="uhlsport-download" bsSize="small" onClick={this.onLoadFromUhlsportClick} disabled={this.state.uhlsportLoading || !this.state.internalid || this.state.internalid.length < 1}>Von Uhlsport laden</Button>
                  </div>
                </div>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Abbrechen</Button>
            <Button bsStyle="success" onClick={this.addProduct}
                    disabled={!this.state.name || this.state.name.length < 1 || !this.state.internalid || this.state.internalid.length < 1 || !this.state.pricegroups || this.state.pricegroups.length < 1 || !(this.state.picture || this.getColourPictures().length > 0)}>Hinzufügen</Button>
          </Modal.Footer>
        </Modal>
        {this.state.uhlsportImageIds && this.state.uhlsportImageIds.map((el, i) => <UhlsportLightbox key={i} id={el} show={this.state.uhlsportImagesLoadedCount >= this.state.uhlsportImageIds.length} onLoaded={this.onLoadedUhlsportLightbox} onClose={this.onCloseUhlsportLightbox.bind(this, el)}/>)}
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
