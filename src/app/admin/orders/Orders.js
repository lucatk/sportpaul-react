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
      filterStatus: '',
      filterProduct: -1,
      sorting: '',
      sortingMode: '',
      selectedClubProducts: null
    };

    this.loadOrders();

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.onFilterClubChange = this.onFilterClubChange.bind(this);
    this.onFilterDateModifierChange = this.onFilterDateModifierChange.bind(this);
    this.onFilterDateChange = this.onFilterDateChange.bind(this);
    this.onFilterCustomerChange = this.onFilterCustomerChange.bind(this);
    this.onFilterStatusChange = this.onFilterStatusChange.bind(this);
    this.onFilterProductChange = this.onFilterProductChange.bind(this);
    this.onSortingClubClicked = this.onSortingClubClicked.bind(this);
    this.onSortingDateClicked = this.onSortingDateClicked.bind(this);
    this.onSortingCustomerClicked = this.onSortingCustomerClicked.bind(this);
    this.onSortingAmountItemsClicked = this.onSortingAmountItemsClicked.bind(this);
    this.onSortingTotalClicked = this.onSortingTotalClicked.bind(this);
    this.onSortingStatusClicked = this.onSortingStatusClicked.bind(this);
    this.onOrderExportCheckChange = this.onOrderExportCheckChange.bind(this);
  }
  loadOrders() {
    this.setState({loading:true});
    $.ajax({
      url: 'php/orders/load_all.php',
      success: function(data) {
        console.log(data);
        var orders = JSON.parse(data);
        var toLoad = 0;
        for(var i in orders) {
          toLoad++;
          orders[i].export = false;
        }
        orders.forEach((order, key) => {
          $.post({
            url: 'php/items/load.php',
            data: {
              orderid: orders[key].id,
              clubid: orders[key].clubid
            },
            success: function(data) {
              orders[key].items = JSON.parse(data);
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
    if(e.target.value.length < 1) {
      this.setState({filterClub: -1, selectedClubProducts: null, filterProduct: -1});
    } else {
      var clubid = parseInt(e.target.value);
      this.setState({filterClub: clubid, selectedClubProducts: null, filterProduct: -1});

      this.loadClubProducts(clubid);
    }
  }
  onFilterDateChange(e) {
    this.setState({filterDate: e.target.value});
  }
  onFilterDateModifierChange(e) {
    this.setState({filterDateModifier: e.target.value});
  }
  onFilterCustomerChange(e) {
    this.setState({filterCustomer: e.target.value});
  }
  onFilterStatusChange(e) {
    if(e.target.value.length < 1) {
      this.setState({filterStatus: ""});
    } else {
      this.setState({filterStatus: e.target.value});
    }
  }
  onFilterProductChange(e) {
    if(e.target.value.length < 1) {
      this.setState({filterProduct: -1});
    } else {
      var productid = parseInt(e.target.value);
      this.setState({filterProduct: productid});
    }
  }
  onSortingClubClicked(e) {
    if(this.state.sorting === 'club') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'club', sortingMode: 'asc'});
    }
  }
  onSortingDateClicked(e) {
    if(this.state.sorting === 'date') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'date', sortingMode: 'asc'});
    }
  }
  onSortingCustomerClicked(e) {
    if(this.state.sorting === 'customer') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'customer', sortingMode: 'asc'});
    }
  }
  onSortingAmountItemsClicked(e) {
    if(this.state.sorting === 'amitems') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'amitems', sortingMode: 'asc'});
    }
  }
  onSortingTotalClicked(e) {
    if(this.state.sorting === 'total') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'total', sortingMode: 'asc'});
    }
  }
  onSortingStatusClicked(e) {
    if(this.state.sorting === 'status') {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
    } else {
      this.setState({sorting: 'status', sortingMode: 'asc'});
    }
  }
  loadClubProducts(clubid) {
    $.post({
      url: 'php/products/load.php',
      data: {
        id: clubid
      },
      success: function(data) {
        var products = JSON.parse(data);
        var parsedProducts = [];
        for(var i in products) {
          parsedProducts[i] = products[i];
          parsedProducts[i].defaultFlocking = parsedProducts[i].defaultFlocking == 1;
        }

        this.setState({
          selectedClubProducts: parsedProducts
        });
      }.bind(this)
    });
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
              <OrdersTable data={this.state.orders}
                filterClub={this.state.filterClub}
                filterDateModifier={this.state.filterDateModifier}
                filterDate={this.state.filterDate}
                filterCustomer={this.state.filterCustomer}
                filterStatus={this.state.filterStatus}
                filterProduct={this.state.filterProduct}
                selectedClubProducts={this.state.selectedClubProducts}
                sorting={this.state.sorting}
                sortingMode={this.state.sortingMode}
                onFilterClubChange={this.onFilterClubChange}
                onFilterDateModifierChange={this.onFilterDateModifierChange}
                onFilterDateChange={this.onFilterDateChange}
                onFilterCustomerChange={this.onFilterCustomerChange}
                onFilterStatusChange={this.onFilterStatusChange}
                onFilterProductChange={this.onFilterProductChange}
                onSortingClubClicked={this.onSortingClubClicked}
                onSortingDateClicked={this.onSortingDateClicked}
                onSortingCustomerClicked={this.onSortingCustomerClicked}
                onSortingAmountItemsClicked={this.onSortingAmountItemsClicked}
                onSortingTotalClicked={this.onSortingTotalClicked}
                onSortingStatusClicked={this.onSortingStatusClicked}
                onExportCheckChange={this.onOrderExportCheckChange}
                onRemove={this.openRemoveModal} />

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
