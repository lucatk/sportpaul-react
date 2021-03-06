import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import ProductCartTable from './ProductCartTable';

class ProductCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product-cart">
        <Helmet>
          <title>Warenkorb | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        <h1 className="page-header">Ihr Warenkorb <small>/ Persönliche Details / Bestellung abschließen</small></h1>
        <div className="cart-contents">
          <ProductCartTable data={this.props.contents} onRemove={this.props.onProductRemoveFromCart} onPreview={this.props.onProductPreviewRequest} />
        </div>
        <Button className="checkout-button" bsStyle="primary" onClick={this.props.onContinue} disabled={this.props.contents.length < 1}>Weiter <Glyphicon glyph="menu-right" /></Button>
      </div>
    );
  }
}

export default ProductCart;
