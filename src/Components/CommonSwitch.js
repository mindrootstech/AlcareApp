import { View, Text, Switch, StyleSheet } from 'react-native'
import React from 'react'
import { FontStyles } from '../common/FontStyle'
import { Colors } from '../common/Colors'

const CommonSwitch = props => {
  const { isEnabled, onValueChangePress, title } = props

  return (
    <View>
      <View
        style={[
          styles.viewSurfaceCleaning,
          { marginBottom: isEnabled ? 0 : 10 },
        ]}>
        <Text
          style={{
            ...FontStyles.fontMontserrat_Regular15,
            color: Colors.navigationTitle,
          }}>
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{ marginRight: 7, ...FontStyles.fontMontserrat_Normal13 }}>
            No
          </Text>
          <Switch
            trackColor={{
              false: Colors.switchBackground,
              true: Colors.switchBackground,
            }}
            thumbColor={isEnabled ? Colors.colorDarkBlue : Colors.white}
            onValueChange={onValueChangePress}
            value={isEnabled}
          />
          <Text
            style={{ marginLeft: 7, ...FontStyles.fontMontserrat_Normal13 }}>
            Yes
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CommonSwitch

const styles = StyleSheet.create({
  viewSurfaceCleaning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
