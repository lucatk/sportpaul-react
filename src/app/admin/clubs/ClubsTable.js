import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

class ClubsTable extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>ausstehende Bestellungen</th>
            <th>Produkte</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.data && this.props.data.length > 0
            ? this.props.data.map((row) =>
                <tr key={row.id} data-id={row.id} data-name={row.name}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.orderCount} ausstehende Bestellung{row.orderCount==1?'':'en'}</td>
                  <td>{row.productCount} Produkt{row.productCount==1?'':'e'}</td>
                  <td className="buttons">
                    <ButtonToolbar>
                      <Link to={"/admin/clubs/edit/" + row.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
                      <Button bsStyle="danger" bsSize="small" onClick={this.props.onRemove}><Glyphicon glyph="trash" /> Löschen</Button>
                    </ButtonToolbar>
                  </td>
                </tr>
          ) : <tr className="no-data"><td colSpan="5">Keine Vereine vorhanden</td></tr>}
        </tbody>
      </Table>
    )
  }
}

export default ClubsTable;
