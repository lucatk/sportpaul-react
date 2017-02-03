import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';

import ClubsTable from './ClubsTable';

class Clubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: [],
      showRemoveModal: false,
      removeModalScope: {
        name: '',
        id: -1
      },
      loadedClubs: false
    };

    $.ajax({
      url: 'php/load_clubs.php',
      success: function(data) {
        this.setState({
          clubs: JSON.parse(data),
          loadedClubs: true
        });
      }.bind(this)
    });

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
        {!this.props.children && <div className="container" data-page="Clubs">
          <h1 className="page-header">Vereine</h1>
          {this.state.loadedClubs &&
            <div>
              <ClubsTable data={this.state.clubs} onRemove={this.openRemoveModal} />

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
          {!this.state.loadedClubs && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Clubs;
