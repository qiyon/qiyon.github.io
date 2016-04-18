import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import FullWidthSection from './FullWidthSection';
import {Colors, Spacing} from 'material-ui/lib/styles';

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
    const appBarStyles = {
      position: 'fixed',
    };
    const footerStyles = {
      backgroundColor: Colors.grey900,
      color: Colors.lightWhite,
      textAlign: 'center',
    };
    return (
      <div >
        <AppBar
          iconElementLeft={<IconButton onTouchTap={this.handleTouchTapHome}><HomeIcon /></IconButton>}
          iconElementRight={<FlatButton label="关于" linkButton={true}  onTouchTap={this.handleTouchTapAbout}  />}
          style={appBarStyles}
        />
        <div style={{ minHeight: '100vh', paddingTop: Spacing.desktopKeylineIncrement}}>
          {this.props.children}
        </div>
        <FullWidthSection style={footerStyles}>
          <p> Powered By </p>
          <p> React </p>
          <p> Material-UI </p>
          <p> www.heqiyong.com </p>
        </FullWidthSection>
      </div>
    );
  },
});

export default Master;
