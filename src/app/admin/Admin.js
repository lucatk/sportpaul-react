import React, { Component } from 'react';

import $ from 'jquery';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import {Helmet} from "react-helmet";

import LoginForm from './LoginForm';
import ImageLightbox from '../utils/ImageLightbox';

import './Admin.css';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      picturePreview: null
    };

    this.checkAuth();

    this.onClosePicturePreview = this.onClosePicturePreview.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    if(this.props != nextProps) {
      this.checkAuth();
    }
  }
  checkAuth() {
    $.ajax({
      url: "php/auth/check.php",
      xhrFields: { withCredentials: true },
      success: function(data) {
        var result = JSON.parse(data);
        this.setState({loggedIn:result.loggedIn});
      }.bind(this)
    });
  }
  logout() {
    $.post({
      url: "php/auth/login.php",
      xhrFields: { withCredentials: true },
      success: function(data) {
        this.checkAuth();
      }.bind(this)
    })
  }
  onPicturePreviewRequest(picture) {
    this.setState({picturePreview: picture});
  }
  onClosePicturePreview() {
    this.setState({picturePreview: null});
  }
  render() {
    return (
      <div className="admin">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Admin-Home | Sport-Paul Vereinsbekleidung</title>
        </Helmet>
        {this.state.loggedIn
        ? <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">Admin</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav>
                {/* <NavItem eventKey={1} href="#/admin">Home</NavItem>*/}
                <NavItem eventKey={2} href="#/admin/clubs">Vereine</NavItem>
                <NavItem eventKey={3} href="#/admin/orders">Bestellungen</NavItem>
                <NavItem eventKey={4} href="#/admin/customers">Kunden</NavItem>
                <NavItem eventKey={5} href="#/admin/settings">Einstellungen</NavItem>
              </Nav>
              <Nav pullRight>
                <NavItem eventKey={-2} onClick={this.logout}>Logout</NavItem>
                <NavItem eventKey={-1} href="#/">zur Hauptseite</NavItem>
              </Nav>
            </Navbar>
            {!this.props.children && ""}
            {this.props.children && React.cloneElement(this.props.children, {
              onPicturePreviewRequest: this.onPicturePreviewRequest.bind(this)
            })}
          </div>
        : <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">Admin</a>
                </Navbar.Brand>
              </Navbar.Header>
            </Navbar>
            <LoginForm onLogin={this.checkAuth.bind(this)} />
          </div>
        }
      </div>
    );
  }
}

export default Admin;
