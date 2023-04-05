import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  StatusBar,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Linking,
  AppState,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native'

import { FontStyles } from '../../common/FontStyle'
import { Colors } from '../../common/Colors'
import { postWithParam, getAPIAfterLogin } from '../../network'
import Loader from '../../network/Loader'
import Parent from './Parent'
import EmptyNotify from '../../emptyNotification/EmptyNotify'
import {
  home_url,
  get_clients_url,
  save_attendance_url,
} from '../../network/Urls'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import { useIsFocused } from '@react-navigation/native'
import { Shadow } from '../../common/Shadow'
import Geolocation from '@react-native-community/geolocation'
import ForegroundHandler from '../../Helper/ForegroundHandler'
import Images from '../../common/Images'
import NetInfo from '@react-native-community/netinfo'
import deviceInfoModule from 'react-native-device-info'
import { AuthContext } from '../../common/context'
import VersionCheck from 'react-native-version-check'

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight

const Dashboard = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext)
  let colors = ['#C1EAFB', '#D2FFE4', '#EAE7FF', '#FFDACD']
  const useFocused = useIsFocused()
  const [isShownLoader, setShownLoader] = useState(false)
  const [dictData, setData] = useState({})
  const [slideIcon, setSlideIcon] = useState(true)
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [isTop, setTop] = React.useState(false)
  const appState = useRef(AppState.currentState)
  const [arrData, setArrData] = useState([
    {
      id: 0,
      text: 'Clients assgined',
      icon: require('../../assets/clock.png'),
      value: 0,
    },
    {
      id: 1,
      text: 'Pending Follow\nUps',
      icon: require('../../assets/clockCalender.png'),
      value: 0,
    },
  ])

  const checkTypeKey = async () => {
    let checkValueType = await AsyncStorage.getItem('valueType')
    console.log("dejhdfe",checkValueType)
    if(checkValueType == '2')
    {
      console.log("dejhdfe")
      setSlideIcon(false)
    }else if (checkValueType == '1'){
      console.log("eeee")
      setSlideIcon(true)
    }

  }

  useEffect(() => {
    setTimeout(() => {
      getOneTimeLocation()
    }, 2000)

    if (global.isUserIn == undefined) {
      apiGetClient()
      global.isUserIn = true
    } else {
      refreshParentProfile()
      apiDashBoard()
    }
  }, [useFocused])

  useEffect(() => {
    // checkVersionUpdate();
  }, [])

  useEffect(() => {
    console.log('here')
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!')
      }

      appState.current = nextAppState
      // setAppStateVisible(appState.current);
      console.log('AppState2', appState.current)
      if (appState.current == 'active') {
        console.log('active')
        checkTypeKey()
        // checkVersionUpdate()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const checkVersionUpdate = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate()

      console.log('updateNeeded0000', updateNeeded.isNeeded)
      console.log('updateNeeded===', updateNeeded)

      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'New version available',
          'Please update your app to the latest version to continue using.',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp()
                if (Platform.OS == 'ios') {
                  Linking.openURL(
                    'https://apps.apple.com/us/app/alcare-ph/id6443912828',
                  )
                } else {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.alcare.android',
                  )
                }
              },
            },
          ],
          { cancelable: false },
        )
      }
    } catch (error) {}
  }

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position----', position)
      },
      error => {
        console.log(error.message)
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    )
  }

  const refreshParentProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('profile')

      if (value !== null) {
        const myProfileInfo = JSON.parse(value)
        console.log(myProfileInfo)
        setData(myProfileInfo)

        setArrData([
          {
            id: 0,
            text: 'Clients assgined',
            icon: require('../../assets/clock.png'),
            value: myProfileInfo?.clients_count,
          },
          {
            id: 1,
            text: 'Pending Follow\nUps ',
            icon: require('../../assets/clockCalender.png'),
            value: myProfileInfo?.pending_follow_week,
          },
        ])
      }
    } catch (error) {
      console.log('Profile is not created yet')
    }
  }

  const apiDashBoard = async () => {
    setShownLoader(true)

    let fcmToken = await AsyncStorage.getItem('fcmToken')
    let formdata = new FormData()

    formdata.append('firebase_id', fcmToken ? fcmToken : '')

    const response = await postWithParam(home_url, formdata)

    setTop(false)
    if (response.status == true) {
      setShownLoader(false)

      AsyncStorage.setItem('profile', JSON.stringify(response.data.profile))
      refreshParentProfile()

      const attendance = response.data.profile.attendance

      let Punchin = attendance.punch_in
      let Punchout = attendance.punch_out

      if (
        Punchin != null &&
        Punchin != '' &&
        (Punchout == null || Punchout == '')
      ) {
        setSlideIcon(false)
      
        AsyncStorage.setItem('valueType', '2')
      } else {
        setSlideIcon(true)
       
        AsyncStorage.setItem('valueType', '1')
      }
      global.userId = response.data.profile.user_id
    } else {
      setShownLoader(false)
      // Alert.alert(response.message)
    }
  }

  const apiPunchInOut = async punchedIn => {
    var currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(currentDate)

    let formData = new FormData()

    formData.append('type', punchedIn ? '1' : '2')
    formData.append('time', `${currentDate}`)

    const response = await postWithParam(save_attendance_url, formData)
    setTop(false)
    if (response.status == true) {
      setShownLoader(false)
    } else {
      setShownLoader(false)
    }
  }

  const apiGetClient = async () => {
    setShownLoader(true)
    const response = await getAPIAfterLogin(get_clients_url)
    if (response.message == 'Unauthenticated.') {
      setShownLoader(false)
      Alert.alert(
        '',
        'Your session has expired. Please login again',
        [
          {
            text: 'OK',
            onPress: () => {
              signOut()
            },
          },
        ],
        { cancelable: false },
      )
      return
    }

    apiDashBoard()
    setTop(false)
    if (response.status == true) {
      setShownLoader(false)
      AsyncStorage.setItem('ApprovedClients', JSON.stringify(response.clients))
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const onPressNotification = () => {
    let updatedProfileDict = dictData
    updatedProfileDict.notificationCount = '0'
    setData(updatedProfileDict)
    AsyncStorage.setItem('profile', JSON.stringify(updatedProfileDict))
    navigation.navigate('Notification')
  }

  const currentDateTimeWithDay = () => {
    var currentDate = moment().format('dddd, MMMM DD YYYY')
    console.log(currentDate)
    return currentDate
  }

  const onPressColoredIcon = id => {
    if (id == 0) {
      navigation.navigate('ViewClient')
    } else {
      navigation.navigate('PendingFollowUps')
    }
  }

  const onChangeStyles = async () => {
    console.log('Connection type')
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)

      if (state.isConnected) {
        let punchedIn = !isPunchedIn
        setIsPunchedIn(!isPunchedIn)

        apiPunchInOut(slideIcon)

        setSlideIcon(slideIcon === true ? false : true)
        AsyncStorage.setItem('valueType',slideIcon === true ? "2" : "1" )
      } else {
        Alert.alert(`No Internet Connection 
        Please check your connection and try again`)
      }
    })

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type)
      console.log('Is connected?', state.isConnected)
    })

    // Unsubscribe
    unsubscribe()
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <View style={styles.statuBarIosStyle}>
          <StatusBar
            translucent
            backgroundColor={Colors.colorBackgroundGray}
            barStyle="dark-content"
          />
        </View>
      ) : (
        <View style={{ height: 0, marginBottom: 20 }}>
          <StatusBar
            backgroundColor={Colors.colorBackgroundGray}
            barStyle="dark-content"
          />
        </View>
      )}
      <ForegroundHandler />
      <View
        style={[
          styles.MainViewContainer,
          { paddingHorizontal: deviceInfoModule.isTablet() ? 80 : 20 },
        ]}>
        <View style={styles.WelcomeView}>
          <View style={styles.WelcomeSubView}>
            {dictData.profile_image || dictData.profile_image != '' ? (
              <Image
                style={styles.WelcomeImage}
                source={{ uri: dictData?.profile_image }}
                resizeMode="cover"
              />
            ) : (
              <Image
                style={styles.WelcomeImage}
                source={Images.placeProfile}
                resizeMode="cover"
              />
            )}

            <View style={styles.WelcomeTextView}>
              <Text style={styles.WelcomeText}>Welcome</Text>
              <Text style={styles.UgoText}>{dictData?.name}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={onPressNotification}>
            <View style={styles.WelcomeImageViewRight}>
              {dictData?.notificationCount != '0' && (
                <View style={styles.BadgeView}>
                  <Text style={styles.BadgeText}>
                    {dictData?.notificationCount}
                  </Text>
                </View>
              )}

              <Image
                source={require('../../assets/Notification.png')}
                style={styles.WelcomeImageRight}></Image>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={styles.BusinessAgentText}>Your Dashboard</Text>
          <Text style={styles.DateText}>{currentDateTimeWithDay()} </Text>
        </View>

        <View style={styles.FlatListView}>
          <FlatList
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={arrData}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onPressColoredIcon(item.id)}>
                  <View style={styles.viewColoredBoxStyle}>
                    <View
                      style={[
                        styles.Card,
                        { backgroundColor: colors[index % colors.length] },
                      ]}>
                      <View style={styles.ImageTextView}>
                        <Image
                          style={styles.FlatlistIcon}
                          source={item.icon}></Image>
                        <View style={styles.FlatlistTextView}>
                          <Text style={styles.TextId}>{item.value}</Text>
                          <Text style={styles.TextDescription}>
                            {item.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </View>

        <View style={styles.MainButtonView}>
          <TouchableOpacity
            style={styles.ButtonView}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('AddClient')
            }}>
            <View style={styles.ButtonImageTextView}>
              <Image
                style={[
                  styles.ButtonAddImage,
                  { height: 22, alignSelf: 'center', marginLeft: 5 },
                ]}
                source={require('../../assets/client.png')}></Image>
              <View style={styles.AddViewText}>
                <Text style={styles.AddDescription}>Add Client</Text>
                <Text style={styles.AddTextDescription}>
                  Add and manage your Client
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ButtonView}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('AddArea')
            }}>
            <View style={styles.ButtonImageTextView}>
              <Image
                style={[
                  styles.ButtonAddImage,
                  { alignSelf: 'center', marginLeft: 5 },
                ]}
                source={require('../../assets/calculationIcon.png')}></Image>
              <View style={styles.AddViewText}>
                <Text style={styles.AddDescription}>Add Area</Text>
                <Text style={styles.AddTextDescription}>
                  Add new Area to manage
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {slideIcon === false && (
            <Parent
              onEndReach={() => onChangeStyles()}
              slideIcon={slideIcon}
              imageIcon={Images.redBttn}
            />
          )}
          {slideIcon === true && (
            <Parent
              onEndReach={() => onChangeStyles()}
              slideIcon={slideIcon}
              imageIcon={Images.greenBttn}
            />
          )}
        </View>
      </View>

      <Loader isLoading={isShownLoader} />
    </View>
    // </ScrollView>
  )
}
export default Dashboard

