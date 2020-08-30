# Finstagram - The Instagram Clone

**_✨ A MERN Stack Clone of the social networking giant - Instagram_**

<p>
<img src="https://img.shields.io/badge/Frontend-ReactJS-blue?logo=react">
<img src="https://img.shields.io/badge/Backend-NodeJS-green?logo=node.js">
<img src="https://img.shields.io/badge/DataBase-MongoDB-lightgreen?logo=mongoDB">
<img src="https://img.shields.io/badge/State--Manager-Redux-purple?logo=redux">
</p>

<div align="center">
  <img src="https://elit-altum.github.io/assets/Finstagram.jpg" width="250">
</div>

## Setting Up

### A. Clone and install packages

1. Fork this project from the top right of the screen to create a copy of the code.
2. Download your fork of the project locally on your machine or clone it using

   ```
    git clone git@github.com:<your-username>/MERN-Instagram-Clone.git
   ```

3. Navigate to the folder and run `npm i` for installing all packages & dependencies for the server/backend via npm.
4. Navigate to the `client` and run `yarn` to install all dependencies & packages required for the frontend via yarn.

### B. Create API secrets for external services

1. This project uses external services and APIs which require a secret/API pass-key for operations. Please ensure you obtain a pass-key from all these sources before running the project locally.
   - [Cloudinary](https://cloudinary.com/users/register/free) : For storing & fetching images.
   - [SendGrid](https://app.sendgrid.com/) : For sending emails to users upon signup.
   - [MapBox](https://www.mapbox.com/) : For geo-encoding locations on posts.
   - [MongoDB](https://www.mongodb.com/cloud/atlas) : Either a cloud hosted cluster on Mongo Atlas or your local mongo URL.

### C. Create a `.env` file for serving secrets

1. On the root of your project create a new file named `config.env` or run
   ```shell
   touch config.env
   ```
2. Add the following content to the file

   ```env
   NODE_ENV=development

   APP_NAME=My-Insta-Clone

   MONGO_SRV=<MONGO_CLUSTER_SECRET> || mongodb://localhost:27017/insta-clone

   JWT_SECRET=<24_BIT_RANDOM_STRING_FOR_ENCODING_JWT>
   JWT_EXPIRE=90d

   CLOUDINARY_URL=<UNIQUE_CLOUDINARY_URL>

   COOKIE_EXPIRE=60

   SENDGRID_API_KEY=<UNIQUE_SENDGRID_API_KEY>
   SENDGRID_SENDER_EMAIL=<EMAIL_ID_FOR_SENDING_WELCOME_EMAILS>

   ```

**_Important:_** A trial version of the Mapbox Access Token, which is provided while following the Mapbox tutorials, has been hardcoded [here](https://github.com/elit-altum/MERN-Instagram-Clone/blob/c95b615e72051a7bb3562e8c7bcec1aa04299f49/client/src/components/NearbyPosts.js#L38). You can change it with a personal token if you want, as the trial token may effect the number of requests you can make to the Mapbox API.

### D. Run the project locally

1. Start the express server (via nodemon) for the backend. By default, it starts on port: `3001`
   ```
   npm run dev
   ```
2. Navigate to the client to start the webpack dev server. By default, it starts on port: `3000`.

   ```
   cd client/
   yarn start
   ```

**_Important_**: The front-end has an already configured proxy to port: `3001` to avoid the browser's CORS denial. If you are changing the port for the express server / backend. Please ensure to make a change [here](https://github.com/elit-altum/MERN-Instagram-Clone/blob/c95b615e72051a7bb3562e8c7bcec1aa04299f49/client/package.json#L26) as well.

If you face any trouble setting up the project locally please feel free to open an issue [here](https://github.com/elit-altum/MERN-Instagram-Clone/issues/new).

### E. Backend API Testing

More than 35 test cases have been written to test the backend REST API routes using [Jest](https://www.npmjs.com/package/jest) & [Supertest](https://www.npmjs.com/package/supertest)

**_Jest Coverage:_**

<img src="https://raw.githubusercontent.com/elit-altum/MERN-Instagram-Clone/master/public/jest-coverage.PNG?raw=true" />

Running the test suites:

```
npm test
```

Running Jest with the `--watch` mode:

```
npm run test-dev
```

### F. Further Information

1. View the project report & engineering choices made [here]('./../PROJECT_REPORT.md).
2. View the API Docs built using Postman documentation [here](https://documenter.getpostman.com/view/11499248/T1LPE7Tm?version=latest).
