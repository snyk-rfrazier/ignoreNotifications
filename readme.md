### Create the app integration in Snyk with Eventbridge
https://docs.snyk.io/integrate-with-snyk/event-forwarding/amazon-eventbridge

### Create SNS topic to simply forward to an email
Note the SNS_TOPIC_ARN created

### Create three Lambda functions
Make sure to attach a policy to these lambda functions so they can send to SNS: 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sns:Publish"
            ],
            "Resource": "SNS_TOPIC_ARN"
        }
    ]
}
```

#### ignoreCreate

[Ignore Create](./ignoreCreate.js) 

#### ignoreEdit

[Ignore Edit](./ignoreEdit.js)

#### ignoreDelete

[Ignore Delete](./ignoreDelete.js)

### Add rules in Eventbridge *on the newly created event bus* for three event patterns: 

#### Ignore Created
Target for this will be the ignoreCreat lambda function
```    
{
  "detail": {
    "event": ["org.project.ignore.create"]
    }
}
```

#### Ignore Edited
Target for this will be the ignoreEdit lambda function
```    
{
  "detail": {
    "event": ["org.project.ignore.edit"]
    }
}
```

#### Ignore Deleted
Target for this will be the ignoreDelete lambda function
```    
{
  "detail": {
    "event": ["org.project.ignore.delete"]
    }
}
```

