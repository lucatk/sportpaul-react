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

class CustomerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      clubid: -1,
      clubname: '',
      firstname: '',
      lastname: '',
      address: '',
      postcode: '',
      town: '',
      email: '',
      phone: '',
      ordersAmount: '',
      loading: true
    }

    this.componentWillReceiveProps(this.props);

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.removeCustomer = this.removeCustomer.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true
    });
    $.post({
      url: 'php/customers/load.php',
      data: {
        id: nextProps.params.customerid
      },
      success: function(data) {
        var parsed = JSON.parse(data);
        this.setState({
          ...parsed,
          loading: false
        });
      }.bind(this)
    });
  }
  removeCustomer(e) {
    $.post({
      url: 'php/customers/remove.php',
      data: {
        id: this.state.id
      },
      success: function(data) {
        this.props.router.push("/admin/customers");
      }.bind(this)
    });
    this.closeRemoveModal();
  }
  closeRemoveModal() {
    this.setState({
      showRemoveModal: false
    });
  }
  openRemoveModal(e) {
    this.setState({
      showRemoveModal: true
    });
  }
  render() {
    return (
      <div className="container" data-page="CustomerView">
        <Helmet>
          <title>{"ID: " + this.state.id + " | Kunden-Details | Sport-Paul Vereinsbekleidung"}</title>
        </Helmet>
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Kunde: Details
          <small> ID: {this.state.id}</small>
          <Link to={"/admin/customers/edit/" + this.state.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
          <Button bsSize="small" bsStyle="danger" onClick={this.openRemoveModal}><Glyphicon glyph="trash" /> Löschen</Button>
          <Link to="/admin/customers"><Button bsSize="small"><Glyphicon bsClass="flipped glyphicon" glyph="share-alt" /> Zurück</Button></Link>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11"><Link to={"/admin/customers/club/" + this.state.clubid}>{this.state.clubname} <span className="text-muted">(ID: {this.state.clubid})</span></Link></ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputCustomerInfo">
            <ControlLabel bsClass="col-sm-1 control-label">Kundendaten</ControlLabel>
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
          <FormGroup controlId="inputOrdersAmount">
            <ControlLabel bsClass="col-sm-1 control-label">Anzahl Bestellungen</ControlLabel>
            <ControlLabel bsClass="col-sm-11"><Link to={"/admin/orders/customer/" + this.state.id}>{this.state.ordersAmount} aufgegebene Bestellungen</Link></ControlLabel>
          </FormGroup>
        </form>

        <Modal show={this.state.showRemoveModal} onHide={this.closeRemoveModal}>
          <Modal.Header closeButton>
            <Modal.Title>Kunde löschen...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Möchten Sie den Kunden "{this.state.firstname} {this.state.lastname}", beim Verein "{this.state.clubname}", und seine Daten unwiderruflich löschen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeRemoveModal}>Abbrechen</Button>
            <Button bsStyle="danger" onClick={this.removeCustomer}>Löschen</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CustomerView;
