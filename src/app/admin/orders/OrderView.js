import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import * as Statics from "../../utils/Statics";
import LoadingOverlay from '../../utils/LoadingOverlay';

class OrderView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clubid: -1,
      id: -1,
      clubname: '',
      firstname: '',
      lastname: '',
      address: '',
      postcode: '',
      town: '',
      email: '',
      phone: '',
      created: null,
      updated: null,
      status: '',
      items: [],
      total: 0,
      loadedInfo: false,
      loadedItems: false,
      loading: true
    }

    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      loadedInfo: false,
      loadedItems: false,
      loading: true
    });

    var loadedInfo = false;
    var loadedItems = false;
    var doneProcess = (() => {
      if(loadedInfo && loadedItems)
        this.setState({loading: false});
    }).bind(this);

    $.post({
      url: 'php/orders/load.php',
      data: {
        id: nextProps.params.orderid,
        clubid: nextProps.params.clubid
      },
      success: function(data) {
        var parsed = JSON.parse(data);

        loadedInfo = true;
        doneProcess();

        this.setState({
          ...parsed,
          loadedInfo: true
        });
      }.bind(this)
    });
    $.post({
      url: 'php/items/load.php',
      data: {
        orderid: nextProps.params.orderid,
        clubid: nextProps.params.clubid
      },
      success: function(data) {
        var items = JSON.parse(data);
        var parsedItems = [];

        for(var i in items) {
          parsedItems[i] = items[i];
          if(items[i].colour && items[i].colour.length > 0)
            parsedItems[i].colour = JSON.parse(items[i].colour);
            parsedItems[i].flockings = JSON.parse(items[i].flockings);
        }

        loadedItems = true;
        doneProcess();

        this.setState({
          items: parsedItems,
          loadedItems: true
        });
      }.bind(this)
    });
  }
  render() {
    return (
      <div className="container" data-page="OrderView">
        <Helmet>
          <title>{"ID: " + this.state.clubid + "/" + this.state.id + " | Bestellung-Details | Sport-Paul Vereinsbekleidung"}</title>
        </Helmet>
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Bestellung: Details
          <small> ID: {this.state.clubid}/{this.state.id}</small>
          <Link to={"/admin/orders/edit/" + this.state.clubid + "/" + this.state.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
          <Link to="/admin/orders"><Button bsSize="small"><Glyphicon bsClass="flipped glyphicon" glyph="share-alt" /> Zurück</Button></Link>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11"><Link to={"/admin/orders/club/" + this.state.clubid}>{this.state.clubname} <span className="text-muted">(ID: {this.state.clubid})</span></Link></ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputCustomerInfo">
            <ControlLabel bsClass="col-sm-1 control-label">Kunde</ControlLabel>
            <ControlLabel bsClass="col-sm-11">
              <p className="name">{this.state.firstname} {this.state.lastname}</p>
              <p className="address">{this.state.address}</p>
              <p className="town">{this.state.postcode} {this.state.town}</p>
            </ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputPhone">
            <ControlLabel bsClass="col-sm-1 control-label">Telefon</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{this.state.phone}</ControlLabel>
          </FormGroup>
          {this.state.email.length > 0 && <FormGroup controlId="inputEmail">
            <ControlLabel bsClass="col-sm-1 control-label">E-Mail</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{this.state.email}</ControlLabel>
          </FormGroup>}
          <FormGroup controlId="inputDate">
            <ControlLabel bsClass="col-sm-1 control-label">Bestelldatum</ControlLabel>
            <ControlLabel bsClass="col-sm-11">
              {(new Date(this.state.created)).toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }).replace(",", "")} Uhr
            </ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputDateUpdated">
            <ControlLabel bsClass="col-sm-1 control-label">Änderungsdatum</ControlLabel>
            <ControlLabel bsClass="col-sm-11">
              {(new Date(this.state.updated)).toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }).replace(",", "")} Uhr
            </ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputStatus">
            <ControlLabel bsClass="col-sm-1 control-label">Status</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{Statics.OrderStatus[this.state.status]}</ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputProducts">
            <ControlLabel bsClass="col-sm-1 control-label">Positionen</ControlLabel>
            <div className="col-sm-11">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Artikelnr.</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Preis</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items && Object.keys(this.state.items).length > 0
                    ? Object.keys(this.state.items).map((key) =>
                        <tr key={key} data-id={key} data-name={this.state.items[key].name}>
                          <td>{key}</td>
                          <td>{this.state.items[key].name}</td>
                          <td>{this.state.items[key].internalid}{(this.state.items[key].colour != null && this.state.items[key].colour.id) && [<br />, this.state.items[key].colour.id + " " + this.state.items[key].colour.name]}</td>
                          <td>{this.state.items[key].size}</td>
                          <td className="flocking">
                            {(this.state.items[key].flockings && this.state.items[key].flockings.length > 0)
                              ? this.state.items[key].flockings.map((flocking, i) => <p key={i}>{flocking.description + (flocking.type == "0" ? " (" + flocking.value + ")" : "")}</p>)
                              : '-'}
                          </td>
                          <td>
                            <p>{parseFloat(this.state.items[key].price).toFixed(2).replace(".", ",")} €</p>
                            {(this.state.items[key].flockings && this.state.items[key].flockings.length > 0)
                              && this.state.items[key].flockings.filter((flocking) => flocking.price > 0).map((flocking, i) => <p key={i} className="flocking-price">+{flocking.price.toFixed(2).replace('.', ',')} €</p>)}
                          </td>
                          <td>{Statics.ItemStatus[this.state.items[key].status]}</td>
                        </tr>
                  ) : <tr className="no-data"><td colSpan="7">Keine Positionen vorhanden</td></tr>}
                </tbody>
              </Table>
            </div>
          </FormGroup>
          <FormGroup controlId="inputTotal">
            <ControlLabel bsClass="col-sm-1 control-label">Gesamtpreis</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{parseFloat(this.state.total).toFixed(2).replace(".", ",")} €</ControlLabel>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default OrderView;
