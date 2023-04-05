import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '../../../common/Colors'
import { FontStyles } from '../../../common/FontStyle'
import { Shadow } from '../../../common/Shadow'

const AreaListCell = prop => {
  const { item, index, onPress } = prop
  // {"created_date": "Jul 19 2022", "height": "10.00", "length": "15.00",
  //  "name": "test area", "services": ["Surface Cleaning", "Environment Cleaning"],
  //   "width": "10.00"}

  console.log('==========df=', item.name)
  console.log('==========df=', item.services)

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <View style={{ padding: 3 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textAreaLightStyle}>Area Name</Text>
            <Text style={styles.textAreaNameStyle}>{item.name}</Text>
          </View>
          <Text style={styles.textDateStyle}>{item.created_date}</Text>
        </View>

        <View
          style={[
            styles.viewAreaParentStyle,
            {
              backgroundColor:
                (index + 1) % 2 == 0
                  ? Colors.coloLightYellow
                  : Colors.colorLightSkyBlue,
              height: 144,
              ...Shadow,
            },
          ]}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ width: 110, marginBottom: 5 }}>
              <View style={{ marginBottom: 25 }}>
                <Text style={styles.textAreaLightStyle}>Height</Text>
                <Text style={styles.textInfoHeavyStyle}>{item.height} ft.</Text>
              </View>
              <View>
                <Text style={styles.textAreaLightStyle}>Services</Text>
                <Text style={[styles.textInfoHeavyStyle]}>
                  {item.services[0]}
                </Text>
              </View>
            </View>
            <View style={{ width: 120 }}>
              <View style={{ marginBottom: 40 }}>
                <Text style={styles.textAreaLightStyle}>Length</Text>
                <Text style={styles.textInfoHeavyStyle}>{item.length} ft.</Text>
              </View>
              {item.services.length >= 2 && (
                <Text style={[styles.textInfoHeavyStyle]}>
                  {item.services[1]}
                </Text>
              )}
            </View>
            <View style={{ width: 120 }}>
              <View style={{ marginBottom: 40 }}>
                <Text style={styles.textAreaLightStyle}>Width</Text>
                <Text style={styles.textInfoHeavyStyle}>{item.width} ft.</Text>
              </View>
              {item.services.length == 3 && (
                <Text style={[styles.textInfoHeavyStyle]}>
                  {item.services[2]}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  viewAreaParentStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 6,
    width: '100%',
    height: 130,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textAreaLightStyle: {
    color: Colors.colorDarkGray,
    marginRight: 10,
    ...FontStyles.fontMontserrat_Regular14,
  },
  textAreaHeavyStyle: {
    color: Colors.colorDarkGray,
  },
  textAreaNameStyle: {
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_semibold14,
  },
  textDateStyle: {
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_Medium14,
  },
  textInfoHeavyStyle: {
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_semibold14,
  },
})

export default AreaListCell
