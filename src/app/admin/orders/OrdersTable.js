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
  constructor(props) {
    super(props);

    this.state = {
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

    this.onExportCheckCellClick = this.onExportCheckCellClick.bind(this);
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
  onExportCheckCellClick(clubid, id, checked) {
    this.props.onOrderExportCheckChange(clubid, id, checked);
  }
  onFilterClubChange(e) {
    if(e.target.value.length < 1) {
      this.props.onFilterClubChange(-1);
      this.setState({filterClub: -1, selectedClubProducts: null, filterProduct: -1});
    } else {
      var clubid = parseInt(e.target.value);
      this.props.onFilterClubChange(clubid);
      this.setState({filterClub: clubid, selectedClubProducts: null, filterProduct: -1});

      this.loadClubProducts(clubid);
    }
  }
  onFilterDateChange(e) {
    this.props.onFilterDateChange(this.state.filterDateModifier, e.target.value);
    this.setState({filterDate: e.target.value});
  }
  onFilterDateModifierChange(e) {
    this.props.onFilterDateChange(e.target.value, this.state.filterDate);
    this.setState({filterDateModifier: e.target.value});
  }
  onFilterCustomerChange(e) {
    this.props.onFilterCustomerChange(e.target.value);
    this.setState({filterCustomer: e.target.value});
  }
  onFilterStatusChange(e) {
    if(e.target.value.length < 1) {
      this.props.onFilterStatusChange("");
      this.setState({filterStatus: ""});
    } else {
      this.props.onFilterStatusChange(e.target.value);
      this.setState({filterStatus: e.target.value});
    }
  }
  onFilterProductChange(e) {
    if(e.target.value.length < 1) {
      // this.props.onFilterProductChange(-1);
      this.setState({filterProduct: -1});
    } else {
      var productid = parseInt(e.target.value);
      // this.props.onFilterProductChange(productid);
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

    if(this.state.filterClub !== -1 || this.state.filterDate.length > 0 || this.state.filterCustomer.length > 0 || this.state.filterStatus.length > 0 || this.state.filterProduct !== -1) {
      data = data.filter(function(value) {
        var matcher;
        if(this.state.filterClub !== -1) {
          if(this.state.filterClub != value.clubid) return false;
        }
        if(this.state.filterDate.length > 0) {
          var dateMatcher = this.state.filterDate.match(/(\d+)/g);
          var parsedDate = new Date(dateMatcher[2] || new Date().getFullYear(), (dateMatcher[1] || new Date().getMonth()+1) - 1, dateMatcher[0] || 1);
          var createdDate = new Date(value.created);
          console.log(parsedDate, createdDate);
          switch(this.state.filterDateModifier) {
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
              matcher = new RegExp(".*" + this.state.filterDate.replace("*", ".*") + ".*", "i");
              if(!matcher.test(value.created)) return false;
          }
        }
        if(this.state.filterCustomer.length > 0) {
          matcher = new RegExp(".*" + this.state.filterCustomer.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.firstname + " " + value.lastname)) return false;
        }
        if(this.state.filterStatus.length > 0) {
          matcher = new RegExp(this.state.filterStatus, "i");
          if(!matcher.test(value.status)) return false;
        }
        if(this.state.filterProduct !== -1) {
          var found = false;
          for(var o in value.items) {
            if(value.items[o].id == this.state.filterProduct) {
              found = true;
              break;
            }
          }
          if(!found) return false;
        }

        return true;
      }.bind(this));
    }

    if(this.state.sorting.length > 0) {
      data = data.sort((a, b) => {
        var critA = null;
        var critB = null;
        switch(this.state.sorting) {
          case "club":
            if(this.state.sortingMode === "desc") {
              critA = b.clubname.toUpperCase();
              critB = a.clubname.toUpperCase();
            } else {
              critA = a.clubname.toUpperCase();
              critB = b.clubname.toUpperCase();
            }
            break;
          case "date":
            if(this.state.sortingMode === "desc") {
              critA = new Date(b.created).valueOf();
              critB = new Date(a.created).valueOf();
            } else {
              critA = new Date(a.created).valueOf();
              critB = new Date(b.created).valueOf();
            }
            break;
          case "customer":
            if(this.state.sortingMode === "desc") {
              critA = (b.firstname + b.lastname).toUpperCase();
              critB = (a.firstname + a.lastname).toUpperCase();
            } else {
              critA = (a.firstname + a.lastname).toUpperCase();
              critB = (b.firstname + b.lastname).toUpperCase();
            }
            break;
          case "amitems":
            if(this.state.sortingMode === "desc") {
              critA = b.itemCount;
              critB = a.itemCount;
            } else {
              critA = a.itemCount;
              critB = b.itemCount;
            }
            break;
          case "total":
            if(this.state.sortingMode === "desc") {
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
            <th onClick={this.onSortingClubClicked}>Verein{this.state.sorting === 'club' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.onSortingDateClicked}>Bestelldatum{this.state.sorting === 'date' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.onSortingCustomerClicked}>Kunde{this.state.sorting === 'customer' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.onSortingAmountItemsClicked}>Positionen{this.state.sorting === 'amitems' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.onSortingTotalClicked}>Gesamt{this.state.sorting === 'total' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.onSortingStatusClicked}>Status{this.state.sorting === 'status' && [' ', <Glyphicon glyph={this.state.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="filter-row">
            <td className="export-check"></td>
            <td className="club">
              <FormControl componentClass="select" value={this.state.filterClub} onChange={this.onFilterClubChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {clubs.map((name, id) =>
                <option key={id} value={id}>{name}</option>)}
              </FormControl>
            </td>
            <td className="date">
              <Row>
                <Col xs={4}>
                  <FormControl componentClass="select" value={this.state.filterDateModifier} onChange={this.onFilterDateModifierChange}>
                    <option value="">Filter...</option>
                    <option value="separator" disabled></option>
                    <option value="before">vor</option>
                    <option value="exact">exakt</option>
                    <option value="after">nach</option>
                  </FormControl>
                </Col>
                <Col xs={8}><FormControl type="text" value={this.state.filterDate} placeholder="Datum..." onChange={this.onFilterDateChange} /></Col>
              </Row>
            </td>
            <td className="customer"><FormControl type="text" value={this.state.filterCustomer} placeholder="Filter..." onChange={this.onFilterCustomerChange} /></td>
            <td></td>
            <td></td>
            <td className="status">
              <FormControl componentClass="select" value={this.state.filterStatus} onChange={this.onFilterStatusChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {orderStatuses.map((value, i) =>
                <option key={i} value={value.key}>{value.status}</option>)}
              </FormControl>
            </td>
            <td className="buttons product">
              <FormControl componentClass="select" value={this.state.filterProduct} onChange={this.onFilterProductChange} disabled={this.state.filterClub == -1}>
                {this.state.filterClub != -1 ? [
                  <option value="">Produktsuche...</option>,
                  <option value="separator" disabled></option>,
                  (this.state.selectedClubProducts == null
                  ? <option disabled>Lade Produkte...</option>
                  : this.state.selectedClubProducts.map((product, i) => (
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
                <tr key={row.clubid + "/" + row.id} data-id={row.id} data-clubid={row.clubid} data-club={row.clubname}>
                  <td className="export-check" onClick={this.onExportCheckCellClick.bind(this, row.clubid, row.id, !row.export)}><input type="checkbox" checked={row.export} /></td>
                  <td>{row.clubname}</td>
                  <td>
                    {(new Date(row.created)).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })} Uhr
                  </td>
                  <td>{row.firstname} {row.lastname}</td>
                  <td>{row.itemCount} Position{row.itemCount==1?'':'en'}</td>
                  <td>{parseFloat(row.total).toFixed(2).replace(".", ",")} €</td>
                  <td>{Statics.OrderStatus[row.status]}</td>
                  <td className="buttons">
                    <ButtonToolbar>
                      {this.props.processingMode
                        ? <Link to={"/admin/orders/edit/" + row.clubid + "/" + row.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
                        : <Link to={"/admin/orders/view/" + row.clubid + "/" + row.id}><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>}
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
