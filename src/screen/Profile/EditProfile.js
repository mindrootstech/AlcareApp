import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import ActionSheet from 'react-native-actionsheet'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import ProfileStyle from './ProfileStyle'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import CommonBottomButton from '../../Components/CommonBottomButton'
import { FontStyles } from '../../common/FontStyle'
import { Colors } from '../../common/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import {
  update_profile_url,
  update_profile_image_url,
} from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Images from '../../common/Images'

const EditProfile = ({ navigation }) => {
  const styles = ProfileStyle()

  const [dictProfile, setProfile] = useState({})
  const actionSheet = useRef(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const orgNameRef = useRef(null)
  const addressRef = useRef(null)
  const emailRef = useRef(dictProfile.email)
  const contactRef = useRef(null)
  const [isShownLoader, setShownLoader] = useState(false)

  useEffect(() => {
    refreshParentProfile()
  }, [])

  const refreshParentProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('profile')

      if (value !== null) {
        const myProfileInfo = JSON.parse(value)
        setProfile(myProfileInfo)
        orgNameRef.current.value = myProfileInfo.organization_name
        addressRef.current.value = myProfileInfo.organization_address
        emailRef.current.value = myProfileInfo.email
        contactRef.current.value = myProfileInfo.contact_no

        console.log('data>>>>>>>>>>>>', myProfileInfo)
      }
    } catch (error) {
      alert(error)
    }
  }

  const onImageError = () => {
    // console.log('Error loading profile photo at url ' + profilePictureURL)
    // const defaultProfilePhotoURL =
    //     'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc=w240-h480-rw'
    // setProfilePictureURL(defaultProfilePhotoURL)
  }
  //
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
        apiEditProfileImage(image)
      })
    } else if (index == 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log('image---', image)
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

    console.log('=======1', response)

    if (response.status == true) {
      setShownLoader(false)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const onPressUpdate = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

    if (
      orgNameRef.current.value == '' ||
      orgNameRef.current.value == undefined
    ) {
      alert('please fill Organization name')
    } else if (
      addressRef.current.value == '' ||
      addressRef.current.value == undefined
    ) {
      alert('please fill Organization Address')
    } else if (
      emailRef.current.value == '' ||
      emailRef.current.value == undefined
    ) {
      alert('please fill Email Address')
    } else if (
      reg.test(emailRef.current.value) === false
    ) {
      alert('Please enter correct email format')
    }
    else if (
      contactRef.current.value == '' ||
      contactRef.current.value == undefined
    ) {
      alert('please fill Contact No.')
    } else if (
      contactRef.current.value.length < 10
    ) {
      alert('Please enter a valid contact number')
    }
    else {
      let updatedProfileDict = dictProfile
      updatedProfileDict.organization_name = orgNameRef.current.value
      updatedProfileDict.organization_address = addressRef.current.value
      updatedProfileDict.email = emailRef.current.value
      updatedProfileDict.contact_no = contactRef.current.value

      setProfile(updatedProfileDict)
      AsyncStorage.setItem('profile', JSON.stringify(updatedProfileDict))
      apiEditProfile()
    }
  }

  const apiEditProfile = async () => {
    setShownLoader(true)
    let formdata = new FormData()

    formdata.append('organization_name', orgNameRef.current.value)
    formdata.append('organization_address', addressRef.current.value)
    formdata.append('contact_no', contactRef.current.value)
    formdata.append('email', emailRef.current.value)

    console.log('res898989898========ponse1', formdata)

    const response = await postWithParam(update_profile_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      alert('Profile updated successfully')
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <CommonNavigationHeader
          navigationTitle={'Edit Profile'}
          onPressButton={() => navigation.goBack()}
          showBackButton={true}
        />

        <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
          {dictProfile.profile_image || dictProfile.profile_image != "" ?
            <Image
              style={[styles.editImage, { opacity: dictProfile ? 1 : 0.3 }]}
              source={{ uri: dictProfile.profile_image }}
              resizeMode="cover"
              onError={onImageError}
            />
            :
            <Image
              style={[styles.editImage, { opacity: 0.3}]}
              source={Images.placeProfile}
              resizeMode="cover"
              onError={onImageError}
            />
          }

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

        <ScrollView style={{ paddingHorizontal: 20 }}>
          <ScrollView style={{ marginTop: 10 }}>
            <CommonTextAndInput
              manualViewStyle={{ marginTop: 20 }}
              isSecureTextEntry={false}
              commonText={'Organization Name'}
              placeholder={'Enter Organization Name'}
              refInput={orgNameRef}
              defaultValue={dictProfile.organization_name}
              autoCapitalizeProp={'sentences'}
            // onChangeTextFunc={setEmail}
            />
            <CommonTextAndInput
              manualViewStyle={{ marginTop: 18 }}
              isSecureTextEntry={false}
              commonText={'Organization Address'}
              placeholder={'Enter Organization Address'}
              refInput={addressRef}
              // onChangeTextFunc={setEmail}
              defaultValue={dictProfile.organization_address}
              autoCapitalizeProp={'sentences'}
            />
            <CommonTextAndInput
              manualViewStyle={{ marginTop: 18 }}
              isSecureTextEntry={false}
              commonText={'E-mail'}
              placeholder={'Enter E-mail'}
              keyboardType={'email-address'}
              refInput={emailRef}
              defaultValue={dictProfile.email}
            // onChangeTextFunc={setEmail}
            />
            <CommonTextAndInput
              manualViewStyle={{ marginTop: 18 }}
              isSecureTextEntry={false}
              commonText={'Contact No.'}
              placeholder={'Enter Contact No.'}
              keyboardType={'numeric'}
              defaultValue={dictProfile.contact_no}
              refInput={contactRef}
              maxLength={11}
              returnKeyType='done'
            // onChangeTextFunc={setEmail}
            />

            <CommonTextAndInput
              manualViewStyle={{ marginTop: 18 }}
              isSecureTextEntry={true}
              commonText={'Password'}
              placeholder={'************'}
              isEditable={false}
            // onChangeTextFunc={setEmail}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePassword')
              }}
              style={{ marginTop: 10 }}>
              <Text
                style={{
                  textAlign: 'right',
                  ...FontStyles.fontMontserrat_Normal13,
                  color: Colors.colorChangePswrd,
                }}>
                Change Password
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>

        <ActionSheet
          ref={actionSheet}
          title={'Confirm action'}
          options={['Camera', 'Gallery', 'Cancel']}
          cancelButtonIndex={2}
          onPress={index => {
            onActionDone(index)
          }}
        />
      </KeyboardAwareScrollView>
      <View style={{
        width: '100%',
        marginVertical: 10,
        // backgroundColor:'red'
      }}>
        <CommonBottomButton
          onPressButton={onPressUpdate}
          manualButtonStyle={{ marginHorizontal: 20 }}
          buttonTitle={'Update'}
        />
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

export default EditProfile
