import React, { Component } from 'react';

class ClubShowcaseItem extends Component {
  render() {
    return (
      <div className="club-item" onClick={this.props.onClick}>
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="img-container">
              {(typeof this.props.club.logodata === "string" && this.props.club.logodata.length > 0) && <img className="club-item-image" src={"clublogos/" + this.props.club.logodata} role="presentation" onClick={this.handlePreviewClick} />}
            </div>
            <h3 className="club-item-name">{this.props.club.name}</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default ClubShowcaseItem;
