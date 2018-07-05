import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import App from '../../ui/App.js';

// import AppContainer from '../../ui/containers/AppContainer.js';
// import AboutContainer from '../../ui/containers/AboutContainer.js';
// import NotFoundPage from '../../ui/pages/NotFoundPage.js';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Switch>
            <Route exact path="/" component={App}/>
            {/*<Route exact path="/" component={AppContainer}/>*/}
            {/*<Route exact path="/about" component={AboutContainer}/>*/}
            {/*<Route component={NotFoundPage}/>*/}
        </Switch>
    </Router>
);
