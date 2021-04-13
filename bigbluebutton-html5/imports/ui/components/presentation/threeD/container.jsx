/* import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import {setSceneUrl, getSceneUrl } from './service';
import ThreeComponent from './component';

const ThreeContainer = props => (
  <ThreeComponent {...{ ...props }} />
);

export default withTracker(() => {
  //const ThreeDStart = Session.get('3dStart');

  return {
  
    isViewer,
    isPresenter,
    getUrl: getSceneUrl(),
    setUrl: setSceneUrl(),
  };
})(ThreeContainer); */