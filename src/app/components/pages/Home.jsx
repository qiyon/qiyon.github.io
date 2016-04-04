import React from 'react';
import {Link} from 'react-router';
import FullWidthSection from '../FullWidthSection';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import $ from 'jquery';

const HomePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
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
    }).bind(this), (function (err) {
    }).bind(this));
  },
  render() {
    let posts = this.state.posts.map(function (postData) {
      return (
        <Card key={postData.id}>
          <CardText>
            <Link to={'/post/' + postData.id}>{postData.title}</Link>
          </CardText>
        </Card>
      );
    });
    return (
      <FullWidthSection>
        <Card>
          <CardText>
            <TextField
              floatingLabelText="搜索"
            />
          </CardText>
        </Card>
        {posts}
      </FullWidthSection>
    );
  },
});

export default HomePage;