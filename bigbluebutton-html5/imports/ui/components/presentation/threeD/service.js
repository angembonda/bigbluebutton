import Meetings from '/imports/api/meetings';
import { makeCall } from '/imports/ui/services/api';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const sendCameraUrl = (docUrl) => {
  makeCall('insertScene',{docUrl});
};

const getCameraUrl = ()=> {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({meetingId}, {fields: {docUrl: 1 }});
  return meeting.docUrl ;
};


const removeUpdatedMesh = () => {
  makeCall('removeMeshUpdate');
};

const removeNewMesh = () => {
  makeCall('removeAddedMesh');
};
const removeCameraUrl = () => {
  makeCall('removeScene');
};

const setMeshUrl = (doc)=> {
  makeCall('updateMesh',{doc});

}
const addmesh = (mesh)=> {
  makeCall('addMesh',{mesh});

}
const getMeshUrl = ()=> {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({meetingId}, {fields: {doc: 1 }});
  return meeting.doc ;
};
const getNewMesh = ()=> {
  const meetingId = Auth.meetingID;
  const meeting = Meetings.findOne({meetingId}, {fields: {mesh: 1 }});
  return meeting.mesh ;
};
const amIModerator = () => {
  const User = Users.findOne({ intId: Auth.userID }, { fields: { role: 1 } });
  return User.role === ROLE_MODERATOR;
};


export {
    getCameraUrl,
    sendCameraUrl,
    removeCameraUrl,
    setMeshUrl,
    getMeshUrl,
    addmesh,
    getNewMesh,
    amIModerator,
    removeUpdatedMesh,
    removeNewMesh,


};