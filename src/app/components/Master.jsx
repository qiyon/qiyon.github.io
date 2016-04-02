import React from 'react';
import {Link} from 'react-router';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';

const Master = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  handleTouchTapHome() {
    this.context.router.push('/');
  },
  handleTouchTapAbout() {
    this.context.router.push('/about');
  },

  render() {
    return (
      <div style={{ minHeight: '100vh' }}>
        <AppBar
          iconElementLeft={<IconButton onTouchTap={this.handleTouchTapHome}><HomeIcon /></IconButton>}
          iconElementRight={<FlatButton label="About" linkButton={true}  onTouchTap={this.handleTouchTapAbout}  />}
        />
        {this.props.children}
      </div>
    );
  },
});

export default Master;
