import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Route from './src/navigation/Routs'
import strings from './src/constants/lang'
import SplashScreen from 'react-native-splash-screen'
import { LogBox } from 'react-native'

LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs()

const App = () => {
  strings.setLanguage('en')

  useEffect(() => {
    SplashScreen.hide()
  })
  return (
    <NavigationContainer>
      <Route />
    </NavigationContainer>
  )
}

export default App
