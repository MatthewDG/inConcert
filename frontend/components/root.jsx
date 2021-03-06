import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { searchVideos } from '../actions/video_actions';
import App from './app';
import SessionFormContainer from './session_form/session_form_container';
import VideoShowContainer from './video_show/video_show_container';
import VideoIndexContainer from './video_index/video_index_container';
import VideoFormContainer from './video_form/video_form_container';
import SearchResultsContainer from './navbar/search/search_results_container';
import UserShowContainer from './user_show/user_show_container';

const Root = ({ store }) => {
  const isLoggedIn = () => {
    return !!store.getState().session.currentUser;
  }

  const redirectIfLoggedIn = (nextState, replace) => {
    if (isLoggedIn()){
      replace('/');
    }
  }

  const redirectIfLoggedOut = (nextState, replace) => {
    if(!isLoggedIn()){
      replace('/')
    }
  }

  return(
    <Provider store={ store }>
      <Router history={ hashHistory } onUpdate={ () => window.scrollTo(0, 0)}>
        <Route path="/" component={ App }>
          <IndexRoute component={ VideoIndexContainer } />
          <Route path="/login" component={ SessionFormContainer } onEnter={ redirectIfLoggedIn } />
          <Route path="/signup" component={ SessionFormContainer } onEnter={ redirectIfLoggedIn } />
          <Route path="/videos/:id" component={ VideoShowContainer } />
          <Route path="/videos/:id/edit" component={ VideoFormContainer } />
          <Route path="/upload" component={ VideoFormContainer } onEnter={ redirectIfLoggedOut } />
          <Route path="/search" component={ SearchResultsContainer }  />
          <Route path="/users/:id" component={ UserShowContainer } />
          <Route path="/users/:id/likes" component={ UserShowContainer } />
          <Route path="/users/:id/videos" component={ UserShowContainer } />
        </Route>
      </Router>
    </Provider>
  )
}

export default Root;
