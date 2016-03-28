import React from 'react';

const Master = React.createClass({
    render() {
        return (
            <div>
                <h1>Welcome To QiyonSite!</h1>
                {this.props.children}
            </div>
        );
    },
});

export default Master;