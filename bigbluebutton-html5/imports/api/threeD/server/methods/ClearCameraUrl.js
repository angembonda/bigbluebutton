import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function ClearCameraUrl() {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'RemoveSceneMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  const meeting = Meetings.findOne({ meetingId });
  if (!meeting || meeting.docUrl === null) return;

  Meetings.update({ meetingId }, { $set: { docUrl: null } });
  const payload = {};

  Logger.info(`User id=${requesterUserId} stopped sharing 3d camera position for meeting=${meetingId}`);

  RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}