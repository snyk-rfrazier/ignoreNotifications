import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export const handler = async (event) => {
  const snsClient = new SNSClient({});
  const details = event.detail;
  const content = details.content;

  const ignoredByUserId = details.actingUserPublicId;
  const actingOrgPublicId = details.actingOrgPublicId;
  const projectId = details.actingProjectPublicId
  const issueId = content.issueId;
  const beforeReason = content.before[0].reason;
  const beforeReasonType = content.before[0].reasonType;
  const beforeIgnoreCreated = content.before[0].created;
  const beforeIgnoreExpires = content.before[0].expires;
  const afterReason = content.after[0].reason;
  const afterReasonType = content.after[0].reasonType;
  const afterIgnoreCreated = content.after[0].created;
  const afterIgnoreExpires = content.after[0].expires;
  const previouslyIgnoredBy = content.before[0].ignoredBy.id
  const eventTime = event.time;

  const message = `Snyk Ignore Edited Alert!
  * Organization: ${actingOrgPublicId}
  * Project ID: ${projectId}
  * Issue ID: ${issueId}
  * Ignored By: ${ignoredByUserId}
  * Previously Ignored By: ${previouslyIgnoredBy}
  * Reason: ${afterReason}
  * Previous Reason: ${beforeReason}
  * Reason Type: ${beforeReasonType}
  * Previous Reason Type: ${afterReasonType}
  * Ignore Created: ${afterIgnoreCreated}
  * Previous Ignore Created: ${beforeIgnoreCreated}
  * Ignore Expires: ${afterIgnoreExpires}
  * Previous Ignore Expires: ${beforeIgnoreExpires}
  * Event Time: ${eventTime}`;

  const params = {
    Message: message,
    Subject: `Snyk Ignore Alert for Issue: ${issueId}`,
    TopicArn: "arn:aws:sns:us-east-1:590183812647:audit-log"
  };
  
  const command = new PublishCommand(params);

  try {
    const response = await snsClient.send(command)
    console.log("Notification sent successfully: ", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  return {
    statusCode: 200,
    body: "Event processed successfully",
  };
};