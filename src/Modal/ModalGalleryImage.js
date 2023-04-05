import React from 'react'
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native'
import { Colors } from '../common/Colors'

const ModalGalleryImage = props => {
  const { image, onPressImage } = props

  return (
    <View style={styles.viewParentStyle}>
      <View style={styles.viewInnerStyle}>
        <TouchableOpacity
          onPress={onPressImage}
          style={styles.btnCancelStyle}
          activeOpacity={1}>
          <Image
            source={require('../assets/crossBlack.png')}
            style={styles.imgCrossStyle}
          />
        </TouchableOpacity>

        <Image style={[styles.imgCameraStyle]} source={{ uri: image }} />
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
    height: 500,
    width: '100%',
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
    borderRadius: 18,
    alignSelf: 'flex-end',
    marginTop: -15,
    marginRight: -20,
    marginBottom: -4,
  },
  imgCrossStyle: {
    height: 15,
    width: 15,
    tintColor: Colors.colorDarkBlue,
  },
})
export default ModalGalleryImage
