import React, { Component } from 'react';

import { FormControl } from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class ProductSizesInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // editing: false,
      sizes: this.props.value || [],
      inputTemp: this.props.value ? (this.props.value.join(', ')) : ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputConfirm = this.onInputConfirm.bind(this);
  }
  onInputChange(event) {
    this.setState({inputTemp:event.target.value});
  }
  onInputConfirm() {
    // this.setState({editing:false});
    if(new RegExp(Statics.SizeRegex).test(this.state.inputTemp)) {
      var match, sizes = [], regex = new RegExp(Statics.SizeRegex);
      while((match = regex.exec(this.state.inputTemp))) {
        sizes.push(match[1].trim());
      }
      this.setState({
        sizes: sizes,
        inputTemp: sizes.length < 1 ? '' : sizes.join(', ')
      });
      this.props.onValueChange(sizes);
    } else if(this.state.inputTemp.length < 1) {
      this.setState({
        sizes: [],
        inputTemp: ''
      });
      this.props.onValueChange([]);
    } else {
      if(this.state.sizes.length < 1) {
        this.setState({inputTemp:''});
      } else {
        this.setState({inputTemp:this.state.sizes.join(', ')});
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      sizes: nextProps.value,
      inputTemp: nextProps.value.join(', ')
    });
  }
  render() {
    return (
      <FormControl type="text" disabled={!(this.props.enabled===undefined?true:this.props.enabled)} value={this.state.inputTemp} placeholder={this.props.enabled===false?"":"S, M, L, ..."} onChange={this.onInputChange} onBlur={this.onInputConfirm} />
    );
  }
}

export default ProductSizesInput;
