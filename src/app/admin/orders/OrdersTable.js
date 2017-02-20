import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  FormControl,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class OrdersTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterClub: '',
      filterID: '',
      filterCustomer: '',
      filterStatus: ''
    };

    this.onExportCheckCellClick = this.onExportCheckCellClick.bind(this);
    this.onFilterClubChange = this.onFilterClubChange.bind(this);
    this.onFilterIDChange = this.onFilterIDChange.bind(this);
    this.onFilterCustomerChange = this.onFilterCustomerChange.bind(this);
    this.onFilterStatusChange = this.onFilterStatusChange.bind(this);
  }
  onExportCheckCellClick(e) {
    e.target.querySelector("input").checked = !e.target.querySelector("input").checked;
  }
  onFilterClubChange(e) {
    if(e.target.value == "Filter...") {
      this.setState({filterClub: ""});
    } else {
      this.setState({filterClub: e.target.value});
    }
  }
  onFilterIDChange(e) {
    this.setState({filterID: e.target.value});
  }
  onFilterCustomerChange(e) {
    this.setState({filterCustomer: e.target.value});
  }
  onFilterStatusChange(e) {
    if(e.target.value == "Filter...") {
      this.setState({filterStatus: ""});
    } else {
      this.setState({filterStatus: e.target.value});
    }
  }
  render() {
    var data = this.props.data;

    var clubNames = [];
    data.forEach((row) => {
      if(row.clubname && !clubNames.includes(row.clubname)) {
        clubNames.push(row.clubname);
      }
    });

    var orderStatuses = [];
    for(var i in Statics.OrderStatus) {
      orderStatuses.push({
        key: i,
        status: Statics.OrderStatus[i]
      });
    }

    if(this.state.filterClub.length > 0 || this.state.filterID.length > 0 || this.state.filterCustomer.length > 0 || this.state.filterStatus.length > 0) {
      data = data.filter(function(value) {
        var matcher;
        if(this.state.filterClub.length > 0) {
          matcher = new RegExp(".*" + this.state.filterClub.replace("*", ".*") + ".*", "i");
          if(!matcher.test(value.clubname)) return false;
        }
        if(this.state.filterID.length > 0) {
          matcher = new RegExp(".*" + this.state.filterID.replace("*", ".*") + ".*", "i");
          if(!matcher.test(value.id)) return false;
        }
        if(this.state.filterCustomer.length > 0) {
          matcher = new RegExp(".*" + this.state.filterCustomer.replace("*", ".*") + ".*", "i");
          if(!matcher.test(value.firstname + " " + value.lastname)) return false;
        }
        if(this.state.filterStatus.length > 0) {
          matcher = new RegExp(this.state.filterStatus, "i");
          if(!matcher.test(value.status)) return false;
        }

        return true;
      }.bind(this));
    }

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Verein</th>
            <th>#</th>
            <th>Kunde</th>
            <th>Positionen</th>
            <th>Gesamt</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="filter-row">
            <td className="export-check"></td>
            <td className="club">
              <FormControl componentClass="select" value={this.state.filterClub} placeholder="Filter..." onChange={this.onFilterClubChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {clubNames.map((name, i) =>
                <option key={i} value={name}>{name}</option>)}
              </FormControl>
            </td>
            <td className="id"><FormControl type="text" value={this.state.filterID} placeholder="Filter..." onChange={this.onFilterIDChange} /></td>
            <td className="customer"><FormControl type="text" value={this.state.filterCustomer} placeholder="Filter..." onChange={this.onFilterCustomerChange} /></td>
            <td></td>
            <td></td>
            <td className="status">
              <FormControl componentClass="select" value={this.state.filterStatus} placeholder="Filter..." onChange={this.onFilterStatusChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {orderStatuses.map((value, i) =>
                <option key={i} value={value.key}>{value.status}</option>)}
              </FormControl>
            </td>
            <td className="buttons"></td>
          </tr>
          {data && data.length > 0
            ? data.map((row) =>
                <tr key={row.clubid + "/" + row.id} data-id={row.id} data-clubid={row.clubid} data-club={row.clubname}>
                  <td className="export-check" onClick={this.onExportCheckCellClick}><input type="checkbox" value="" /></td>
                  <td>{row.clubname}</td>
                  <td>{row.id}</td>
                  <td>{row.firstname} {row.lastname}</td>
                  <td>{row.itemCount} Position{row.itemCount==1?'':'en'}</td>
                  <td>{row.total.toFixed(2).replace(".", ",")} €</td>
                  <td>{Statics.OrderStatus[row.status]}</td>
                  <td className="buttons">
                    <ButtonToolbar>
                      <Link to={"/admin/orders/view/" + row.clubid + "/" + row.id}><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>
                      <Button bsStyle="danger" bsSize="small" onClick={this.props.onRemove}><Glyphicon glyph="remove" /> Löschen</Button>
                    </ButtonToolbar>
                  </td>
                </tr>
          ) : <tr className="no-data"><td colSpan="8">Keine Bestellungen vorhanden</td></tr>}
        </tbody>
      </Table>
    )
  }
}

export default OrdersTable;
