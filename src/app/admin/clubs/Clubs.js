import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';

import LoadingOverlay from '../../utils/LoadingOverlay';
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
      loadedClubs: false,
      loading: false
    };

    this.loadClubs();

    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.removeClub = this.removeClub.bind(this);
  }
  loadClubs() {
    this.setState({loading:true});
    $.ajax({
      url: 'php/clubs/load_all.php',
      success: function(data) {
        this.setState({
          clubs: JSON.parse(data),
          loadedClubs: true,
          loading: false
        });
      }.bind(this)
    });
  }
  removeClub(e) {
    $.post({
      url: 'php/clubs/remove.php',
      data: {
        id: this.state.removeModalScope.id
      },
      success: function(data) {
        this.loadClubs();
      }.bind(this)
    });
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
  componentWillReceiveProps(nextProps) {
    if(!nextProps.children) {
      this.loadClubs();
    }
  }
  render() {
    return (
      <div>
        {!this.props.children && <div className="container" data-page="Clubs">
          <LoadingOverlay show={this.state.loading} />
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
          {(!this.state.loadedClubs && !this.state.loading) && <p className="loading-error">Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu!</p>}
        </div>}
        {this.props.children}
      </div>
    );
  }
}

export default Clubs;
