import React, { Component } from 'react';

import { Modal, Button } from 'react-bootstrap';

class PopupModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      title: '',
      description: [],
      positiveButton: null,
      negativeButton: null,
      callback: () => {}
    };

    this.showModal.bind(this);
  }
  showModal(title, description, callback, positiveButton, negativeButton) {
    this.setState({
      show: true,
      title: title,
      description: description,
      positiveButton: positiveButton,
      negativeButton: negativeButton,
      callback: callback
    });
  }
  onClose(success) {
    this.setState({show: false});
    if(this.state.callback != null) {
      this.state.callback(success);
    }
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.onClose.bind(this, false)}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!(this.state.description instanceof Array) && this.state.description}
          {this.state.description instanceof Array && this.state.description.map((line, i) => (<p key={i}>{line}</p>))}
        </Modal.Body>
        <Modal.Footer>
          {this.state.negativeButton != null && <Button onClick={this.onClose.bind(this, false)}>{this.state.negativeButton}</Button>}
          {this.state.positiveButton != null && <Button bsStyle="success" onClick={this.onClose.bind(this, true)}>{this.state.positiveButton}</Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PopupModal;
