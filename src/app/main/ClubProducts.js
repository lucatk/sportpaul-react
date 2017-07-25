import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import ClubProductItem from './ClubProductItem.js';

class ClubProducts extends Component {
  render() {
    return (
      <div className="product-list">
        <Helmet>
          <title>{this.props.clubName} | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        {this.props.productList && this.props.productList.length > 0
          ? this.props.productList.map((product) =>
              <ClubProductItem
                key={product.id}
                product={product}
                onAdd={this.props.onProductAddToCart}
                onPreview={this.props.onProductPreviewRequest} />
            )
          : <p>Keine Produkte verfügbar</p>}
      </div>
    );
  }
}

export default ClubProducts;
