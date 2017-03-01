import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Table,
  FormGroup, FormControl,
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';

import LoadingOverlay from '../../utils/LoadingOverlay';
import OrdersTable from './OrdersTable';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      showRemoveModal: false,
      removeModalScope: {
        id: -1,
        clubid: -1,
        club: ''
      },
      loadedOrders: false,
      loading: true
    };

    this.loadOrders();

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
  }
  loadOrders() {
    this.setState({loading:true});
    $.ajax({
      url: 'php/orders/load_all.php',
      success: function(data) {
        this.setState({
          orders: JSON.parse(data),
          loadedOrders: true,
          loading: false
        });
      }.bind(this)
    });
  }
  removeOrder(e) {
    $.post({
      url: 'php/orders/remove.php',
      data: {
        id: this.state.removeModalScope.id,
        clubid: this.state.removeModalScope.clubid
      },
      success: function(data) {
        this.loadOrders();
      }.bind(this)
    });
    this.closeRemoveModal();
  }
  closeRemoveModal() {
    this.setState({
      showRemoveModal: false,
      removeModalScope: {
        id: -1,
        clubid: -1,
        club: ''
      }
    });
  }
  openRemoveModal(e) {
    this.setState({
      showRemoveModal: true,
      removeModalScope: e.target.parentElement.parentElement.parentElement.dataset
    });
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.children) {
      this.loadOrders();
    }
  }
  render() {
    return (
      <div>
        {!this.props.children && <div className="container" data-page="Orders">
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">Bestellungen</h1>
          {this.state.loadedOrders &&
            <div>
              <OrdersTable data={this.state.orders} onRemove={this.openRemoveModal} />

              <Modal show={this.state.showRemoveModal} onHide={this.closeRemoveModal} data-scope={this.state.removeModalScope.id}>
                <Modal.Header closeButton>
                  <Modal.Title>Bestellung löschen...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Möchten Sie die Bestellung mit der ID {this.state.removeModalScope.id} beim Verein mit der ID {this.state.removeModalScope.clubid} unwiderruflich löschen?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeRemoveModal}>Abbrechen</Button>
                  <Button bsStyle="danger" onClick={this.removeOrder}>Löschen</Button>
                </Modal.Footer>
              </Modal>
            </div>}
          {(!this.state.loadedOrders && !this.state.loading) && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}

          <Button bsSize="small" bsStyle="success"><Glyphicon glyph="save" /> Exportieren</Button>
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Orders;
