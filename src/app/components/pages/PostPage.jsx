import React from 'react';
import FullWidthSection from '../FullWidthSection';
import $ from 'jquery';
import marked from 'marked';

const PostPage = React.createClass({
  getInitialState: function () {
    return {
      postSrc: "",
      postHtml: "",
    };
  },
  componentWillMount: function () {
    marked.setOptions({
      gfm: true,
    });
  },
  componentDidMount() {
    let postId = this.props.params.postId || null;
    if (!postId) {
      this.setState({
        postSrc: "获取内容失败",
        postHtml: "获取内容失败",
      });
    } else {
      $.get("/posts/" + postId + '.md').then((function (data) {
        this.setState({
          postSrc: data,
          postHtml: marked(data),
        });
      }).bind(this), (function (err) {
        this.setState({
          postSrc: "获取内容失败",
          postHtml: "获取内容失败",
        });
      }).bind(this));
    }
  },
  render() {
    return (
      <FullWidthSection>
        <div dangerouslySetInnerHTML={{__html: this.state.postHtml}}/>
      </FullWidthSection>
    );
  },
});

export default PostPage;
