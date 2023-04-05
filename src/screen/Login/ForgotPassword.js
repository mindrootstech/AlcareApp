import React, { useRef, useState } from 'react'
import {
  View,
  Keyboard,
  Alert,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import CommonBackBlueButton from '../../Components/CommonBackBlueButton'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import CommonBottomButton from '../../Components/CommonBottomButton'
import { Colors } from '../../common/Colors'
import { forgot_password_url } from '../../network/Urls'
import { checkEmailWithPost } from '../../network'
import Loader from '../../network/Loader'
import { FontStyles } from '../../common/FontStyle'

const ForgotPassword = ({ navigation }) => {
  // const {  } = props;

  const emailRef = useRef('')
  const [isShownLoader, setShownLoader] = useState(false)

  const onSubmitPress = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    const email = emailRef.current.value

    if (email == '' || email == undefined || reg.test(email) === false) {
      alert('Please fill the correct email')
    } else {
      apiViewClient()
    }
  }

  const apiViewClient = async () => {
    setShownLoader(true)

    let formdata = new FormData()
    formdata.append('email', emailRef.current.value)

    const response = await checkEmailWithPost(forgot_password_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      alert('Varification send to your email successfully')
    } else {
      setShownLoader(false)
      Alert.alert('', response.text)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <View style={styles.viewParentStyle}>
          <View style={styles.viewUpperSectionStyle}>
            <CommonBackBlueButton
              manualButtonStyle={{ marginTop: 55 }}
              onPressButton={() => navigation.goBack()}
            />
            <Text style={styles.textLoginToYourAccountStyle}>
              Forgot your Password
            </Text>
            <Text style={styles.textCommonStyle}>
              Enter your Email address and we'll send you an email to reset your
              password.
            </Text>

            <CommonTextAndInput
              manualViewStyle={{ marginTop: 15 }}
              isSecureTextEntry={false}
              commonText={'E-mail'}
              placeholder={'E-mail'}
              refInput={emailRef}
              keyboardType={'email-address'}
            />
          </View>
          <CommonBottomButton
            manualButtonStyle={styles.btnLoginStyle}
            buttonTitle={'Submit'}
            onPressButton={onSubmitPress}
          />
        </View>
        <Loader isLoading={isShownLoader} />
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
  },
  viewUpperSectionStyle: {
    width: '100%',
  },
  textCommonStyle: {
    ...FontStyles.fontMontserrat_Regular16,
    marginBottom: 8,
    color: Colors.navigationTitle,
    marginTop: 30,
  },
  textLoginToYourAccountStyle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.colorDarkBlue,
    marginTop: 38,
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
    // backgroundColor: 'blue',
  },
})

export default ForgotPassword
