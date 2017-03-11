import React, { Component } from 'react';
import $ from 'jquery';

import LoadingOverlay from '../utils/LoadingOverlay';
import TeamList from './TeamList.js';
import TeamProducts from './TeamProducts.js';
import ProductCart from './ProductCart.js';

import TeamSamples from '../utils/teams.js';
import '../utils/NavLink.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    var cartContents = [];
    if(localStorage && localStorage.getItem('lastUpdate') && Date.now() - localStorage.getItem('lastUpdate') < 86400000 && localStorage.cart && localStorage.cart.length > 0) {
      cartContents = JSON.parse(localStorage.getItem('cart'));
    }
    this.state = {
      teams: [],
      selectedTeam: -1,
      cartContents: cartContents,
      loadedClubs: false,
      loading: true,
    };

    this.loadClubs();

    this.onTeamChange = this.onTeamChange.bind(this);
    this.onProductAddToCart = this.onProductAddToCart.bind(this);
    this.onProductRemoveFromCart = this.onProductRemoveFromCart.bind(this);
  }

  loadClubs() {
    this.setState({loading: true});
    $.get({
      url: 'php/clubs/load_all.php',
      data: {
        load_products: true
      },
      success: function(data) {
        var teams = JSON.parse(data);
        var parsedTeams = [];
        teams.forEach((team) => {
          var parsedTeam = team;
          var parsedProducts = [];
          team.products.forEach((product) => {
            var parsedProduct = product;
            parsedProduct.pricegroups = JSON.parse(product.pricegroups);
            parsedProducts.push(parsedProduct);
          });
          parsedTeam.products = parsedProducts;
          parsedTeams.push(parsedTeam);
        });

        this.setState({
          teams: parsedTeams,
          loadedClubs: true,
          loading: false
        });
      }.bind(this)
    });
  }

  onTeamChange(newTeam) {
    this.setState({selectedTeam: newTeam});
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

  componentWillUpdate(nextProps, nextState) {
    if(!localStorage || !nextState) return;
    if(nextState.cartContents && nextState.cartContents.length > 0) {
      localStorage.setItem('selectedTeam', nextState.selectedTeam);
      localStorage.setItem('cart', JSON.stringify(nextState.cartContents));
      localStorage.setItem('lastUpdate', Date.now());
    } else if(nextState.selectedTeam !== localStorage.getItem('selectedTeam')) {
      localStorage.setItem('selectedTeam', nextState.selectedTeam);
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('lastUpdate', Date.now());
    }
  }

  componentWillReceiveProps(nextProps) {
    this.loadClubs();
  }

  render() {
    this.cartTotal = 0;
    this.state.cartContents.forEach((el) => this.cartTotal += el.price);
    return (
      <div className="App">
        <LoadingOverlay show={this.state.loading} />

        {this.state.loadedClubs &&
          <div>
            <div className="col-xs-12 col-sm-3 col-md-2 col-xl-3">
              <TeamList teams={this.state.teams} selectedTeam={this.state.selectedTeam} onChange={this.onTeamChange} />
            </div>
            <div className="col-xs-12 col-sm-9 col-md-10 col-xl-9">
              <TeamProducts productList={this.getTeamWithId(this.state.selectedTeam).products || []} onProductAddToCart={this.onProductAddToCart} />
            </div>
          </div>
        }
        {(!this.state.loadedClubs && !this.state.loading) && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}
      </div>
    );
    // <ProductCart contents={this.state.cartContents} total={this.cartTotal} onRemove={this.onProductRemoveFromCart} />
  }

  getTeamWithId(id) {
    var found = [];
    this.state.teams.forEach((team) => {
      if(team.id == id) {
        found = team;
      }
    });
    console.log(found);
    return found;
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

export default App;
