# Amplify Notetaker
This project is based on the course [Serverless React with AWS Amplify - The Complete Guide](https://learning.oreilly.com/videos/serverless-react-with/9781839219726/) by Reed Barger. It implements a full-stack GraphQL React app backed by DynamoDB table.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Technologies used
### Frontend

* React
* AWS Amplify
* S3 static website
* Cloudfront

### Backend

* AWS AppSync
* AWS Amplify
* DynamoDB
* Cognito Identity provider


##  Getting Started

### Install NPM libraries

Install aws-amplify cli globally

`npm install -g @aws-amplify/cli`

Install project specific dependencies listed in `package.json`

`npm install`


### Deploy using Amplify

Configure Amplify. `amplify configure` will ask you to sign into AWS console

`amplify configure`


Initialize the Amplify project

`amplify init`


Update the cloud resources

`amplify push`


Check deployment status


`amplify status`


### Test locally

Run the app locally in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

`npm start`



### Cleaning up

`amplify delete`