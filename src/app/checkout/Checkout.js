import React, { Component } from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import CheckoutCart from './CheckoutCart';
import CheckoutCustomerInfo from './CheckoutCustomerInfo';
import './Checkout.css';

class Checkout extends Component {
  render() {
    return (
      <div className="Checkout">
        <Link className="back-link" to="/"><FontAwesome name="angle-left" /> Zurück zum Shop</Link>
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
