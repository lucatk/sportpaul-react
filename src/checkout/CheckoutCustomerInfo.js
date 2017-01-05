import React, {Component} from 'react';

class CheckoutCustomerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {}
    };
  }

  render() {
    return (
      <div className="customer-info">
        <div className="column-1">
          <label>Vorname: <input id="firstname" type="text" value={this.state.customer.firstname} /></label>
          <label>Straße: <input id="street" type="text" value={this.state.customer.street} /></label>
        </div>
        <div className="column-2">
          <label>Nachname: <input id="lastname" type="text" value={this.state.customer.lastname} /></label>
          <div className="address">
            <label>PLZ: <input id="postcode" type="text" value={this.state.customer.postcode} /></label>
            <label>Ort: <input id="town" type="text" value={this.state.customer.town} /></label>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutCustomerInfo;
