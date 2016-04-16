import React from 'react';
import FullWidthSection from '../FullWidthSection';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardHeader from 'material-ui/lib/card/card-header';
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
      postsShow: [],
    };
  },
  componentDidMount: function () {
    $.get('/posts.json').then((function (data) {
      this.setState({
        posts: data,
      });
      this.filterPosts(this.state.keyword);
    }).bind(this), (function (err) {
    }).bind(this));
  },
  handleChange: function (event) {
    let newKeyword = event.target.value || '';
    this.setState({keyword: newKeyword});
    this.filterPosts(newKeyword);
  },
  handleClickPost: function (id) {
    this.context.router.push('/post/' + id);
  },
  filterPosts: function (keyword) {
    let filterPosts = [];
    if (keyword) {
      keyword = keyword.toLowerCase();
      filterPosts = this.state.posts.filter((function (onePost) {
        for (let col of ['id', 'title', 'tag']) {
          if (onePost[col].toLowerCase().indexOf(keyword) >= 0) {
            return true;
          }
        }
        return false;
      }));
    } else {
      filterPosts = this.state.posts;
    }
    this.setState({
      postsShow: filterPosts,
    });
  },
  render() {
    let postCardStyles = {
      cursor: 'pointer',
      marginTop: '12px',
    };
    let componentSelf = this;
    let posts = this.state.postsShow.map(function (postData) {
      return (
        <div onClick={componentSelf.handleClickPost.bind(null, postData.id)} key={postData.id} style={postCardStyles}>
          <Card >
            <CardHeader title={postData.title} subtitle={postData.time.substr(0, 10)}/>
          </Card>
        </div>
      );
    });
    return (
      <FullWidthSection>
        <div style={{maxWidth:'1000px',margin:'auto'}}>
          <Card>
            <CardText>
              <TextField
                floatingLabelText="搜索"
                fullWidth={true}
                value={this.state.keyword}
                onChange={this.handleChange}
              />
            </CardText>
          </Card>
          {posts}
        </div>
      </FullWidthSection>
    );
  },
});

export default HomePage;