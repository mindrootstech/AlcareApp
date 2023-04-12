import React, { useState } from 'react'
import { View, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import CommonBottomButton from '../Components/CommonBottomButton'

import { Colors } from '../common/Colors'

import { FontStyles } from '../common/FontStyle'

import { Shadow } from '../common/Shadow'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonTextAndInput1 from '../Components/CommonTextAndInput1'

const ModalClientContacts = props => {
  const { onPressNotes, onSubmit } = props

  const [dictUserInfo, setUserDictInfo] = useState({
    first_name: '',
    last_name: '',
    detail_email: '',
    detail_contact: '',
    designation: '',
  })

  const onPressSubmit = () => {
    const { first_name, last_name, detail_email, detail_contact, designation } =
      { ...dictUserInfo }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    if (!first_name) {
      Alert.alert('', 'Please enter first name')
      return
    }
    if (!last_name) {
      Alert.alert('', 'Please enter last name')
      return
    }
    if (!detail_email) {
      Alert.alert('', 'Please enter email-address')
      return
    }

    if (reg.test(detail_email) === false) {
      Alert.alert('', 'Please enter correct email-address')
      return
    }

    if (!detail_contact) {
      Alert.alert('', 'Please enter contact number')
      return
    }
    if (detail_contact.length < 10) {
      Alert.alert('', 'Please enter correct contact number')
      return
    }
    if (!designation) {
      Alert.alert('', 'Please enter designation')
      return
    }
    onSubmit(dictUserInfo)
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
              <CommonTextAndInput1
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="First Name"
                onChangeText={text => {
                  setUserDictInfo(prevState => ({
                    ...prevState,
                    first_name: text,
                  }))
                }}
                placeholder="Enter First Name"
                autoCapitalizeProp={'sentences'}
              />
              <CommonTextAndInput1
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="Last Name"
                onChangeText={text => {
                  setUserDictInfo(prevState => ({
                    ...prevState,
                    last_name: text,
                  }))
                }}
                placeholder="Enter Last Name"
              />
              <CommonTextAndInput1
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={styles.TextInputStyle}
                commonText="Email Address"
                onChangeText={text => {
                  setUserDictInfo(prevState => ({
                    ...prevState,
                    detail_email: text,
                  }))
                }}
                keyboardType={'email-address'}
                placeholder=" Enter Email Address"
              />
              <CommonTextAndInput1
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={[styles.TextInputStyle]}
                commonText="Contact No."
                onChangeText={text => {
                  setUserDictInfo(prevState => ({
                    ...prevState,
                    detail_contact: text,
                  }))
                }}
                maxLength={10}
                keyboardType={'number-pad'}
                placeholder="Enter Contact No."
              />
              <CommonTextAndInput1
                textInputCommonStyle={styles.TextInput}
                textCommonStyle={styles.TextInputTitle}
                manualViewStyle={[styles.TextInputStyle, { marginBottom: 20 }]}
                commonText="Designation"
                onChangeText={text => {
                  setUserDictInfo(prevState => ({
                    ...prevState,
                    designation: text,
                  }))
                }}
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
