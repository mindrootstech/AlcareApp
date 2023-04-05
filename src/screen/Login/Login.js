import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Keyboard,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import CommonBottomButton from '../../Components/CommonBottomButton'
import { Colors } from '../../common/Colors'
import { postWithParam, loginWithPost } from '../../network'
import Loader from '../../network/Loader'
import { login_url } from '../../network/Urls'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../../common/context'
import {
  requestUserPermission,
  notificationListener,
} from '../../Helper/FirebasePushHelper'
import ForegroundHandler from '../../Helper/ForegroundHandler'
import Images from '../../common/Images'

const Login = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext)

  // const {  } = props;
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const [isShownLoader, setShownLoader] = useState(false)
 
 
  const [showpass, setshowpass] = useState(true)

  const showPassword=()=>{
    setshowpass(!showpass)
  }

  useEffect(() => {
    requestUserPermission()
    notificationListener()
  })

  const onLoginPress = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

    if (
      emailRef.current.value == '' ||
      emailRef.current.value == undefined 
    
    ) {
      alert('Please enter your email address')
    } else if (
      reg.test(emailRef.current.value) === false
    ){
      alert('Please enter a correct email format ')
    }
    
    else if (
      passwordRef.current.value == '' ||
      passwordRef.current.value == undefined 
     
    ) {
      alert('Please enter the password')
    }
    else if (
      passwordRef.current.value.length < 6
    ){
      alert('Please fill the valid password with more than 5 Character')
    }
    else {
      apiLogin()
    }
  }

  const apiLogin = async () => {
    setShownLoader(true)
    let formdata = new FormData()

    formdata.append('email', emailRef.current.value)
    formdata.append('password', passwordRef.current.value)

    let fcmToken = await AsyncStorage.getItem('fcmToken')

    formdata.append('firebase_id', fcmToken ? fcmToken : '')

    const response = await loginWithPost(login_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)

      if (response.data.status == '1') {
        AsyncStorage.setItem('token', response.data.token)
        AsyncStorage.setItem('klogin', JSON.stringify(true))

        signIn(response.data.token)
      } else {
        alert(
          'Your account is pending approval. You will be able to use the app once the admin approves your account.',
        )
      }
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.viewParentStyle}>
        <ForegroundHandler />
        <View style={styles.viewUpperSectionStyle}>
          <Text style={styles.textLoginToYourAccountStyle}>
            Login to your account
          </Text>
          <CommonTextAndInput
            manualViewStyle={{ marginTop: 40 }}
            isSecureTextEntry={false}
            commonText={'E-mail'}
            placeholder={'E-mail'}
            refInput={emailRef}
            keyboardType={'email-address'}
          />
         
          <CommonTextAndInput
            manualViewStyle={{ marginTop: 18 }}
            // isSecureTextEntry={true}
            commonText={'Password'}
            placeholder={'Password'}
            refInput={passwordRef}
            isSecureTextEntry={showpass}
            showPswrdIcon={true}
            onPressbttn={()=>showPassword()}
            images={showpass === true?Images.clossEye:Images.eyeIcon}
          />
          {/* <TouchableOpacity onPress={() => setshowpass(!showpass)}>
            <Image style={styles.eyeIcon} source={Images.eyeIcon}>
            </Image></TouchableOpacity> */}
         
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.btnForgotPasswordStyle}>
            <Text style={styles.textForgotPasswordStyle}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </View>

        <Loader isLoading={isShownLoader} />

        <CommonBottomButton
          onPressButton={onLoginPress}
          manualButtonStyle={styles.btnLoginStyle}
          buttonTitle={'LOGIN'}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  viewParentStyle: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: Colors.colorBackgroundGray,
  },
  viewUpperSectionStyle: {
    width: '100%',
  },
  textLoginToYourAccountStyle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.colorDarkBlue,
    marginTop: 90,
  },
  btnForgotPasswordStyle: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  textForgotPasswordStyle: {
    color: Colors.colorDarkBlue,
    fontSize: 12,
    fontWeight: '400',
  },
  btnLoginStyle: {
    marginBottom: 50,
    width: '100%',
  },
  eyeIcon:{
    width:25,
    height:25,
    resizeMode:"contain",
   

  }
})

export default Login
