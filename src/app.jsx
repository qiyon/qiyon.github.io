import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for onTouchTap
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
        <h1>Webcome to QiyonSite!</h1>,
        document.getElementById('app')
);
