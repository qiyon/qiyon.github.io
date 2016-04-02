import React from 'react';
import FullWidthSection from '../FullWidthSection';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';

const HomePage = React.createClass({
  render() {
    return (
      <FullWidthSection>
        <Card>
          <CardText>
            <TextField
              floatingLabelText="搜索"
            /><br/>
          </CardText>
        </Card>
      </FullWidthSection>
    );
  },
});

export default HomePage;