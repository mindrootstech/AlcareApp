import React from 'react'
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'

const CommonBottomButton = props => {
  const {
    buttonTitle,
    manualButtonStyle,
    onPressButton,
    imageShow = false,
  } = props

  return (
    <TouchableOpacity
      onPress={onPressButton}
      style={[styles.btnStyle, manualButtonStyle]}>
      {imageShow && (
        <Image
          style={styles.imgStyle}
          source={require('../assets/logout.png')}
        />
      )}
      <Text
        style={[
          styles.textButtonStyle,
          { marginLeft: imageShow ? 5 : 0 },
          { ...FontStyles.fontMontserrat_semibold17 },
        ]}>
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: Colors.colorDarkBlue,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    height: 17,
    width: 19,
    marginLeft: -5,
  },
  textButtonStyle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
    color: 'white',
  },
})

export default CommonBottomButton
