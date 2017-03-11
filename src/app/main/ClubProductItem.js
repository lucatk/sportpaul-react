import React, { Component } from 'react';

class ClubProductItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSize: '',
      flocking: ''
    };

    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleFlockingChange = this.handleFlockingChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  handleSizeChange(event) {
    this.setState({selectedSize: event.target.value});
  }

  handleFlockingChange(event) {
    this.setState({flocking: event.target.value});
  }

  handleAddClick(event) {
    this.props.onAdd(this.props.product, this.state);
    this.setState({flocking: ''});
  }

  render() {
    return (
      <div className="product-item">
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="left-column col-xs-4">
              <div className="img-container">
                <img className="product-item-image" src="http://placehold.it/200x300" role="presentation" />
              </div>
            </div>
            <div className="right-column col-xs-8">
              <ul className="list-group">
                <li className="product-item-name list-group-item">
                  {this.props.product.name}
                  {(this.props.product.internalid && this.props.product.internalid.length > 0) && <span className="internalid"> (Art. {this.props.product.internalid})</span>}
                </li>
                {(this.props.product.additionalInfo && this.props.product.additionalInfo.length > 0) &&
                <li className="list-group-item">{this.props.product.additionalInfo}</li>}
                <li className="product-item-pricegroups list-group-item">
                  {this.props.product.pricegroups.map((pricegroup, i) =>
                    <p className="pricegroup" key={i}>
                      <span className="sizes">{pricegroup.sizes.join(", ")}:</span> {pricegroup.price.toFixed(2).replace(".", ",")} €
                    </p>
                  )}
                </li>
                <li className="product-item-action list-group-item">
                  <div className="row">
                    <div className={this.state.selectedSize.length < 1 ? "col-xs-9 col-md-10" : "col-xs-7"}>
                      <select className="product-item-size form-control input-sm" value={this.state.selectedSize} onChange={this.handleSizeChange}>
                        <option value="">Größe auswählen...</option>
                        {this.props.product.pricegroups.map((pricegroup, i) =>
                          <optgroup key={i} label="──────────">
                            {pricegroup.sizes.map((size, ii) =>
                              <option key={ii} value={size}>{size}</option>
                            )}
                          </optgroup>
                        )}
                      </select>
                    </div>
                    <button className={"btn btn-primary btn-sm cart-button " + (this.state.selectedSize.length < 1 ? "col-xs-3 col-md-2" : "col-xs-5")} type="button"><span className="glyphicon glyphicon-shopping-cart"></span></button>
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
