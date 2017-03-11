import React, { Component } from 'react';

import {
  Nav, NavItem
} from 'react-bootstrap';

class ClubList extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.props.onChange(selected);
  }

  render() {
    return (
      <div className="club-list">
        <Nav bsStyle="pills" stacked activeKey={this.props.selectedClub || -1} onSelect={this.handleChange}>
          <NavItem eventKey={-1}>Home</NavItem>
          {this.props.clubs.map((club, i) =>
            <NavItem key={i} eventKey={parseInt(club.id)}>{club.name}</NavItem>
          )}
        </Nav>
      </div>
    );
  }
}

ClubList.propTypes = {
  selectedClub: React.PropTypes.number,
  clubs: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default ClubList;
