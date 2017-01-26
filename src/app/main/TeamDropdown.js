import React, { Component } from 'react';

class TeamDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || this.props.teams[0]
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select className="team-dropdown" value={this.state.value} onChange={this.handleChange}>
        {this.props.teams.map((team) =>
          <option key={team} value={team}>{team}</option>
        )}
      </select>
    );
  }
}

TeamDropdown.propTypes = {
  teams: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default TeamDropdown;
