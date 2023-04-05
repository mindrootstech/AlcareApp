import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Image,
  FlatList,
  Alert,
  Modal,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native'
import CommonBottomButton from '../Components/CommonBottomButton'
import ActionSheet from 'react-native-actionsheet'
import { Colors } from '../common/Colors'
import ImagePicker from 'react-native-image-crop-picker'
import ModalGalleryImage from './ModalGalleryImage'
import { create_contact_note_url } from '../network/Urls'
import { postWithParam } from '../network'
import Loader from '../network/Loader'
import { FontStyles } from '../common/FontStyle'
import Geolocation from '@react-native-community/geolocation'
import InputAccessoryViewCommon from "../Components/InputAccessoryViewCommon";
const ModalAddContactNote = props => {
  const { onPressNotes, clientId, contactId } = props
  const actionSheet = useRef(null)
  const notesRef = useRef('')
  const [isShownLoader, setShownLoader] = useState(false)
  const inputAccessoryViewID = "uniqueID";
  console.log('clientId----', clientId)
  console.log('contactId----', contactId)

  const showActionSheet = index => {
    actionSheet.current.show()
  }

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position----', position)
        apiAddNotes(position.coords.latitude, position.coords.longitude)
      },
      error => {
        console.log(error.message)
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    )
  }

  const onPressSubmit = () => {
    if (notesRef.current.value == '' || notesRef.current.value == undefined) {
      alert('please fill note')
    } else {
      getOneTimeLocation()
    }
  }

  const apiAddNotes = async (lat, long) => {
    setShownLoader(true)
    let formdata = new FormData()

    formdata.append('note', notesRef.current.value)
    formdata.append('client_id', clientId)
    formdata.append('contact_id', contactId)
    formdata.append('lat', lat)
    formdata.append('long', long)

    const response = await postWithParam(create_contact_note_url, formdata)

    if (response.status == true) {
      setShownLoader(false)
      console.log('success')
      Alert.alert('', 'Note created successfully', [
        { text: 'OK', onPress: () => onPressNotes() },
      ])
    } else {
      setShownLoader(false)

      console.log('response.message========12', response.message)
      Alert.alert('', response.message)
    }
  }

  return (
    <View style={styles.viewParentStyle}>
      <View style={styles.viewInnerStyle}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressNotes}
          style={[styles.btnCancelStyle, { height: 36, width: 36 }]}>
          <Image
            source={require('../assets/crossBlack.png')}
            style={styles.imgCrossStyle}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.textAddNotesStyle,
            { ...FontStyles.fontMontserrat_Bold18 },
          ]}>
          Add Notes
        </Text>

        {Platform.OS == 'ios' &&

          <InputAccessoryViewCommon
            inputAccessoryViewID={inputAccessoryViewID}
          />

        }
        <TextInput
          style={styles.textInputFeatureDescriptionStyle}
          multiline={true}
          textAlignVertical="top"
          inputAccessoryViewID={inputAccessoryViewID}
          onChangeText={text => {
            notesRef.current.value = text
          }}
          ref={notesRef}
        />
        {/* <InputAccessoryViewCommon
            inputAccessoryViewID={inputAccessoryViewID}
          /> */}
        <CommonBottomButton
          onPressButton={onPressSubmit}
          manualButtonStyle={styles.btnSubmitStyle}
          buttonTitle={'Submit'}
        />
      </View>

      <Loader isLoading={isShownLoader} />

      <ActionSheet
        ref={actionSheet}
        // title={'Confirm action'}
        options={['Camera', 'Gallery', 'Cancel']}
        cancelButtonIndex={2}
        onPress={index => {
          // openGallery
          onActionDone(index)
        }}
      />
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
    paddingHorizontal: 20,
    width: '100%',
  },
  textAddNotesStyle: {
    color: Colors.colorDarkGray,
    marginTop: 5,
    alignSelf: 'center',
  },
  textInputFeatureDescriptionStyle: {
    height: 155,
    width: '100%',
    backgroundColor: Colors.colorLightGray,
    paddingHorizontal: 20,
    paddingTop: 15,
    borderRadius: 7,
    marginTop: 22,
    ...FontStyles.fontMontserrat_Medium15,
    color: 'black'
  },
  btnSubmitStyle: {
    marginTop: 34,
    marginBottom: 28,
    width: '70%',
    alignSelf: 'center',
  },
  viewCameraAndImagesStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  btnCameraStyle: {
    height: 40,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.colorDarkBlue,
    borderRadius: 4,
    marginRight: 5,
  },
  imgCameraStyle: {
    height: 22,
    width: 25,
  },
  imgGalleryStyle: {
    height: 45,
    width: 55,
    marginLeft: 5,
  },
  btnCancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    alignSelf: 'flex-end',
    marginTop: -12,
    marginRight: -25,
  },
  imgCrossStyle: {
    height: 18,
    width: 18,
    tintColor: Colors.colorDarkBlue,
  },
  imgCrossForGalleryStyle: {
    height: 8,
    width: 8,
    tintColor: Colors.colorDarkBlue,
  },
})
export default ModalAddContactNote
