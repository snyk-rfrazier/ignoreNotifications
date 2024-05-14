import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export const handler = async (event) => {
  const snsClient = new SNSClient({});
  const details = event.detail;
  const content = details.content;
  
  console.log("event.detail :", JSON.stringify(event.detail))

  const ignoredByUserId = details.actingUserPublicId;
  const actingOrgPublicId = details.actingOrgPublicId;
  const projectId = details.actingProjectPublicId
  const issueId = content.issueId;
  const reason = content.reason;
  const reasonType = content.reasonType;
  const eventTime = event.time;
  const ignoreCreated = content.created;
  const ignoreExpires = content.expires;

  const message = `Snyk Ignore Created Alert!
  * Ignored By: ${ignoredByUserId}
  * Organization: ${actingOrgPublicId}
  * Project ID: ${projectId}
  * Issue ID: ${issueId}
  * Reason: ${reason}
  * Reason Type: ${reasonType}
  * Event Time: ${eventTime}
  * Ignore Created: ${ignoreCreated}
  * Ignore Expires: ${ignoreExpires}`;

  const params = {
    Message: message,
    Subject: "Snyk Ignore Created Alert",
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