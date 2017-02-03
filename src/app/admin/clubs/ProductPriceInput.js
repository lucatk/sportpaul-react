import React, { Component } from 'react';

import { FormControl } from 'react-bootstrap';

class ProductPriceInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      price: this.props.value || 0,
      priceTemp: this.props.value ? (this.props.value.toFixed(2).replace('.', ',') + ' €') : ''
    };

    this.onPriceChange = this.onPriceChange.bind(this);
    this.onPriceConfirm = this.onPriceConfirm.bind(this);
  }
  onPriceChange(event) {
    this.setState({priceTemp:event.target.value});
  }
  onPriceConfirm() {
    if(/^\+?([0-9]+(\.[0-9]+)?|\.[0-9]+)(€| €)?$/.test(this.state.priceTemp.replace(',', '.'))) {
      var parsed = parseFloat(this.state.priceTemp.replace(',', '.'));
      this.setState({
        price: parsed,
        priceTemp: parsed === 0 ? '' : (parsed.toFixed(2).replace('.', ',') + ' €')
      });
      this.props.onValueChange(parsed);
    } else if(this.state.priceTemp.length < 1) {
      this.setState({
        price: 0,
        priceTemp: ''
      });
      this.props.onValueChange(0);
    } else {
      if(this.state.price === 0) {
        this.setState({priceTemp:''});
      } else {
        this.setState({priceTemp:this.state.price.toFixed(2).replace('.', ',') + ' €'});
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      price: nextProps.value,
      priceTemp: nextProps.value ? (nextProps.value.toFixed(2).replace('.', ',') + ' €') : ''
    });
  }
  render() {
    return (
      <FormControl type="text" disabled={!(this.props.enabled===undefined?true:this.props.enabled)} value={this.state.priceTemp} placeholder={this.props.enabled===false?"":"10,00 €"} onChange={this.onPriceChange} onBlur={this.onPriceConfirm} />
    );
  }
}

export default ProductPriceInput;
