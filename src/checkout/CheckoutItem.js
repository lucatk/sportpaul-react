import React, { Component } from 'react';

class CheckoutItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flocking: false,
      flockingValue: ''
    };

    this.handleAddFlocking = this.handleAddFlocking.bind(this);
    this.handleFlockingRemove = this.handleFlockingRemove.bind(this);
    this.handleFlockingChange = this.handleFlockingChange.bind(this);
  }

  handleAddFlocking() {
    this.setState({flocking: true, flockingValue: ''});
  }

  handleFlockingRemove() {
    if(this.state.flockingValue.length < 1) {
      this.setState({flocking: false, flockingValue: ''});
    }
  }

  handleFlockingChange(event) {
    this.setState({flockingValue: event.target.value});
  }

  render() {
    return (
      <div className="checkout-item">
        <img className="checkout-item-image" src="http://placehold.it/200x300" role="presentation" />
        <div className="info">
          <p className="checkout-item-name">{this.props.name}</p>
          <p className="checkout-item-price">{this.props.price.toFixed(2)} €</p>
          <p className="checkout-item-size">Größe: {this.props.size}</p>
          {this.state.flocking &&
          <label className="checkout-item-flocking">
            Beflockung:
            <input autoFocus type="text" value={this.state.flockingValue} onChange={this.handleFlockingChange} onBlur={this.handleFlockingRemove} />
            <p className="checkout-item-flockingprice">+{this.props.flockingPrice.toFixed(2)} €</p>
          </label>}
          {!this.state.flocking && (!(!this.props.flockingPrice) || this.props.flockingPrice === 0) &&
          <a className="checkout-item-addflocking" href="#/checkout" onClick={this.handleAddFlocking}>Beflockung hinzufügen...</a>}
        </div>
      </div>
    );
  }
}

CheckoutItem.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  size: React.PropTypes.string.isRequired,
  price: React.PropTypes.number.isRequired,
  flockingPrice: React.PropTypes.number
};

export default CheckoutItem;
