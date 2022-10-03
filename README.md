# Image recognition API

This is a recognition API project from Erick Wendel _Aplicações Serverless na AWS com Node.js_ course.

### Stack

- NodeJS
- AWS SDK
- Serverless framework
- AWS Rekognition
- AWS Lambda
- AWS Translate

---

## How to run it

First of all, you will need to have an account on [AWS](https://aws.amazon.com/) and [Serverless framework](https://www.serverless.com/), and then set your AWS credentials to connect both.

- [Install Serverless framework cli](https://www.serverless.com/framework/docs/getting-started)
- [Set AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/)

Next, you need to clone this project, enter in the folder and install the dependencies:

```bash
$ git clone http://url.com

$ cd ./folder

$ npm i
```

After this, update the field `org:` in the top of the file `serverless.yml`, with your Serverless Framework org. You can find it on your Serverless framework profile:

```yml
org: <YOUR_ORG_HERE>
```

Then, deploy the serverless app:

```bash
$ serverless deploy
```

so you can invoke the function. The `--path` flag is pointing to the `request.json` configuration file. I've put my Github profile photo in the `imageUrl` field, but you can update it with another image URL to the AWS Rekognition service analyse it:

```bash
$ serverless invoke -f img-analysis --path request.json
```

You can invoke the function without deploy by setting the option `local`:

```
$ serverless invoke local -f img-analysis --path request.json
```

You can invoke the function putting the url returned by `serverless deploy` in the browser and set a query string called `imageUrl` with the desired url. You can find the url on Serverless dashboard too:

```
https://<YOUR_ENDPOINT>?imageUrl=<YOUR_IMAGE_URL>
```
