import React, { Component, ReactDOM } from 'react';

import { FormControl } from 'react-bootstrap';

import FormPriceInput from '../../utils/FormPriceInput';
import * as Statics from "../../utils/Statics";

class ProductFlockingsControl extends Component {
  constructor(props) {
    super(props);

    this.descriptionInputs = [];
    this.state = {
      // editing: false,
      data: []
    };

    this.onAddFlocking = this.onAddFlocking.bind(this);
    this.onDescriptionValueChange = this.onDescriptionValueChange.bind(this);
    this.onDescriptionValueConfirm = this.onDescriptionValueConfirm.bind(this);
    this.onPriceValueChange = this.onPriceValueChange.bind(this);
    this.onTypeValueChange = this.onTypeValueChange.bind(this);
  }
  onAddFlocking() {
    var data = this.state.data;
    this.focusGroup = data.length;
    data[data.length] = {
      description: '',
      price: 0,
      type: "0"
    };
    this.setState({data:data});
  }
  onDescriptionValueChange(i, event) {
    var data = this.state.data;
    data[i].description = event.target.value;
    this.setState({data:data});
  }
  onDescriptionValueConfirm(i) {
    var data = this.state.data;
    if(data[i].description.length < 1) {
      data.splice(i, 1);
      this.setState({data:data});
    }
    this.props.onValueChange(data);
  }
  onPriceValueChange(i, newPrice) {
    var data = this.state.data;
    data[i].price = newPrice;
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  onTypeValueChange(i, selection) {
    var data = this.state.data;
    data[i].type = selection.target.value;
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value
    });
  }
  render() {
    var flockingTypes = Statics.asObjects(Statics.FlockingTypes);
    return (
      <div>
        {this.state.data.map((flocking, i) =>
          <div key={i} className="row">
            <div className="col-sm-5">
              <FormControl type="text" value={flocking.description} placeholder="Beschreibung" onChange={this.onDescriptionValueChange.bind(this, i)} onBlur={this.onDescriptionValueConfirm.bind(this, i)} ref={(input) => { this.descriptionInputs[i] = input }} />
            </div>
            <div className="col-sm-3">
              <FormPriceInput value={flocking.price} onValueChange={this.onPriceValueChange.bind(this, i)} />
            </div>
            <div className="col-sm-4">
              <FormControl componentClass="select" value={flocking.type} onChange={this.onTypeValueChange.bind(this, i)}>
                <option value="" disabled>Beflockungs-Typ</option>
                {flockingTypes.map((value, i) =>
                <option key={i} value={value.key}>{value.value}</option>)}
              </FormControl>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-sm-12">
            <FormControl type="text" placeholder="Beflockung hinzufügen..." onFocus={this.onAddFlocking} />
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
      this.descriptionInputs[this.focusGroup]._reactInternalInstance._renderedComponent._hostNode.focus();
      this.focusGroup = -1;
    }
  }
}

export default ProductFlockingsControl;
