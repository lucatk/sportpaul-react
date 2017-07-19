import React, { Component } from 'react';
import $ from 'jquery';

import { Link } from 'react-router';
import {
  Table,
  FormControl,
  ButtonToolbar, Button,
  Glyphicon,
  Row, Col
} from 'react-bootstrap';

import * as Statics from "../../utils/Statics";

class OrdersTable extends Component {
  render() {
    var data = this.props.data.slice();
    // console.log(data);

    var clubs = [];
    data.forEach((row) => {
      if(row.clubid && row.clubname && !clubs[row.clubid]) {
        clubs[row.clubid] = row.clubname;
      }
    });

    var orderStatuses = [];
    for(var i in Statics.OrderStatus) {
      orderStatuses.push({
        key: i,
        status: Statics.OrderStatus[i]
      });
    }

    if(this.props.filterClub !== -1 || this.props.filterDate.length > 0 || this.props.filterCustomer.length > 0 || this.props.filterStatus.length > 0 || this.props.filterProduct !== -1) {
      data = data.filter(function(value) {
        var matcher;
        if(this.props.filterClub !== -1) {
          if(this.props.filterClub != value.clubid) return false;
        }
        if(this.props.filterDate.length > 0) {
          var dateMatcher = this.props.filterDate.match(/(\d+)/g);
          var parsedDate = new Date(dateMatcher[2] || new Date().getFullYear(), (dateMatcher[1] || new Date().getMonth()+1) - 1, dateMatcher[0] || 1);
          var createdDate = new Date(value.created);

          switch(this.props.filterDateModifier) {
            case "before":
              if(createdDate.valueOf() >= parsedDate.valueOf()) return false;
              break;
            case "after":
              if(createdDate.valueOf() < parsedDate.valueOf()) return false;
              break;
            case "exact":
              if(new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate()).valueOf() !== parsedDate.valueOf()) return false;
              break;
            default:
              matcher = new RegExp(".*" + this.props.filterDate.replace("*", ".*") + ".*", "i");
              if(!matcher.test(value.created)) return false;
          }
        }
        if(this.props.filterCustomer.length > 0) {
          matcher = new RegExp(".*" + this.props.filterCustomer.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.firstname + " " + value.lastname)) return false;
        }
        if(this.props.filterStatus.length > 0) {
          matcher = new RegExp(this.props.filterStatus, "i");
          if(!matcher.test(value.status)) return false;
        }
        if(this.props.filterProduct !== -1) {
          var found = false;
          for(var o in value.items) {
            if(value.items[o].id == this.props.filterProduct) {
              found = true;
              break;
            }
          }
          if(!found) return false;
        }

        return true;
      }.bind(this));
    }

    if(this.props.sorting.length > 0) {
      data = data.sort((a, b) => {
        var critA = null;
        var critB = null;
        switch(this.props.sorting) {
          case "club":
            if(this.props.sortingMode === "desc") {
              critA = b.clubname.toUpperCase();
              critB = a.clubname.toUpperCase();
            } else {
              critA = a.clubname.toUpperCase();
              critB = b.clubname.toUpperCase();
            }
            break;
          case "date":
            if(this.props.sortingMode === "desc") {
              critA = new Date(b.created).valueOf();
              critB = new Date(a.created).valueOf();
            } else {
              critA = new Date(a.created).valueOf();
              critB = new Date(b.created).valueOf();
            }
            break;
          case "customer":
            if(this.props.sortingMode === "desc") {
              critA = (b.firstname + b.lastname).toUpperCase();
              critB = (a.firstname + a.lastname).toUpperCase();
            } else {
              critA = (a.firstname + a.lastname).toUpperCase();
              critB = (b.firstname + b.lastname).toUpperCase();
            }
            break;
          case "amitems":
            if(this.props.sortingMode === "desc") {
              critA = b.itemCount;
              critB = a.itemCount;
            } else {
              critA = a.itemCount;
              critB = b.itemCount;
            }
            break;
          case "total":
            if(this.props.sortingMode === "desc") {
              critA = parseFloat(b.total);
              critB = parseFloat(a.total);
            } else {
              critA = parseFloat(a.total);
              critB = parseFloat(b.total);
            }
            break;
          case "status":

            break;
          default:
            critA = a.id;
            critB = b.id;
        }

        if(critA < critB) {
          return -1;
        } else if(critA > critB) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th onClick={this.props.onSortingClubClicked}>Verein{this.props.sorting === 'club' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingDateClicked}>Bestelldatum{this.props.sorting === 'date' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingCustomerClicked}>Kunde{this.props.sorting === 'customer' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingAmountItemsClicked}>Positionen{this.props.sorting === 'amitems' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingTotalClicked}>Gesamt{this.props.sorting === 'total' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingStatusClicked}>Status{this.props.sorting === 'status' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="filter-row">
            <td className="export-check"></td>
            <td className="club">
              <FormControl componentClass="select" value={this.props.filterClub} onChange={this.props.onFilterClubChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {clubs.map((name, id) =>
                <option key={id} value={id}>{name}</option>)}
              </FormControl>
            </td>
            <td className="date">
              <Row>
                <Col xs={4}>
                  <FormControl componentClass="select" value={this.props.filterDateModifier} onChange={this.props.onFilterDateModifierChange}>
                    <option value="">Filter...</option>
                    <option value="separator" disabled></option>
                    <option value="before">vor</option>
                    <option value="exact">exakt</option>
                    <option value="after">nach</option>
                  </FormControl>
                </Col>
                <Col xs={8}><FormControl type="text" value={this.props.filterDate} placeholder="Datum..." onChange={this.props.onFilterDateChange} /></Col>
              </Row>
            </td>
            <td className="customer"><FormControl type="text" value={this.props.filterCustomer} placeholder="Filter..." onChange={this.props.onFilterCustomerChange} /></td>
            <td></td>
            <td></td>
            <td className="status">
              <FormControl componentClass="select" value={this.props.filterStatus} onChange={this.props.onFilterStatusChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {orderStatuses.map((value, i) =>
                <option key={i} value={value.key}>{value.status}</option>)}
              </FormControl>
            </td>
            <td className="buttons product">
              <FormControl componentClass="select" value={this.props.filterProduct} onChange={this.props.onFilterProductChange} disabled={this.props.filterClub == -1}>
                {this.props.filterClub != -1 ? [
                  <option value="">Produktsuche...</option>,
                  <option value="separator" disabled></option>,
                  (this.props.selectedClubProducts == null
                  ? <option disabled>Lade Produkte...</option>
                  : this.props.selectedClubProducts.map((product, i) => (
                    <option value={product.id}>{product.name}</option>
                  )))
                ] : [
                  <option value="">Verein auswählen!</option>
                ]}
              </FormControl>
            </td>
          </tr>
          {data && data.length > 0
            ? data.map((row) =>
                <tr key={row.clubid + "/" + row.id} data-id={row.id} data-clubid={row.clubid} data-club={row.clubname} data-export={row.export}>
                  <td className="export-check" onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{row.status >= 1 && <input type="checkbox" checked={row.export} />}</td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{row.clubname}</td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>
                    {(new Date(row.created)).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })} Uhr
                  </td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{row.firstname} {row.lastname}</td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{row.itemCount} Position{row.itemCount==1?'':'en'}</td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{parseFloat(row.total).toFixed(2).replace(".", ",")} €</td>
                  <td onClick={this.props.onExportCheckChange.bind(this, row.clubid, row.id)}>{Statics.OrderStatus[row.status]}</td>
                  <td className="buttons">
                    <ButtonToolbar>
                      <Link to={"/admin/orders/view/" + row.clubid + "/" + row.id}><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>
                      <Link to={"/admin/orders/edit/" + row.clubid + "/" + row.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
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
