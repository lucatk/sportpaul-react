import React, { Component } from 'react';

import FontAwesome from 'react-fontawesome';

class LoadingPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="loading-overlay">
        <FontAwesome name="spinner" pulse fixedWidth />
      </div>
    );
  }
}

export default LoadingPage;
