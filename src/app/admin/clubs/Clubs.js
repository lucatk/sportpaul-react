import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  ButtonToolbar, Button,
  Glyphicon,
  Modal
} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import { arrayMove } from 'react-sortable-hoc';

import LoadingOverlay from '../../utils/LoadingOverlay';
import ClubsTable from './ClubsTable';

class Clubs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clubs: [],
      sortedClubList: [],
      showRemoveModal: false,
      removeModalScope: {
        name: '',
        id: -1
      },
      loadedClubs: false,
      loading: true
    };

    this.loadClubs();

    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.removeClub = this.removeClub.bind(this);
    this.onClubsSortEnd = this.onClubsSortEnd.bind(this);
  }
  loadClubs() {
    this.setState({loading: true});
    $.ajax({
      url: 'php/clubs/load_all.php',
      success: function(data) {
        var clubs = JSON.parse(data);
        var parsedClubs = [];
        for(var i in clubs) {
          parsedClubs[i] = clubs[i];
          parsedClubs[i].displayorder = parseInt(parsedClubs[i].displayorder);
        }

        this.setState({
          clubs: parsedClubs,
          loadedClubs: true,
          loading: false
        });
        setTimeout(() => {
          this.sortClubList();
        }, 100);
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
  onClubsSortEnd({oldIndex, newIndex}) {
    var data = this.state.sortedClubList;
    data = arrayMove(data, oldIndex, newIndex);
    var newOrder = this.state.clubs;
    var lastDisplayorder = -1;
    var lastIndexChanged = -1;

    data.forEach((club, i) => {
      if(i == newIndex) {
        if(data[i-1]) {
          club.displayorder = data[i-1].displayorder+1;
        } else {
          club.displayorder = 0;
        }
        lastIndexChanged = i;
        lastDisplayorder = club.displayorder;
      } else if(i == lastIndexChanged+1 && lastDisplayorder > -1) {
        if(club.displayorder <= lastDisplayorder) {
          club.displayorder++;
          lastIndexChanged = i;
          lastDisplayorder = club.displayorder;
        }
      }
      var index = -1;
      newOrder.forEach((c, i) => {
        if(c.id === club.id) {
          index = i;
        }
      });
      newOrder[index] = club;
    });
    this.setState({
      clubs: newOrder
    });
    setTimeout(() => {
      this.sortClubList();
      this.saveClubOrder();
    }, 100);
  }
  sortClubList() {
    this.setState({
      sortedClubList: this.state.clubs.concat().sort((a, b) => (a.displayorder == b.displayorder ? parseInt(a.id) - parseInt(b.id) : a.displayorder - b.displayorder))
    });
  }
  saveClubOrder() {
    this.setState({loading: true});

    var order = {};
    this.state.clubs.forEach((club) => {
      order[club.id] = club.displayorder;
    });
    $.post({
      url: 'php/clubs/order.php',
      data: {
        data: JSON.stringify(order)
      },
      success: function(data) {
        console.log(data);
        this.setState({
          loading: false
        });
      }.bind(this)
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
          <Helmet>
            <title>Vereine | Sport-Paul Vereinsbekleidung</title>
          </Helmet>
          <LoadingOverlay show={this.state.loading} />
          <h1 className="page-header">Vereine</h1>
          {this.state.loadedClubs &&
            <div>
              <ClubsTable data={this.state.clubs} sortedClubList={this.state.sortedClubList} onSortEnd={this.onClubsSortEnd} onRemove={this.openRemoveModal} />

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

          <Link to="/admin/clubs/create"><Button bsSize="small" bsStyle="success"><Glyphicon glyph="plus" /> Hinzufügen...</Button></Link>
        </div>}
        {this.props.children && React.cloneElement(this.props.children, {
          onPicturePreviewRequest: this.props.onPicturePreviewRequest
        })}
      </div>
    );
  }
}

export default Clubs;
