import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import FullWidthSection from './FullWidthSection';

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
      backgroundColor: '#212121',
      color: '#ffffff',
      textAlign: 'center',
    };
    return (
      <div >
        <AppBar
          iconElementLeft={<IconButton onTouchTap={this.handleTouchTapHome}><HomeIcon /></IconButton>}
          iconElementRight={<FlatButton label="关于" linkButton={true}  onTouchTap={this.handleTouchTapAbout}  />}
          style={appBarStyles}
        />
        <div style={{ minHeight: '100vh' }}>
          {this.props.children}
        </div>
        <FullWidthSection style={footerStyles}>
          <p> Powered By </p>
          <p> React </p>
          <p> Material-UI </p>
          <p> Qiyong He </p>
          <p> www.heqiyong.com </p>
        </FullWidthSection>
      </div>
    );
  },
});

export default Master;
