import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  FormGroup, FormControl,
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';

class Orders extends Component {
  constructor(props) {
    super(props);

    this.onExportCheckCellClick = this.onExportCheckCellClick.bind(this);
  }
  onExportCheckCellClick(e) {
    e.target.querySelector("input").checked = !e.target.querySelector("input").checked;
  }
  render() {
    return (
      <div>
        {!this.props.children && <div className="container" data-page="Orders">
          <h1 className="page-header">Bestellungen</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Verein</th>
                <th>Kunde</th>
                <th>Gesamt</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr data-id="0" data-clubid="0">
                <td className="export-check" onClick={this.onExportCheckCellClick}><input type="checkbox" value="" /></td>
                <td>0</td>
                <td>FC Steinhofen</td>
                <td>Max Mustermann</td>
                <td>33,50 €</td>
                <td>ausstehend</td>
                <td className="buttons">
                  <ButtonToolbar>
                    <Link to="/admin/orders/show/0/0"><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>
                    <Button bsStyle="danger" bsSize="small" onClick={this.openRemoveModal}><Glyphicon glyph="remove" /> Löschen</Button>
                  </ButtonToolbar>
                </td>
              </tr>
              <tr className="success" data-id="1" data-clubid="0">
                <td className="export-check" onClick={this.onExportCheckCellClick}><input type="checkbox" value="" /></td>
                <td>1</td>
                <td>FC Steinhofen</td>
                <td>Armin Killmaier</td>
                <td>67,00 €</td>
                <td>erledigt</td>
                <td className="buttons">
                  <ButtonToolbar>
                    <Link to="/admin/orders/show/0/0"><Button bsSize="small"><Glyphicon glyph="search" /> Details</Button></Link>
                    <Button bsStyle="danger" bsSize="small" onClick={this.openRemoveModal}><Glyphicon glyph="remove" /> Löschen</Button>
                  </ButtonToolbar>
                </td>
              </tr>
            </tbody>
          </Table>

          <Button bsStyle="success"><Glyphicon glyph="save" /> Exportieren</Button>
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Orders;
