import { Meteor } from 'meteor/meteor';
import shareCamera from './methods/shareCamera';
import ClearCameraUrl from './methods/ClearCameraUrl';
import updateMesh from './methods/updateMesh';
import removeMeshUpdate from './methods/removeMeshUpdate';

Meteor.methods({
  shareCamera,
  ClearCameraUrl,
  updateMesh,
  removeMeshUpdate,

});

