import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function removeAddedMesh() {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'RemoveAddedMeshMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  const meeting = Meetings.findOne({ meetingId });
  if (!meeting || meeting.mesh === null) return;

  Meetings.update({ meetingId }, { $set: { mesh: null } });
  const payload = {};

  Logger.info(`User id=${requesterUserId} stopped adding new Mesh position for meeting=${meetingId}`);

  RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}