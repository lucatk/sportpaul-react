import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon,
  Row, Col,
  Table
} from 'react-bootstrap';

import LoadingOverlay from '../utils/LoadingOverlay';

class OrderSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.total = 0;
    this.orderCart = [];
    for(var i in this.props.productCart) {
      var product = this.props.productCart[i];
      this.orderCart[i] = {
        id: product.id,
        internalid: product.internalid,
        name: product.name,
        size: product.size,
        price: -1,
        displayPrice: -1,
        flocking: product.flocking,
        flockingPrice: product.flockingPrice,
        defaultFlocking: product.defaultFlocking
      };
      for(var z in product.pricegroups) {
        if(product.pricegroups[z].sizes.includes(product.size)) {
          this.orderCart[i].price = product.pricegroups[z].price;
          this.orderCart[i].displayPrice = product.pricegroups[z].price;
          if(product.flocking && product.flocking.length > 0) this.orderCart[i].displayPrice += product.flockingPrice;

          this.total += this.orderCart[i].displayPrice;
        }
      }
    }
    this.customerData = this.props.customerData;
    if(!this.customerData.email) this.customerData.email = '';

    this.onClickOrder = this.onClickOrder.bind(this);
  }

  onClickOrder() {
    this.setState({loading:true});
    $.post({
      url: 'php/orders/add.php',
      data: {
        clubid: this.props.clubid,
        ...this.customerData,
        cart: JSON.stringify(this.orderCart)
      },
      success: function(data) {
        this.setState({loading:false, done:true});
        var parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch(e) {
          console.log(data);
          throw e;
        }

        var success = false;
        if(parsed.error !== "00000" || parsed.rowsAffected < 1) {
          console.log("Error: ", parsed);

          this.setState({success:false});
        } else {
          success = true;
          this.setState({success:true});
        }
        this.props.onOrder(success);
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <LoadingOverlay show={this.state.loading} />
        <div className="order-summary">
          <h1 className="page-header">Bestellung abschließen</h1>
          <Row>
            <Col lg="4">
              <div className="customer-data">
                <h2>Kundeninformationen:</h2>
                <p>{this.customerData.firstname} {this.customerData.lastname}</p>
                <p>{this.customerData.address}</p>
                <p>{this.customerData.postcode} {this.customerData.town}</p>
                <p>Telefon: {this.customerData.phone}</p>
                <p>E-Mail: {this.customerData.email}</p>
              </div>
            </Col>
            <Col lg="8">
              <h2>Bestellübersicht:</h2>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Gesamtpreis</th>
                  </tr>
                </thead>
                <tbody>
                  {this.orderCart.map((row, i) =>
                  <tr>
                    <td>{row.name}</td>
                    <td>{row.size}</td>
                    <td>{(row.flocking && row.flocking.length > 0) ? row.flocking : '-'}</td>
                    <td>{row.displayPrice.toFixed(2).replace('.', ',')} €</td>
                  </tr>)}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"></td>
                    <td>{this.total.toFixed(2).replace('.', ',')} €</td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
          {!this.state.done && <Button bsStyle="primary" onClick={this.onClickOrder}>Bestellen</Button>}
          {(this.state.done && this.state.success) && <div className="done"><p>Die Bestellung wurde aufgenommen. Informationen zur Bestellung werden an die E-Mail <span>{this.customerData.email}</span> gesendet.</p><Button bsStyle="primary"><Glyphicon glyph="print" /> Bestellübersicht drucken</Button></div>}
          {(this.state.done && !this.state.success) && <div className="done"><p>Es gab einen Fehler bei der Bestellung.</p></div>}
        </div>
      </div>
    );
  }
}

export default OrderSummary;
