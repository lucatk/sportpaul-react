import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import '../www/css/bootstrap.min.css';
import '../www/css/bootstrap-theme.min.css';
import './index.css';

import App from './main/App';

import Checkout from './checkout/Checkout';

import Admin from './admin/Admin';

import Clubs from './admin/clubs/Clubs';
import ClubEditing from './admin/clubs/ClubEditing';
import ClubCreation from './admin/clubs/ClubCreation';

import Orders from './admin/orders/Orders';
import OrderView from './admin/orders/OrderView';
import OrderEditing from './admin/orders/OrderEditing';

import Settings from './admin/settings/Settings';
import SettingsGeneral from './admin/settings/SettingsGeneral';
import SettingsMailing from './admin/settings/SettingsMailing';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/checkout" component={Checkout}></Route>
    <Route path="/admin" component={Admin}>
      <Route path="/admin/clubs" component={Clubs}>
        <Route path="/admin/clubs/edit/:clubid" component={ClubEditing}></Route>
        <Route path="/admin/clubs/create" component={ClubCreation}></Route>
      </Route>
      <Route path="/admin/orders" component={Orders}>
        <Route path="/admin/orders/view/:clubid/:orderid" component={OrderView}></Route>
        <Route path="/admin/orders/edit/:clubid/:orderid" component={OrderEditing}></Route>
      </Route>
      <Route path="/admin/settings" component={Settings}>
        <IndexRedirect to="/admin/settings/general"></IndexRedirect>
        <Route name="settings-general" path="/admin/settings/general" component={SettingsGeneral}></Route>
        <Route path="/admin/settings/mailing" component={SettingsMailing}></Route>
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
);
