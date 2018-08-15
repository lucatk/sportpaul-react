import React, { Component } from 'react';

import { Link } from 'react-router';
import {
  Table,
  ButtonToolbar, Button,
  Glyphicon
} from 'react-bootstrap';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span className="drag-handle"><Glyphicon glyph="menu-hamburger" /></span>);
const SortableClubItem = SortableElement(({i, club, events}) => (
  <tr key={i} data-id={club.id} data-name={club.name}>
    <td className="club-id-sort"><DragHandle />{club.id}</td>
    <td>{club.name}</td>
    <td>{club.orderCount} ausstehende Bestellung{club.orderCount==1?'':'en'}</td>
    <td>{club.productCount} Produkt{club.productCount==1?'':'e'}</td>
    <td className="buttons">
      <ButtonToolbar>
        <Link to={"/admin/clubs/edit/" + club.id}><Button bsSize="small"><Glyphicon glyph="pencil" /> Bearbeiten</Button></Link>
        <Button bsStyle="danger" bsSize="small" onClick={events.onRemove}><Glyphicon glyph="trash" /> Löschen</Button>
      </ButtonToolbar>
    </td>
  </tr>
));
const SortableClubList = SortableContainer(({items, eventHandlers}) => {
  return <tbody>{items.map((club, i) => <SortableClubItem key={i} i={i} index={i} club={club} events={eventHandlers} />)}</tbody>;
});

class ClubsTable extends Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>ausstehende Bestellungen</th>
            <th>Produkte</th>
            <th></th>
          </tr>
        </thead>
        {this.props.data && this.props.data.length > 0
          ? (
            <SortableClubList className="club-sortable-helper" lockAxis="y" items={this.props.sortedClubList}
                  eventHandlers={{
                    onRemove: this.props.onRemove
                  }} onSortEnd={this.props.onSortEnd} useDragHandle={true} />
          ) : <tbody><tr className="no-data"><td colSpan="5">Keine Vereine vorhanden</td></tr></tbody>}
      </Table>
    )
  }
}

export default ClubsTable;
