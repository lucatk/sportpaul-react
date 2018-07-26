import React, { Component } from 'react';
import $ from 'jquery';
import {
  Modal,
  Button,
  FormGroup, FormControl, ControlLabel,
  Alert
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import LoadingOverlay from '../utils/LoadingOverlay';
import ImageLightbox from '../utils/ImageLightbox';
import ClubList from './ClubList.js';
import ClubShowcase from './ClubShowcase.js';
import ClubProducts from './ClubProducts.js';
import ProductCart from './ProductCart.js';
import OrderProcess from './OrderProcess';
import OrderSummary from './OrderSummary';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    var cartContents = [];
    var clubInUse = -1;
    if(localStorage && localStorage.getItem('lastUpdate') && Date.now() - localStorage.getItem('lastUpdate') < 86400000 && localStorage.cart && localStorage.cart.length > 0) {
      cartContents = JSON.parse(localStorage.getItem('cart'));
      clubInUse = localStorage.getItem('clubInUse');
    }
    this.state = {
      clubs: [],
      selectedClub: -1,
      clubInUse: clubInUse,
      cartContents: cartContents,
      previewProductPicture: null,
      loadedClubs: false,
      loading: true,
      flockingModal: {
        target: -1,
        inputs: []
      },
      customerData: null,
      loggedIn: false,
      recaptchaSiteKey: ''
    };

    this.checkAuth();
    $.post({
      url: 'php/settings/load.php',
      data: {
        name: "general_recaptcha_site"
      },
      success: function(data) {
        this.setState({recaptchaSiteKey: JSON.parse(data)["general_recaptcha_site"]});
      }.bind(this)
    });

    this.onClubChange = this.onClubChange.bind(this);
    this.onProductAddToCart = this.onProductAddToCart.bind(this);
    this.onProductRemoveFromCart = this.onProductRemoveFromCart.bind(this);
    this.onProductPreviewRequest = this.onProductPreviewRequest.bind(this);
    this.onCloseProductPreview = this.onCloseProductPreview.bind(this);
    this.onFlockingModalInputChange = this.onFlockingModalInputChange.bind(this);
    this.onShowOrderProcess = this.onShowOrderProcess.bind(this);
    this.onShowOrderSummary = this.onShowOrderSummary.bind(this);
    this.onOrder = this.onOrder.bind(this);
  }

  loadClubs() {
    this.setState({loading: true});
    $.get({
      url: 'php/clubs/load_all.php',
      data: {
        load_products: true
      },
      success: function(data) {
        var clubs = JSON.parse(data);
        var parsedClubs = [];
        clubs.forEach((club) => {
          var parsedClub = club;
          var parsedProducts = [];
          club.products.forEach((product) => {
            var parsedProduct = product;
            parsedProduct.colours = JSON.parse(product.colours);
            parsedProduct.pricegroups = JSON.parse(product.pricegroups);
            parsedProduct.flockings = JSON.parse(product.flockings);
            parsedProducts.push(parsedProduct);
          });
          parsedClub.products = parsedProducts;
          parsedClubs.push(parsedClub);
        });

        this.setState({
          clubs: parsedClubs,
          loadedClubs: true,
          loading: false
        });
      }.bind(this)
    });
  }

  checkAuth() {
    $.ajax({
      url: "php/auth/check.php",
      xhrFields: { withCredentials: true },
      success: function(data) {
        var result = JSON.parse(data);
        this.setState({loggedIn:result.loggedIn});
        this.loadClubs();
      }.bind(this)
    });
  }

  onClubChange(newClub) {
    if(newClub == -99) {
      this.props.router.push("/admin");
    } else {
      this.setState({selectedClub: newClub});
    }
  }

  onProductAddToCart(product, input) {
    if(this.state.clubInUse != -1 && this.state.clubInUse != this.state.selectedClub) {
      return;
    }

    var newContents = this.state.cartContents.slice();
    var cartProduct = {
      id: product.id,
      name: product.name,
      internalid: product.internalid,
      flockings: product.flockings,
      includedFlockingInfo: product.includedFlockingInfo,
      size: input.selectedSize,
      pricegroups: product.pricegroups,
      picture: product.picture,
      colour: product.colours[input.selectedColour]
    };
    newContents[this.state.cartContents.length] = cartProduct;
    this.setState({cartContents: newContents, clubInUse: this.state.selectedClub});
    if(product.flockings != null && product.flockings.length > 0) {
      this.setState({
        flockingModal: {
          target: newContents.length-1,
          inputs: product.flockings.map((flocking) => flocking.type=="0"?'':flocking.price <= 0)
        }
      });
    }
  }

  onProductRemoveFromCart(key) {
    var newContents = this.state.cartContents.slice();
    newContents.splice(key, 1);
    this.setState({cartContents: newContents});

    if(newContents.length < 1) {
      this.setState({clubInUse: -1});
    }
  }

  onProductPreviewRequest(product) {
    this.setState({previewProductPicture: product});
  }

  onCloseProductPreview() {
    this.setState({previewProductPicture: null});
  }

  onFlockingModalInputChange(i, ev) {
    var flockingModal = this.state.flockingModal;
    switch(this.state.cartContents[this.state.flockingModal.target].flockings[i].type) {
      case "0":
        flockingModal.inputs[i] = ev.target.value;
        break;
      case "1":
        flockingModal.inputs[i] = ev.target.checked;
        break;
    }
    this.setState({flockingModal:flockingModal});
  }

  onShowOrderProcess() {
    this.setState({selectedClub: -3});
  }

  onShowOrderSummary(customerData) {
    this.setState({
      selectedClub: -4,
      customerData: customerData
    });
  }

  onFlockingModalClose(success) {
    var newContents = this.state.cartContents.slice();
    if(success) {
      var flockings = [];
      this.state.cartContents[this.state.flockingModal.target].flockings.forEach((flocking, i) => {
        var input = this.state.flockingModal.inputs[i];
        if(typeof(input) === 'string' || input instanceof String) {
          if(input.length > 0) {
            flocking.value = input;
            flockings.push(flocking);
          }
        } else {
          if(input) {
            flockings.push(flocking);
          }
        }
      });
      newContents[this.state.flockingModal.target].flockings = flockings;
    } else {
      newContents.splice(this.state.flockingModal.target);
    }
    this.setState({cartContents:newContents,flockingModal:{target:-1,inputs:[]}});
  }

  onOrder(success) {
    if(success) {
      this.setState({
        clubInUse: -1,
        cartContents: [],
        customerData: null
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props != nextProps) {
      this.checkAuth();
    }

    if(!localStorage || !nextState) return;
    if(nextState.cartContents && nextState.cartContents.length > 0) {
      localStorage.setItem('clubInUse', nextState.clubInUse);
      localStorage.setItem('cart', JSON.stringify(nextState.cartContents));
      localStorage.setItem('lastUpdate', Date.now());
    } else if(nextState.clubInUse !== localStorage.getItem('clubInUse')) {
      localStorage.setItem('clubInUse', nextState.clubInUse);
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('lastUpdate', Date.now());
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.loggedIn) {
      this.loadClubs();
    }
  }

  render() {
    this.cartTotal = 0;
    this.state.cartContents.forEach((el) => this.cartTotal += el.price);
    return (
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Home | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        <LoadingOverlay show={this.state.loading} />
        {this.state.previewProductPicture && <ImageLightbox image={"productpics/" + this.state.previewProductPicture} onClose={this.onCloseProductPreview} />}
        {this.state.flockingModal.target !== -1 &&
        <Modal show={this.state.flockingModal.target !== -1} onHide={this.onFlockingModalClose.bind(this, false)}>
          <Modal.Header closeButton>
            <Modal.Title>Beflockung hinzufügen...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.cartContents[this.state.flockingModal.target].flockings.map((flocking, i) => <FormGroup key={i} controlId={"flocking-"+i}>
              {flocking.type == "0" ? [
                <ControlLabel className="no-fontweight">Beflockung "{flocking.description}" hinzufügen ({flocking.price>0?'Aufpreis: ' + flocking.price.toFixed(2).replace('.', ',') + ' €':'kostenlos'}):</ControlLabel>,
                <FormControl type="text" value={this.state.flockingModal.inputs[i]} onChange={this.onFlockingModalInputChange.bind(this, i)} placeholder="Leer lassen falls keine Beflockung erwünscht" />
              ] : [
                <label className="no-fontweight">
                  <input type="checkbox" value="" checked={this.state.flockingModal.inputs[i]} onChange={this.onFlockingModalInputChange.bind(this, i)} /> Beflockung "{flocking.description}" hinzufügen ({flocking.price>0?'Aufpreis: ' + flocking.price.toFixed(2).replace('.', ',') + ' €':'kostenlos'})
                </label>
              ]}
            </FormGroup>)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onFlockingModalClose.bind(this, false)}>Abbrechen</Button>
            <Button bsStyle="primary" onClick={this.onFlockingModalClose.bind(this, true)}>Bestätigen</Button>
          </Modal.Footer>
        </Modal>}

        {this.state.loadedClubs &&
          <div>
            <div className="club-list-container col-xs-12 col-sm-3 col-md-2 col-xxl-3">
              <ClubList clubs={this.state.clubs} selectedClub={this.state.selectedClub} showCart={this.state.cartContents.length > 0} cartContent={this.state.cartContents.length} loggedIn={this.state.loggedIn} onChange={this.onClubChange} />
            </div>
            <div className="col-xs-12 col-sm-9 col-md-10 col-xxl-9">
              {(this.state.selectedClub >= 0 && (this.state.loggedIn || this.getClubWithId(this.state.selectedClub).displaymode >= 2) && this.state.clubInUse != -1 && this.state.clubInUse != this.state.selectedClub) && (
                <Alert bsStyle="warning">
                  Hinweis: Ihr Warenkorb enthält bereits Produkte eines anderen Vereins. Sie können daher keine Produkte dieses Vereins in den Warenkorb legen.
                </Alert>
              )}
              {this.state.selectedClub >= 0 ? (
                <ClubProducts clubName={this.getClubWithId(this.state.selectedClub).name} productList={this.getClubWithId(this.state.selectedClub).products || []} orderable={(this.state.loggedIn || this.getClubWithId(this.state.selectedClub).displaymode >= 2) && (this.state.clubInUse == -1 || this.state.clubInUse == this.state.selectedClub)} onProductAddToCart={this.onProductAddToCart} onProductPreviewRequest={this.onProductPreviewRequest} />
              ) : this.state.selectedClub === -2 ? (
                <ProductCart contents={this.state.cartContents} onProductRemoveFromCart={this.onProductRemoveFromCart} onProductPreviewRequest={this.onProductPreviewRequest} onContinue={this.onShowOrderProcess} />
              ) : this.state.selectedClub === -3 ? (
                <OrderProcess productCart={this.state.cartContents} onContinue={this.onShowOrderSummary} />
              ) : this.state.selectedClub === -4 ? (
                <OrderSummary productCart={this.state.cartContents} customerData={this.state.customerData} clubid={this.state.clubInUse} onOrder={this.onOrder} recaptchaKey={this.state.recaptchaSiteKey} loggedIn={this.state.loggedIn} />
              ) : (
                <ClubShowcase clubList={this.state.clubs} onChange={this.onClubChange} />
              )}
            </div>
          </div>
        }
        {(!this.state.loadedClubs && !this.state.loading) && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}
      </div>
    );
    // <ProductCart contents={this.state.cartContents} total={this.cartTotal} onRemove={this.onProductRemoveFromCart} />
  }

  getClubWithId(id) {
    var found = [];
    this.state.clubs.forEach((club) => {
      if(club.id == id) {
        found = club;
      }
    });
    return found;
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

export default App;
