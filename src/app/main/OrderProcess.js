import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  Button,
  Glyphicon,
  Row, Col,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import {Helmet} from "react-helmet";

// import theme from 'theme.css';,

class OrderProcess extends Component {
  constructor(props) {
    super(props);

    this.regexFirstname = /^.{1,}$/;
    this.regexLastname = /^.{1,}$/;
    this.regexAddress = /^.{1,}$/;
    this.regexPostcode = /^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$/;
    this.regexTown = /^.{1,}$/;
    this.regexPhone = /^(0|0049\s?|\+49\s?|\(\+49\)\s?){1}([1-9]{2,4})([ \-\/]?[0-9]{1,10})+$/;
    this.regexEmail = /^[a-zA-Z0-9]+[_a-zA-Z0-9\.-]*[a-zA-Z0-9]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;

    this.state = {
      firstname: undefined,
      lastname: undefined,
      address: undefined,
      postcode: undefined,
      town: undefined,
      phone: undefined,
      email: undefined,
      suggestions: []
    };

    this.onFirstnameChange = this.onFirstnameChange.bind(this);
    this.onLastnameChange = this.onLastnameChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onPostcodeChange = this.onPostcodeChange.bind(this);
    this.onTownChange = this.onTownChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onClickContinue = this.onClickContinue.bind(this);

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);

