# DJ With Friends ![Image of build status](https://github.com/TylerJDev/DJ-With-Friends/workflows/build/badge.svg)
[DJ with Friends](https://djwithfriends.com/) is a way to listen to music together with others! It utilizes the Spotify API to allow users to host songs. We're always growing, and future features are mapped out within our [projects](https://github.com/TylerJDev/DJ-With-Friends/projects/1).

## Getting started

DJ With Friends utilizes Firebase both on the frontend and backend. We'll need to create a new Firebase project so that we can utilize it for our dev environment.

### Pre-installation
* Clone this repo

#### Setting up Dev
Go to [Firebase](https://firebase.google.com/) and create a new project. You can name it whatever you'd like. After we've created the project, we'll need to do a few more things to fully set up our dev environment.

* Create a new "Web" app, pick any nickname & register the app
* Copy the contents of your `Firebase SDK snippet`, we'll only utilize the keys

Note: Your config snippet should look like this but without the <placeholder> values.
```
const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<MESSAGING_SENDER_ID>",
  appId: "<APP_ID>"
};
```

#### Firestore Configuration (DB)
* Create a new *Cloud Firestore* database
* Start in `test mode`
* Decide on which location is best for you

#### Authentication Configuration
* Go to "Authentication"
* Enable both Email/Password and "Anonymous"

Inside the root of the project, create a `.env` file and add the API keys/IDs that we copied from our Firebase SDK config snippet.
Your `.env` file should look something like this, but instead of the <placeholder> values, it'll be your Firebase keys.
  
```
VUE_APP_apiKey='<API_KEY>'
VUE_APP_authDomain='<AUTH_DOMAIN>'
VUE_APP_projectId='<PROJECT_ID>'
VUE_APP_storageBucket='<STORAGE_BUCKET>'
VUE_APP_messagingSenderId='<MESSAGING_SENDER_ID>'
VUE_APP_appId='<APP_ID>'
```

*Note:* We're utilizing [Vue CLI's environment variable](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables) feature, hence the "VUE_APP_" prefix.

### Installation
* use `npm install` to install all dependencies
* use `npm run serve` to start up a local server

With that, DJ With Friends should be running on a local server.
This project utilizes [Vue CLI](https://cli.vuejs.org/guide/), so anything out of scope for this readme can probably be found there.

## Contributions
Thinking about contributing? Contributions are more than welcome. There are only a few steps that need to be taken in order to submit a PR.

## Tests
We utilize Jest & Cypress to run tests, both locally and in our CI/CD. We also utilize Pa11y to scan for any risks for accessibility.

* To run our Jest tests
`npm run test`

* To run our Cypress tests with CI
`npm run cypress:run`

* To run Pa11y
`npm run test-pa11y`

## Accessibility
When building new features or addressing bugs, it's best to always do so with accessibility in mind. When developing DJ With Friends, I wanted to make sure that we're creating an accessible community so that *anyone* can use DJ With Friends. 

We currently utilize [Pa11y](https://github.com/pa11y/pa11y-ci) in both our CI/CD and to test locally, but with any automated accessibility testing service, it won't catch everything that you could manually. This means that manual testing is *necessary* for any new features. 

Depending on the size and scope of the feature, you can utilize an [accessibility checklist](https://www.a11yproject.com/checklist/) which is based on the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG21/).
