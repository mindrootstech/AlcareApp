import { View, Alert, SafeAreaView, StatusBar } from 'react-native'
import React, { useState, useRef } from 'react'
import ActionSheet from 'react-native-actionsheet'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import ProfileStyle from './ProfileStyle'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import CommonBottomButton from '../../Components/CommonBottomButton'
import { FontStyles } from '../../common/FontStyle'
import { Colors } from '../../common/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { change_password_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'

const ChangePassword = ({ navigation }) => {
  const styles = ProfileStyle()
  const oldPasswordRef = useRef('')
  const passwordRef = useRef('')
  const reEnterPasswordRef = useRef('')
  const [isShownLoader, setShownLoader] = useState(false)

  const onDonePress = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

    const oldPassword = oldPasswordRef.current.value
    const password = passwordRef.current.value
    const reEnterPassword = reEnterPasswordRef.current.value

    if (
      oldPassword == '' ||
      oldPassword == undefined ||
      oldPassword.length < 6
    ) {
      alert('Please fill the valid password with more than 5 Character')
    } else if (password == '' || password == undefined || password.length < 6) {
      alert('Please fill the valid new password with more than 5 Character')
    } else if (reEnterPassword == undefined || reEnterPassword != password) {
      alert("Password and confirm password must be same")
    } 
    else {
      apiChangePassword()
    }
  }

  const apiChangePassword = async () => {
    setShownLoader(true)
    let formdata = new FormData()

    formdata.append('old_password', oldPasswordRef.current.value)
    formdata.append('password', passwordRef.current.value)
    formdata.append('confirm_password', reEnterPasswordRef.current.value)

    console.log('formdata=========', formdata)

    const response = await postWithParam(change_password_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      alert('Password updated succesfully')
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
          navigationTitle={'Change Password'}
          onPressButton={() => navigation.goBack()}
          showBackButton={true}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <CommonTextAndInput
            manualViewStyle={{ marginTop: 20 }}
            isSecureTextEntry={true}
            commonText={'Old Password'}
            placeholder={'Enter Old Password'}
            refInput={oldPasswordRef}
          />
          <CommonTextAndInput
            manualViewStyle={{ marginTop: 18 }}
            isSecureTextEntry={true}
            commonText={'New Password'}
            placeholder={'Enter New Password'}
            refInput={passwordRef}
          />
          <CommonTextAndInput
            manualViewStyle={{ marginTop: 18 }}
            isSecureTextEntry={true}
            commonText={'Re-enter New Password'}
            placeholder={'Re-enter New Password'}
            refInput={reEnterPasswordRef}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={{ width: '100%', bottom: 50, position: 'absolute' }}>
        <CommonBottomButton
          onPressButton={onDonePress}
          manualButtonStyle={{ marginHorizontal: 20 }}
          buttonTitle={'Done'}
        />
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

export default ChangePassword
