import React, { Component } from 'react';

import {
  Modal, ButtonToolbar, Button
} from 'react-bootstrap';

class UhlsportLightbox extends Component {
  render() {
    return (
      <div className={"image-lightbox" + (this.props.show?"":" hidden")}>
        <div className="image-lightbox-inner">
          <div className="title">
            <h4>Farbe: {this.props.id.substr(7)}</h4>
          </div>
          <img src={"php/uhlsport/loadimage.php?id=" + this.props.id} onLoad={this.props.onLoaded} onError={this.props.onClose.bind(this, false)} />
          <div className="buttons">
            <Button onClick={this.props.onClose.bind(this, false)}>Abbrechen</Button>
            <Button bsStyle="success" onClick={this.props.onClose.bind(this, true)}>Übernehmen</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UhlsportLightbox;
