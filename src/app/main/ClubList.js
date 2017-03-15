import React, { Component } from 'react';

import {
  Nav, NavItem,
  Glyphicon
} from 'react-bootstrap';

class ClubList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleShowAll = this.handleShowAll.bind(this);
    this.resetShowAll = this.resetShowAll.bind(this);
  }

  handleChange(selected) {
    this.props.onChange(selected);
  }

  handleShowAll() {
    this.setState({showAll: true});
  }

  resetShowAll() {
    this.setState({showAll: false});
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.showCart || nextProps.selectedClub < 0 || nextProps.clubs.length < 3) {
      this.resetShowAll();
    }
  }

  render() {
    var selectedClub = null;
    if(this.props.selectedClub >= 0) {
      selectedClub = this.getClubWithId(this.props.selectedClub);
    }
    return (
      <div className="club-list">
        <Nav bsStyle="pills" stacked activeKey={this.props.selectedClub || -1} onSelect={this.handleChange}>
          <NavItem eventKey={-1} role="button highlight"><Glyphicon glyph="home" /><p>Home</p></NavItem>

          {(this.props.showCart && this.props.selectedClub >= 0) &&
            <NavItem eventKey={parseInt(selectedClub.id)}>{(typeof selectedClub.logodata === "string" && selectedClub.logodata.length > 0) && <img className="club-logo" src={"clublogos/" + selectedClub.logodata} />}<p>{selectedClub.name}</p></NavItem>
          }
          {this.props.showCart ? (
            this.props.selectedClub < 0 || this.state.showAll || this.props.clubs.length < 3 ? (
              this.props.clubs.filter((el) => (this.props.clubs.length < 3 || this.props.selectedClub < 0 || parseInt(el.id) !== this.props.selectedClub)).map((club, i) =>
                <NavItem key={i} eventKey={parseInt(club.id)}>{(typeof club.logodata === "string" && club.logodata.length > 0) && <img className="club-logo" src={"clublogos/" + club.logodata} />}<p>{club.name}</p></NavItem>
              )
            ) : (
              <NavItem eventKey={this.props.selectedClub} role="button show-all" onClick={this.handleShowAll}><Glyphicon glyph="chevron-down" /></NavItem>
            )
          ) : this.props.clubs.map((club, i) =>
            <NavItem key={i} eventKey={parseInt(club.id)}>{(typeof club.logodata === "string" && club.logodata.length > 0) && <img className="club-logo" src={"clublogos/" + club.logodata} />}<p>{club.name}</p></NavItem>
          )}
          {this.state.showAll && <NavItem eventKey={this.props.selectedClub} role="button show-all" onClick={this.resetShowAll}><Glyphicon glyph="chevron-up" /></NavItem>}

          {this.props.showCart && <NavItem eventKey={-2} role="button highlight"><Glyphicon glyph="shopping-cart" /><p>Warenkorb</p></NavItem>}
        </Nav>
      </div>
    );
  }

  getClubWithId(id) {
    var found = [];
    this.props.clubs.forEach((club) => {
      if(club.id == id) {
        found = club;
      }
    });
    return found;
  }
}

ClubList.propTypes = {
  selectedClub: React.PropTypes.number,
  clubs: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default ClubList;
