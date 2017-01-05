import React, { Component } from 'react';

class TeamProductItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSize: this.props.product.sizes[0],
      flocking: ''
    };

    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleFlockingChange = this.handleFlockingChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  handleSizeChange(event) {
    this.setState({selectedSize: event.target.value});
  }

  handleFlockingChange(event) {
    this.setState({flocking: event.target.value});
  }

  handleAddClick(event) {
    this.props.onAdd(this.props.product, this.state);
    this.setState({flocking: ''});
  }

  render() {
    /*<div className="product-item-action-flocking">
      <label>Beflockung</label>
      <input id="flocking" type="text" value={this.state.flocking} onChange={this.handleFlockingChange} />
    </div>*/
    return (
      <div className="product-item">
        <p className="product-item-name">{this.props.product.name}</p>
        <img className="product-item-image" src="http://placehold.it/200x300" role="presentation" />

        <div className="product-item-action">

          <div className="product-item-action-size">
            <label>Größe</label>
            <select id="size" className="product-item-size" value={this.state.selectedSize} onChange={this.handleSizeChange}>
              {this.props.product.sizes.map((size) =>
                <option key={size === '' ? 'none' : size} value={size === '' ? 'none' : size}>{size}</option>
              )}
            </select>
          </div>
          <div className="product-item-action-price">
            <label>{this.props.product.price.toFixed(2)} €</label>
          </div>
          <button className="cart-button" type="button" onClick={this.handleAddClick}>In Warenkorb</button>
        </div>
      </div>
    );
  }
}

TeamProductItem.propTypes = {
  product: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    sizes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    price: React.PropTypes.number,
    flockingPrice: React.PropTypes.number
  }).isRequired,
  onAdd: React.PropTypes.func
};

export default TeamProductItem;
