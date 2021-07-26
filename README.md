# Overview
Example of a simple Ionic app that uses Couchbase Lite as embedded datastore for offline data storage and Sync Gateway/Couchbase Server for remote data sync.
The app uses a reference Cordova native plugin that exposes a subset of couchbase lite APIs.

# Folder Overview

# standalone
This version of app demonstrates basic Database and Document CRUD operations using Couhbase Lite as a standalone, embedded database within your mobile app. A document is created and stored in a "user" Couchbase Lite database.


# query
This version of app extends the "standalone" version of the app and demonstrates basic query and full-text-search operations against Couhbase Lite database. In addition to the "user" database, this version of the app is bundled with a second "university" database pre-seeded with documents against which queries are issued.

# sync
This version of app extends the "query" version of the app and demonstrates basic database sync functionality. The app supports bi-directional sync with a remote Couchbase Server database through a Sync Gateway.


# Build Instructions

## Pre-requisites
1. Ionic CLI >= v6.16.0 
2. Cordova CLI >= 9.0.0
3. angular/cli >= 12.0.0
4. couchbase-lite-cordova-plugin-android (url: https://github.com/rajagp/couchbase-lite-cordova-plugin-android )

##  Build & Run
1. clone repository
2. cd into /standalone directory.
3. run command: npm install

## Note: This project itself does not install couchbase-lite-cordova-plugin-android. 

Next step: Follow plugin install instructions from https://github.com/rajagp/couchbase-lite-cordova-plugin-android

4. After installing the plugin run commmand: ionic cordova platform add android
5. Run the project sing command: ionic cordova run android
