import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon
} from 'react-bootstrap';

import ProductCartTable from './ProductCartTable';

class ProductCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product-cart">
        <h1 className="page-header">Ihr Warenkorb <small>/ Persönliche Details / Bestellung abschließen</small></h1>
        <div className="cart-contents">
          <ProductCartTable data={this.props.contents} onRemove={this.props.onProductRemoveFromCart} onPreview={this.props.onProductPreviewRequest} />
        </div>
        <Button className="checkout-button" bsStyle="primary" onClick={this.props.onContinue}>Weiter <Glyphicon glyph="menu-right" /></Button>
      </div>
    );
  }
}

export default ProductCart;
