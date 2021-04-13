import { Meteor } from 'meteor/meteor';
import insertScene from './methods/insertScene';
import removeScene from './methods/removeScene';
import updateMesh from './methods/updateMesh';
import addMesh from './methods/addMesh';
import removeAddedMesh from './methods/removeAddedMesh';
import removeMeshUpdate from './methods/removeMeshUpdate';

Meteor.methods({
  insertScene,
  removeScene,
  updateMesh,
  addMesh,
  removeAddedMesh,
  removeMeshUpdate,

});

