import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import ClubProductItem from './ClubProductItem.js';

class ClubProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: props.productList.sort((a, b) => {
        return parseInt(a.displayorder) - parseInt(b.displayorder);
      })
    };
  }
  componentWillReceiveProps(nextProps) {
    var productList = nextProps.productList;
    productList = nextProps.productList.sort((a, b) => parseInt(a.displayorder) - parseInt(b.displayorder));
    this.setState({
      productList: productList
    });
  }
  render() {
    return (
      <div className="product-list">
        <Helmet>
          <title>{this.props.clubName} | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        {this.state.productList && this.state.productList.length > 0
          ? this.state.productList.map((product) =>
              <ClubProductItem
                key={product.id}
                product={product}
                orderable={this.props.orderable}
                onAdd={this.props.onProductAddToCart}
                onPreview={this.props.onProductPreviewRequest} />
            )
          : <p>Keine Produkte verfügbar</p>}
      </div>
    );
  }
}

export default ClubProducts;