    this.validateAllInputs = this.validateAllInputs.bind(this);
  }

  onFirstnameChange(ev) {
    this.setState({firstname:ev.target.value});
  }

  onLastnameChange(ev) {
    this.setState({lastname:ev.target.value});
  }

  onAddressChange(ev) {
    this.setState({address:ev.target.value});
  }

  onPostcodeChange(ev) {
    this.setState({postcode:ev.target.value.trim()});
  }

  onTownChange(ev) {
    this.setState({town:ev.target.value});
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

  getSuggestions(scope, value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength <= 0 ? [] : this.props.customers.filter((customer) => {
      switch(scope) {
        case 'firstname':
          return customer.firstname.toLowerCase().slice(0, inputLength) === inputValue;
        case 'lastname':
          return customer.lastname.toLowerCase().slice(0, inputLength) === inputValue;
        case 'address':
          return customer.address.toLowerCase().slice(0, inputLength) === inputValue;
        default:
          return false;
      }
    });
  }

  onSuggestionsFetchRequested(scope, { value }) {
    this.setState({
      suggestions: this.getSuggestions(scope, value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  onSuggestionSelected(ev, { suggestion }) {
    this.setState({
      firstname: suggestion.firstname,
      lastname: suggestion.lastname,
      address: suggestion.address,
      postcode: suggestion.postcode,
      town: suggestion.town,
      phone: suggestion.phone,
      email: suggestion.email,
    });
  }

  getSuggestionValue(scope, suggestion) {
    switch(scope) {
      case 'firstname':
        return suggestion.firstname;
      case 'lastname':
        return suggestion.lastname;
      case 'address':
        return suggestion.address;
      default:
        return '';
    }
  }

  renderSuggestion(scope, suggestion, { query, isHighlighted }) {
    const highlightLength = query.length;
    switch(scope) {
      case 'firstname':
        return (
          <div>
            <p><span className="highlight">{suggestion.firstname.slice(0, highlightLength)}</span>{suggestion.firstname.slice(highlightLength)} {suggestion.lastname}</p>
            <p className="small">{suggestion.clubname}</p>
            <p className="small">{suggestion.address}, {suggestion.postcode} {suggestion.town}</p>
          </div>
        );
      case 'lastname':
        return (
          <div>
            <p>{suggestion.firstname} <span className="highlight">{suggestion.lastname.slice(0, highlightLength)}</span>{suggestion.lastname.slice(highlightLength)}</p>
            <p className="small">{suggestion.clubname}</p>
            <p className="small">{suggestion.address}, {suggestion.postcode} {suggestion.town}</p>
          </div>
        );
      case 'address':
        return (
          <div>
            <p><span className="highlight">{suggestion.address.slice(0, highlightLength)}</span>{suggestion.address.slice(highlightLength)}</p>
            <p className="small">{suggestion.firstname} {suggestion.lastname} - {suggestion.postcode} {suggestion.town}</p>
            <p className="small">{suggestion.clubname}</p>
          </div>
        );
      default:
        return null;
    }
  }

  validateInput(input, regex, optional) {
    if(optional === true && input !== undefined && input.length < 1) return null;
    if(input !== undefined && !regex.test(input)) return 'error';
    return null;
  }

  validateAllInputs() {
    if(this.state.firstname === undefined || this.validateInput(this.state.firstname.trim(), this.regexFirstname)) return false;
    if(this.state.lastname === undefined || this.validateInput(this.state.lastname.trim(), this.regexLastname)) return false;
    if(this.state.address === undefined || this.validateInput(this.state.address.trim(), this.regexAddress)) return false;
    if(this.state.postcode === undefined || this.validateInput(this.state.postcode.trim(), this.regexPostcode)) return false;
    if(this.state.town === undefined || this.validateInput(this.state.town.trim(), this.regexTown)) return false;
    if(this.state.phone === undefined || this.validateInput(this.state.phone.trim(), this.regexPhone)) return false;
    if(this.validateInput(this.state.email, this.regexEmail, true)) return false;
    return true;
  }

  render() {
    return (
      <div className="order-process">
        <Helmet>
          <title>Persönliche Details | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        <h1 className="page-header">Persönliche Details <small>/ Bestellung abschließen</small></h1>
        <form>
          <Row>
            <Col lg={6}>
              <Row>
                <Col sm={6}>
                  <FormGroup controlId="pd_firstname" validationState={this.validateInput(this.state.firstname, this.regexFirstname)}>
                    <ControlLabel>Vorname</ControlLabel>
                    {/*<FormControl type="text" value={this.state.firstname} onChange={this.onFirstnameChange} onFocus={this.onFirstnameChange} />*/}
                    <Autosuggest suggestions={this.state.suggestions}
                                 onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, 'firstname')}
                                 onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                 onSuggestionSelected={this.onSuggestionSelected}
                                 getSuggestionValue={this.getSuggestionValue.bind(this, 'firstname')}
                                 renderSuggestion={this.renderSuggestion.bind(this, 'firstname')}
                                 inputProps={{
                                   value: this.state.firstname || '',
                                   onChange: this.onFirstnameChange,
                                   onFocus: this.onFirstnameChange,
                                   className: 'form-control',
                                   id: 'pd_firstname',
                                   autoComplete: 'given-name'
                                 }} />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup controlId="pd_lastname" validationState={this.validateInput(this.state.lastname, this.regexLastname)}>
                    <ControlLabel>Nachname</ControlLabel>
                    {/*<FormControl type="text" value={this.state.lastname} onChange={this.onLastnameChange} onFocus={this.onLastnameChange} />*/}
                    <Autosuggest suggestions={this.state.suggestions}
                                 onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, 'lastname')}
                                 onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                 onSuggestionSelected={this.onSuggestionSelected}
                                 getSuggestionValue={this.getSuggestionValue.bind(this, 'lastname')}
                                 renderSuggestion={this.renderSuggestion.bind(this, 'lastname')}
                                 inputProps={{
                                   value: this.state.lastname || '',
                                   onChange: this.onLastnameChange,
                                   onFocus: this.onLastnameChange,
                                   className: 'form-control',
                                   id: 'pd_lastname',
                                   autoComplete: 'family-name'
                                 }} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Row>
                <Col sm={12}>
                  <FormGroup controlId="pd_address" validationState={this.validateInput(this.state.address, this.regexAddress)}>
                    <ControlLabel>Adresse</ControlLabel>
                    {/*<FormControl type="text" value={this.state.address} onChange={this.onAddressChange} onFocus={this.onAddressChange} />*/}
                    <Autosuggest suggestions={this.state.suggestions}
                                 onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this, 'address')}
                                 onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                 onSuggestionSelected={this.onSuggestionSelected}
                                 getSuggestionValue={this.getSuggestionValue.bind(this, 'address')}
                                 renderSuggestion={this.renderSuggestion.bind(this, 'address')}
                                 inputProps={{
                                   value: this.state.address || '',
                                   onChange: this.onAddressChange,
                                   onFocus: this.onAddressChange,
                                   className: 'form-control',
                                   id: 'pd_address',
                                   autoComplete: 'street-address'
                                 }} />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <Row>
                <Col sm={3}>
                  <FormGroup controlId="pd_postcode" validationState={this.validateInput(this.state.postcode, this.regexPostcode)}>
                    <ControlLabel>PLZ</ControlLabel>
                    <FormControl type="text" autoComplete="postal-code" value={this.state.postcode} onChange={this.onPostcodeChange} onFocus={this.onPostcodeChange} />
                  </FormGroup>
                </Col>
                <Col sm={9}>
                  <FormGroup controlId="pd_town" validationState={this.validateInput(this.state.town, this.regexTown)}>
                    <ControlLabel>Ort</ControlLabel>
                    <FormControl type="text" autoComplete="address-level2" value={this.state.town} onChange={this.onTownChange} onFocus={this.onTownChange} />
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
                    <FormControl type="tel" autoComplete="tel" value={this.state.phone} onChange={this.onPhoneChange} onFocus={this.onPhoneChange} />
                  </FormGroup>
                </Col>
                <Col sm={8}>
                  <FormGroup controlId="pd_email" validationState={this.validateInput(this.state.email, this.regexEmail, true)}>
                    <ControlLabel>E-Mail</ControlLabel>
                    <FormControl type="email" autoComplete="email" value={this.state.email} onChange={this.onEmailChange} onFocus={this.onEmailChange} />
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
