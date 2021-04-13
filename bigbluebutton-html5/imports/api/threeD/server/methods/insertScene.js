import { Meteor } from 'meteor/meteor';
import RedisPubSub from '/imports/startup/server/redis';
import { check } from 'meteor/check';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';

export default function insertScene(options) {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
    const EVENT_NAME = 'AddScenePubMsg';
  
    const { meetingId, requesterUserId } = extractCredentials(this.userId);
    const {docUrl}= options;
  
    check(docUrl, String);
    
    Meetings.update({ meetingId }, { $set: { docUrl } });

    const payload = { docUrl };
  
    Logger.info(`User id=${requesterUserId} sharing 3d camera position at: ${docUrl} for meeting ${meetingId}`);
  
    return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
