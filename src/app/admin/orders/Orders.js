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
import json2csv from 'json2csv';

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
      loading: true,
      filterClub: -1,
      filterDateModifier: '',
      filterDate: '',
      filterCustomer: '',
      filterStatus: ''
    };

    this.loadOrders();

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.onFilterClubChange = this.onFilterClubChange.bind(this);
    this.onFilterDateChange = this.onFilterDateChange.bind(this);
    this.onFilterCustomerChange = this.onFilterCustomerChange.bind(this);
    this.onFilterStatusChange = this.onFilterStatusChange.bind(this);
    this.onOrderExportCheckChange = this.onOrderExportCheckChange.bind(this);
  }
  loadOrders() {
    this.setState({loading:true});
    $.ajax({
      url: 'php/orders/load_all.php',
      success: function(data) {
        var orders = JSON.parse(data);
        var toLoad = 0;
        for(var i in orders) {
          toLoad++;
          orders[i].export = false;
        }
        orders.forEach((order, key) => {
          console.log(key, orders[key].id);
          $.post({
            url: 'php/items/load.php',
            data: {
              orderid: orders[key].id,
              clubid: orders[key].clubid
            },
            success: function(data) {
              orders[key].items = JSON.parse(data);
              console.log(key, orders[key].id, orders[key].items);
              toLoad--;

              if(toLoad < 1) {
                this.setState({
                  orders: orders,
                  loadedOrders: true,
                  loading: false
                });
              }
            }.bind(this)
          });
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
  onOrderExportCheckChange(clubid, id, checked) {
    var newOrders = this.state.orders;
    for(var i in newOrders) {
      if(newOrders[i].clubid == clubid && newOrders[i].id == id) {
        newOrders[i].export = checked;
      }
    }
    this.setState({orders:newOrders});
  }
  onFilterClubChange(e) {
    this.setState({filterClub: e});
  }
  onFilterDateChange(mod, e) {
    this.setState({filterDateModifier: mod, filterDate: e});
  }
  onFilterCustomerChange(e) {
    this.setState({filterCustomer: e});
  }
  onFilterStatusChange(e) {
    this.setState({filterStatus: e});
  }
  onClickExport() {

    // TESTING

    var toExport = {};
    for(var i in this.state.orders) {
      if(this.state.orders[i].export) {
        var exports = toExport[this.state.orders[i].clubid];
        if(!exports) exports = [];
        exports.push(this.state.orders[i]);
        toExport[this.state.orders[i].clubid] = exports;
      }
    }
    var fields = ['ID', 'ArtikelNr', ''];
    var myCars = [
      {
        "car": "Audiü",
        "price": 40000,
        "color": "blue"
      }, {
        "car": "BMWß",
        "price": 35000,
        "color": "black"
      }, {
        "car": "Porsche",
        "price": 60000,
        "color": "green"
      }
    ];
    var csv = json2csv({ data: myCars, fields: fields, del: ";" });
    console.log(csv);

    var link = document.createElement('a');
    link.href = "data:text/csv;charset=iso8859-1," + encodeURI(csv);
    link.download = "export_.csv";
    document.body.appendChild(link);
    link.click();

    // var uriContent = "data:application/vnd.openxmlformats," + encodeURIComponent(xls);
    // var newWindow=window.open(uriContent, 'filename.txt');

    // var xls = json2xls(json);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.children) {
      this.loadOrders();
    }
  }
  render() {
    document.title = "Bestellungen | Sport-Paul Vereinsbekleidung";
    return (
      <div>
        {!this.props.children && <div className="container" data-page="Orders">
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">Bestellungen</h1>
          {this.state.loadedOrders &&
            <div>
              <OrdersTable data={this.state.orders} onRemove={this.openRemoveModal} onFilterClubChange={this.onFilterClubChange} onFilterDateChange={this.onFilterDateChange} onFilterCustomerChange={this.onFilterCustomerChange} onFilterStatusChange={this.onFilterStatusChange} onOrderExportCheckChange={this.onOrderExportCheckChange} />

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

          <Button bsSize="small" bsStyle="success" onClick={this.onClickExport}><Glyphicon glyph="save" /> Exportieren</Button>
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Orders;
