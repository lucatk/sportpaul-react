import React, { Component, ReactDOM } from 'react';

import { FormControl } from 'react-bootstrap';

import ProductSizesInput from './ProductSizesInput';
import ProductPriceInput from './ProductPriceInput';

class ProductPricegroupsControl extends Component {
  constructor(props) {
    super(props);

    this.sizesInputs = [];
    this.state = {
      // editing: false,
      data: []
    };

    this.onAddGroup = this.onAddGroup.bind(this);
    this.onSizesValueChange = this.onSizesValueChange.bind(this);
    this.onPriceValueChange = this.onPriceValueChange.bind(this);
  }
  onAddGroup() {
    var data = this.state.data;
    this.focusGroup = data.length;
    data[data.length] = {
      sizes: [],
      price: 0
    };
    this.setState({data:data});
  }
  onSizesValueChange(i, newSizes) {
    var data = this.state.data;
    if(newSizes.length < 1) {
      data.splice(i, 1);
    } else {
      data[i].sizes = newSizes;
    }
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  onPriceValueChange(i, newPrice) {
    var data = this.state.data;
    data[i].price = newPrice;
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value
    });
  }
  render() {
    return (
      <div>
        {this.state.data.map((group, i) =>
          <div key={i} className="row">
            <div className="col-sm-5">
              <ProductSizesInput value={group.sizes} onValueChange={this.onSizesValueChange.bind(this, i)} ref={(input) => { this.sizesInputs[i] = input }} />
            </div>
            <div className="col-sm-3">
              <ProductPriceInput value={group.price} onValueChange={this.onPriceValueChange.bind(this, i)} />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-sm-8">
            <FormControl type="text" placeholder="Gruppe hinzufügen..." onFocus={this.onAddGroup} />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.focusNewGroup();
  }
  componentDidUpdate() {
    this.focusNewGroup();
  }
  focusNewGroup() {
    if(this.focusGroup !== undefined && this.focusGroup !== -1) {
      this.sizesInputs[this.focusGroup]._reactInternalInstance._renderedComponent._renderedComponent._hostNode.focus();
      this.focusGroup = -1;
    }
  }
}

export default ProductPricegroupsControl;
