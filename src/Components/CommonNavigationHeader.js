import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native'

import CommonBackBlueButton from './CommonBackBlueButton'
import { Colors } from '../common/Colors'
import ProfileStyle from '../screen/Profile/ProfileStyle'
import { FontStyles } from '../common/FontStyle'

const { width } = Dimensions.get('window')
const CommonNavigationHeader = props => {
  const styles = ProfileStyle()

  const {
    manualStyle = {},
    onPressButton,
    navigationTitle,
    rightButtonTitle = 'RESET',
    showBackButton = false,
    showRightButton = false,
    onPressRightButton,
    showPlusIcon = false,
  } = props

  return (
    <View style={[style.manualButtonStyle, manualStyle]}>
      <CommonBackBlueButton
        onPressButton={onPressButton}
        opacity={showBackButton ? 1 : 0}
        disable={!showBackButton}
      />

      <Text
      numberOfLines={1}
        style={[styles.textHeader, { ...FontStyles.fontMontserrat_Bold17 ,width:250}]}>
        {' '}
        {navigationTitle}{' '}
      </Text>

      <TouchableOpacity
        disabled={!showRightButton}
        onPress={onPressRightButton}>
        <Text
          style={{
            color: Colors.colorDarkBlue,
            ...FontStyles.fontMontserrat_Regular15,
            opacity: showPlusIcon ? 0 : showRightButton ? 1 : 0,

          }}>
          {' '}
          {rightButtonTitle}{' '}
        </Text>

        <Image
          style={{
            height: 22,
            width: 22,
            marginTop: -20,
            alignSelf: 'flex-end',
            marginRight:6,
            opacity: showPlusIcon ? 1 : 0,
          }}
          source={require('../assets/plus_Icon.png')}
        />
      </TouchableOpacity>
    </View>
  )
}

export default CommonNavigationHeader

const style = StyleSheet.create({
  manualButtonStyle: {
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 19,
    justifyContent: 'space-between',
    marginTop: 10,
    flexDirection: 'row',
    // backgroundColor: Colors.colorBackgroundGray,
    // backgroundColor:'red',
    
  },
  
})
