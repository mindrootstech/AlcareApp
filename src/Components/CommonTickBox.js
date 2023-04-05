import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'

const CommonTickBox = props => {
  const {
    showHospital = true,
    text,
    containerStyle,
    isChecked = false,
    onPressTick,
    buttonContainerStyle,
  
  } = props

  return (
    <TouchableOpacity
      onPress={onPressTick}
      activeOpacity={1}
      style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.ButtonImageView,
          {
            backgroundColor: isChecked ? Colors.colorDarkBlue : 'white',
            buttonContainerStyle,
          },
        ]}>
        <Image
          source={require('../assets/tickicon.png')}
          style={[styles.ImageStyle, { display: isChecked ? 'flex' : 'none' }]}
        />
      </View>
      <Text
        style={{
          ...FontStyles.fontMontserrat_Regular13,
          color: Colors.colorDarkGray,
        }}>
        {text} 
      </Text>
    </TouchableOpacity>
  )
}

export default CommonTickBox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor:'red'
    padding:1.1
  },
  ButtonImageView: {
    height: 19,
    width: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.colorDarkBlue,
    marginRight: 5,
    borderRadius: 2,
  },
  ImageStyle: {
    height: 8,
    width: 10,
  },
})