export const styles = StyleSheet.create({
  MainViewContainer: {
    flex: 1,

    backgroundColor: Colors.colorBackgroundGray,
    // backgroundColor:'cyan'
  },
  WelcomeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 33,
  },
  viewColoredBoxStyle: {
    marginBottom: 8,
    // backgroundColor: 'cyan',
  },
  WelcomeSubView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  WelcomeImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  WelcomeTextView: {
    marginLeft: 12,
  },
  WelcomeImageRight: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  statuBarIosStyle: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: Colors.colorBackgroundGray,
    marginBottom: 20,
  },
  BusinessAgentText: {
    ...FontStyles.fontMontserrat_Bold18,
    color: Colors.navigationTitle,
  },
  DateText: {
    marginTop: 5,
    ...FontStyles.fontMontserrat_Normal15,
    color: Colors.navigationTitle,
  },
  FlatListView: {
    width: '100%',
    marginBottom: 30,
    // backgroundColor:'red'
  },
  Card: {
    height: 113,
    borderRadius: 20,
    width: deviceInfoModule.isTablet() ? 175 : 155,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    ...Shadow,
    // backgroundColor:'red'
  },
  ImageTextView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  TextId: {
    color: Colors.colorDarkBlue,
    ...FontStyles.fontMontserrat_Bold23,
  },
  TextDescription: {
    lineHeight: 18,
    marginRight: 10,
    color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_SemiBold12,
  },
  MainButtonView: {
    backgroundColor: Colors.colorBackgroundGray,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ButtonView: {
    height: 105,
    borderRadius: 20,
    width: deviceInfoModule.isTablet() ? 182 : '47%',
    borderWidth: 1,
    borderColor: '#006D9B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Shadow,
    // backgroundColor:'red'
  },
  ButtonImageTextView: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    // width: 105,
  },
  AddDescription: {
    color: Colors.colorDarkBlue,
    ...FontStyles.fontMontserrat_semibold16,
  },
  AddTextDescription: {
    lineHeight: 18,
    color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_SemiBold12,
  },
  ButtonAddImage: {
    height: 20,
    width: 20,
  },
  AddViewText: {
    marginLeft: 8,
  },
  WelcomeText: {
    ...FontStyles.fontMontserrat_Regular15,
    color: Colors.navigationTitle,
  },
  UgoText: {
    ...FontStyles.fontMontserrat_semibold17,
    color: Colors.navigationTitle,
  },
  FlatlistIcon: {
    height: 20,
    width: 20,
  },
  FlatlistTextView: {
    marginLeft: 10,
    marginRight: 5,
  },
  BadgeView: {
    height: 13,
    width: 13,
    backgroundColor: 'red',
    position: 'absolute',
    right: -3,
    borderRadius: 6,
    top: -4,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
    marginTop: -1,
  },
  WelcomeImageViewRight: {
    height: 20,
    width: 20,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  punch: {
    ...FontStyles.fontMontserrat_semibold16,
  },
  bottomSliderText: {
    ...FontStyles.fontMontserrat_Medium11,
    color: '#6E6B7B',
  },
})
