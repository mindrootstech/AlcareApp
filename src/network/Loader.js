import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators'
import { Colors } from '../common/Colors'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const Loader = props => {
  const {
    isLoading = false,
    loaderPosition = {},
    position = 'absolute',
    left = 0,
    top = 0,
    bottom = 0,
    right = 0,
  } = props

  if (isLoading) {
    return (
      <View
        style={[
          loaderPosition,
          {
            position: position,
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <UIActivityIndicator isLoading color={Colors.colorOffWhite} />
      </View>
    )
  }
  return <View style={[{ top: 0 }, loaderPosition]}></View>
}

export default Loader

const styles = StyleSheet.create({})
