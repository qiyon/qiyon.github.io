import React from 'react';
import FullWidthSection from '../FullWidthSection';
import $ from 'jquery';
import marked from 'marked';
import Config from '../Config';
import RaisedButton  from 'material-ui/lib/raised-button';

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
    let bottonStyles = {
      marginRight: '6px',
    };
    return (
      <FullWidthSection>
        <div style={{maxWidth:'1000px',margin:'auto'}}>
          <RaisedButton
            label="在GitHub中查看"
            style={bottonStyles}
            linkButton={true}
            href={Config.gitHubUrl+'blob/master/posts/' + this.props.params.postId + '.md'}
          />
          <RaisedButton
            label="在GitHub中编辑"
            style={bottonStyles}
            linkButton={true}
            href={Config.gitHubUrl+'edit/master/posts/' + this.props.params.postId + '.md'}
          />
          <div dangerouslySetInnerHTML={{__html: this.state.postHtml}}/>
        </div>
      </FullWidthSection>
    );
  },
});

export default PostPage;
