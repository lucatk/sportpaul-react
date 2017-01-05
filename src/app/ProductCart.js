import React, { Component } from 'react';
import ProductCartItem from './ProductCartItem.js';
import { Link } from 'react-router';

class ProductCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowScrollPosition: 0
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    this.setState({windowScrollPosition: window.scrollY});
  }

  render() {
    return (
      <div className={"product-cart" + (this.state.windowScrollPosition >= 45 ? " scrolled" : "")}>
        <p className="product-cart-heading">Ihr Warenkorb</p>
        <div className="cart-contents">
          {this.props.contents && this.props.contents.length > 0
            ? this.props.contents.map((product, index) =>
                <ProductCartItem
                  key={index}
                  reactKey={index}
                  id={product.id}
                  name={product.name}
                  size={product.size}
                  price={product.price}
                  flockingPrice={product.flockingPrice}
                  onRemove={this.props.onRemove} />
              ) /*flocking=product.flocking*/
            : <p>Ihr Warenkorb ist leer!</p>}
        </div>
        {this.props.contents && this.props.contents.length > 0 &&
        <div>
          <p className="product-cart-total">Gesamt: {this.props.total.toFixed(2)} €</p>
          <Link to="/checkout"><button className="cart-continue-button" type="button" onClick={this.handleCartClick}>Weiter</button></Link>
        </div>}
      </div>
    );
  }
}

export default ProductCart;
