import React, { Component } from 'react';

import ClubShowcaseItem from './ClubShowcaseItem.js';

class ClubShowcase extends Component {
  render() {
    return (
      <div className="club-showcase">
        {this.props.clubList && this.props.clubList.length > 0
          ? this.props.clubList.map((club) =>
              <ClubShowcaseItem
                key={club.id}
                club={club}
                onClick={this.props.onChange.bind(this, parseInt(club.id))} />
            )
          : <p>Keine Vereine vorhanden</p>}
      </div>
    );
  }
}

export default ClubShowcase;
