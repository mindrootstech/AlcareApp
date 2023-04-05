import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import ProfileStyle from './ProfileStyle'
import ActionSheet from 'react-native-actionsheet'
import { FontStyles } from '../../common/FontStyle'
import CommonBottomButton from '../../Components/CommonBottomButton'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { Colors } from '../../common/Colors'
import ImagePicker from 'react-native-image-crop-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logout_url, update_profile_image_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import Images from '../../common/Images'


import { AuthContext } from '../../common/context'

import { useIsFocused } from '@react-navigation/native'

const Profile = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext)
  const useFocused = useIsFocused()
  const styles = ProfileStyle()
  const [profilePictureURL, setProfilePictureURL] = useState()
  const actionSheet = useRef(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [dictProfile, setProfile] = useState({})
  const [isShownLoader, setShownLoader] = useState(false)

  const onImageError = () => {
    console.log('Error loading profile photo at url ' + profilePictureURL)
    // const defaultProfilePhotoURL =
    //     'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc=w240-h480-rw'
    // setProfilePictureURL(defaultProfilePhotoURL)
  }

  useEffect(() => {
    refreshParentProfile()
  }, [useFocused])

  const onPressLogout = () => {
    Alert.alert('', 'Are you sure you want to Logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => apiLogout() },
    ])
  }

  const apiLogout = async () => {
    setShownLoader(true)

    const response = await postWithParam(logout_url)

    console.log('response1:::::::::::', response)

    if (response.status == true) {
      setShownLoader(false)
      global.isUserIn = undefined
      global.isComingFromMapScreen = undefined
      global.isComingBackFromMapScreen = undefined
      global.isNavigatedToMapGlobal = undefined
      global.viewClientData = undefined
      global.userId = undefined
      signOut()
    } else {
      setShownLoader(false)
      signOut()
    }
  }

  const refreshParentProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('profile')

      if (value !== null) {
        const myProfileInfo = JSON.parse(value)
        console.log(myProfileInfo)
        setProfile(myProfileInfo)
        setProfilePictureURL(myProfileInfo?.profile_image)
      }
    } catch (error) {
      alert(error)
    }
  }

  const showActionSheet = index => {
    setSelectedPhotoIndex(index)
    actionSheet.current.show()
  }

  const onActionDone = index => {
    if (index == 0) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log('image---', image)
        setProfilePictureURL(image.path)
        console.log('==========fdsf======', dictProfile)
        apiEditProfileImage(image)
      })
    } else if (index == 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log('image---', image)
        setProfilePictureURL(image.path)
        apiEditProfileImage(image)
      })
    }
    console.log('Done')
  }

  const apiEditProfileImage = async image => {
    setShownLoader(true)

    let updatedProfileDict = dictProfile
    updatedProfileDict.profile_image = image.path
    setProfile(updatedProfileDict)
    AsyncStorage.setItem('profile', JSON.stringify(updatedProfileDict))

    let formdata = new FormData()

    formdata.append('profile_image', {
      name: image.filename ? image.filename : 'profileImage',
      type: image.mime,
      uri:
        Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path,
    })

    const response = await postWithParam(update_profile_image_url, formdata)

    console.log('=========response1', response)

    if (response.status == true) {
      setShownLoader(false)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const openUrl = async () => {
    navigation.navigate('Webview', {
      Title: 'Privacy Policy',
      Link: 'https://portal.allianceformulations.com/privacypolicy',
    })
  }


  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
      <View style={styles.container}>
        <CommonNavigationHeader
          navigationTitle={'Settings'}
          rightButtonTitle={'Reset'}
          onPressButton={() => navigation.goBack()}
        />

        <ScrollView>

          <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>


            {profilePictureURL || profilePictureURL != "" ?
              <Image
                style={[styles.image, { opacity: profilePictureURL ? 1 : 0.3 }]}
                source={{ uri: profilePictureURL }}
                resizeMode="cover"
                onError={onImageError}
              />
              :
              <Image
                style={[styles.image, { opacity: profilePictureURL ? 1 : 0.3 }]}
                source={Images.placeProfile}
                resizeMode="cover"
                onError={onImageError}
              />
            }
            {/* <Image
            style={[styles.image, { opacity: profilePictureURL ? 1 : 0.3 }]}
            source={{ uri: profilePictureURL }}
            resizeMode="cover"
            onError={onImageError}
          /> */}

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={showActionSheet}>
              <View style={styles.viewEditIcon}>
                <Image
                  style={styles.cameraIcon}
                  source={require('../../assets/whitePencil.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.textName,
              { ...FontStyles.fontMontserrat_semibold15 },
            ]}>
            {dictProfile?.name}
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('EditProfile')
            }}>
            <View style={styles.cellStyle}>
              <Image
                style={styles.cellIcon}
                source={require('../../assets/user.png')}
              />
              <Text
                style={[
                  styles.textCell,
                  { ...FontStyles.fontMontserrat_semibold15 },
                ]}>
                Profile
              </Text>
              <Image
                style={styles.cellArrowIcon}
                source={require('../../assets/arrow.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('ExpenseList', {
                isFromNavigation: true,
              })
            }}>
            <View style={[styles.cellStyle, { marginTop: 10 }]}>
              <Image
                style={styles.cellIcon}
                source={require('../../assets/expense_profile.png')}
              />
              <Text
                style={[
                  styles.textCell,
                  { ...FontStyles.fontMontserrat_semibold15 },
                ]}>
                Expense
              </Text>
              <Image
                style={styles.cellArrowIcon}
                source={require('../../assets/arrow.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('Media')
            }}>
            <View style={[styles.cellStyle, { marginTop: 10 }]}>
              <Image
                style={styles.cellIcon}
                source={require('../../assets/media.png')}
              />
              <Text
                style={[
                  styles.textCell,
                  { ...FontStyles.fontMontserrat_semibold15 },
                ]}>
                Media
              </Text>
              <Image
                style={styles.cellArrowIcon}
                source={require('../../assets/arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => openUrl()}>
            <View style={[styles.cellStyle, { marginTop: 10 }]}>
              <Image
                style={styles.cellIcon}
                source={Images.privacyIcon}
              />
              <Text
                style={[
                  styles.textCell,
                  { ...FontStyles.fontMontserrat_semibold15 },
                ]}>
                Privacy Policy
              </Text>
              <Image
                style={styles.cellArrowIcon}
                source={require('../../assets/arrow.png')}
              />
            </View>
          </TouchableOpacity>

          <View style={{height:"50%", width:"100%", marginBottom : 100}}>

          </View>

        </ScrollView>


        <View style={{ width: '100%', bottom: 28, position: 'absolute' }}>
          <CommonBottomButton
            manualButtonStyle={{ marginHorizontal: 20 }}
            buttonTitle={'Logout'}
            imageShow={true}
            onPressButton={() => onPressLogout()}
          />
        </View>

        <ActionSheet
          ref={actionSheet}
          title={'Confirm action'}
          options={['Camera', 'Gallery', 'Cancel']}
          cancelButtonIndex={2}
          onPress={index => {
            onActionDone(index)
          }}
        />
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

export default Profile
