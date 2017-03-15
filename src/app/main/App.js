import React, { Component } from 'react';
import $ from 'jquery';

import LoadingOverlay from '../utils/LoadingOverlay';
import ImageLightbox from '../utils/ImageLightbox';
import ClubList from './ClubList.js';
import ClubProducts from './ClubProducts.js';
import ProductCart from './ProductCart.js';

import '../utils/NavLink.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    document.title = "Home | Sport-Paul Vereinsbekleidung";

    var cartContents = [];
    if(localStorage && localStorage.getItem('lastUpdate') && Date.now() - localStorage.getItem('lastUpdate') < 86400000 && localStorage.cart && localStorage.cart.length > 0) {
      cartContents = JSON.parse(localStorage.getItem('cart'));
    }
    this.state = {
      clubs: [],
      selectedClub: -1,
      cartContents: cartContents,
      previewProduct: null,
      loadedClubs: false,
      loading: true
    };

    this.loadClubs();

    this.onClubChange = this.onClubChange.bind(this);
    this.onProductAddToCart = this.onProductAddToCart.bind(this);
    this.onProductRemoveFromCart = this.onProductRemoveFromCart.bind(this);
    this.onProductPreviewRequest = this.onProductPreviewRequest.bind(this);
    this.onCloseProductPreview = this.onCloseProductPreview.bind(this);
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
            parsedProduct.pricegroups = JSON.parse(product.pricegroups);
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
    var newContents = this.state.cartContents.slice();
    var cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      flockingPrice: product.flockingPrice,
      size: input.selectedSize,
      // flocking: input.flocking
    };
    newContents[this.state.cartContents.length] = cartProduct;
    this.setState({cartContents: newContents});
  }

  onProductRemoveFromCart(key) {
    var newContents = this.state.cartContents.slice();
    newContents.splice(key, 1);
    this.setState({cartContents: newContents});
  }

  onProductPreviewRequest(product) {
    this.setState({previewProduct: product});
  }

  onCloseProductPreview() {
    this.setState({previewProduct: null});
  }

  componentWillUpdate(nextProps, nextState) {
    if(!localStorage || !nextState) return;
    if(nextState.cartContents && nextState.cartContents.length > 0) {
      localStorage.setItem('selectedClub', nextState.selectedClub);
      localStorage.setItem('cart', JSON.stringify(nextState.cartContents));
      localStorage.setItem('lastUpdate', Date.now());
    } else if(nextState.selectedClub !== localStorage.getItem('selectedClub')) {
      localStorage.setItem('selectedClub', nextState.selectedClub);
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
    } else {
      document.title = "Home | Sport-Paul Vereinsbekleidung";
    }

    this.cartTotal = 0;
    this.state.cartContents.forEach((el) => this.cartTotal += el.price);
    return (
      <div className="App">
        <LoadingOverlay show={this.state.loading} />
        {this.state.previewProduct && <ImageLightbox image={"productpics/" + this.state.previewProduct.picture} onClose={this.onCloseProductPreview} />}

        {this.state.loadedClubs &&
          <div>
            <div className="col-xs-12 col-sm-3 col-md-2 col-xxl-3">
              <ClubList clubs={this.state.clubs} selectedClub={this.state.selectedClub} showCart={this.state.cartContents.length > 0} onChange={this.onClubChange} />
            </div>
            <div className="col-xs-12 col-sm-9 col-md-10 col-xxl-9">
              {this.state.selectedClub >= 0 ? (
                <ClubProducts productList={this.getClubWithId(this.state.selectedClub).products || []} onProductAddToCart={this.onProductAddToCart} onProductPreviewRequest={this.onProductPreviewRequest} />
              ) : this.state.selectedClub === -2 ? (
                <p>Warenkorb</p>
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
