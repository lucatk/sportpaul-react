import React, { Component } from 'react';

class ImageUploadControl extends Component {
  constructor(props) {
    super(props);

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({imagePreview: e.target.result});
    }).bind(this);

    if(this.props.value) {
      this.state = {
        image: this.props.value,
        imagePreview: ''
      };
      if(this.props.value && typeof this.props.value === "object")
        this.fileReader.readAsDataURL(this.props.value);
    } else {
      this.state = {
        image: null,
        imagePreview: ''
      };
    }

    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.updateImage(nextProps.value);
  }
  onChange(e) {
    this.props.onChange(e.target.files[0]);
  }
  updateImage(image) {
    if(image && typeof image === "object")
      this.fileReader.readAsDataURL(image);
    this.setState({image: image});
  }
  render() {
    return (
      <div>
        <input type="file" className="form-control" onChange={this.onChange} />
        <img className="file-preview img-thumbnail" src={(typeof this.state.image === "string" && (this.state.image||"").length > 0) ? (this.props.searchPath?this.props.searchPath:'') + this.state.image : this.state.imagePreview} />
      </div>
    );
  }
}

export default ImageUploadControl;
