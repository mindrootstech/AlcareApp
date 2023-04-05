import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Image,
  FlatList,
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native'
import CommonBottomButton from '../Components/CommonBottomButton'
import ActionSheet from 'react-native-actionsheet'
import { Colors } from '../common/Colors'
import Loader from '../network/Loader'
import { FontStyles } from '../common/FontStyle'
import CommonTextAndInput from '../Components/CommonTextAndInput'
import { Shadow } from '../common/Shadow'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ModalClientContacts = props => {
  const { onPressNotes, onSubmit } = props
  const [isShownLoader, setShownLoader] = useState(false)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef('')
  const emailRef = useRef('')
  const contactNumberRef = useRef('')
  const designationRef = useRef('')

  // First, last name, email, contact number, designation
  const onPressSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    if (
      firstNameRef.current.value == undefined ||
      firstNameRef.current.value == ''
    ) {
      alert('Please enter first name')
    }   else if (
      lastNameRef.current.value == undefined ||
      lastNameRef.current.value == '' 
      ) {
      alert('Please enter last name')
    } 
    // else if (
    //   emailRef.current.value == undefined ||
    //   emailRef.current.value == '' 
     
    // ) {
    //   alert('Please enter your email ')
    // } 
    else if (emailRef.current.value != '' && emailRef.current.value != undefined) {
      if (reg.test(emailRef.current.value) === false) {
        alert('Please enter correct email format')
      }
    }
    // else if(
    //   reg.test(emailRef.current.value) === false
    // ){
    //   alert('Please enter a corrrect email format')
    // }
    else if (
      contactNumberRef.current.value == undefined ||
      contactNumberRef.current.value == '' 
     
    ) {
      alert('Please enter your contact number')
    }
    else if (
      contactNumberRef.current.value.length < 10
    ){
      alert('Please enter a valid contact number')
    }
    else if (
      designationRef.current.value == undefined ||
      designationRef.current.value == ''
    ) {
      alert('Please enter designation')
    } else {
      const userData = {
        first_name: firstNameRef.current.value,
        last_name:
          lastNameRef.current.value == undefined
            ? ''
            : lastNameRef.current.value,
        detail_contact: contactNumberRef.current.value,
        detail_email: emailRef.current.value,
        designation: designationRef.current.value,
      }
      onSubmit(userData)
    }
  }

  return (
    <View style={styles.viewParentStyle}>
      <View style={styles.viewInnerStyle}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressNotes}
          style={[styles.btnCancelStyle, { height: 36, width: 36 }]}>
          <Image
            source={require('../assets/crossBlack.png')}
            style={styles.imgCrossStyle}
          />
        </TouchableOpacity>
        <KeyboardAwareScrollView
          style={{
            width: '100%',
          }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}>
          <View style={{ padding: 4 }}>
            <View style={styles.TextInputView}>
              <CommonTextAndInput
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="First Name"
                refInput={firstNameRef}
                placeholder="Enter First Name"
                autoCapitalizeProp={'sentences'}
              />
              <CommonTextAndInput
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="Last Name"
                refInput={lastNameRef}
                placeholder="Enter Last Name"
              />
              <CommonTextAndInput
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="Email Address"
                refInput={emailRef}
                keyboardType={'email-address'}
                placeholder=" Enter Email Address"
              />
              <CommonTextAndInput
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={[styles.TextInputStyle]}
                commonText="Contact No."
                refInput={contactNumberRef}
                maxLength={11}
                keyboardType={'numeric'}
                placeholder="Enter Contact No."
              />
              <CommonTextAndInput
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={[styles.TextInputStyle, { marginBottom: 20 }]}
                commonText="Designation"
                refInput={designationRef}
                placeholder="Enter Designation"
              />

              <CommonBottomButton
                onPressButton={onPressSubmit}
                manualButtonStyle={styles.btnSubmitStyle}
                buttonTitle={'Add Contact'}
              />
            </View>
            {/* </KeyboardAwareScrollView> */}
          </View>
        </KeyboardAwareScrollView>
      </View>

      <Loader isLoading={isShownLoader} />
    </View>
  )
}

const styles = StyleSheet.create({
  viewParentStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewInnerStyle: {
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 15,
    width: '100%',
  },
  btnCancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    alignSelf: 'flex-end',
    marginTop: -12,
    marginRight: -25,
  },
  imgCrossStyle: {
    height: 18,
    width: 18,
    tintColor: Colors.colorDarkBlue,
  },
  TextInputStyle: {
    marginTop: 15,
  },
  TextInputView: {
    width: '100%',
    backgroundColor: Colors.colorLightPurple,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    ...Shadow,
  },
  TextInputTitle: {
    // ...FontStyles.fontMontserrat_Regular14,
  },
  TextInput: {
    backgroundColor: 'white',
    // ...FontStyles.fontMontserrat_Regular12,
  },
  textAlignE: {
    alignSelf: 'center',
    ...FontStyles.fontMontserrat_Normal14,
  },
  textOrgAddStyle: {
    ...FontStyles.fontMontserrat_Regular15,
    marginBottom: 8,
    color: Colors.navigationTitle,
    marginTop: 20,
  },
  textInputOrgAddStyle: {
    ...FontStyles.fontMontserrat_Regular13,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: 'white',
    height: 38,
    marginBottom: 22,
  },
  btnSubmitStyle: {
    marginTop: 20,
    marginBottom: 20,
  },
})
export default ModalClientContacts
