var fs = require('fs');
const language = require('./config/language.json');
const fetch = require("node-fetch");
const mainUrl = "cloudfunctions.net";

try {
    const data = fs.readFileSync('config/mainconfig.js', 'utf8').replace("export const MainConfig = ", "");
    const MainConfig = JSON.parse(data.replace(/({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g, "$1\"$2\":"));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="apple-touch-icon" sizes="76x76" href="%PUBLIC_URL%/apple-icon.png"/>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"/>
    <link href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" rel="stylesheet"/>
    <title>${MainConfig.AppDetails.app_name}</title>
</head>
<body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
</body>
</html>`;

const manifest = `{
    "short_name": "${MainConfig.AppDetails.app_name}",
    "name": "${MainConfig.AppDetails.app_name}",
    "icons": [
    {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
    }
    ],
    "start_url": "./index.html",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
}
`;

let firebaserc = `{
    "projects": {
        "default": "${MainConfig.FirebaseConfig.projectId}"
    }
}
`;

const facebookScheme = 'fb' + MainConfig.facebookAppId;

let appJson = `{
    "expo": {
      "name": "${MainConfig.AppDetails.app_name}",
      "description": "${MainConfig.AppDetails.app_description}",
      "slug": "${MainConfig.AppDetails.app_name.replace(/ /g,"-").toLowerCase()}",
      "privacy": "public",
      "platforms": [
        "ios",
        "android"
      ],
      "notification": {
        "icon": "./assets/images/logo96x96.png"
      },
      "version": "${MainConfig.AppDetails.ios_app_version}",
      "orientation": "portrait",
      "icon": "./assets/images/logo1024x1024.png",
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "cover",
        "backgroundColor": "#ffffff"
      },
      "updates": {
        "fallbackToCacheTimeout": 0
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "packagerOpts": {
        "config": "metro.config.js"
      },
      "ios": {
        "supportsTablet": true,
        "usesAppleSignIn": true,
        "bundleIdentifier": "${MainConfig.AppDetails.app_identifier}",
        "infoPlist": {
          "NSLocationAlwaysUsageDescription": "${language.NSLocationAlwaysUsageDescription}",
          "NSLocationAlwaysAndWhenInUseUsageDescription": "${language.NSLocationAlwaysAndWhenInUseUsageDescription}",
          "NSLocationWhenInUseUsageDescription": "${language.NSLocationWhenInUseUsageDescription}",
          "NSCameraUsageDescription": "${language.NSCameraUsageDescription}",
          "NSPhotoLibraryUsageDescription": "${language.NSPhotoLibraryUsageDescription}",
          "ITSAppUsesNonExemptEncryption":false,
          "UIBackgroundModes": [
            "audio",
            "location",
            "fetch"
          ]
        },
        "config": {
          "googleMapsApiKey": "${MainConfig.Google_Map_Key}"
        },
        "googleServicesFile": "./GoogleService-Info.plist",
        "buildNumber": "${MainConfig.AppDetails.ios_app_version}"
      },
      "android": {
        "package": "${MainConfig.AppDetails.app_identifier}",
        "versionCode": ${MainConfig.AppDetails.android_app_version},
        "permissions": [
          "CAMERA",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE",
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION",
          "CAMERA_ROLL",
          "FOREGROUND_SERVICE",
          "ACCESS_BACKGROUND_LOCATION"
        ],
        "googleServicesFile": "./google-services.json",
        "config": {
          "googleMaps": {
            "apiKey": "${MainConfig.Google_Map_Key}"
          }
        },
        "useNextNotificationsApi": true
      },
      "facebookScheme": "${facebookScheme}",
      "facebookAppId": "${MainConfig.facebookAppId}",
      "facebookDisplayName": "${MainConfig.AppDetails.app_name}"
    }
}
`;

    fs.writeFile('web-app/public/index.html', html, function (err) {
        if (err) throw err;
        console.log('Web App "index.html" Created!');
    });

    fs.writeFile('web-app/public/manifest.json', manifest, function (err) {
        if (err) throw err;
        console.log('Web Manifest Created!');
    });

    fs.writeFile('.firebaserc', firebaserc, function (err) {
        if (err) throw err;
        console.log('Firebase Config Created!');
    });

    fs.writeFile('mobile-app/app.json', appJson, function (err) {
        if (err) throw err;
        console.log('Mobile app.json Created!');
    });
 
    var license = MainConfig.PurchaseDetails.CodeCanyon_Purchase_Code;
    if(license!=''){
      fetch(`https://us-central1-seradd.${mainUrl}/baseset`, {
            method: 'post',
            body:  JSON.stringify({
              projectId:  MainConfig.FirebaseConfig.projectId,
              app_name: MainConfig.AppDetails.app_name,
              app_identifier:  MainConfig.AppDetails.app_identifier,
              license: license,
              contact_email: MainConfig.PurchaseDetails.Buyer_Email_Address ? MainConfig.PurchaseDetails.Buyer_Email_Address: ' ',
              createTime: new Date().toISOString(),
              reqType: 'install'
            }),
            headers: { 'Content-Type': 'application/json' },
      }).then(response =>  response.json())
      .then(res=>{
        if(res.success){
          console.log('License Updated');
        }else{
          console.error(res.error);
        }
      })
      .catch(error=>console.error(error));
    }
} catch (err) {
    console.error(err);
}

fs.copyFile("assets/favicon.ico", "web-app/public/favicon.ico", (err) => {err?console.log("File Copy Error:", err):console.log("Favicon copied successfully.")});

fs.copyFile("assets/logo72x72.png", "web-app/public/apple-icon.png", (err) => {err?console.log("File Copy Error:", err):console.log("Apple Icon copied successfully.")});

fs.copyFile("assets/logo1024x1024.png", "mobile-app/assets/images/logo1024x1024.png", (err) => {err?console.log("File Copy Error:", err):console.log("App Icon copied successfully.")});

fs.copyFile("assets/splash.png", "mobile-app/assets/images/splash.png", (err) => {err?console.log("File Copy Error:", err):console.log("App Splash copied successfully.")});

fs.copyFile("assets/logo96x96.png", "mobile-app/assets/images/logo96x96.png", (err) => {err?console.log("File Copy Error:", err):console.log("Push Icon copied successfully.")});

fs.copyFile("assets/logo165x90white.png", "mobile-app/assets/images/logo165x90white.png", (err) => {err?console.log("File Copy Error:", err):console.log("App Menu Logo copied successfully.")});

fs.copyFile("assets/intro.jpg", "mobile-app/assets/images/intro.jpg", (err) => {err?console.log("File Copy Error:", err):console.log("Intro Image copied successfully.")});

fs.copyFile("assets/bg.jpg", "mobile-app/assets/images/bg.jpg", (err) => {err?console.log("File Copy Error:", err):console.log("Background Image copied successfully.")});

fs.copyFile("config/google-services.json", "mobile-app/google-services.json", (err) => {err?console.log("File Copy Error:", err):console.log("google-services.json copied successfully.")});

fs.copyFile("config/GoogleService-Info.plist", "mobile-app/GoogleService-Info.plist", (err) => {err?console.log("File Copy Error:", err):console.log("GoogleService-Info.plist copied successfully.")});

fs.copyFile("config/language.json", "functions/language.json", (err) => {err?console.log("File Copy Error:", err):console.log("Language file copied successfully.")});