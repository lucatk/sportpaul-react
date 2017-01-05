import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import TeamSamples from '../teams.js';
import CheckoutItem from './CheckoutItem.js';

class CheckoutCart extends Component {
  constructor(props) {
    super(props);
    if(localStorage && localStorage.getItem('lastUpdate') && Date.now() - localStorage.getItem('lastUpdate') < 86400000 && localStorage.cart && localStorage.cart.length > 0) {
      this.state = {
        team: localStorage.getItem('selectedTeam'),
        cartContents: JSON.parse(localStorage.getItem('cart')),
        totalPrice: 0
      };
    } else {
      hashHistory.push('/');
    }
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
                flockingPrice={product.flockingPrice} />
            )
          : null}
          <p className="checkout-total">Gesamt: {this.state.totalPrice.toFixed(2)} €</p>
      </div>
    );
  }
}

export default CheckoutCart;
