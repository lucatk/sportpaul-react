import React, { Component } from 'react';

import $ from 'jquery';
import { Nav, NavItem } from 'react-bootstrap';

import LoadingOverlay from '../../utils/LoadingOverlay'

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      settings: {}
    };
    this.tempValues = {};
  }
  onSettingChange(name, save, ev) {
    if(save) {
      this.setState({
        loading: true
      });
      var value = ev.target.value;
      if(typeof value == "boolean") value = value ? 1 : 0;

      var data = new FormData();
      data.append("name", name);
      data.append("value", value);
      $.post({
        url: 'php/settings/update.php',
        contentType: false,
        processData: false,
        data: data,
        success: function(data) {
          var result = JSON.parse(data);
          this.setState({
            loading: false
          });
          if(result.error !== 0 && result.rowsAffected < 1) {
            if(this.tempValues[name] !== undefined && this.tempValues[name] !== null) {
              var settings = this.state.settings;
              settings[name] = this.tempValues[name];
              this.setState({
                settings: settings
              });
            }
          } else {
            if(this.tempValues[name] !== undefined && this.tempValues[name] !== null)
              delete this.tempValues[name];
            var settings = this.state.settings;
            settings[name] = value;
            this.setState({
              settings: settings
            });
          }
        }.bind(this)
      });
    } else {
      this.tempValues[name] = this.state.settings[name];
      var settings = this.state.settings;
      var value = ev.target.value;
      if(typeof value == "boolean") value = value ? 1 : 0;
      settings[name] = value;
      this.setState({
        settings: settings
      });
    }
  }
  componentDidMount() {
    $.ajax({
      url: 'php/settings/load_all.php',
      success: function(data) {
        console.log(data);
        this.setState({
          settings: JSON.parse(data),
          loading: false
        });
      }.bind(this)
    });
  }
  render() {
    document.title = "Admin-Einstellungen | Sport-Paul Vereinsbekleidung";
    return (
      <div>
        <div className="container" data-page="Settings">
          <LoadingOverlay show={this.state.loading} />
          <Nav bsStyle="tabs" activeHref={"#" + this.props.location.pathname}>
            <NavItem eventKey={1} href="#/admin/settings/general">Allgemein</NavItem>
            <NavItem eventKey={2} href="#/admin/settings/mailing">E-Mail-Versand</NavItem>
          </Nav>
          {!this.props.children && ""}
          {this.props.children && React.cloneElement(this.props.children, {
            settings: this.state.settings,
            onSettingChange: this.onSettingChange.bind(this)
          })}
        </div>
      </div>
    );
  }
}

export default Settings;
