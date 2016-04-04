import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';

//import routes
import Master from './components/Master';
import Home from './components/pages/Home';
import About from './components/pages/About';
import PostPage from './components/pages/PostPage';

const AppRoutes = (
  <Route path="/" component={Master}>
    <IndexRoute component={Home}/>
    <Route path="home" component={Home}/>
    <Route path="about" component={About}/>
    <Route path="post/:postId" component={PostPage}/>
  </Route>
);
export default AppRoutes;
