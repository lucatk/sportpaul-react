import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon,
  Row, Col,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

class OrderProcess extends Component {
  constructor(props) {
    super(props);

    this.regexFirstname = /^.{1,}$/;
    this.regexLastname = /^.{1,}$/;
    this.regexStreet = /^.{1,}$/;
    this.regexHousenr = /^\d+([\/\-]\d+)?[A-Za-z]*$/;
    this.regexPostcode = /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/;
    this.regexTown = /^.{1,}$/;
    this.regexPhone = /^(0|0049\s?|\+49\s?|\(\+49\)\s?){1}([1-9]{2,4})([ \-\/]?[0-9]{1,10})+$/;
    this.regexEmail = /^[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    this.state = {
      firstname: undefined,
      lastname: undefined,
      street: undefined,
      housenr: undefined,
      postcode: undefined,
      town: undefined,
      phone: undefined,
      email: undefined
    };

    this.onFirstnameChange = this.onFirstnameChange.bind(this);
    this.onLastnameChange = this.onLastnameChange.bind(this);
    this.onStreetChange = this.onStreetChange.bind(this);
    this.onHousenrChange = this.onHousenrChange.bind(this);
    this.onPostcodeChange = this.onPostcodeChange.bind(this);
    this.onTownChange = this.onTownChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onClickContinue = this.onClickContinue.bind(this);

    this.validateAllInputs = this.validateAllInputs.bind(this);
  }

  onFirstnameChange(ev) {
    this.setState({firstname:ev.target.value.trim()});
  }

  onLastnameChange(ev) {
    this.setState({lastname:ev.target.value.trim()});
  }

  onStreetChange(ev) {
    this.setState({street:ev.target.value.trim()});
  }

  onHousenrChange(ev) {
    this.setState({housenr:ev.target.value.trim()});
  }

  onPostcodeChange(ev) {
    this.setState({postcode:ev.target.value.trim()});
  }

  onTownChange(ev) {
    this.setState({town:ev.target.value.trim()});
  }

  onPhoneChange(ev) {
    this.setState({phone:ev.target.value.trim()});
  }

  onEmailChange(ev) {
    this.setState({email:ev.target.value.trim()});
  }

  onClickContinue() {
    if(this.validateAllInputs()) {
      this.props.onContinue(this.state);
    }
  }

  validateInput(input, regex) {
    if(input !== undefined && !regex.test(input)) return 'error';
    return null;
  }

  validateAllInputs() {
    if(this.state.firstname === undefined || this.validateInput(this.state.firstname, this.regexFirstname)) return false;
    if(this.state.lastname === undefined || this.validateInput(this.state.lastname, this.regexLastname)) return false;
    if(this.state.street === undefined || this.validateInput(this.state.street, this.regexStreet)) return false;
    if(this.state.housenr === undefined || this.validateInput(this.state.housenr, this.regexHousenr)) return false;
    if(this.state.postcode === undefined || this.validateInput(this.state.postcode, this.regexPostcode)) return false;
    if(this.state.town === undefined || this.validateInput(this.state.town, this.regexTown)) return false;
    if(this.state.phone === undefined || this.validateInput(this.state.phone, this.regexPhone)) return false;
    if(this.state.email === undefined || this.validateInput(this.state.email, this.regexEmail)) return false;
    return true;
  }

  render() {
    return (
      <div className="order-process">
        <h1 className="page-header">Persönliche Details <small>/ Bestellung abschließen</small></h1>
        <form>
          <Row>
            <Col lg={6}>
              <Row>
                <Col sm={6}>
                  <FormGroup controlId="pd_firstname" validationState={this.validateInput(this.state.firstname, this.regexFirstname)}>
                    <ControlLabel>Vorname</ControlLabel>
                    <FormControl type="text" value={this.state.firstname} onChange={this.onFirstnameChange} onFocus={this.onFirstnameChange} />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup controlId="pd_lastname" validationState={this.validateInput(this.state.lastname, this.regexLastname)}>
                    <ControlLabel>Nachname</ControlLabel>
                    <FormControl type="text" value={this.state.lastname} onChange={this.onLastnameChange} onFocus={this.onLastnameChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Row>
                <Col sm={10}>
                  <FormGroup controlId="pd_street" validationState={this.validateInput(this.state.street, this.regexStreet)}>
                    <ControlLabel>Straße</ControlLabel>
                    <FormControl type="text" value={this.state.street} onChange={this.onStreetChange} onFocus={this.onStreetChange} />
                  </FormGroup>
                </Col>
                <Col sm={2}>
                  <FormGroup controlId="pd_housenr" validationState={this.validateInput(this.state.housenr, this.regexHousenr)}>
                    <ControlLabel>Hausnr.</ControlLabel>
                    <FormControl type="text" value={this.state.housenr} onChange={this.onHousenrChange} onFocus={this.onHousenrChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="pd_postcode" validationState={this.validateInput(this.state.postcode, this.regexPostcode)}>
                    <ControlLabel>PLZ</ControlLabel>
                    <FormControl type="text" value={this.state.postcode} onChange={this.onPostcodeChange} onFocus={this.onPostcodeChange} />
                  </FormGroup>
                </Col>
                <Col sm={9}>
                  <FormGroup controlId="pd_town" validationState={this.validateInput(this.state.town, this.regexTown)}>
                    <ControlLabel>Ort</ControlLabel>
                    <FormControl type="text" value={this.state.town} onChange={this.onTownChange} onFocus={this.onTownChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Row>
                <Col sm={4}>
                  <FormGroup controlId="pd_phone" validationState={this.validateInput(this.state.phone, this.regexPhone)}>
                    <ControlLabel>Telefon</ControlLabel>
                    <FormControl type="tel" value={this.state.phone} onChange={this.onPhoneChange} onFocus={this.onPhoneChange} />
                  </FormGroup>
                </Col>
                <Col sm={8}>
                  <FormGroup controlId="pd_email" validationState={this.validateInput(this.state.email, this.regexEmail)}>
                    <ControlLabel>E-Mail</ControlLabel>
                    <FormControl type="email" value={this.state.email} onChange={this.onEmailChange} onFocus={this.onEmailChange} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
        <Button bsStyle="primary" onClick={this.onClickContinue} disabled={!this.validateAllInputs()}>Weiter <Glyphicon glyph="menu-right" /></Button>
      </div>
    );
  }
}

export default OrderProcess;
