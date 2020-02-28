# Simple node chat app

This is a simple chat app built with:

- node.js
- socket.io

Check it out on heroku : https://paolown-node-chat-app.herokuapp.com/

# Quick start

```text

# install
 
npm install

# run the server

npm run server

```
# Guide

The app is really simple, I have my "backend" in the app.js file, while the the logic of the front-end are in the 
public folder.

```text
.
├── README.md
├── package-lock.json
├── package.json
├── app.js
├── .gitignore
├── middleware
│   └── auth.js
├── models
│   ├── Profile.js
│   └── User.js
└── client
    ├── css
    │   └── style.css
    ├── resources
    ├── chat.js
    ├── index.html
    └── modalScript.js

```

