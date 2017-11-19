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
import CustomersTable from './CustomersTable';
import CustomersExportModal from './CustomersExportModal';
import CustomersContactModal from './CustomersContactModal';

import * as Statics from '../../utils/Statics';

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      showCustomersExportModal: false,
      scopeCustomersExportModal: null,
      showCustomersContactModal: false,
      scopeCustomersContactModal: null,
      loadedCustomers: false,
      loading: true,
      filterClub: -1,
      filterFirstname: '',
      filterLastname: '',
      filterPostcode: '',
      filterTown: '',
      sorting: '',
      sortingMode: ''
    };
    if(this.props.params["club"]) {
      this.state.filterClub = parseInt(this.props.params["club"]);
    }

    this.loadCustomers();

    this.openExportModal = this.openExportModal.bind(this);
    this.closeExportModal = this.closeExportModal.bind(this);
    this.openContactModal = this.openContactModal.bind(this);
    this.closeContactModal = this.closeContactModal.bind(this);
    this.onFilterClubChange = this.onFilterClubChange.bind(this);
    this.onFilterFirstnameChange = this.onFilterFirstnameChange.bind(this);
    this.onFilterLastnameChange = this.onFilterLastnameChange.bind(this);
    this.onFilterPostcodeChange = this.onFilterPostcodeChange.bind(this);
    this.onFilterTownChange = this.onFilterTownChange.bind(this);
    this.onSortingScopeChanged = this.onSortingScopeChanged.bind(this);
    this.onCustomerActionCheckChange = this.onCustomerActionCheckChange.bind(this);
    this.onCustomerActionCheckAll = this.onCustomerActionCheckAll.bind(this);
  }
  loadCustomers() {
    this.setState({loading:true});
    $.ajax({
      url: 'php/customers/load_all.php',
      success: function(data) {
        var customers = JSON.parse(data);
        this.setState({
          customers: customers,
          loadedCustomers: true,
          loading: false
        });
      }.bind(this)
    });
  }
  onCustomerActionCheckChange(id) {
    var newCustomers = this.state.customers;
    for(var i in newCustomers) {
      if(newCustomers[i].id == id) {
        newCustomers[i].check = !newCustomers[i].check;
      }
    }
    this.setState({customers:newCustomers});
  }
  onCustomerActionCheckAll(e) {
    var newCustomers = this.state.customers;
    var filtered = newCustomers;
    if(this.state.filterClub !== -1 || this.state.filterFirstname.length > 0 || this.state.filterLastname.length > 0 || this.state.filterPostcode.length > 0 || this.state.filterTown.length > 0) {
      filtered = newCustomers.filter(function(value) {
        var matcher;
        if(this.state.filterClub !== -1) {
          if(this.state.filterClub != value.clubid) return false;
        }
        if(this.state.filterFirstname.length > 0) {
          matcher = new RegExp(".*" + this.state.filterFirstname.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.firstname)) return false;
        }
        if(this.state.filterLastname.length > 0) {
          matcher = new RegExp(".*" + this.state.filterLastname.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.lastname)) return false;
        }
        if(this.state.filterPostcode.length > 0) {
          matcher = new RegExp(".*" + this.state.filterPostcode.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.postcode)) return false;
        }
        if(this.state.filterTown.length > 0) {
          matcher = new RegExp(".*" + this.state.filterTown.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.town)) return false;
        }

        return true;
      }.bind(this));
    }
    var allChecked = true;
    for(var i in filtered) {
      if(!newCustomers[i].check) allChecked = false;
      newCustomers[i].check = e.target.checked;
    }
    if(allChecked) {
      for(var i in newCustomers) {
        newCustomers[i].check = false;
      }
    }
    this.setState({customers:newCustomers});
  }
  onFilterClubChange(e) {
    if(e.target.value.length < 1) {
      this.setState({filterClub: -1});
    } else {
      var clubid = parseInt(e.target.value);
      this.setState({filterClub: clubid});
    }
  }
  onFilterFirstnameChange(e) {
    this.setState({filterFirstname: e.target.value});
  }
  onFilterLastnameChange(e) {
    this.setState({filterLastname: e.target.value});
  }
  onFilterPostcodeChange(e) {
    this.setState({filterPostcode: e.target.value});
  }
  onFilterTownChange(e) {
    this.setState({filterTown: e.target.value});
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
  openExportModal() {
    this.setState({
      showCustomersExportModal: true,
      scopeCustomersExportModal: this.state.customers.filter(c => c.check)
    });
  }
  closeExportModal(answer) {
    this.setState({
      showCustomersExportModal: false,
      scopeCustomersExportModal: null
    });
    if(answer) {
      this.setState({loading: true});

      var toExport = {};
      var toExportCount = 0;
      answer.data.forEach((customer) => {
        var exports = toExport[customer.clubid];
        if(!exports) exports = [];
        exports.push(customer.id);
        toExport[customer.clubid] = exports;
        toExportCount++;
      });

      var columns = Object.keys(answer.columns).filter(c => answer.columns[c]);
      if(answer.exportMode === 0) {
        var clubStrings = [];
        Object.keys(toExport).forEach((key) => {
          clubStrings.push(key + ":" + toExport[key].join(","));
        });
        window.open("php/customers/csv.php?columns=" + columns.join(",") + "&columnnames=" + columns.map(c => Statics.CustomersExportColumns[c]).join(",") + "&multipleclubs=1&request=" + clubStrings.join(";"));
      } else {
        Object.keys(toExport).forEach((key) => {
          window.open("php/customers/csv.php?columns=" + columns.join(",") + "&columnnames=" + columns.map(c => Statics.CustomersExportColumns[c]).join(",") + "&clubid=" + key + "&request=" + toExport[key].join(","));
        });
      }

      this.setState({loading:false});
      this.uncheckAll();
    }
  }
  openContactModal() {
    this.setState({
      showCustomersContactModal: true,
      scopeCustomersContactModal: this.state.customers.filter(c => c.check)
    });
  }
  closeContactModal(answer) {
    this.setState({
      showCustomersContactModal: false,
      scopeCustomersContactModal: null
    });
    if(answer) {
      this.setState({loading: true});

      var data = new FormData();
      data.append("customers", JSON.stringify(answer.data));
      var subject = answer.inputSubject;
      var text = answer.inputText;
      Object.keys(Statics.CustomersContactTextPresets).forEach((key) => {
        subject = subject.replace("[" + Statics.CustomersContactTextPresets[key] + "]", "%" + key + "%");
        text = text.replace("[" + Statics.CustomersContactTextPresets[key] + "]", "%" + key + "%");
      });
      data.append("subject", subject);
      data.append("text", text);
      data.append("template", "customercontact");
      $.post({
        url: 'php/mailing/broadcast_message.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          var result = JSON.parse(data);
          this.popupModal.showModal("Nachricht versendet!", result.sent + " E-Mail(s) wurde(n) verschickt, es sind " + result.errors + " Fehler aufgetreten!", null, null, "Ok");

          this.setState({loading:false});
          this.uncheckAll();
        }.bind(this)
      });
    }
  }
  uncheckAll() {
    var newCustomers = this.state.customers;
    this.state.customers.forEach((customer, i) => {
      newCustomers[i].check = false;
    });
    this.setState({customers: newCustomers});
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.children) {
      this.loadCustomers();
    }
    if(nextProps.params["club"]) {
      this.setState({filterClub:parseInt(nextProps.params["club"])});
    }
  }
  render() {
    var checked = 0;
    this.state.customers.forEach((customer) => {
      if(customer.check) checked++;
    });
    return (
      <div>
        <Helmet>
          <title>Kunden | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        {!this.props.children && <div className="container" data-page="Customers">
          <PopupModal ref={(ref) => {this.popupModal = ref;}} />
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">Kunden</h1>
          {this.state.loadedCustomers &&
            <div>
              <CustomersTable data={this.state.customers}
                filterClub={this.state.filterClub}
                filterFirstname={this.state.filterFirstname}
                filterLastname={this.state.filterLastname}
                filterPostcode={this.state.filterPostcode}
                filterTown={this.state.filterTown}
                sorting={this.state.sorting}
                sortingMode={this.state.sortingMode}
                onFilterClubChange={this.onFilterClubChange}
                onFilterFirstnameChange={this.onFilterFirstnameChange}
                onFilterLastnameChange={this.onFilterLastnameChange}
                onFilterPostcodeChange={this.onFilterPostcodeChange}
                onFilterTownChange={this.onFilterTownChange}
                onSortingScopeChanged={this.onSortingScopeChanged}
                onActionCheckChange={this.onCustomerActionCheckChange}
                onActionCheckAll={this.onCustomerActionCheckAll} />
            </div>}
          {(!this.state.loadedCustomers && !this.state.loading) && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}

          <Button bsSize="small" bsStyle="success" onClick={this.openExportModal} disabled={checked < 1}><Glyphicon glyph="save" /> Exportieren...</Button>
          <Button bsSize="small" bsStyle="success" onClick={this.openContactModal} disabled={checked < 1}><Glyphicon glyph="envelope" /> Kontaktieren...</Button>

          <CustomersExportModal show={this.state.showCustomersExportModal} scope={this.state.scopeCustomersExportModal} onClose={this.closeExportModal} />
          <CustomersContactModal show={this.state.showCustomersContactModal} scope={this.state.scopeCustomersContactModal} onClose={this.closeContactModal} />
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Customers;
