import React, { Component } from 'react';

class ImageLightbox extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }
  onClick(event) {
    if(event.target === this._reactInternalInstance._renderedComponent._hostNode) {
      this.props.onClose();
    }
  }
  render() {
    return (
      <div className="image-lightbox" onClick={this.onClick}>
        <div className="image-lightbox-inner">
          <button type="button" className="close" aria-label="Close" onClick={this.props.onClose}><span aria-hidden="true">×</span></button>
          <img src={this.props.image} />
        </div>
      </div>
    );
  }
}

export default ImageLightbox;
