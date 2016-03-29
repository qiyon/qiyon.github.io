import React from 'react';
import {
    Route,
    Redirect,
    IndexRoute,
} from 'react-router';

//import routes
import Master from './components/Master';
import Home from './components/pages/Home';
import About from './components/pages/About';

const AppRoutes = (
    <Route path="/" component={Master}>
        <IndexRoute component={Home} />
        <Route path="home" component={Home} />
        <Route path="about" component={About} />
    </Route>
);
export default AppRoutes;
