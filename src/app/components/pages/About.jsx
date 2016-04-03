import React from 'react';
import FullWidthSection from '../FullWidthSection';

const AboutPage = React.createClass({
  render() {
    return (
      <FullWidthSection>
        <p>
          一个搭建在<strong>github.io</strong>上的，基于<strong>React</strong>和<strong>Material-UI</strong>的个人网站。
        </p>
      </FullWidthSection>
    );
  },
});

export default AboutPage;
