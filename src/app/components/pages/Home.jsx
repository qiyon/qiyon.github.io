import React from 'react';
import FullWidthSection from '../FullWidthSection';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import $ from 'jquery';

const HomePage = React.createClass({
  getInitialState: function () {
    return {
      keyword: "",
      posts: [],
    };
  },
  componentDidMount: function () {
    $.get('/posts.json').then((function (data) {
      this.setState({
        posts: data,
      });
    }).bind(this), function (err) {
    });
  },
  render() {
    let posts = this.state.posts.map(function (postData) {
      return (
        <Card key={postData.id}>
          <CardText>{postData.title}</CardText>
        </Card>
      );
    });
    return (
      <FullWidthSection>
        <Card>
          <CardText>
            <TextField
              floatingLabelText="搜索"
            /><br/>
          </CardText>
        </Card>
        {posts}
      </FullWidthSection>
    );
  },
});

export default HomePage;