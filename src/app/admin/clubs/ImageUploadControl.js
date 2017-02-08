import React, { Component } from 'react';

class ImageUploadControl extends Component {
  constructor(props) {
    super(props);

    this.fileReader = new FileReader();
    this.fileReader.onload = ((e) => {
      this.setState({imagePreview: e.target.result});
    }).bind(this);

    this.state = {
      image: this.props.value,
      imagePreview: ''
    };
    this.updateImage(this.props.value);

    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.updateImage(nextProps.value);
  }
  onChange(e) {
    this.updateImage(e.target.files[0]);
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
        <img className="file-preview img-thumbnail" src={typeof this.state.image === "string" ? (this.props.searchPath?this.props.searchPath:'') + this.state.image : this.state.logoPreview} />
      </div>
    );
  }
}

export default ImageUploadControl;
