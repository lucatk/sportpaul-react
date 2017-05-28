import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon,
  Col, Row
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";
import LoadingOverlay from '../../utils/LoadingOverlay';
import PopupModal from '../../utils/PopupModal';

import FormPriceInput from '../../utils/FormPriceInput';

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
      total: 0,
      // showItemEditModal: false,
      // scopeItemEditModal: -1,
      // showItemRemoveModal: false,
      // scopeItemRemoveModal: -1,
      // showItemAddModal: false,
      toUpdateItems: [],
      // toRemoveItems: [],
      // toAddItems: [],
      loadedInfo: false,
      loadedItems: false,
      loading: true,
      hasChanges: false
    }

    this.componentWillReceiveProps(this.props);

    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);

    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onStreetChange = this.onStreetChange.bind(this);
    this.onHousenrChange = this.onHousenrChange.bind(this);
    this.onPostcodeChange = this.onPostcodeChange.bind(this);
    this.onTownChange = this.onTownChange.bind(this);
    this.onTelephoneChange = this.onTelephoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    // TODO
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

        Object.values(items).forEach((item) => {
          var parsedItem = item;
          if(item.pricegroups.length > 0) {
            parsedItem.pricegroups = JSON.parse(item.pricegroups);
          }
          parsedItems.push(parsedItem);
        });

        loadedItems = true;
        doneProcess();

        this.setState({
          items: parsedItems,
          loadedItems: true
        });
      }.bind(this)
    });
  }
  save() {
    var updatedOrderInfo = false;
    var error = false;
    var toUpdateCount = this.state.toUpdateItems.length;

    var doneProcess = () => {
      if(!updatedOrderInfo || toUpdateCount > 0) return;

      this.setState({
        toUpdateItems: [],
        hasChanges: false,
        loading: false
      });

      if(error) {
        console.log("error");
      } else {
        this.props.router.push("/admin/orders");
      }
    };

    var data = new FormData();
    data.append("orderid", this.state.id);
    data.append("clubid", this.state.clubid);
    data.append("firstName", this.state.firstname);
    data.append("lastName", this.state.lastname);
    data.append("street", this.state.street);
    data.append("housenr", this.state.housenr);
    data.append("postCode", this.state.postcode);
    data.append("town", this.state.town);
    data.append("email", this.state.email);
    data.append("telephone", this.state.telephone);
    data.append("status", this.state.status);
    $.post({
      url: 'php/orders/update.php',
      contentType: false,
      processData: false,
      data: data,
      success: function(data) {
        var result = JSON.parse(data);
        if(result.error !== 0 && result.rowsAffected < 1)
          error = true;
        console.log(result, error);
        updatedOrderInfo = true;
        doneProcess();
      }.bind(this)
    });

    this.state.toUpdateItems.forEach((id) => {
      var item = this.state.items[id];
      if(item == undefined || item == null) return;
      var data = new FormData();
      data.append("clubid", item.clubid);
      data.append("orderid", item.orderid);
      data.append("id", item.id);
      data.append("flocking", item.flocking);
      data.append("size", item.size);
      data.append("price", item.price);
      data.append("flockingPrice", item.flockingPrice);
      data.append("status", item.status);
      $.post({
        url: 'php/items/update.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1)
            error = true;
          console.log(result, error);
          toUpdateCount--;
          doneProcess();
        }
      });
    });
  }
  delete() {

  }
  onFirstNameChange(ev) {
    this.setState({firstname: ev.target.value, hasChanges: true});
  }
  onLastNameChange(ev) {
    this.setState({lastname: ev.target.value, hasChanges: true});
  }
  onStreetChange(ev) {
    this.setState({street: ev.target.value, hasChanges: true});
  }
  onHousenrChange(ev) {
    this.setState({housenr: ev.target.value, hasChanges: true});
  }
  onPostcodeChange(ev) {
    this.setState({postcode: ev.target.value, hasChanges: true});
  }
  onTownChange(ev) {
    this.setState({town: ev.target.value, hasChanges: true});
  }
  onTelephoneChange(ev) {
    this.setState({telephone: ev.target.value, hasChanges: true});
  }
  onEmailChange(ev) {
    this.setState({email: ev.target.value, hasChanges: true});
  }
  onStatusChange(ev) {
    if(ev.target.value == 3) {
      this.popupModal.showModal("Möchten Sie den Status wirklich ändern?", "Durch diese Statusänderung wird der Status aller Positionen auf \"" + Statics.ItemStatus[3] + "\" gesetzt.", function(success) {
        if(success) {
          var items = this.state.items;
          items.forEach((item) => {
            item.status = 3;
          });
          this.setState({status: 3, items: items, hasChanges: true});
        }
      }.bind(this), "Okay", "Abbrechen");
    } else {
      this.setState({status: ev.target.value, hasChanges: true});
    }
  }
  onItemSizeChange(key, ev) {
    var items = this.state.items;
    items[key].size = ev.target.value;
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
  }
  onItemFlockingChange(key, ev) {
    var items = this.state.items;
    items[key].flocking = ev.target.value;
    if(ev.target.value.length < 1) {
      items[key].flockingPrice = 0;
    }
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
    this.calculateTotal(items);
  }
  onItemFlockingPriceChange(key, newPrice) {
    var items = this.state.items;
    items[key].flockingPrice = newPrice;
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
    this.calculateTotal(items);
  }
  onItemPriceChange(key, newPrice) {
    var items = this.state.items;
    items[key].price = newPrice;
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
    this.calculateTotal(items);
    // TODO
  }
  onItemStatusChange(key, ev) {
    if(ev.target.value == -1) {
      if(this.state.status > 1) {
        var value = ev.target.value;
        this.popupModal.showModal("Möchten Sie den Status wirklich ändern?", "Durch diese Statusänderung wird der Status der Bestellung auf \"" + Statics.OrderStatus[1] + "\" gesetzt.", function(success) {
          if(success) {
            var items = this.state.items;
            items[key].status = value;
            var toUpdate = this.state.toUpdateItems;
            if(!toUpdate.includes(key)) toUpdate.push(key);
            this.setState({items: items, toUpdateItems: toUpdate, status: 1, hasChanges: true});
          }
        }.bind(this), "Okay", "Abbrechen");
        return;
      }
    } else if(ev.target.value < 3) {
      if(this.state.status > 2) {
        var value = ev.target.value;
        this.popupModal.showModal("Möchten Sie den Status wirklich ändern?", "Durch diese Statusänderung wird der Status der Bestellung auf \"" + Statics.OrderStatus[2] + "\" gesetzt.", function(success) {
          if(success) {
            var items = this.state.items;
            items[key].status = value;
            var toUpdate = this.state.toUpdateItems;
            if(!toUpdate.includes(key)) toUpdate.push(key);
            this.setState({items: items, toUpdateItems: toUpdate, status: 2, hasChanges: true});
          }
        }.bind(this), "Okay", "Abbrechen");
        return;
      }
    }
    var items = this.state.items;
    items[key].status = ev.target.value;
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
  }
  onItemStatusUp(key, ev) {
    var items = this.state.items;
    if(items[key].status == 0) {
      items[key].status = 2;
    } else {
      items[key].status++;
    }
    var toUpdate = this.state.toUpdateItems;
    if(!toUpdate.includes(key)) toUpdate.push(key);
    this.setState({items: items, toUpdateItems: toUpdate, hasChanges: true});
  }
  calculateTotal(items) {
    var total = 0;
    items.forEach((item) => {
      total += parseFloat(item.price);
      if(item.flocking && item.flocking.length > 0) {
        total += parseFloat(item.flockingPrice);
      }
    });
    this.setState({total: total});
  }
  render() {
    document.title = "ID: " + this.state.clubid + "/" + this.state.id + " | Bestellung bearbeiten | Sport-Paul Vereinsbekleidung";
    return (
      <div className="container" data-page="OrderEditing">
        <PopupModal ref={(ref) => {this.popupModal = ref;}} />
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Bestellung bearbeiten
          <small> ID: {this.state.clubid}/{this.state.id}</small>
          <div className="unsaved-changes">
            {this.state.hasChanges && <small>Sie haben ungesicherte Änderungen!</small>}
            <Button bsStyle="success" bsSize="small" onClick={this.save}>Speichern</Button>
          </div>
          <Link to="/admin/orders"><Button bsSize="small"><Glyphicon bsClass="flipped glyphicon" glyph="share-alt" /> Zurück</Button></Link>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11"><Link to={"/admin/clubs/edit/" + this.state.clubid}>{this.state.clubname} <span className="text-muted">(ID: {this.state.clubid})</span></Link></ControlLabel>
            {/*// TODO: alle Bestellungen fuer Verein anzeigen, statt Verein-Bearbeitungsseite*/}
          </FormGroup>
          <FormGroup controlId="inputCustomerInfo">
            <ControlLabel bsClass="col-sm-1 control-label">Kunde</ControlLabel>
            <Col sm={11}>
              <div className="editing-container">
                <Row>
                  <Col sm={6}>
                    <FormGroup controlId="inputFirstname">
                      <FormControl type="text" value={this.state.firstname} onChange={this.onFirstNameChange} />
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup controlId="inputLastname">
                      <FormControl type="text" value={this.state.lastname} onChange={this.onLastNameChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                  <Row>
                    <FormGroup controlId="inputStreet" bsClass="form-group col-sm-9">
                      <FormControl type="text" value={this.state.street} onChange={this.onStreetChange} />
                    </FormGroup>
                    <FormGroup controlId="inputHousenr" bsClass="form-group col-sm-3">
                      <FormControl type="text" value={this.state.housenr} onChange={this.onHousenrChange} />
                    </FormGroup>
                  </Row>
                  </Col>
                  <Col sm={6}>
                    <Row>
                      <FormGroup controlId="inputPostcode" bsClass="form-group col-sm-6">
                        <FormControl type="text" value={this.state.postcode} onChange={this.onPostcodeChange} />
                      </FormGroup>
                      <FormGroup controlId="inputTown" bsClass="form-group col-sm-6">
                        <FormControl type="text" value={this.state.town} onChange={this.onTownChange} />
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </FormGroup>
          <FormGroup controlId="inputTelephone">
            <ControlLabel bsClass="col-sm-1 control-label">Telefon</ControlLabel>
            <Col sm={11}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="inputTelephone">
                    <FormControl value={this.state.telephone} onChange={this.onTelephoneChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
          <FormGroup controlId="inputEmail">
            <ControlLabel bsClass="col-sm-1 control-label">E-Mail</ControlLabel>
            <Col sm={11}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="inputEmail">
                    <FormControl type="text" value={this.state.email} onChange={this.onEmailChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
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
            <Col sm={11}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="inputStatus">
                    <FormControl componentClass="select" value={this.state.status} onChange={this.onStatusChange}>
                      {Object.keys(Statics.OrderStatus).map((key, i) =>
                      <option key={i} value={key}>{Statics.OrderStatus[key]}</option>)}
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
          <FormGroup controlId="inputProducts">
            <ControlLabel bsClass="col-sm-1 control-label">Positionen</ControlLabel>
            <div className="col-sm-12">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Artikelnr.</th>
                    <th>Größe</th>
                    <th>Beflockung</th>
                    <th>Beflockung-Preis</th>
                    <th>Preis</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items && Object.keys(this.state.items).length > 0
                    ? Object.keys(this.state.items).map((key) =>
                        <tr key={key} data-id={this.state.items[key].id} data-name={this.state.items[key].name}>
                          <td>{key}</td>
                          <td>{this.state.items[key].name}</td>
                          <td>{this.state.items[key].internalid}</td>
                          <td>
                          {this.state.items[key].pricegroups.length > 0
                          ? <FormControl componentClass="select" value={this.state.items[key].size} onChange={this.onItemSizeChange.bind(this, key)}>
                              {this.state.items[key].pricegroups.map((pricegroup, i) =>
                                pricegroup.sizes.map((size, ii) =>
                                  <option key={ii} value={size}>{size}</option>
                                )
                              )}
                            </FormControl>
                          : this.state.items[key].size}
                          </td>
                          <td><FormControl type="text" value={this.state.items[key].flocking} onChange={this.onItemFlockingChange.bind(this, key)} /></td>
                          <td><FormPriceInput enabled={this.state.items[key].flocking && this.state.items[key].flocking.length > 0} placeholder="0,00 €" value={parseFloat(this.state.items[key].flockingPrice)} onValueChange={this.onItemFlockingPriceChange.bind(this, key)} /></td>
                          <td><FormPriceInput value={parseFloat(this.state.items[key].price)} onValueChange={this.onItemPriceChange.bind(this, key)} /></td>
                          <td className="status">
                            <FormControl componentClass="select" value={this.state.items[key].status} onChange={this.onItemStatusChange.bind(this, key)}>
                              {Object.keys(Statics.ItemStatus).map((key, i) =>
                              <option key={i} value={key}>{Statics.ItemStatus[key]}</option>)}
                            </FormControl>
                          </td>
                          <td className="buttons">
                            <ButtonToolbar>
                              <Button bsStyle="success" bsSize="small" onClick={this.onItemStatusUp.bind(this, key)} disabled={this.state.items[key].status>=3}><Glyphicon glyph="arrow-up" /> Status erhöhen</Button>
                              {/*<Button bsStyle="danger" bsSize="small" onClick=this.onItemRemoveClick.bind(this, key)><Glyphicon glyph="remove" /> Entfernen</Button>*/}
                            </ButtonToolbar>
                          </td>
                        </tr>
                  ) : <tr className="no-data"><td colSpan="9">Keine Positionen vorhanden</td></tr>}
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

export default OrderEditing;
