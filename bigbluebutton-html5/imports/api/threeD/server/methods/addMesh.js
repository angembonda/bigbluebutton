import { Meteor } from 'meteor/meteor';
import RedisPubSub from '/imports/startup/server/redis';
import { check } from 'meteor/check';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';

export default function updateMesh(options) {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
    const EVENT_NAME = 'AddMeshPubMsg';
  
    const { meetingId, requesterUserId } = extractCredentials(this.userId);
    const {mesh}= options;
  
    check(mesh, String);
    
    Meetings.update({ meetingId }, { $set: { mesh } });

    const payload = { mesh };
  
    Logger.info(`User id=${requesterUserId} added a new Mesh for meeting ${meetingId}`);
  
    return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}