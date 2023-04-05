import React, { useState } from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'

const ModalClients = props => {
  const { arrClients, onPressNotes, onSelectClient } = props

  const [clientDetailArrayForSearch, setClientDetailArrayForSearch] =
    useState(arrClients)

  const onChangeSearchText = text => {
    setClientDetailArrayForSearch(
      arrClients.filter(item => {
        return item.org_name.toLowerCase().includes(text.toLowerCase())
      }),
    )
  }

  console.log('========dsds==', arrClients)

  return (
    <View style={styles.viewParentStyle}>
      <View style={styles.viewInnerStyle}>
        <TouchableOpacity
          onPress={onPressNotes}
          style={styles.btnCancelStyle}
          activeOpacity={1}>
          <Image
            source={require('../assets/crossBlack.png')}
            style={styles.imgCrossStyle}
          />
        </TouchableOpacity>

        <View style={styles.viewSearchBarStyle}>
          <View style={styles.viewSearchBarInnerStyle}>
            <TextInput
              placeholder="Search"
              style={[
                styles.textInputSearchStyle,
                { ...FontStyles.fontMontserrat_semibold15, color: Colors.navigationTitle },
              ]}
              onChangeText={text => onChangeSearchText(text)}
            />
            <Image
              style={styles.imgLenceBlueStyle}
              source={require('.././assets/lenceBlue.png')}
            />
          </View>
        </View>
        <FlatList
          style={{ width: '100%', paddingHorizontal: 15, marginVertical: 20 }}
          showsVerticalScrollIndicator={false}
          data={clientDetailArrayForSearch}
          renderItem={({ item, index }) => {
            return (
              <View style={{ height: 40 }}>
                <TouchableOpacity onPress={() => onSelectClient(item)}>
                  <Text style={styles.textClientStyle}>{item.org_name}</Text>
                </TouchableOpacity>
                <View style={styles.viewSepratorStyle} />
              </View>
            )
          }}
        />
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
    paddingHorizontal: 10,
    width: '100%',
    height: 500,
  },
  btnCancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: -10,
    marginRight: -20,
    marginBottom: -2,
  },
  imgCrossStyle: {
    height: 15,
    width: 15,
    tintColor: Colors.colorDarkBlue,
  },
  viewSearchBarStyle: {
    borderRadius: 24,
    width: '100%',
    overflow: 'hidden',
    paddingBottom: 5,
  },
  viewSearchBarInnerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 22,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  textInputSearchStyle: {
    width: '85%',
    fontWeight: '400',
    fontSize: 14,
  },
  imgLenceBlueStyle: {
    width: 18,
    height: 18,
    marginRight: 1,
  },
  textClientStyle: {
    ...FontStyles.fontMontserrat_Regular15,
    color: Colors.navigationTitle
  },
  viewSepratorStyle: {
    width: '100%',
    backgroundColor: 'gray',
    height: 1,
    marginTop: 12,
  },
})
export default ModalClients
