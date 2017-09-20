import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import LoadableComponent from './utils/LoadableComponent';

import '../www/css/bootstrap.min.css';
import '../www/css/bootstrap-theme.min.css';
import './index.css';

const App = LoadableComponent({
  loader: () => import(/* webpackChunkName: "main_App" */ './main/App')
});

const Checkout = LoadableComponent({
  loader: () => import(/* webpackChunkName: "checkout_Checkout" */ './checkout/Checkout')
});

const Admin = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_Admin" */ './admin/Admin')
});

const Clubs = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_clubs_Clubs" */ './admin/clubs/Clubs')
});
const ClubEditing = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_clubs_ClubsEditing" */ './admin/clubs/ClubEditing')
});
const ClubCreation = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_clubs_ClubsCreation" */ './admin/clubs/ClubCreation')
});

const Orders = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_orders_Orders" */ './admin/orders/Orders')
});
const OrderView = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_orders_OrderView" */ './admin/orders/OrderView')
});
const OrderEditing = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_orders_OrderEditing" */ './admin/orders/OrderEditing')
});

const Settings = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_settings_Settings" */ './admin/settings/Settings')
});
const SettingsGeneral = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_settings_SettingsGeneral" */ './admin/settings/SettingsGeneral')
});
const SettingsMailing = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_settings_SettingsMailing" */ './admin/settings/SettingsMailing')
});
const SettingsCaptcha = LoadableComponent({
  loader: () => import(/* webpackChunkName: "admin_settings_SettingsCaptcha" */ './admin/settings/SettingsCaptcha')
});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/checkout" component={Checkout}></Route>
    <Route path="/admin" component={Admin}>
      <IndexRedirect to="/admin/clubs"></IndexRedirect>
      <Route name="admin-clubs" path="/admin/clubs" component={Clubs}>
        <Route path="/admin/clubs/edit/:clubid" component={ClubEditing}></Route>
        <Route path="/admin/clubs/create" component={ClubCreation}></Route>
      </Route>
      <Route path="/admin/orders" component={Orders}>
        <Route path="/admin/orders/view/:clubid/:orderid" component={OrderView}></Route>
        <Route path="/admin/orders/edit/:clubid/:orderid" component={OrderEditing}></Route>
      </Route>
      <Route path="/admin/orders/club/:club" component={Orders}></Route>
      <Route path="/admin/settings" component={Settings}>
        <IndexRedirect to="/admin/settings/general"></IndexRedirect>
        <Route name="settings-general" path="/admin/settings/general" component={SettingsGeneral}></Route>
        <Route path="/admin/settings/mailing" component={SettingsMailing}></Route>
        <Route path="/admin/settings/captcha" component={SettingsCaptcha}></Route>
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
);
