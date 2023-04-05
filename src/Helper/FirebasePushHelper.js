import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    console.log('Authorization status:', authStatus)
    getFCMToken()
  }
}

const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken')

  console.log('fcmToken---------', fcmToken)

  if (!fcmToken) {
    try {
      let fcmToken = await messaging().getToken()
      console.log('fcmToken---------', fcmToken)
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    } catch (error) {
      alert(`error ${error}`)
      console.log('error while generating fcm token', error)
    }
  }
}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    )
  })

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        )
      }
    })
}
