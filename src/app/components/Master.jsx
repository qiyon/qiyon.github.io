import React from 'react';
import {Link} from 'react-router';

const Master = React.createClass({
    render() {
        return (
            <div>
                <h1>Welcome To QiyonSite!</h1>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About</Link>
                {this.props.children}
            </div>
        );
    },
});

export default Master;
