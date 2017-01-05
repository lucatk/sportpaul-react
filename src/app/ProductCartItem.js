import React, { Component } from 'react';
import BezierEasing from 'bezier-easing';

class ProductCartItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMod: 0.0
    };
    this.easing = BezierEasing(0.68, -0.65, 0.265, 1.65);

    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  componentDidMount() {
    // this.heightTimerId = setInterval(() => this.tickHeight(), 1);
  }

  componentWillUnmount() {
    // clearInterval(this.heightTimerId);
  }

  tickHeight() {
    if(this.state.heightMod >= 1.0) {
      clearInterval(this.heightTimerId);
      return;
    }
    this.setState({heightMod: this.state.heightMod+0.01});
  }

  handleRemoveClick() {
    this.props.onRemove(this.props.reactKey);
  }

  render() {
    return (
      <div className="product-cart-item">
        <img className="product-item-image" src="http://placehold.it/200x300" role="presentation" />
        <div className="info">
          <p className="product-item-name">{this.props.name}</p>
          <p className="product-item-price">{this.props.price.toFixed(2)} €</p>
          <p className="product-item-size">Größe: {this.props.size}</p>
          {false && this.props.flocking.length > 0 &&
          <p className="product-item-flocking">Beflockung: {this.props.flocking}</p>}
          <a className="product-item-remove" href="#" onClick={this.handleRemoveClick}>Entfernen</a>
        </div>
      </div>
    );
  }
}

ProductCartItem.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  size: React.PropTypes.string.isRequired,
  flocking: React.PropTypes.string.isRequired,
  price: React.PropTypes.number.isRequired
};

export default ProductCartItem;
