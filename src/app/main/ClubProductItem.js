import React, { Component } from 'react';

class ClubProductItem extends Component {
  constructor(props) {
    super(props);

    this.regexSizechainNumbers = /^\d{1,}$/
    this.regexSizechainLetters = /^(\dX|X*)(S|L)|M$/

    this.state = {
      selectedColour: -1,
      selectedSize: '',
      flocking: ''
    };

    this.handleColourChange = this.handleColourChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
  }

  handleColourChange(event) {
    this.setState({selectedColour: event.target.value});
  }

  handleSizeChange(event) {
    this.setState({selectedSize: event.target.value});
  }

  handleAddClick(event) {
    this.props.onAdd(this.props.product, this.state);
    this.setState({selectedColour: -1, selectedSize: ''});
  }

  handlePreviewClick(event) {
    var productPicture = this.props.product.picture;
    if(this.props.product.colours.length > 0) {
      if(this.props.product.colours.length == 1) {
        if(this.props.product.colours[0].picture != null)
          productPicture = this.props.product.colours[0].picture;
      } else {
        if(this.state.selectedColour < 0) {
          productPicture = this.props.product.colours[0].picture;
        } else {
          if(this.props.product.colours[this.state.selectedColour].picture != null)
            productPicture = this.props.product.colours[this.state.selectedColour].picture;
        }
      }
    }
    this.props.onPreview(productPicture);
  }

  render() {
    var productPicture = this.props.product.picture;
    if(this.props.product.colours.length > 0) {
      if(this.props.product.colours.length == 1) {
        if(this.props.product.colours[0].picture != null)
          productPicture = this.props.product.colours[0].picture;
      } else {
        if(this.state.selectedColour < 0) {
          productPicture = this.props.product.colours[0].picture;
        } else {
          if(this.props.product.colours[this.state.selectedColour].picture != null)
            productPicture = this.props.product.colours[this.state.selectedColour].picture;
        }
      }
    }
    return (
      <div className="product-item">
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="left-column col-xs-4">
              <div className="img-container">
                <img className="product-item-image" src={"productpics/" + productPicture} role="presentation" onClick={this.handlePreviewClick} />
              </div>
            </div>
            <div className="right-column col-xs-8">
              <ul className="list-group">
                <li className="product-item-name list-group-item">
                  {this.props.product.name} {this.props.product.colours.length == 1 && this.props.product.colours[0].name}
                  {(this.props.product.internalid && this.props.product.internalid.length > 0) && <span className="internalid"> (Art. {this.props.product.internalid}{this.props.product.colours.length == 1 && "; Farbe: " + this.props.product.colours[0].id})</span>}
                </li>
                {(this.props.product.additionalInfo && this.props.product.additionalInfo.length > 0) &&
                <li className="list-group-item">{this.props.product.additionalInfo}</li>}
                <li className="product-item-pricegroups list-group-item">
                  {this.props.product.pricegroups.map((pricegroup, i) =>
                    <p className="pricegroup" key={i}>
                      <span className="sizes">{pricegroup.sizes.every(s => s.match(this.regexSizechainNumbers)) || pricegroup.sizes.every(s => s.match(this.regexSizechainLetters)) ? pricegroup.sizes[0] + "-" + pricegroup.sizes[pricegroup.sizes.length-1] : pricegroup.sizes.join(", ")}:</span> {pricegroup.price.toFixed(2).replace(".", ",")} €
                    </p>
                  )}
                </li>
                <li className="product-item-action list-group-item">
                  {this.props.product.defaultFlocking && <p className="flocking-info">{this.props.product.defaultFlockingInfo}</p>}
                  {this.props.product.colours.length > 1 && <div className="row">
                    <div className="col-xs-12">
                      <select className="product-item-colour form-control input-sm" value={this.state.selectedColour} onChange={this.handleColourChange}>
                        <option value={-1}>Farbe...</option>
                        {this.props.product.colours.map((colour, i) =>
                          <option key={i} value={i}>{colour.id} {colour.name}</option>
                        )}
                      </select>
                    </div>
                  </div>}
                  <div className="row">
                    <div className="col-xs-8">
                      <select className="product-item-size form-control input-sm" value={this.state.selectedSize} onChange={this.handleSizeChange}>
                        <option value="">Größe...</option>
                        {this.props.product.pricegroups.map((pricegroup, i) =>
                          <optgroup key={i} label="──────────">
                            {pricegroup.sizes.map((size, ii) =>
                              <option key={ii} value={size}>{size}</option>
                            )}
                          </optgroup>
                        )}
                      </select>
                    </div>
                    <button disabled={this.state.selectedSize.length < 1 || (this.props.product.colours && this.props.product.colours.length > 0 && this.state.selectedColour < 0)} className="btn btn-primary btn-sm cart-button col-xs-4" type="button" onClick={this.handleAddClick}><span className="glyphicon glyphicon-shopping-cart"></span></button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ClubProductItem.propTypes = {
  product: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    internalid: React.PropTypes.string,
    additionalInfo: React.PropTypes.string,
    pricegroups: React.PropTypes.arrayOf(React.PropTypes.shape({
      sizes: React.PropTypes.arrayOf(React.PropTypes.string),
      price: React.PropTypes.number
    })).isRequired,
    flockingPrice: React.PropTypes.number
  }).isRequired,
  onAdd: React.PropTypes.func
};

export default ClubProductItem;
