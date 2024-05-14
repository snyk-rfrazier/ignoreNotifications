import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export const handler = async (event) => {
    const snsTopicARN = "<SNS_TOPIC_ARN>" // add in SNS topic arn
    const snsClient = new SNSClient({});
    const details = event.detail;
    const content = details.content;

    const ignoredByUserId = details.actingUserPublicId;
    const actingOrgPublicId = details.actingOrgPublicId;
    const projectId = details.actingProjectPublicId
    const issueId = content.issueId;
    const reason = content.reason;
    const reasonType = content.reasonType;
    const eventTime = event.time;
    const ignoreCreated = content.created;
    const ignoreExpires = content.expires;

    const message = `Snyk Ignore Deleted Alert!
        * Ignore Deleted By: ${ignoredByUserId}
        * Organization: ${actingOrgPublicId}
        * Project ID: ${projectId}
        * Issue ID: ${issueId}
        * Deleted Reason: ${reason}
        * Deleted Reason Type: ${reasonType}
        * Event Time: ${eventTime}
        * Original Ignore Created: ${ignoreCreated}
        * Original Ignore Expires: ${ignoreExpires}`;

    const params = {
        Message: message,
        Subject: "Snyk Ignore Deleted Alert",
        TopicArn: snsTopicARN,
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