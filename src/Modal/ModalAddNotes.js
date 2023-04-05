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
  Linking
} from 'react-native'
import CommonBottomButton from '../Components/CommonBottomButton'
import ActionSheet from 'react-native-actionsheet'
import { Colors } from '../common/Colors'
import ImagePicker from 'react-native-image-crop-picker'
import ModalGalleryImage from './ModalGalleryImage'
import { create_note_url } from '../network/Urls'
import { postWithParam } from '../network'
import Loader from '../network/Loader'
import { FontStyles } from '../common/FontStyle'
import Geolocation from '@react-native-community/geolocation'
import InputAccessoryViewCommon from "../Components/InputAccessoryViewCommon";
import { ISO_8601 } from 'moment'
import Images from '../common/Images'

const ModalAddNotes = props => {
  const { onPressNotes, clientId } = props
  const actionSheet = useRef(null)
  const [arrImageProfile, setArrImageProfile] = useState([])
  const notesRef = useRef('')
  const [isShownLoader, setShownLoader] = useState(false)
  const inputAccessoryViewID = "uniqueID";
  const ImageListComponent = props => {
    const { item, index } = props
    const [isModelPresented, setIsModelPresented] = useState(false)

    return (

      <View style={{height:60,width:70,alignItems:'center',padding:8}}>
      <TouchableOpacity onPress={() => setIsModelPresented(!isModelPresented)}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModelPresented}>
            
            <ModalGalleryImage
            image={item.path}
            onPressImage={() => {
              setIsModelPresented(!isModelPresented)
            }}
          />

        </Modal>
        <ImageBackground
          source={{ uri: item.path }}
          style={styles.imgGalleryStyle}>
                 </ImageBackground>
                </TouchableOpacity>
               
          <TouchableOpacity
            onPress={() => onPressCancel(index)}
            style={[
              styles.btnCancelStyleCross,
              { height: 14, width: 14, marginTop:-50, marginRight: -8 ,borderRadius:9},
            ]}>
            <Image
              source={Images.crossBlack}
              style={styles.imgCrossForGalleryStyle}
            />
          </TouchableOpacity>
          </View>





      // <TouchableOpacity onPress={() => setIsModelPresented(!isModelPresented)}>
      //   <Modal
      //     animationType="slide"
      //     transparent={true}
      //     visible={isModelPresented}>
      //     <ModalGalleryImage
      //       image={item.path}
      //       onPressImage={() => {
      //         setIsModelPresented(!isModelPresented)
      //       }}
      //     />
      //   </Modal>
      //   <ImageBackground
      //     source={{ uri: item.path }}
      //     style={styles.imgGalleryStyle}>
      //     <TouchableOpacity
      //       onPress={() => onPressCancel(index)}
      //       style={[
      //         styles.btnCancelStyle,
      //         { height: 16, width: 16, marginTop: -5, marginRight: -5 },
      //       ]}>
      //       <Image
      //         source={require('../assets/crossBlack.png')}
      //         style={styles.imgCrossForGalleryStyle}
      //       />
      //     </TouchableOpacity>
      //   </ImageBackground>
      // </TouchableOpacity>
    )
  }

  const onPressCancel = index => {
    // let dict = [...arrImageProfile]
    // dict = arrImageProfile.splice(index, 1)
    // setArrImageProfile(dict)
    arrImageProfile.splice(index, 1)

    setArrImageProfile([...arrImageProfile])
  }

  const showActionSheet = index => {
    actionSheet.current.show()
  }

  const onActionDone = index => {
    if (index == 0) {
      console.log('camera selected')
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setArrImageProfile(prevArr => [...prevArr, image])
      })
    } else if (index == 1) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setArrImageProfile(prevArr => [...prevArr, image])
      })
    }
    console.log('Done')
  }

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position----', position)
        apiAddNotes(position.coords.latitude, position.coords.longitude)
      },
      error => {
        apiAddNotes('', '')
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
    )
  }

  const onPressSubmit = () => {
    if (notesRef.current.value == '' || notesRef.current.value == undefined) {
      alert('Please fill note')
    } else {
    getOneTimeLocation()
     //apiAddNotes()
    }
  }

  const apiAddNotes = async (lat, long) => {
    setShownLoader(true)
    let formdata = new FormData()

    arrImageProfile.forEach(function (image) {
      formdata.append('image[]', {
        name: image.filename ? image.filename : 'profileImage',
        type: image.mime,
        uri:
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path,
      })
    })
    formdata.append('note', notesRef.current.value)
    formdata.append('client_id', clientId)
    formdata.append('lat', lat?lat:"")
    formdata.append('long', long?long:"")

    console.log("formdata==", formdata);

    const response = await postWithParam(create_note_url, formdata)

    if (response.status == true) {
      setShownLoader(false)
      console.log('success')
      onPressNotes()
      Alert.alert('','Note created successfully')
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


        {Platform.OS == 'ios'   && 

  <InputAccessoryViewCommon
            inputAccessoryViewID={inputAccessoryViewID}
          /> 
        
           }
           
          
        <TextInput
          style={styles.textInputFeatureDescriptionStyle}
          multiline={true}
          inputAccessoryViewID={inputAccessoryViewID}
          textAlignVertical="top"
          onChangeText={text => {
            notesRef.current.value = text
          }}
          ref={notesRef}
        />
        {/* <InputAccessoryViewCommon
            inputAccessoryViewID={inputAccessoryViewID}
          /> */}

        <View style={styles.viewCameraAndImagesStyle}>
          <TouchableOpacity
            onPress={showActionSheet}
            style={[styles.btnCameraStyle]}>
            <Image
              style={styles.imgCameraStyle}
              source={require('../assets/camera.png')}
            />
          </TouchableOpacity>

          <FlatList
            horizontal
            // style={{ backgroundColor:'blue'}}
            showsHorizontalScrollIndicator={false}
            data={arrImageProfile}
            renderItem={({ item, index }) => {
              console.log(item)
              return <ImageListComponent item={item} index={index} />
            }}
          />
        </View>

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
    resizeMode:'contain'
  },
  imgGalleryStyle: {
    height: 47,
    width: 56,
    // marginLeft: 1,
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
  btnCancelStyleCross: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardColor,
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
export default ModalAddNotes
