/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import Route from './src/navigation/Routs'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage)
})

AppRegistry.registerComponent(appName, () => Route)
