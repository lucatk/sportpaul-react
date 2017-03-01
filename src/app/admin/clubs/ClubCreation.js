import React, { Component } from 'react';
import { withRouter } from 'react-router';

import $ from 'jquery';
import {
  Modal,
  FormGroup, FormControl, ControlLabel,
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

import LoadingOverlay from '../../utils/LoadingOverlay';
import ImageUploadControl from './ImageUploadControl';

class ClubCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      logodata: '',
      loading: false
    }

    this.onNameChange = this.onNameChange.bind(this);
    this.onLogodataChange = this.onLogodataChange.bind(this);
    this.save = this.save.bind(this);
  }
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if(this.state.name && this.state.name.length > 0
          && this.state.logodata && this.state.logodata.length > 0)
        return 'Sie haben ungesicherte Änderungen, sind Sie sicher, dass Sie diese Seite verlassen wollen?';
    })
  }
  onNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  onLogodataChange(newLogodata) {
    this.setState({
      logodata: newLogodata
    });
  }
  save() {
    this.setState({loading: true});

    var data = new FormData();
    data.append("name", this.state.name);
    data.append("logodata", this.state.logodata);
    $.post({
      url: 'php/clubs/add.php',
      contentType: false,
      processData: false,
      data: data,
      success: function(data) {
        console.log(data);
        var result = JSON.parse(data);
        console.log(result);

        this.setState({loading: false});
        if(result.error !== 0 && result.rowsAffected < 1) {
          console.log("error");
        } else {
          this.props.router.push("/admin/clubs");
        }
      }.bind(this)
    });
  }
  render() {
    return (
      <div className="container" data-page="ClubCreation">
        <LoadingOverlay show={this.state.loading} />
        <h1 className="page-header">
          Verein hinzufügen
          <div className="unsaved-changes">
            <Button bsStyle="success" bsSize="small" onClick={this.save} disabled={!this.state.name || this.state.name.length < 1 || !this.state.logodata}>Speichern</Button>
          </div>
        </h1>
        <form>
          <FormGroup controlId="inputName" validationState={!this.state.name || this.state.name.length < 1 ? 'error' : null}>
            <ControlLabel bsClass="col-sm-1 control-label">Name</ControlLabel>
            <div className="col-sm-11">
              <FormControl type="text" value={this.state.name} placeholder="Geben Sie dem Verein einen Namen..." onChange={this.onNameChange} />
            </div>
          </FormGroup>
          <FormGroup controlId="inputLogo" validationState={!this.state.logodata || this.state.logodata.length < 1 ? 'error' : null}>
            <ControlLabel bsClass="col-sm-1 control-label">Logo</ControlLabel>
            <div className="col-sm-11">
              <ImageUploadControl value={this.state.logodata} searchPath="clublogos/" onChange={this.onLogodataChange} />
            </div>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default withRouter(ClubCreation);
