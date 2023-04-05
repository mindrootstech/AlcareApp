// In App.js in a new project

import React, { useState, useEffect, useMemo } from 'react'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import Login from '../screen/Login/Login'
import ForgotPassword from '../screen/Login/ForgotPassword'
import ProfileScreen from '../screen/Profile/Profile'
import Dashboard from '../screen/Dashboard/Dashboard'
import EditProfile from '../screen/Profile/EditProfile'
import ViewClient from '../screen/ViewClient/ViewClient'
import PendingFollowUps from '../screen/PendingFollowUps/PendingFollowUps'
import BottomTab from './BottomTab'
import ChangePassword from '../screen/Profile/ChangePassword'
import Media from '../screen/Profile/Media'
import AddArea from '../screen/AddArea/AddArea'
import AddAreaSecond from '../screen/AddArea/AddAreaSecond'
import Notification from '../screen/Notification/Notification'
import MapScreen from '../screen/AddClient/MapScreen'
import AreanDetails from '../screen/AreanDetails/AreanDetails'
import ClientDetail from '../screen/ClientDetail/ClientDetail'
import AddExpense from '../screen/AddExpense/AddExpense'
import ExpenseList from '../screen/AddExpense/ExpenseList'
import Parent from '../screen/Dashboard/Parent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EmptyNotify from '../emptyNotification/EmptyNotify'
import { AuthContext } from '../common/context'
import { navigationRef } from '../../RootNavigation'
import Webview from '../screen/Profile/Webview'
import SplashScreen from 'react-native-splash-screen'
import strings from '../constants/lang'

const Stack = createStackNavigator()

import { LogBox } from 'react-native'
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets'

LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs()

const Route = () => {
  strings.setLanguage('en')

  const initialState = {
    userToken: null,
  }

  const loginReducer = (prevState, action) => {
    console.log('action.userToken--', action.userToken)

    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.userToken,
        }

      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.userToken,
        }
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
        }
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialState)

  const authContext = React.useMemo(
    () => ({
      signIn: userToken => {
        dispatch({ type: 'LOGIN', userToken })
      },
      signOut: () => {
        removeStorageValue()
        console.log("lkdfhkghfjkdhgdfjkh");
        dispatch({ type: 'LOGOUT' })
      },
    }),
    [],
  )

  async function removeStorageValue() {
    try {
      await AsyncStorage.removeItem('klogin')
      await AsyncStorage.removeItem('token')
      console.log('Data removed')
    } catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000)
  })

  useEffect(() => {
    setTimeout(async () => {
      let myToken = null
      try {
        const value = await AsyncStorage.getItem('token')
        if (value !== null) {
          myToken = value
        }
      } catch (error) {
        console.log(error)
      }

      dispatch({ type: 'RETRIEVE_TOKEN', userToken: myToken })
    })
  }, [])

  const userSignIn = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: false,
            headerShown: false,
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  const userDashboard = () => {
    return (
      // <UserContext.Provider value={loginState}>

      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          <Stack.Screen name="BottomTab" component={BottomTab} />

          <Stack.Screen name="Dashboard" component={Dashboard} />

          <Stack.Screen name="Parent" component={Parent} />

          <Stack.Screen name="MapScreen" component={MapScreen} />

          <Stack.Screen name="AddExpense" component={AddExpense} />
<Stack.Screen name='ExpenseList' component={ExpenseList} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="PendingFollowUps" component={PendingFollowUps} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Media" component={Media} />
          <Stack.Screen name="AddArea" component={AddArea} />
          <Stack.Screen name="AddAreaSecond" component={AddAreaSecond} />
          <Stack.Screen name="AreanDetails" component={AreanDetails} />
          <Stack.Screen name="ClientDetail" component={ClientDetail} />
          <Stack.Screen name="EmptyNotify" component={EmptyNotify} />
          <Stack.Screen name="Webview" component={Webview} />
        </Stack.Navigator>
      </NavigationContainer>

      // </UserContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      {loginState.userToken !== null ? userDashboard() : userSignIn()}
    </AuthContext.Provider>
  )
}

export default Route
