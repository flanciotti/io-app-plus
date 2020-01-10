/**
 * Main app entrypoint
 */
// Shim file generated by rn-nodeify
import "./shim";

import { AppRegistry, Text, TextInput } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from "react-native-exception-handler";

import { App } from "./ts/App";
import { mixpanel } from "./ts/mixpanel";

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    if (mixpanel) {
      mixpanel.track("APPLICATION_ERROR", {
        TYPE: "js",
        ERROR: JSON.stringify(e),
        APP_VERSION: DeviceInfo.getReadableVersion()
      });
    }
    Alert.alert(
      "Unexpected error occurred",
      `
        Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}
        You will need to restart the app.
        `
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);
setNativeExceptionHandler(exceptionString => {
  if (mixpanel) {
    mixpanel.track("APPLICATION_ERROR", {
      TYPE: "native",
      ERROR: exceptionString,
      APP_VERSION: DeviceInfo.getReadableVersion()
    });
  }
});

//Disable allowFontScaling for Text/TextInput component
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent("ItaliaApp", () => App);