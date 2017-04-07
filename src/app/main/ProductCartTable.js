import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';

class ProductCartTable extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Produkt</th>
            <th>Art. Nr.</th>
            <th>Größe</th>
            <th>Beflockung</th>
            <th>Preis</th>
            <th></th>
          </tr>
        </thead>
          {this.props.data && this.props.data.length > 0
          ? [(<tbody>
              {this.props.data.map((row, i) =>
                <tr key={i} data-id={row.id} data-product={row.name}>
                  <td>{i+1}</td>
                  <td><img className="product-thumbnail" onClick={this.props.onPreview.bind(null, row)} src={"productpics/" + row.picture} />{row.name}</td>
                  <td>{row.internalid}</td>
                  <td>{row.size}</td>
                  {(row.flocking && row.flocking.length > 0) ?
                  <td className="flocking">"{row.flocking}"</td> :
                  <td>-</td>}
                  <td>
                    <p>{this.getPriceFromPricegroups(row.pricegroups, row.size).toFixed(2).replace('.', ',')} €</p>
                    {(row.flocking && row.flocking.length > 0 && row.flockingPrice > 0) && <p className="flocking-price">+{row.flockingPrice.toFixed(2).replace('.', ',')} €</p>}
                  </td>
                  <td className="buttons">
                    <ButtonToolbar>
                      <Button bsStyle="danger" bsSize="small" onClick={this.props.onRemove.bind(null, i)}><Glyphicon glyph="trash" /> Entfernen</Button>
                    </ButtonToolbar>
                  </td>
                </tr>
              )}
            </tbody>),
            (<tfoot>
              <tr>
                <td></td>
                <td colSpan="4">{this.props.data.length} Artikel</td>
                <td>{this.props.data.reduce((acc, val) => acc+this.getPriceFromPricegroups(val.pricegroups, val.size)+(val.flocking.length>0?val.flockingPrice:0), 0).toFixed(2).replace('.', ',')} €</td>
                <td></td>
              </tr>
            </tfoot>)] : <tbody><tr className="no-data"><td colSpan="7">Warenkorb leer</td></tr></tbody>}


      </Table>
    )
  }

  getPriceFromPricegroups(pricegroups, size) {
    for(var i in pricegroups) {
      if(pricegroups[i].sizes.includes(size)) return pricegroups[i].price;
    }
    return 0;
  }
}

export default ProductCartTable;
