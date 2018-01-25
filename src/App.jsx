import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, withRouter, IndexRoute} from 'react-router-dom';
import {Switch, browserHistory, Redirect} from 'react-router';
import PropTypes from 'prop-types'

import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';

const contentNode = document.getElementById('contents');

const NoMatch = () => <p>Page Not Found</p>;

const Header = () => (
  <Navbar fluid id="pass">
    <Navbar.Header>
      <Navbar.Brand>Issue Tracker</Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/issues">
        <NavItem>Issues</NavItem>
      </LinkContainer>
      <LinkContainer to="/reports">
        <NavItem>Reports</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight >
      {/* <NavItem><Glyphicon glyph="plus" />Create Issue</NavItem> */}
      <NavItem><IssueAddNavItem /></NavItem>
      <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal"/>} noCaret>
        <MenuItem>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </Navbar>
);

const App = (props) => (
  <div>
    {/* <div className="header">
      <h1>Issue Tracker</h1>
    </div> */}
    <Header />
    <div className="container-fluid">
      {props.children}
      <hr />
      <h5><small>
          Hi I am a footer
      </small></h5>
    </div>
    {/* <div className="footer">
      Hi I am a footer
    </div> */}
  </div>
);

const Dashboard = (prop) => (
  <div>Index</div>
);



const RoutedApp = () => (
  <Router history={browserHistory}>
      {/* <Route path="/" component={App}> */}
      <App>
        <Switch>
          <Route exact path="/issues/:id" component={IssueEdit} />
          <Route exact path="/issues" component={withRouter(IssueList)} />
          <Redirect from="/" to="/issues" />
          {/* <Route exact path="/" component={Dashboard} /> Alternate to IndexRoute */}
          <Route path="*" component={NoMatch} />
        </Switch>
      </App>
      {/* </Route> */}
  </Router>
);

ReactDOM.render(<RoutedApp />, contentNode)

if(module.hot){
  module.hot.accept();
}

App.propTypes = {
  children : PropTypes.object.isRequired,
}
