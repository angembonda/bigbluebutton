import { Meteor } from 'meteor/meteor';
import Logger from '/imports/startup/server/logger';
import Meetings from '/imports/api/meetings';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function removeMeshUpdate() {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'RemoveUpdateMeshMsg';

  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  const meeting = Meetings.findOne({ meetingId });
  if (!meeting || meeting.doc === null) return;

  Meetings.update({ meetingId }, { $set: { doc: null } });
  const payload = {};

  Logger.info(`User id=${requesterUserId} stopped sharing Mesh position for meeting=${meetingId}`);

  RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}