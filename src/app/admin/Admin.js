import React, { Component } from 'react';

import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';

import './Admin.css';

class Admin extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    document.title = "Admin-Home | Sport-Paul Vereinsbekleidung";
    return (
      <div className="admin">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Admin</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#/admin">Home</NavItem>
            <NavItem eventKey={2} href="#/admin/clubs">Vereine</NavItem>
            <NavItem eventKey={3} href="#/admin/orders">Bestellungen</NavItem>
            <NavItem eventKey={4} href="#/admin/settings">Einstellungen</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={-1} href="#/">zur Hauptseite</NavItem>
          </Nav>
        </Navbar>
        {!this.props.children && ""}
        {this.props.children}
      </div>
    );
  }
}

export default Admin;
