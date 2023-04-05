import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'
import { Shadow } from '../common/Shadow'

const AreaCard = props => {
  const { areaBoxDetail } = props

  console.log('----------------8', areaBoxDetail)
  return (
    <View style={{ padding: 4 }}>
      <View style={styles.areaCardStyle}>
        <View style={styles.subView}>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Length</Text>
            <Text style={styles.lengtjDesStyle}>
              {areaBoxDetail.length} ft.
            </Text>
          </View>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Width</Text>
            <Text style={styles.lengtjDesStyle}>{areaBoxDetail.width} ft.</Text>
          </View>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Height</Text>
            <Text style={styles.lengtjDesStyle}>
              {areaBoxDetail.height} ft.
            </Text>
          </View>
        </View>
        <View style={[styles.subView, { marginTop: 20 }]}>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Area</Text>
            <Text style={styles.lengtjDesStyle}>
              {areaBoxDetail.area} sq. ft.
            </Text>
          </View>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Volume</Text>
            <Text style={styles.lengtjDesStyle}>
              {areaBoxDetail.volume} cu. ft.
            </Text>
          </View>
          <View style={styles.subView2}>
            <Text style={styles.lengthStyle}>Area(4 walls)</Text>
            <Text style={styles.lengtjDesStyle}>
              {areaBoxDetail.areaof4wall} sq. ft.
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default AreaCard

const styles = StyleSheet.create({
  areaCardStyle: {
    backgroundColor: Colors.cardColor,
    padding: 15,
    paddingLeft: 20,
    borderRadius: 10,
    marginTop: 10,
    ...Shadow,
  },
  subView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  subView2: {
    flex: 1,
  },
  lengthStyle: {
    ...FontStyles.fontMontserrat_Normal14,
    color: Colors.textColor,
  },
  lengtjDesStyle: {
    ...FontStyles.fontMontserrat_SemiBold13,
    color: Colors.textBoldColor,
  },
})
