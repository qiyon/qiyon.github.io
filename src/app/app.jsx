import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    useRouterHistory,
} from 'react-router';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {createHashHistory} from 'history';

//Helpers for debugging
window.React = React;
window.Perf = require('react-addons-perf');

//Needed for onTouchTap
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

//run
ReactDOM.render(
    <Router
        history={useRouterHistory(createHashHistory)({ queryKey: false }) }
        onUpdate={() => window.scrollTo(0, 0) }
        >
        {AppRoutes}
    </Router>,
    document.getElementById('app')
);
