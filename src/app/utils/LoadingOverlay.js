import React, { Component } from 'react';

import FontAwesome from 'react-fontawesome';

class LoadingOverlay extends Component {
  render() {
    if(this.props.show) {
      return (
        <div className="loading-overlay">
          <FontAwesome name="spinner" pulse fixedWidth />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default LoadingOverlay;
