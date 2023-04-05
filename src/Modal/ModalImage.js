import React from 'react'
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native'
import { Colors } from '../common/Colors'

const ModalImage = props => {
  const { arrImage, onPressNotes } = props

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

        <FlatList
          style={{ width: '100%' }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={arrImage}
          renderItem={({ item, index }) => {
            return (
              <Image resizeMode='stretch' style={styles.imgCameraStyle} source={{ uri: item }} />
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
  },
  imgCameraStyle: {
    height: 400,
    width: Dimensions.get('window').width - 60,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  btnCancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: -17,
    marginRight: -20,
    marginBottom: -2,
  },
  imgCrossStyle: {
    height: 15,
    width: 15,
    tintColor: Colors.colorDarkBlue,
  },
})
export default ModalImage
