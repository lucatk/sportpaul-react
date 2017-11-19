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

class CustomersTable extends Component {
  render() {
    var data = this.props.data.slice();

    var clubs = [];
    var actionChecked = 0;
    var lengthUnfiltered = data.length;
    data.forEach((row) => {
      if(row.clubid && row.clubname && !clubs[row.clubid]) {
        clubs[row.clubid] = row.clubname;
      }
      if(row.check) actionChecked++;
    });
    this.actionCheckAllState = 0;

    if(this.props.filterClub !== -1 || this.props.filterFirstname.length > 0 || this.props.filterLastname.length > 0 || this.props.filterPostcode.length > 0 || this.props.filterTown.length > 0) {
      data = data.filter(function(value) {
        var matcher;
        if(this.props.filterClub !== -1) {
          if(this.props.filterClub != value.clubid) return false;
        }
        if(this.props.filterFirstname.length > 0) {
          matcher = new RegExp(".*" + this.props.filterFirstname.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.firstname)) return false;
        }
        if(this.props.filterLastname.length > 0) {
          matcher = new RegExp(".*" + this.props.filterLastname.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.lastname)) return false;
        }
        if(this.props.filterPostcode.length > 0) {
          matcher = new RegExp(".*" + this.props.filterPostcode.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.postcode)) return false;
        }
        if(this.props.filterTown.length > 0) {
          matcher = new RegExp(".*" + this.props.filterTown.split("*").join(".*") + ".*", "i");
          if(!matcher.test(value.town)) return false;
        }

        return true;
      }.bind(this));

      var actionCheckedFiltered = 0;
      data.forEach((row) => {
        if(row.check) actionCheckedFiltered++;
      });
      if(actionChecked > actionCheckedFiltered || (data.length == lengthUnfiltered && actionCheckedFiltered > 0 && actionCheckedFiltered < data.length)) {
        this.actionCheckAllState = -1;
      } else if((actionChecked == actionCheckedFiltered || data.length == actionCheckedFiltered) && actionCheckedFiltered > 0) {
        this.actionCheckAllState = 1;
      }
    } else {
      if(data.length > actionChecked && actionChecked > 0) {
        this.actionCheckAllState = -1;
      } else if(data.length == actionChecked && actionChecked > 0) {
        this.actionCheckAllState = 1;
      }
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
          case "firstname":
            if(this.props.sortingMode === "desc") {
              critA = b.firstname.toUpperCase();
              critB = a.firstname.toUpperCase();
            } else {
              critA = a.firstname.toUpperCase();
              critB = b.firstname.toUpperCase();
            }
            break;
          case "lastname":
            if(this.props.sortingMode === "desc") {
              critA = b.lastname.toUpperCase();
              critB = a.lastname.toUpperCase();
            } else {
              critA = a.lastname.toUpperCase();
              critB = b.lastname.toUpperCase();
            }
            break;
          case "postcode":
            if(this.props.sortingMode === "desc") {
              critA = b.postcode.toUpperCase();
              critB = a.postcode.toUpperCase();
            } else {
              critA = a.postcode.toUpperCase();
              critB = b.postcode.toUpperCase();
            }
            break;
          case "town":
            if(this.props.sortingMode === "desc") {
              critA = b.town.toUpperCase();
              critB = a.town.toUpperCase();
            } else {
              critA = a.town.toUpperCase();
              critB = b.town.toUpperCase();
            }
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
            <th onClick={this.props.onSortingScopeChanged.bind(this, "club")}>Verein{this.props.sorting === 'club' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingScopeChanged.bind(this, "firstname")}>Vorname{this.props.sorting === 'firstname' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingScopeChanged.bind(this, "lastname")}>Nachname{this.props.sorting === 'lastname' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingScopeChanged.bind(this, "postcode")}>PLZ{this.props.sorting === 'postcode' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th onClick={this.props.onSortingScopeChanged.bind(this, "town")}>Stadt{this.props.sorting === 'town' && [' ', <Glyphicon glyph={this.props.sortingMode=='asc'?'triangle-top':'triangle-bottom'} />]}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="filter-row">
            <td className="action-check" onClick={this.props.onActionCheckAll.bind(this, {target:{checked:this.actionCheckAllState != 1}})}><input type="checkbox" onClick={this.props.onActionCheckAll} ref={(ref) => {this.actionCheckAllRef = ref;}} /></td>
            <td className="club">
              <FormControl componentClass="select" value={this.props.filterClub} onChange={this.props.onFilterClubChange}>
                <option value="">Filter...</option>
                <option value="separator" disabled></option>
                {clubs.map((name, id) =>
                <option key={id} value={id}>{name}</option>)}
              </FormControl>
            </td>
            <td className="firstname"><FormControl type="text" value={this.props.filterFirstname} placeholder="Filter..." onChange={this.props.onFilterFirstnameChange} /></td>
            <td className="lastname"><FormControl type="text" value={this.props.filterLastname} placeholder="Filter..." onChange={this.props.onFilterLastnameChange} /></td>
            <td className="postcode"><FormControl type="text" value={this.props.filterPostcode} placeholder="Filter..." onChange={this.props.onFilterPostcodeChange} /></td>
            <td className="town"><FormControl type="text" value={this.props.filterTown} placeholder="Filter..." onChange={this.props.onFilterTownChange} /></td>
            <td className="buttons"></td>
          </tr>
          {data && data.length > 0
            ? data.map((row) =>
                <tr key={row.id} data-id={row.id} data-clubid={row.clubid} data-club={row.clubname} data-check={row.check}>
                  <td className="action-check" onClick={this.props.onActionCheckChange.bind(this, row.id)}><input type="checkbox" checked={row.check} /></td>
                  <td className="club" onClick={this.props.onActionCheckChange.bind(this, row.id)}>{row.clubname}</td>
                  <td onClick={this.props.onActionCheckChange.bind(this, row.id)}>{row.firstname}</td>
                  <td onClick={this.props.onActionCheckChange.bind(this, row.id)}>{row.lastname}</td>
                  <td onClick={this.props.onActionCheckChange.bind(this, row.id)}>{row.postcode}</td>
                  <td onClick={this.props.onActionCheckChange.bind(this, row.id)}>{row.town}</td>
                  <td className="buttons">
                    <ButtonToolbar>
                      <Link to={"/admin/customers/view/" + row.id}><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>
                      <Link to={"/admin/customers/edit/" + row.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
                    </ButtonToolbar>
                  </td>
                </tr>
          ) : <tr className="no-data"><td colSpan="8">Keine Kunden vorhanden</td></tr>}
        </tbody>
      </Table>
    )
  }

  componentDidMount() { this.updateActionCheckAllState(); }
  componentDidUpdate() { this.updateActionCheckAllState(); }
  updateActionCheckAllState() {
    if(this.actionCheckAllRef != null) {
      this.actionCheckAllRef.indeterminate = this.actionCheckAllState == -1;
      this.actionCheckAllRef.checked = this.actionCheckAllState == 1;
    }
  }
}

export default CustomersTable;
