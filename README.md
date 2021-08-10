# Overview
Example of a simple Ionic app that uses Couchbase Lite as embedded datastore for offline data storage and Sync Gateway/Couchbase Server for remote data sync.
The app uses a reference implementation of a Cordova native plugin that exports a subset of couchbase lite native APIs to Javascript.


# Folder Structure

# standalone
This version of app demonstrates basic Database and Document CRUD operations using Couhbase Lite as a standalone, embedded database within your mobile app. A document is created and stored in a "user" Couchbase Lite database.
 

# query
This version of app extends the "standalone" version of the app and demonstrates basic query and full-text-search operations against Couhbase Lite database. In addition to the "user" database, this version of the app is bundled with a second "university" database pre-seeded with documents against which queries are issued.

# sync
This version of app extends the "query" version of the app and demonstrates basic database sync functionality. The app supports bi-directional sync with a remote Couchbase Server database through a Sync Gateway.


# Getting Started

## Pre-requisites
* [Ionic CLI](https://ionicframework.com/docs/cli) >= v6.16.0
* [Cordova CLI](https://github.com/apache/cordova-cli) >= 9.0.0
* [angular/CLI](https://angular.io/cli) >= 12.0.0
* [Android Studio 4.1 or above](https://developer.android.com/studio)
* Android device or emulator running API level 29 or above
* Android SDK 29
* Android Build Tools 29
* [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

## Build Instructions

* clone repository
```
git clone https://github.com/rajagp/userprofile-couchbase-mobile-cordova-android/
```
* Go to the directory into directory containing the appropriate version of app. For example, for the "standalone" version of app, switch to standalone folder.
```
cd  /path/to/cloned-repo/standalone

```
* Install dependencies 
 
 ```
 npm install
 ```
 
*  Install couchbase lite cordova plugin. For this, follow [instructions](https://github.com/rajagp/couchbase-lite-cordova-plugin-android) to add the plugin to the project. Instructions are repeated here  for convenience. In case of discrepencies, refer to the plugin repo.
 
    *  Install android platform into your Ionic project 

    ```bash
        ionic cordova platform add android
    ```
    * Build your project for Android

    ```bash
        ionic cordova build android
    ```
    * Install the plugin by adding the appropriate Github repo. If you fork the repo and modify it, then be sure to point it to the right URL!

    ```bash
        ionic cordova plugin add https://github.com/rajagp/couchbase-lite-cordova-plugin-android.git
    ```
* Install native couchbase lite framework

    The couchbase lite framework does not come bundled with the cordova plugin. You will have to include the appropriately licensed Couchbase Lite Android library as dependency within your app. The Cordova reference plugin requires minimal version of **Couchbase Lite v3.0.0**. 
    
    Couchbase Lite can be downloaded from Couchbase [downloads](https://www.couchbase.com/downloads) page or can be pulled in via maven as described in [Couchbase Lite Android Getting Started Guides](https://docs.couchbase.com/couchbase-lite/current/android/gs-install.html).
    
    We discuss the steps to add the Couchbase Lite framework dependency depending on how you downloaded the framework. 
    
    * Open the Android project located inside your ionic project under directory: `/path/to/ionic/app/platforms/android` using Android Studio.
    
        **Option 1: To add couchbase-lite-android as an .aar file**
    
        * Create a a new directory called 'libs' under your Android project
        * Copy the .aar files from within your downloaded Couchbase Lite package to the 'libs' folder 
    
        ![](https://blog.couchbase.com/wp-content/uploads/2021/08/adding-couchbase-lite-aar-files.png)
    
        * In your 'app' level `build.gradle` file and add your library file path under dependencies. 
        **NOTE**: It is important that you add the dependency line OUTSIDE Of the "// SUB-PROJECT DEPENDENCIES" block
    
           ```bash
            dependencies {
                implementation fileTree(dir: 'libs', include: '*.jar')
                implementation files('libs/couchbase-lite-android-ee-3.0.0.aar', 'libs/okhttp-3.14.7.jar','libs/okio-1.17.2.jar')
               
                // SUB-PROJECT DEPENDENCIES START
                implementation(project(path: ":CordovaLib"))
                implementation "com.android.support:support-v4:27.+"
                implementation "com.android.support:support-annotations:27.+"
                // SUB-PROJECT DEPENDENCIES END
        
                }
            ```
    
       **Option 2: Include couchbase-lite-android sdk from maven**
    
        * In your 'app' level `build.gradle` file, add your library file path. Follow the instructions in [Couchbase Lite Android Getting Started Guides](https://docs.couchbase.com/couchbase-lite/current/android/gs-install.html) for URL or maven repository etc.
        ```
             dependencies {
                implementation 'com.couchbase.lite:couchbase-lite-android:${version}'
             }
        ```
 * You can run the app directly from Android Studio or issue the following command from command line
 
 ```bash
 ionic cordova run android
 ```
