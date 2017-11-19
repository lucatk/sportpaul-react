import React, { Component } from 'react';

import $ from 'jquery';
import { Link } from 'react-router';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon,
  Col, Row
} from 'react-bootstrap';
import {Helmet} from "react-helmet";

import * as Statics from "../../utils/Statics";
import LoadingOverlay from '../../utils/LoadingOverlay';
import PopupModal from '../../utils/PopupModal';

import FormPriceInput from '../../utils/FormPriceInput';

class CustomerEditing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: -1,
      clubid: -1,
      firstname: '',
      lastname: '',
      address: '',
      postcode: '',
      town: '',
      email: '',
      phone: '',
      loading: true,
      hasChanges: false,
      clubs: []
    };

    this.componentWillReceiveProps(this.props);

    this.save = this.save.bind(this);

    this.openRemoveModal = this.openRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.removeCustomer = this.removeCustomer.bind(this);
    this.onClubChange = this.onClubChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onPostcodeChange = this.onPostcodeChange.bind(this);
    this.onTownChange = this.onTownChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true
    });

    $.post({
      url: 'php/customers/load.php',
      data: {
        id: nextProps.params.customerid
      },
      success: function(data) {
        var parsed = JSON.parse(data);
        this.setState({
          ...parsed,
          loading: false
        });
      }.bind(this)
    });
    $.post({
      url: 'php/clubs/load_all.php',
      success: function(data) {
        var parsed = JSON.parse(data);
        this.setState({clubs:parsed});
      }.bind(this)
    });
  }
  save() {
    var error = false;

    var doneNotifications = (() => {
      if(!sentItemStatusNotification || !sentOrderConfirmedNotification) return;

      this.toNotify = [];
      this.setState({
        toUpdateItems: [],
        hasChanges: false,
        loading: false
      });
      this.props.router.push("/admin/orders");
    }).bind(this);
    var doneProcess = (() => {
      if(!updatedOrderInfo || toUpdateCount > 0) return;
      // || (notifyCustomer && !notifiedCustomer)

      if(error) {
        console.log("An error occured, abort.");
      } else {
        if(this.notificationsEnabled && this.state.email && this.state.email.length > 0) {
          if(this.oldStatus < 1 && this.state.status >= 1) {
            this.popupModal.showModal("Möchten Sie den Kunden über die Bestätigung der Bestellung informieren?", "Der Status dieser Bestellung wurde von " + Statics.OrderStatus[this.oldStatus] + " zu " + Statics.OrderStatus[this.state.status] + " geändert und somit wurde die Bestellung angenommen. Soll der Kunde darüber informiert werden?", (answer) => {
              if(answer) {
                var data = new FormData();
                data.append("template", "orderconfirmed_notification");
                data.append("email", this.state.email);
                data.append("subject", this.orderConfirmedSubject);
                data.append("clubname", this.state.clubname);
                data.append("firstname", this.state.firstname);
                data.append("lastname", this.state.lastname);
                data.append("created", this.state.created);
                this.calculateTotal(this.state.items);
                data.append("total", this.state.total);
                $.post({
                  url: 'php/mailing/send_template.php',
                  contentType: false,
                  processData: false,
                  data: data,
                  success: function(data) {
                    sentOrderConfirmedNotification = true;
                    doneNotifications();
                  }.bind(this)
                });
              } else {
                sentOrderConfirmedNotification = true;
                doneNotifications();
              }
            }, "Ja", "Nein");
          } else {
            sentOrderConfirmedNotification = true;
            doneNotifications();
          }
          if(this.toNotify.length > 0) {
            var receivedItems = this.state.items.filter((item) => (item.status == 2));
            this.popupModal.showModal("Möchten Sie den Kunden über die Statusänderung der Artikel informieren?", "Diese Bestellung enthält " + receivedItems.length + " Artikel die abholbereit sind. Soll der Kunde darüber informiert werden?", (answer) => {
              if(answer) {
                var data = new FormData();
                data.append("template", "receiveditems_notification");
                data.append("email", this.state.email);
                data.append("subject", this.infoNotificationSubject);
                data.append("clubname", this.state.clubname);
                data.append("firstname", this.state.firstname);
                data.append("lastname", this.state.lastname);
                data.append("items", JSON.stringify(receivedItems));
                $.post({
                  url: 'php/mailing/send_template.php',
                  contentType: false,
                  processData: false,
                  data: data,
                  success: function(data) {
                    sentItemStatusNotification = true;
                    doneNotifications();
                  }.bind(this)
                });
              } else {
                sentItemStatusNotification = true;
                doneNotifications();
              }
            }, "Ja", "Nein");
          } else {
            sentItemStatusNotification = true;
            doneNotifications();
          }
        } else {
          this.setState({
            toUpdateItems: [],
            hasChanges: false,
            loading: false
          });
          this.props.router.push("/admin/orders");
        }
      }
    }).bind(this);

    var data = new FormData();
    data.append("orderid", this.state.id);
    data.append("clubid", this.state.clubid);
    data.append("firstName", this.state.firstname);
    data.append("lastName", this.state.lastname);
    data.append("address", this.state.address);
    data.append("postCode", this.state.postcode);
    data.append("town", this.state.town);
    data.append("email", this.state.email);
    data.append("phone", this.state.phone);
    data.append("status", this.state.status);
    $.post({
      url: 'php/orders/update.php',
      contentType: false,
      processData: false,
      data: data,
      success: function(data) {
        var result = JSON.parse(data);
        if(result.error !== 0 && result.rowsAffected < 1) {
          error = true;
          console.log("Error:", result.error);
        }
        updatedOrderInfo = true;
        doneProcess();
      }.bind(this)
    });

    this.state.toUpdateItems.forEach((id) => {
      var item = this.state.items[id];
      if(item == undefined || item == null) return;
      var data = new FormData();
      data.append("clubid", item.clubid);
      data.append("orderid", item.orderid);
      data.append("id", item.id);
      data.append("size", item.size);
      data.append("flockings", JSON.stringify(item.flockings));
      data.append("price", item.price);
      data.append("status", item.status);
      $.post({
        url: 'php/items/update.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          var result = JSON.parse(data);
          if(result.error !== 0 && result.rowsAffected < 1) {
            error = true;
            console.log("Error:", result.error);
          }
          toUpdateCount--;
          doneProcess();
        }
      });
    });
  }
  removeCustomer(e) {
    $.post({
      url: 'php/customers/remove.php',
      data: {
        id: this.state.id
      },
      success: function(data) {
        this.props.router.push("/admin/customers");
      }.bind(this)
    });
    this.closeRemoveModal();
  }
  closeRemoveModal() {
    this.setState({
      showRemoveModal: false
    });
  }
  openRemoveModal(e) {
    this.setState({
      showRemoveModal: true
    });
  }
  onClubChange(ev) {
    this.setState({clubid: ev.target.value, hasChanges:true});
  }
  onFirstNameChange(ev) {
    this.setState({firstname: ev.target.value, hasChanges: true});
  }
  onLastNameChange(ev) {
    this.setState({lastname: ev.target.value, hasChanges: true});
  }
  onAddressChange(ev) {
    this.setState({address: ev.target.value, hasChanges: true});
  }
  onPostcodeChange(ev) {
    this.setState({postcode: ev.target.value, hasChanges: true});
  }
  onTownChange(ev) {
    this.setState({town: ev.target.value, hasChanges: true});
  }
  onPhoneChange(ev) {
    this.setState({phone: ev.target.value, hasChanges: true});
  }
  onEmailChange(ev) {
    this.setState({email: ev.target.value, hasChanges: true});
  }
  render() {
    return (
      <div className="container" data-page="CustomerEditing">
        <Helmet>
          <title>{"ID: " + this.state.id + " | Kunde bearbeiten | Sport-Paul Vereinsbekleidung"}</title>
        </Helmet>
        <PopupModal ref={(ref) => {this.popupModal = ref;}} />
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Kunde bearbeiten
          <small> ID: {this.state.id}</small>
          <div className="unsaved-changes">
            {this.state.hasChanges && <small>Sie haben ungesicherte Änderungen!</small>}
            <Button bsStyle="success" bsSize="small" onClick={this.save}>Speichern</Button>
          </div>
          <Button bsSize="small" bsStyle="danger" onClick={this.openRemoveModal}><Glyphicon glyph="trash" /> Löschen</Button>
          <Link to="/admin/customers"><Button bsSize="small"><Glyphicon bsClass="flipped glyphicon" glyph="share-alt" /> Zurück</Button></Link>
        </h1>
        <form>
          <FormGroup controlId="inputClub">
            <ControlLabel bsClass="col-sm-1 control-label">Verein</ControlLabel>
            <ControlLabel bsClass="col-sm-11">
              <Col sm={5}>
                <FormControl componentClass="select" value={this.state.clubid} onChange={this.onClubChange}>
                  {this.state.clubs.map((club, id) =>
                  <option key={id} value={club.id}>{club.name} (ID: {club.id})</option>)}
                </FormControl>
              </Col>
            </ControlLabel>
          </FormGroup>
          <FormGroup controlId="inputCustomerInfo">
            <ControlLabel bsClass="col-sm-1 control-label">Kundendaten</ControlLabel>
            <Col sm={11}>
              <div className="editing-container">
                <Row>
                  <Col sm={6}>
                    <FormGroup controlId="inputFirstname">
                      <FormControl type="text" value={this.state.firstname} onChange={this.onFirstNameChange} />
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup controlId="inputLastname">
                      <FormControl type="text" value={this.state.lastname} onChange={this.onLastNameChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Row>
                      <FormGroup controlId="inputAddress" bsClass="form-group col-sm-12">
                        <FormControl type="text" value={this.state.address} onChange={this.onAddressChange} />
                      </FormGroup>
                    </Row>
                  </Col>
                  <Col sm={6}>
                    <Row>
                      <FormGroup controlId="inputPostcode" bsClass="form-group col-sm-6">
                        <FormControl type="text" value={this.state.postcode} onChange={this.onPostcodeChange} />
                      </FormGroup>
                      <FormGroup controlId="inputTown" bsClass="form-group col-sm-6">
                        <FormControl type="text" value={this.state.town} onChange={this.onTownChange} />
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </FormGroup>
          <FormGroup controlId="inputPhone">
            <ControlLabel bsClass="col-sm-1 control-label">Telefon</ControlLabel>
            <Col sm={11}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="inputPhone">
                    <FormControl value={this.state.phone} onChange={this.onPhoneChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
          <FormGroup controlId="inputEmail">
            <ControlLabel bsClass="col-sm-1 control-label">E-Mail</ControlLabel>
            <Col sm={11}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="inputEmail">
                    <FormControl type="text" value={this.state.email} onChange={this.onEmailChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
        </form>

        <Modal show={this.state.showRemoveModal} onHide={this.closeRemoveModal}>
          <Modal.Header closeButton>
            <Modal.Title>Kunde löschen...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Möchten Sie den Kunden "{this.state.firstname} {this.state.lastname}", beim Verein "{this.state.clubname}", und seine Daten unwiderruflich löschen?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeRemoveModal}>Abbrechen</Button>
            <Button bsStyle="danger" onClick={this.removeCustomer}>Löschen</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CustomerEditing;
