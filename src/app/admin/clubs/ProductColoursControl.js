import React, { Component, ReactDOM } from 'react';

import { FormControl, Button, Glyphicon } from 'react-bootstrap';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

import ImageUploadControl from './ImageUploadControl';

const DragHandle = SortableHandle(() => <span className="drag-handle"><Glyphicon glyph="menu-hamburger" /></span>);
const SortableColourItem = SortableElement(({i, colour, events}) => {
  return (
    <div key={i} className="row">
      <div className="col-sm-2">
        <FormControl type="text" value={colour.id} placeholder="ID" onChange={events.onIDChange.bind(this, i)} onBlur={events.onIDConfirm.bind(this, i)} ref={events.inputRef.bind(this, i)} />
      </div>
      <div className="col-sm-4">
        <FormControl type="text" value={colour.name} placeholder="Bezeichnung..." onChange={events.onNameChange.bind(this, i)} onBlur={events.onNameConfirm.bind(this, i)} />
      </div>
      <div className="col-sm-3">
        <ImageUploadControl showPreview={false} value={colour.picture} searchPath="productpics/" onChange={events.onPictureChange.bind(this, i)} />
      </div>
      <Button bsSize="small" bsClass="mini-btn btn" onClick={events.showPicturePreview.bind(this, i)} disabled={colour.picture == null}><Glyphicon glyph="search" /></Button>
      <Button bsSize="small" bsClass="mini-btn btn" onClick={events.onRemoveColour.bind(this, i)}><Glyphicon glyph="remove" /></Button>
      <DragHandle />
    </div>
  );
});
const SortableColourList = SortableContainer(({items, eventHandlers}) => {
  return <div>{items.map((colour, i) => <SortableColourItem key={i} i={i} index={i} colour={colour} events={eventHandlers} />)}</div>;
});

class ProductColoursControl extends Component {
  constructor(props) {
    super(props);

    this.idInputs = [];
    this.state = {
      // editing: false,
      data: []
    };

    this.onAddGroup = this.onAddGroup.bind(this);
    // this.onIDChange = this.onIDChange.bind(this);
    // this.onNameChange = this.onNameChange.bind(this);
    // this.onPictureChange = this.onPictureChange.bind(this);
    // this.onIDConfirm = this.onIDConfirm.bind(this);
    // this.onNameConfirm = this.onNameConfirm.bind(this);
    // this.onRemoveColour = this.onRemoveColour.bind(this);
    // this.showPicturePreview = this.showPicturePreview.bind(this);
  }
  onAddGroup() {
    var data = this.state.data;
    this.focusGroup = data.length;
    data[data.length] = {
      id: "",
      name: "",
      picture: null
    };
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  onIDChange(i, event) {
    var data = this.state.data;
    data[i].id = event.target.value;
    this.setState({data:data});
  }
  onNameChange(i, event) {
    var data = this.state.data;
    data[i].name = event.target.value;
    this.setState({data:data});
  }
  onPictureChange(i, newPicture) {
    var data = this.state.data;
    data[i].picture = newPicture;
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  onIDConfirm(i) {
    var data = this.state.data;
    if(data[i].id.length < 1) {
      data.splice(i, 1);
      this.setState({data:data});
    }
    this.props.onValueChange(data);
  }
  onNameConfirm(i) {
    this.props.onValueChange(this.state.data);
  }
  onRemoveColour(i) {
    var data = this.state.data;
    data.splice(i, 1);
    this.setState({data:data});
    this.props.onValueChange(data);
  }
  showPicturePreview(i) {
    this.props.onPicturePreviewRequest(this.state.data[i].picture);
  }
  onSortEnd({oldIndex, newIndex}) {
    var data = arrayMove(this.state.data, oldIndex, newIndex);
    this.setState({
      data: data,
    });
    this.props.onValueChange(data);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value
    });
  }
  render() {
    return (
      <div>
        <SortableColourList helperClass="colour-sortable-helper" lockAxis="y" items={this.state.data} eventHandlers={{
          onIDChange: this.onIDChange.bind(this),
          onIDConfirm: this.onIDConfirm.bind(this),
          onNameChange: this.onNameChange.bind(this),
          onNameConfirm: this.onNameConfirm.bind(this),
          onPictureChange: this.onPictureChange.bind(this),
          showPicturePreview: this.showPicturePreview.bind(this),
          onRemoveColour: this.onRemoveColour.bind(this),
          inputRef: ((i, input) => { this.idInputs[i] = input; }).bind(this)
        }} onSortEnd={this.onSortEnd.bind(this)} useDragHandle={true} />
        <div className="row">
          <div className="col-sm-12">
            <FormControl type="text" placeholder="Farbe hinzufügen..." onFocus={this.onAddGroup} />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.focusNewGroup();
  }
  componentDidUpdate() {
    this.focusNewGroup();
  }
  focusNewGroup() {
    if(this.focusGroup !== undefined && this.focusGroup !== -1) {
      this.idInputs[this.focusGroup]._reactInternalInstance._renderedComponent._hostNode.focus();
      this.focusGroup = -1;
    }
  }
}

export default ProductColoursControl;
