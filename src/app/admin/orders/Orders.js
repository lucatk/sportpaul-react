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
import {Helmet} from "react-helmet";

import LoadingOverlay from '../../utils/LoadingOverlay';
import PopupModal from '../../utils/PopupModal';
import OrdersTable from './OrdersTable';
import OrdersExportModal from './OrdersExportModal';

import * as Statics from '../../utils/Statics';

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
      showOrdersExportModal: false,
      scopeOrdersExportModal: null,
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

    if(this.props.params["club"]) {
      this.state.filterClub = parseInt(this.props.params["club"]);
      this.loadClubProducts(this.state.filterClub);
    }

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.openOrdersExportModal = this.openOrdersExportModal.bind(this);
    this.closeOrdersExportModal = this.closeOrdersExportModal.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.onFilterClubChange = this.onFilterClubChange.bind(this);
    this.onFilterDateModifierChange = this.onFilterDateModifierChange.bind(this);
    this.onFilterDateChange = this.onFilterDateChange.bind(this);
    this.onFilterCustomerChange = this.onFilterCustomerChange.bind(this);
    this.onFilterStatusChange = this.onFilterStatusChange.bind(this);
    this.onFilterProductChange = this.onFilterProductChange.bind(this);
    this.onSortingScopeChanged = this.onSortingScopeChanged.bind(this);
    this.onOrderExportCheckChange = this.onOrderExportCheckChange.bind(this);
    this.onClickExport = this.onClickExport.bind(this);
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
        if(toLoad > 0) {
          orders.forEach((order, key) => {
            $.post({
              url: 'php/items/load.php',
              data: {
                orderid: order.id,
                clubid: order.clubid
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
        } else {
          this.setState({
            orders: [],
            loadedOrders: true,
            loading: false
          });
        }
      }.bind(this)
    });
    $.post({
      url: 'php/settings/load.php',
      data: {
        name: "general_exportcombineclubs"
      },
      success: function(data) {
        this.combineClubs = (JSON.parse(data)["export_combineclubs"] == "1");
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
  onOrderExportCheckChange(clubid, id) {
    var newOrders = this.state.orders;
    for(var i in newOrders) {
      if(newOrders[i].clubid == clubid && newOrders[i].id == id && newOrders[i].status >= 1) {
        newOrders[i].export = !newOrders[i].export;
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
  onSortingScopeChanged(scope) {
    if(this.state.sorting == scope) {
      if(this.state.sortingMode === 'asc') {
        this.setState({sortingMode: 'desc'});
      } else {
        this.setState({sorting: '', sortingMode: ''});
      }
     } else {
      this.setState({sorting: scope, sortingMode: 'asc'});
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
          // parsedProducts[i].defaultFlocking = parsedProducts[i].defaultFlocking == 1;
        }

        this.setState({
          selectedClubProducts: parsedProducts
        });
      }.bind(this)
    });
  }
  openOrdersExportModal() {
    this.setState({
      showOrdersExportModal: true,
      scopeOrdersExportModal: this.state.orders.filter(o => o.export)
    });
  }
  closeOrdersExportModal(answer) {
    this.setState({
      showOrdersExportModal: false,
      scopeOrdersExportModal: null
    });
    if(answer) {
      this.setState({loading: true});

      var toExport = {};
      var toExportCount = 0;
      var hasOrderedArticles = false;
      answer.data.forEach((order) => {
        var exports = toExport[order.clubid];
        if(!exports) exports = [];
        exports.push(order.id);
        toExport[order.clubid] = exports;
        toExportCount++;

        if(!hasOrderedArticles) {
          for(var i in order.items) {
            if(order.items[i].status >= 0) {
              hasOrderedArticles = true;
              break;
            }
          }
        }
      });

      var columns = Object.keys(answer.columns).filter(c => answer.columns[c]);
      if(answer.exportMode === 0) {
        var clubStrings = [];
        Object.keys(toExport).forEach((key) => {
          clubStrings.push(key + ":" + toExport[key].join(","));
        });
        window.open("php/orders/csv.php?columns=" + columns.join(",") + "&columnnames=" + columns.map(c => Statics.ExportColumns[c]).join(",") + "&multipleclubs=1&request=" + clubStrings.join(";") + "&skipordered=" + (answer.skipOrdered ? 1 : 0));
      } else {
        Object.keys(toExport).forEach((key) => {
          window.open("php/orders/csv.php?columns=" + columns.join(",") + "&columnnames=" + columns.map(c => Statics.ExportColumns[c]).join(",") + "&clubid=" + key + "&request=" + toExport[key].join(",") + "&skipordered=" + (answer.skipOrdered ? 1 : 0));
        });
      }

      var toUpdateOrders = [];
      var toUpdateItems = [];
      this.state.orders.forEach((order) => {
        if(toExport[order.clubid] != undefined && toExport[order.clubid].includes(order.id)) {
          if(order.status < 2)
            toUpdateOrders.push({clubid: order.clubid, id: order.id});
          Object.values(order.items).forEach((item) => {
            if(item.status < 0)
              toUpdateItems.push({clubid: order.clubid, orderid: order.id, id: item.id});
          });
        }
      });

      if(toUpdateOrders.length > 0 || toUpdateItems.length > 0) {
        this.popupModal.showModal("Bestellungen exportieren...", "Es wurden " + toExportCount + " Bestellungen exportiert. " + toUpdateOrders.length + " dieser Bestellung(en) und " + toUpdateItems.length + " Artikel werden nun auf den Status " + Statics.OrderStatus[2] + " gesetzt. Fortfahren?", (ans) => {
          if(ans) {
            var doneOrders = false;
            var doneItems = false;
            var done = (() => {
              if(doneOrders && doneItems)
                this.loadOrders();
            }).bind(this);
            var ordersData = new FormData();
            ordersData.append("data", JSON.stringify(toUpdateOrders));
            ordersData.append("status", "2");
            $.post({
              url: 'php/orders/bulk_status.php',
              contentType: false,
              processData: false,
              data: ordersData,
              success: function(data) {
                doneOrders = true;
                done();
              }.bind(this)
            });
            var itemsData = new FormData();
            itemsData.append("data", JSON.stringify(toUpdateItems));
            itemsData.append("status", "0");
            $.post({
              url: 'php/items/bulk_status.php',
              contentType: false,
              processData: false,
              data: itemsData,
              success: function(data) {
                doneItems = true;
                done();
              }.bind(this)
            });
          } else {
            this.setState({loading:false});
            this.uncheckAll();
          }
        }, "Ja", "Nein");
      } else {
        this.setState({loading:false});
        this.uncheckAll();
      }
    }
  }
  onClickExport() {
    this.setState({loading: true});

    var toExport = {};
    var toExportCount = 0;
    var hasOrderedArticles = false;
    this.state.orders.forEach((order) => {
      if(order.export) {
        var exports = toExport[order.clubid];
        if(!exports) exports = [];
        exports.push(order.id);
        toExport[order.clubid] = exports;
        toExportCount++;

        if(!hasOrderedArticles) {
          for(var i in order.items) {
            if(order.items[i].status >= 0) {
              hasOrderedArticles = true;
              break;
            }
          }
        }
      }
    });

    var skipOrdered = false;
    var onAnswer = () => {
      if(this.combineClubs) {
        var clubStrings = [];
        Object.keys(toExport).forEach((key) => {
          clubStrings.push(key + ":" + toExport[key].join(","));
        });
        window.open("php/orders/csv.php?multipleclubs=1&request=" + clubStrings.join(";") + "&skipordered=" + (skipOrdered ? 1 : 0));
      } else {
        Object.keys(toExport).forEach((key) => {
          window.open("php/orders/csv.php?clubid=" + key + "&request=" + toExport[key].join(",") + "&skipordered=" + (skipOrdered ? 1 : 0));
        });
      }

      var toUpdateOrders = [];
      var toUpdateItems = [];
      this.state.orders.forEach((order) => {
        if(toExport[order.clubid] != undefined && toExport[order.clubid].includes(order.id)) {
          if(order.status < 2)
            toUpdateOrders.push({clubid: order.clubid, id: order.id});
          Object.values(order.items).forEach((item) => {
            if(item.status < 0)
              toUpdateItems.push({clubid: order.clubid, orderid: order.id, id: item.id});
          });
        }
      });

      if(toUpdateOrders.length > 0 || toUpdateItems.length > 0) {
        this.popupModal.showModal("Bestellungen exportieren...", "Es wurden " + toExportCount + " Bestellungen exportiert. " + toUpdateOrders.length + " dieser Bestellung(en) und " + toUpdateItems.length + " Artikel werden nun auf den Status " + Statics.OrderStatus[2] + " gesetzt. Fortfahren?", (answer) => {
          if(answer) {
            var doneOrders = false;
            var doneItems = false;
            var done = (() => {
              if(doneOrders && doneItems)
                this.loadOrders();
            }).bind(this);
            var ordersData = new FormData();
            ordersData.append("data", JSON.stringify(toUpdateOrders));
            ordersData.append("status", "2");
            $.post({
              url: 'php/orders/bulk_status.php',
              contentType: false,
              processData: false,
              data: ordersData,
              success: function(data) {
                doneOrders = true;
                done();
              }.bind(this)
            });
            var itemsData = new FormData();
            itemsData.append("data", JSON.stringify(toUpdateItems));
            itemsData.append("status", "0");
            $.post({
              url: 'php/items/bulk_status.php',
              contentType: false,
              processData: false,
              data: itemsData,
              success: function(data) {
                doneItems = true;
                done();
              }.bind(this)
            });
          } else {
            this.setState({loading:false});
            this.uncheckAll();
          }
        }, "Ja", "Nein");
      } else {
        this.setState({loading:false});
        this.uncheckAll();
      }
    };

    if(hasOrderedArticles) {
      this.popupModal.showModal("Bestellungen exportieren...", "Dieser Exportvorgang enthält Bestellungen mit Artikeln, die bereits den Status " + Statics.ItemStatus[0] + " besitzen. Sollen diese Artikel übersprungen werden?", (answer) => {
        skipOrdered = answer;
        onAnswer();
      }, "Ja, bereits bestellte Artikel überspringen", "Nein, nicht überspringen");
    } else {
      onAnswer();
    }
  }
  uncheckAll() {
    var newOrders = this.state.orders;
    this.state.orders.forEach((order, i) => {
      newOrders[i].export = false;
    });
    this.setState({orders: newOrders});
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.children) {
      this.loadOrders();
    }
    if(nextProps.params["club"]) {
      this.setState({filterClub:parseInt(nextProps.params["club"])});
    }
  }
  render() {
    var toExport = 0;
    this.state.orders.forEach((order) => {
      if(order.export) toExport++;
    });
    return (
      <div>
        <Helmet>
          <title>Bestellungen | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        {!this.props.children && <div className="container" data-page="Orders">
          <PopupModal ref={(ref) => {this.popupModal = ref;}} />
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
                onSortingScopeChanged={this.onSortingScopeChanged}
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

          <Button bsSize="small" bsStyle="success" onClick={this.openOrdersExportModal} disabled={toExport < 1}><Glyphicon glyph="save" /> Exportieren...</Button>
          <OrdersExportModal show={this.state.showOrdersExportModal} scope={this.state.scopeOrdersExportModal} onClose={this.closeOrdersExportModal} />
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Orders;
