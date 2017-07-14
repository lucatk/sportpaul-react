import React, { Component } from 'react';
import $ from 'jquery';
import {
  Modal,
  Button,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import LoadingOverlay from '../utils/LoadingOverlay';
import ImageLightbox from '../utils/ImageLightbox';
import ClubList from './ClubList.js';
import ClubProducts from './ClubProducts.js';
import ProductCart from './ProductCart.js';
import OrderProcess from './OrderProcess';
import OrderSummary from './OrderSummary';

import '../utils/NavLink.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    document.title = "Home | Sport-Paul Vereinsbekleidung";

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
      previewProduct: null,
      loadedClubs: false,
      loading: true,
      flockingModal: {
        target: -1,
        input: ''
      },
      customerData: null
    };

    this.loadClubs();

    this.onClubChange = this.onClubChange.bind(this);
    this.onProductAddToCart = this.onProductAddToCart.bind(this);
    this.onProductRemoveFromCart = this.onProductRemoveFromCart.bind(this);
    this.onProductPreviewRequest = this.onProductPreviewRequest.bind(this);
    this.onCloseProductPreview = this.onCloseProductPreview.bind(this);
    this.onFlockingModalInput = this.onFlockingModalInput.bind(this);
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
            parsedProduct.flockingPrice = parseFloat(product.flockingPrice);
            parsedProduct.defaultFlocking = parsedProduct.defaultFlocking == 1;
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

  onClubChange(newClub) {
    this.setState({selectedClub: newClub});
  }

  onProductAddToCart(product, input) {
    if(this.state.clubInUse != -1 && this.state.clubInUse != this.state.selectedClub) {
      // TODO
      return;
    }

    var newContents = this.state.cartContents.slice();
    var cartProduct = {
      id: product.id,
      name: product.name,
      internalid: product.internalid,
      flocking: '',
      flockingPrice: product.flockingPrice,
      defaultFlocking: product.defaultFlocking,
      size: input.selectedSize,
      pricegroups: product.pricegroups,
      picture: product.picture,
      colour: product.colours[input.selectedColour]
    };
    newContents[this.state.cartContents.length] = cartProduct;
    this.setState({cartContents: newContents, clubInUse: this.state.selectedClub});
    if(product.flockingPrice && product.flockingPrice >= 0) {
      this.setState({
        flockingModal: {
          target: newContents.length-1,
          input: ''
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
    this.setState({previewProduct: product});
  }

  onCloseProductPreview() {
    this.setState({previewProduct: null});
  }

  onFlockingModalInput(ev) {
    this.setState({flockingModal:{target:this.state.flockingModal.target,input:ev.target.value}});
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
    if(success) {
      var newContents = this.state.cartContents.slice();
      newContents[this.state.flockingModal.target].flocking = this.state.flockingModal.input;
      this.setState({cartContents:newContents});
    }
    this.setState({flockingModal:{target:-1,input:''}});
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
    this.loadClubs();
  }

  render() {
    if(this.state.selectedClub >= 0) {
      document.title = this.getClubWithId(this.state.selectedClub).name + " | Sport-Paul Vereinsbekleidung";
    } else if(this.state.selectedClub === -2) {
      document.title = "Warenkorb | Sport-Paul Vereinsbekleidung";
    } else if(this.state.selectedClub === -3) {
      document.title = "Persönliche Details | Sport-Paul Vereinsbekleidung";
    } else if(this.state.selectedClub === -4) {
      document.title = "Bestellung abschließen | Sport-Paul Vereinsbekleidung";
    } else {
      document.title = "Home | Sport-Paul Vereinsbekleidung";
    }

    this.cartTotal = 0;
    this.state.cartContents.forEach((el) => this.cartTotal += el.price);
    return (
      <div className="App">
        <LoadingOverlay show={this.state.loading} />
        {this.state.previewProduct && <ImageLightbox image={"productpics/" + this.state.previewProduct.picture} onClose={this.onCloseProductPreview} />}
        {this.state.flockingModal.target !== -1 &&
        <Modal show={this.state.flockingModal.target !== -1} onHide={this.onFlockingModalClose.bind(this, false)}>
          <Modal.Header closeButton>
            <Modal.Title>Beflockung hinzufügen...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="flocking">
              <ControlLabel>Hier können Sie dem Artikel eine Namens-Beflockung geben{this.state.cartContents[this.state.flockingModal.target].flockingPrice>0?' (Aufpreis: ' + this.state.cartContents[this.state.flockingModal.target].flockingPrice.toFixed(2).replace('.', ',') + ' €)':''}:</ControlLabel>
              <FormControl type="text" value={this.state.flockingModal.input} onChange={this.onFlockingModalInput} placeholder="Beflockungs-Text..." />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onFlockingModalClose.bind(this, false)}>Ohne Beflockung</Button>
            <Button bsStyle="primary" onClick={this.onFlockingModalClose.bind(this, true)} disabled={!this.state.flockingModal.input.length}>Bestätigen</Button>
          </Modal.Footer>
        </Modal>}

        {this.state.loadedClubs &&
          <div>
            <div className="col-xs-12 col-sm-3 col-md-2 col-xxl-3">
              <ClubList clubs={this.state.clubs} selectedClub={this.state.selectedClub} showCart={this.state.cartContents.length > 0} cartContent={this.state.cartContents.length} onChange={this.onClubChange} />
            </div>
            <div className="col-xs-12 col-sm-9 col-md-10 col-xxl-9">
              {this.state.selectedClub >= 0 ? (
                <ClubProducts productList={this.getClubWithId(this.state.selectedClub).products || []} onProductAddToCart={this.onProductAddToCart} onProductPreviewRequest={this.onProductPreviewRequest} />
              ) : this.state.selectedClub === -2 ? (
                <ProductCart contents={this.state.cartContents} onProductRemoveFromCart={this.onProductRemoveFromCart} onProductPreviewRequest={this.onProductPreviewRequest} onContinue={this.onShowOrderProcess} />
              ) : this.state.selectedClub === -3 ? (
                <OrderProcess productCart={this.state.cartContents} onContinue={this.onShowOrderSummary} />
              ) : this.state.selectedClub === -4 ? (
                <OrderSummary productCart={this.state.cartContents} customerData={this.state.customerData} clubid={this.state.clubInUse} onOrder={this.onOrder} />
              ) : (
                <p>Home</p>
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
