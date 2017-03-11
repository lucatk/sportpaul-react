import React, { Component } from 'react';

import {
  Nav, NavItem
} from 'react-bootstrap';

class TeamList extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.props.onChange(selected);
  }

  render() {
    return (
      <div className="team-list">
        <Nav bsStyle="pills" stacked activeKey={this.props.selectedTeam || -1} onSelect={this.handleChange}>
          <NavItem eventKey={-1}>Home</NavItem>
          {this.props.teams.map((team, i) =>
            <NavItem key={i} eventKey={parseInt(team.id)}>{team.name}</NavItem>
          )}
        </Nav>
      </div>
    );
  }
}

TeamList.propTypes = {
  selectedTeam: React.PropTypes.number,
  teams: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default TeamList;
