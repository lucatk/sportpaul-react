import React, { Component } from 'react';

import CheckoutCart from './CheckoutCart';
import CheckoutCustomerInfo from './CheckoutCustomerInfo';
import './Checkout.css';

class Checkout extends Component {
  render() {
    return (
      <div className="Checkout">
        <div className="container">
          <h1>Bestellung abschließen</h1>
          <CheckoutCart />
          <CheckoutCustomerInfo />
        </div>
      </div>
    );
  }
}

export default Checkout;
