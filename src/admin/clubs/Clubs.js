import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';

class Clubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRemoveModal: false,
      removeModalScope: {
        name: '',
        id: -1
      }
    };

    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.removeClub = this.removeClub.bind(this);
  }
  removeClub(e) {
    this.closeRemoveModal();
  }
  closeRemoveModal() {
    this.setState({
      showRemoveModal: false,
      removeModalScope: {
        name: '',
        id: -1
      }
    });
  }
  openRemoveModal(e) {
    this.setState({
      showRemoveModal: true,
      removeModalScope: e.target.parentElement.parentElement.parentElement.dataset
    });
  }
  render() {
    return (
      <div>
        {!this.props.children && <div className="container">
          <h1 className="page-header">Vereine</h1>
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
              <tr data-id="0" data-name="FC Steinhofen">
                <td>0</td>
                <td>FC Steinhofen</td>
                <td>0 ausstehende Bestellungen</td>
                <td>1 Produkt</td>
                <td className="buttons">
                  <ButtonToolbar>
                    <Link to="/admin/clubs/edit/0"><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
                    <Button bsStyle="danger" bsSize="small" onClick={this.openRemoveModal}><Glyphicon glyph="remove" /> Löschen</Button>
                  </ButtonToolbar>
                </td>
              </tr>
            </tbody>
          </Table>

          <Modal show={this.state.showRemoveModal} onHide={this.closeRemoveModal} data-scope={this.state.removeModalScope.id}>
            <Modal.Header closeButton>
              <Modal.Title>Verein löschen...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Möchten Sie den Verein &quot;{this.state.removeModalScope.name}&quot; mit der ID {this.state.removeModalScope.id} unwiderruflich löschen?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeRemoveModal}>Abbrechen</Button>
              <Button bsStyle="danger" onClick={this.removeClub}>Löschen</Button>
            </Modal.Footer>
          </Modal>
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Clubs;
