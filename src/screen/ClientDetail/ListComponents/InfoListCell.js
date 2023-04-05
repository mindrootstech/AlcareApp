import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../../../common/Colors'
import { FontStyles } from '../../../common/FontStyle'
import { Shadow } from '../../../common/Shadow'

const InfoListCell = props => {
  const { infoDetail } = props
  return (
    <View style={styles.viewInfoParentStyle}>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text style={styles.textInfoLightStyle}>Organization Name:</Text>
        <Text
          style={[styles.textInfoHeavyStyle, { flex: 1 }]}
          numberOfLines={2}>
          {infoDetail.org_name}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12, marginRight: 2 }}>
        <Text style={styles.textInfoLightStyle}>Email Address:</Text>
        <Text style={styles.textInfoHeavyStyle} numberOfLines={2}>
          {infoDetail.email_adderss}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Text style={styles.textInfoLightStyle}>Contact No:</Text>
        <Text style={styles.textInfoHeavyStyle}>{infoDetail.contact_no}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Text style={styles.textInfoLightStyle}>
          Organisation Address:
          <Text style={styles.textInfoHeavyStyle}> {infoDetail.address}</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewInfoParentStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 15,
    backgroundColor: Colors.colorLightSkyBlue,
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    ...Shadow,
  },
  textInfoLightStyle: {
    color: Colors.colorDarkGray,
    marginRight: 10,
    ...FontStyles.fontMontserrat_Regular15,
  },
  textInfoHeavyStyle: {
    flex: 1,
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_Bold16,
  },
})

export default InfoListCell
