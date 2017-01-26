import React, { Component } from 'react';
import TeamProductItem from './TeamProductItem.js';

class TeamProducts extends Component {
  render() {
    return (
      <div className="product-list">
        {this.props.productList && this.props.productList.length > 0
          ? this.props.productList.map((product) =>
              <TeamProductItem
                key={product.id}
                product={product}
                onAdd={this.props.onProductAddToCart} />
            )
          : <p>Keine Produkte verfügbar</p>}
      </div>
    );
  }
}

export default TeamProducts;
