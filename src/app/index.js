import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import App from './main/App';
import Checkout from './checkout/Checkout';

import Admin from './admin/Admin';
import Clubs from './admin/clubs/Clubs';
import ClubEditing from './admin/clubs/ClubEditing';
import Orders from './admin/orders/Orders';
import OrderView from './admin/orders/OrderView';
import Settings from './admin/settings/Settings';

import './index.css';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/checkout" component={Checkout}></Route>
    <Route path="/admin" component={Admin}>
      <Route path="/admin/clubs" component={Clubs}>
        <Route path="/admin/clubs/edit/:clubid" component={ClubEditing}></Route>
      </Route>
      <Route path="/admin/orders" component={Orders}>
        <Route path="/admin/orders/view/:clubid/:orderid" component={OrderView}></Route>
      </Route>
      <Route path="/admin/settings" component={Settings}></Route>
    </Route>
  </Router>,
  document.getElementById('root')
);
