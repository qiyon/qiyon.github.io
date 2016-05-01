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
    const POSTS_JSON_KEY = 'QIYONG_POSTS_JSON_KEY';
    let _self = this;
    //get datas from storage
    let ls_datas = window.localStorage.getItem(POSTS_JSON_KEY);
    if (ls_datas) {
      _self.setState({posts: JSON.parse(ls_datas)}, function () {
        _self.filterPosts();
      });
    }
    //ajax datas, if different ,update
    $.get('/posts.json').then(function (data) {
      let stringifyDatas = JSON.stringify(data);
      if (window.localStorage.getItem(POSTS_JSON_KEY) !== stringifyDatas) {
        window.localStorage.setItem(POSTS_JSON_KEY, stringifyDatas);
        _self.setState({posts: data}, function () {
          _self.filterPosts();
        });
      }
    }, function (err) {
    });
  },
  handleChange: function (event) {
    let newKeyword = event.target.value || '';
    let _self = this;
    this.setState({keyword: newKeyword}, function () {
      _self.filterPosts();
    });
  },
  handleClickPost: function (id) {
    this.context.router.push('/post/' + id);
  },
  filterPosts: function () {
    let filterPosts = [];
    let keyword = this.state.keyword;
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
                ref={function(textInput){
                  if (textInput != null){
                    textInput.focus();
                  }
                }}
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