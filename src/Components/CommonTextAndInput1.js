import React, { useRef, useState } from 'react'
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Button,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'

const CommonTextAndInput1 = props => {
  const {
    manualViewStyle,
    commonText,
    placeholder,
    isSecureTextEntry,
    onChangeTextFunc,
    keyboardType,
    titleStyle,
    textInputStyle,
    refInput,
    isEditable = true,
    maxLength = 1000,
    value,
    defaultValue,
    autoCapitalizeProp = 'none',
    isTouchable = false,
    onPress,
    returnKeyType = 'default',
    showPswrdIcon = false,
    onPressbttn,
    images,
    onChangeText = () => {
      text => {
        if (keyboardType == 'numeric') {
          let numreg = commonText == 'Contact No.' ? /^[0-9]+$/ : /^\d+\.?\d*$/ ///^[0-9]+$/
          console.log(text)
          // setValueNumeric('')
          if (text == '') {
            setValueNumeric('')
            refInput.current.value = ''
          }
          if (numreg.test(text)) {
            refInput.current.value = text
            setValueNumeric(text)
          } else {
            //  setValueNumeric('')
            //  refInput.current.value = ''
            // Alert.alert('Please fill valid number')
          }
        } else {
          refInput.current.value = text
        }
      }
    },
  } = props

  const [valueNumeric, setValueNumeric] = useState('')

  return (
    <Pressable disabled={isTouchable ? false : true} onPress={onPress}>
      <View
        style={[styles.viewParentStyle, manualViewStyle]}
        pointerEvents={isTouchable ? 'none' : 'box-none'}>
        <Text style={[styles.textCommonStyle, titleStyle]}>{commonText}</Text>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 0.5,
            borderRadius: 5,
            borderColor: Colors.navigationTitle,
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <TextInput
            secureTextEntry={isSecureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={
              Platform.OS == 'android'
                ? Colors.colorLightGray
                : Colors.colorLightGray
            }
            style={[styles.textInputCommonStyle, textInputStyle]}
            returnKeyType={returnKeyType}
            onChangeText={onChangeText}
            editable={isEditable}
            onChange={onChangeTextFunc}
            keyboardType={keyboardType}
            ref={refInput}
            autoCapitalize={autoCapitalizeProp}
            maxLength={maxLength}
            defaultValue={defaultValue}
            value={keyboardType == 'numeric' ? valueNumeric : value}
            color="black"
          />
          {showPswrdIcon && (
            <TouchableOpacity onPress={onPressbttn}>
              <Image style={styles.eyeIcon} source={images}></Image>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  viewParentStyle: {
    width: '100%',
    marginTop: 50,
  },
  textCommonStyle: {
    ...FontStyles.fontMontserrat_Regular15,
    marginBottom: 8,
    color: Colors.navigationTitle,
  },
  textInputCommonStyle: {
    ...FontStyles.fontMontserrat_Regular13,
    // borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: Colors.navigationTitle,
    paddingHorizontal: 15,
    color: 'black',
    // backgroundColor: 'white',
    height: 38,
    width: '92%',
  },
  eyeIcon: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
    // backgroundColor:"red"
    // alignSelf:'flex-end'
  },
})

export default CommonTextAndInput1
