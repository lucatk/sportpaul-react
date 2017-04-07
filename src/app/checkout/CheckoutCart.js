import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import CheckoutItem from './CheckoutItem.js';

class CheckoutCart extends Component {
  constructor(props) {
    super(props);
    if(localStorage && localStorage.getItem('lastUpdate') && Date.now() - localStorage.getItem('lastUpdate') < 86400000 && localStorage.cart && localStorage.cart.length > 0) {
      var cart = JSON.parse(localStorage.getItem('cart'));
      var cartValues = [];
      cart.forEach(function(e, i) {
        cartValues[i] = e.price;
      });

      this.state = {
        club: localStorage.getItem('selectedClub'),
        cartContents: cart,
        cartValues: cartValues
      };
    } else {
      hashHistory.push('/');
      return;
    }

    this.onProductStateChange = this.onProductStateChange.bind(this);
  }
  render() {
    return (
      <div className="cart">
        <p>Ihre Bestellübersicht:</p>
        {this.state.cartContents && this.state.cartContents.length > 0
          ? this.state.cartContents.map((product, index) =>
              <CheckoutItem
                key={index}
                reactKey={index}
                id={product.id}
                name={product.name}
                size={product.size}
                price={product.price}
                flockingPrice={product.flockingPrice}
                onStateChange={this.onProductStateChange} />
            )
          : null}
          <p className="checkout-total">Gesamt: {this.state.cartValues.reduce((a, b) => a + b, 0).toFixed(2)} €</p>
      </div>
    );
  }
  onProductStateChange(key, price) {
    var cv = this.state.cartValues;
    cv[key] = price;
    this.setState({cartValues:cv});
  }
}

export default CheckoutCart;
