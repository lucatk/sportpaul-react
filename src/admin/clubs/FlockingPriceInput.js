import React, { Component } from 'react';

import {
  FormGroup, FormControl, InputGroup
} from 'react-bootstrap';

class FlockingPriceInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false,
      flockingPrice: 0,
      flockingPriceTemp: ''
    };

    this.onFlockingPriceChange = this.onFlockingPriceChange.bind(this);
    this.onFlockingPriceConfirm = this.onFlockingPriceConfirm.bind(this);
    this.onFlockingEnabledChange = this.onFlockingEnabledChange.bind(this);
  }
  onFlockingPriceChange(event) {
    this.setState({flockingPriceTemp:event.target.value});
  }
  onFlockingPriceConfirm() {
    if(/^\+?([0-9]+(\.[0-9]+)?|\.[0-9]+)$/.test(this.state.flockingPriceTemp.replace(',', '.'))) {
      var parsed = parseFloat(this.state.flockingPriceTemp.replace(',', '.'));
      this.setState({
        flockingPrice: parsed,
        flockingPriceTemp: parsed === 0 ? '' : parsed.toFixed(2).replace('.', ',')
      });
      this.props.onChange(parsed);
    } else if(this.state.flockingPriceTemp.length < 1) {
      this.setState({
        flockingPrice: 0,
        flockingPriceTemp: ''
      });
      this.props.onChange(0);
    } else {
      if(this.state.flockingPrice === 0) {
        this.setState({flockingPriceTemp:''});
      } else {
        this.setState({flockingPriceTemp:this.state.flockingPrice.toFixed(2).replace('.', ',')});
      }
    }
  }
  onFlockingEnabledChange(event) {
    this.setState({enabled:event.target.checked});
  }
  render() {
    return (
      <FormGroup>
        <InputGroup>
          <InputGroup.Addon>
            <label><input type="checkbox" value="" checked={this.state.enabled} onChange={this.onFlockingEnabledChange} /> aktiv</label>
          </InputGroup.Addon>
          <FormControl type="text" inputMode="numeric" disabled={!this.state.enabled} value={this.state.flockingPriceTemp} placeholder="0,00" step="0.01" onChange={this.onFlockingPriceChange} onBlur={this.onFlockingPriceConfirm} />
          <InputGroup.Addon className={this.state.enabled?'':'disabled'}>€</InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    );
  }
}

export default FlockingPriceInput;
