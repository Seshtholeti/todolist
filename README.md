```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Amazon Connect, Lambda, Pinpoint, S3, and CloudFront stack

Resources:

  ConnectContactFlow:
    Type: AWS::Connect::ContactFlow
    Properties:
      InstanceArn: !Ref ConnectInstance
      Name: MyContactFlow
      Type: CONTACT_FLOW
      Content: |
        {
          "Version": "2019-10-30",
          "Configuration": {
            "Stages": [
              {
                "Identifier": "f4d4d4d4-d4d4-4d4d-b4d4-d4d4d4d4d4d4",
                "Type": "TRANSFER",
                "Transitions": {
                  "NextStage": "f4d4d4d4-d4d4-4d4d-b4d4-d4d4d4d4d4d5"
                },
                "Conditions": []
              },
              {
                "Identifier": "f4d4d4d4-d4d4-4d4d-b4d4-d4d4d4d4d4d5",
                "Type": "LAMBDA",
                "Transitions": {
                  "NextStage": "f4d4d4d4-d4d4-4d4d-b4d4-d4d4d4d4d4d6"
                },
                "Conditions": []
              },
              {
                "Identifier": "f4d4d4d4-d4d4-4d4d-b4d4-d4d4d4d4d4d6",
                "Type": "DISCONNECT",
                "Transitions": {},
                "Conditions": []
              }
            ]
          }
        }

  ConnectInstance:
    Type: AWS::Connect::Instance
    Properties:
      IdentityManagementType: CONNECT_MANAGED
      InboundCallsEnabled: true
      OutboundCallsEnabled: true
      InstanceAlias: MyConnectInstance

  LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: MyLambdaFunction
      Runtime: nodejs12.x
      Role: !GetAtt LambdaRole.Arn
      Handler: index.handler
      Code:
        ZipFile: |
          exports.handler = async (event) => {
            // Lambda function code to interact with Pinpoint, S3, and CloudFront
            console.log('Received event:', JSON.stringify(event, null, 2));

            // Example code to interact with Pinpoint
            const pinpoint = new AWS.Pinpoint();
            const params = {
              ApplicationId: 'my-pinpoint-app-id',
              MessageRequest: {
                Addresses: {
                  'sample-user@example.com': {
                    ChannelType: 'EMAIL'
                  }
                },
                MessageConfiguration: {
                  EmailMessage: {
                    Subject: 'Hello from Lambda',
                    HtmlBody: 'This is a test email sent from a Lambda function.'
                  }
                }
              }
            };
            await pinpoint.sendMessages(params).promise();

            // Example code to interact with S3
            const s3 = new AWS.S3();
            await s3.putObject({
              Bucket: 'my-s3-bucket',
              Key: 'test-object.txt',
              Body: 'This is a test object in S3.'
            }).promise();

            // Example code to interact with CloudFront
            const cloudfront = new AWS.CloudFront();
            const params = {
              DistributionId: 'my-cloudfront-distribution-id',
              InvalidationBatch: {
                CallerReference: `${Date.now()}`,
                Paths: {
                  Quantity: 1,
                  Items: ['/index.html']
                }
              }
            };
            await cloudfront.createInvalidation(params).promise();

            return {
              statusCode: 200,
              body: 'Lambda function executed successfully!'
            };
          };

  LambdaRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: 'sts:AssumeRole'
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      Policies:
        - PolicyName: PinpointAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - pinpoint:*
                Resource: '*'
        - PolicyName: S3Access
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - s3:*
                Resource: '*'
        - PolicyName: CloudFrontAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - cloudfront:*
                Resource: '*'

  PinpointApp:
    Type: AWS::Pinpoint::App
    Properties:
      Name: MyPinpointApp

  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-s3-bucket

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        DefaultCacheBehavior:
          ForwardedValues:
            QueryString: 'false'
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
        Enabled: 'true'
        HttpVersion: http2
        Origins:
          - DomainName: !GetAtt S3Bucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig: {}
        PriceClass: PriceClass_100

```