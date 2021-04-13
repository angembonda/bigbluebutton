import { Meteor } from 'meteor/meteor';
import RedisPubSub from '/imports/startup/server/redis';
import { check } from 'meteor/check';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';

export default function updateMesh(options) {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
    const EVENT_NAME = 'UpdateMeshPubMsg';
  
    const { meetingId, requesterUserId } = extractCredentials(this.userId);
    const {doc}= options;
  
    check(doc, String);
    
    Meetings.update({ meetingId }, { $set: { doc } });

    const payload = { doc };
  
    Logger.info(`User id=${requesterUserId} sent a Mesh position for meeting ${meetingId}`);
  
    return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}


