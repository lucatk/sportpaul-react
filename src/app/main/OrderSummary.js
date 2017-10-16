import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon,
  Row, Col,
  Table
} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import Recaptcha from 'react-recaptcha';

import LoadingOverlay from '../utils/LoadingOverlay';

class OrderSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      success: false,
      newid: -1,
      newclubid: -1,
      captcha: null
    };

    this.total = 0;
    this.orderCart = [];
    for(var i in this.props.productCart) {
      var product = this.props.productCart[i];
      this.orderCart[i] = {
        id: product.id,
        internalid: product.internalid,
        name: product.name,
        colour: product.colour,
        size: product.size,
        price: -1,
        displayPrice: -1,
        flockings: product.flockings,
        includedFlockingInfo: product.includedFlockingInfo
      };
      for(var z in product.pricegroups) {
        if(product.pricegroups[z].sizes.includes(product.size)) {
          this.orderCart[i].price = product.pricegroups[z].price;
          this.orderCart[i].displayPrice = product.pricegroups[z].price;
          if(product.flockings && product.flockings.length > 0) {
            this.orderCart[i].displayPrice += product.flockings.reduce((acc, val) => acc+val.price, 0);
          }

          this.total += this.orderCart[i].displayPrice;
        }
      }
    }
    this.customerData = this.props.customerData;
    if(!this.customerData.email) this.customerData.email = '';

    this.onClickOrder = this.onClickOrder.bind(this);
    this.onCaptcha = this.onCaptcha.bind(this);
  }

  onClickOrder() {
    this.setState({loading:true});
    var cart = this.orderCart;
    this.orderCart.forEach((item, i) => {
      if(item.colour) {
        item.colour = JSON.stringify(item.colour);
      } else {
        item.colour = "";
      }
      if(item.flockings) {
        item.flockings = JSON.stringify(item.flockings);
      } else {
        item.flockings = "[]";
      }

      cart[i] = item;
    });
    var clubid = this.props.clubid;
    $.post({
      url: 'php/orders/add.php',
      data: {
        clubid: clubid,
        captcha: this.state.captcha,
        ...this.customerData,
        cart: JSON.stringify(cart)
      },
      success: function(data) {
        this.setState({loading:false, done:true});
        var parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch(e) {
          throw e;
        }

        var success = false;
        if(parsed.error !== "00000" || parsed.rowsAffected < 1) {
          console.log("Error: ", parsed.error);

          this.setState({success:false});
        } else {
          success = true;
          this.setState({success:true,newid:parsed.newid,newclubid:clubid});
        }
        this.props.onOrder(success);
      }.bind(this)
    });
  }

  onCaptcha(response) {
    this.setState({captcha:response});
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Bestellung abschließen | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        <LoadingOverlay show={this.state.loading} />
        <div className="order-summary">
          <h1 className="page-header">Bestellung abschließen</h1>
          {!this.state.done && <Row>
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
                    <th>Farbe</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Gesamtpreis</th>
                  </tr>
                </thead>
                <tbody>
                  {this.orderCart.map((row, i) =>
                  <tr>
                    <td>{row.name}</td>
                    <td>{row.colour !== undefined && row.colour != null && row.colour.id ? row.colour.id + " " + row.colour.name : "-"}</td>
                    <td>{row.size}</td>
                    {(row.flockings && row.flockings.length > 0) ?
                      <td className="flocking">
                        {row.flockings.map((flocking, i) => flocking.description + (flocking.type == "0" ? " (" + flocking.value + ")" : "")).join(", ")}
                      </td>
                    : <td>-</td>}
                    <td>{row.displayPrice.toFixed(2).replace('.', ',')} €</td>
                  </tr>)}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"></td>
                    <td>{this.total.toFixed(2).replace('.', ',')} €</td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>}
          {(!this.state.done && !this.props.loggedIn) && <Row><Recaptcha sitekey={this.props.recaptchaKey} render="explicit" onloadCallback={console.log.bind(this, "recaptcha loaded")} verifyCallback={this.onCaptcha} /></Row>}
          {!this.state.done && <Button bsStyle="primary" onClick={this.onClickOrder} disabled={!this.state.captcha && !this.props.loggedIn}>Bestellen</Button>}
          {(this.state.done && this.state.success) && <div className="done"><p>Die Bestellung wurde aufgenommen. Informationen zur Bestellung werden an die E-Mail <span>{this.customerData.email}</span> gesendet.</p><Button bsStyle="primary" onClick={() => {window.open("php/orders/pdf.php?clubid=" + this.state.newclubid + "&id=" + this.state.newid)}}><Glyphicon glyph="print" /> Bestellübersicht drucken</Button></div>}
          {(this.state.done && !this.state.success) && <div className="done"><p>Es gab einen Fehler bei der Bestellung.</p></div>}
        </div>
      </div>
    );
  }
}

export default OrderSummary;
