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

import * as Statics from "../../utils/Statics";
import LoadingOverlay from '../../utils/LoadingOverlay';

// import ProductEditModal from './modals/ProductEditModal';
// import ProductRemovalModal from './modals/ProductRemovalModal';

class OrderEditing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clubid: -1,
      id: -1,
      clubname: '',
      firstname: '',
      lastname: '',
      street: '',
      housenr: '',
      postcode: '',
      town: '',
      email: '',
      telephone: '',
      created: null,
      updated: null,
      status: '',
      items: [],
      showItemEditModal: false,
      scopeItemEditModal: -1,
      showItemRemoveModal: false,
      scopeItemRemoveModal: -1,
      showItemAddModal: false,
      toUpdateItems: [],
      toRemoveItems: [],
      toAddItems: [],
      loadedInfo: false,
      loadedItems: false,
      loading: true
    }

    this.componentWillReceiveProps(this.props);

    this.openEditItemModal = this.openEditItemModal.bind(this);
    this.openRemoveItemModal = this.openRemoveItemModal.bind(this);
    this.editItem = this.editItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  openEditItemModal(e) {
    this.refs.productEditModal.openModal(e);
  }
  openRemoveItemModal(e) {
    this.refs.productRemovalModal.openModal(e);
  }
  editItem(e) {
    this.closeEditProductModal();
  }
  removeItem(e) {
    this.closeRemoveProductModal();
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
        console.log(data);
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

        loadedItems = true;
        doneProcess();

        this.setState({
          items: items,
          loadedItems: true
        });
      }.bind(this)
    });
  }
  render() {
    document.title = "ID: " + this.state.clubid + "/" + this.state.id + " | Bestellung bearbeiten | Sport-Paul Vereinsbekleidung";
    return (
      <div className="container" data-page="OrderView">
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Bestellung bearbeiten
          <small> ID: {this.state.clubid}/{this.state.id}</small>
          <div className="unsaved-changes">
            {((this.state.toUpdateItems && this.state.toUpdateItems.length > 0)
              || (this.state.toRemoveItems && this.state.toRemoveItems.length > 0)
              || (this.state.toAddItems && this.state.toAddItems.length > 0)
              /*|| this.state.name !== this.oldName
              || this.state.logodata !== this.oldLogodata*/)
              && <small>Sie haben ungesicherte Änderungen!</small>}
            <Button bsStyle="success" bsSize="small" onClick={this.save}>Speichern</Button>
          </div>


          <Button bsStyle="danger" bsSize="small"><Glyphicon glyph="remove" /> Löschen</Button>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11"><Link to={"/admin/clubs/edit/" + this.state.clubid}>{this.state.clubname} <span className="text-muted">(ID: {this.state.clubid})</span></Link></ControlLabel>
            {/*// TODO: alle Bestellungen fuer Verein anzeigen, statt Verein-Bearbeitungsseite*/}
          </FormGroup>
          <FormGroup controlId="inputCustomerInfo">
            <ControlLabel bsClass="col-sm-1 control-label">Kunde</ControlLabel>
            <ControlLabel bsClass="col-sm-11">
              <p className="name">{this.state.firstname} {this.state.lastname}</p>
              <p className="address">{this.state.street} {this.state.housenr}</p>
              <p className="town">{this.state.postcode} {this.state.town}</p>
            </ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputTelephone">
            <ControlLabel bsClass="col-sm-1 control-label">Telefon</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{this.state.telephone}</ControlLabel>
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
                    <th>Produkt #</th>
                    <th>Name</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Preis</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/*<tr data-id="0" data-name="Testprodukt 1">
                    <td>0</td>
                    <td className="product-name">Testprodukt 1</td>
                    <td>M</td>
                    <td>M. Mustermann</td>
                    <td>52,48 €</td>
                    <td className="buttons">
                      <ButtonToolbar>
                        <Button bsSize="small" onClick=*this.openEditProductModal*><Glyphicon glyph="pencil" /></Button>
                        <Button bsSize="small" bsStyle="danger" onClick=*this.openRemoveProductModal*><Glyphicon glyph="remove" /></Button>
                      </ButtonToolbar>
                    </td>
                  </tr>*/}
                  {this.state.items && Object.keys(this.state.items).length > 0
                    ? Object.keys(this.state.items).map((key) =>
                        <tr key={key} data-id={key} data-name={this.state.items[key].name}>
                          <td>{key}</td>
                          <td>{this.state.items[key].productid}</td>
                          <td>{this.state.items[key].name}</td>
                          <td>{this.state.items[key].size}</td>
                          <td>{this.state.items[key].flocking}</td>
                          <td>{parseFloat(this.state.items[key].price).toFixed(2).replace(".", ",")} €</td>
                          <td>{Statics.ItemStatus[this.state.items[key].status]}</td>
                        </tr>
                  ) : <tr className="no-data"><td colSpan="7">Keine Positionen vorhanden</td></tr>}
                </tbody>
              </Table>
            </div>
          </FormGroup>
          <FormGroup controlId="inputTotal">
            <ControlLabel bsClass="col-sm-1 control-label">Gesamtpreis</ControlLabel>
            <ControlLabel bsClass="col-sm-11">{Object.keys(this.state.items).reduce((function(acc, val, i){return acc += parseFloat(this.state.items[val].price);}).bind(this), 0).toFixed(2).replace(".", ",")} €</ControlLabel>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default OrderView;
