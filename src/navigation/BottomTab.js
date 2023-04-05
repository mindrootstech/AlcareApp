import React from 'react'
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Images from '../common/Images'
import { Colors } from '../common/Colors'

import Dashboard from '../screen/Dashboard/Dashboard'
import ViewClient from '../screen/ViewClient/ViewClient'
import Profile from '../screen/Profile/Profile'
import AddClient from '../screen/AddClient/AddClient'
import AddArea from '../screen/AddArea/AddArea'

const Tab = createBottomTabNavigator()

const BottomTabs = () => {
  const CustomAddButton = props => {
    const { children, onPress, image = Images.addClientIcon } = props
    return (
      <TouchableOpacity onPress={onPress} style={styles.addIconStyle}>
        <View style={{ width: 70, height: 70 }}>{children}</View>
      </TouchableOpacity>
    )
  }

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        animation: 'slide_from_right',
        tabBarStyle: {
          overflow: 'visible',
          paddingTop: 30,
          borderWidth: 0,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: Colors.colorBackgroundGray,
          height: 80,
        },

        tabBarBackground: () => (
          <Image
            source={require('../assets/curvedTabBackground.png')}
            style={{
              width: '100%',
              height: '100%',
              shadowColor: Colors.theamColor,
              backgroundColor: 'transparent',
            }}
          />
        ),
      }}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? Images.activeHomeTab : Images.homeIcon}
              style={{ height: 20, width: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ViewClient"
        component={ViewClient}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? Images.activeViewClient : Images.ClientViewIcon}
              style={{ height: 20, width: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddClient"
        component={AddClient}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={Images.addClientIcon}
              resizeMode="contain"
              style={{ height: 70, width: 70, marginTop: 5 }}
            />
          ),
          tabBarButton: props => <CustomAddButton {...props} />,
        }}
      />
      <Tab.Screen
        name="AddArea"
        component={AddArea}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={
                focused ? Images.activeCalculationTab : Images.calculationIcon
              }
              style={{ height: 21, width: 21 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={focused ? Images.activeSettingTab : Images.settingIcon}
              style={{ height: 20, width: 20 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {},
  addIconStyle: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default BottomTabs
