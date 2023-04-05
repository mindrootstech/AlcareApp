import { StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../../common/Colors'
import { FontStyles } from '../../common/FontStyle'
import { Shadow } from '../../common/Shadow'

const { height } = Dimensions.get('window')
const imageSize = height * 0.14
const photoIconSize = imageSize * 0.27

const ProfileStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.colorBackgroundGray,
    },
    textHeader: {
      textAlign: 'center',
      color: Colors.navigationTitle,
      
    },
    textName: {
      marginTop: 14,
      textAlign: 'center',
      color: Colors.navigationTitle,
    },
    buttonStyle: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      bottom: -5,
      height: 60,
      width: 60,
      marginTop: -60,
    },
    viewEditIcon: {
      backgroundColor: Colors.colorDarkBlue,
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 74,
      height: 74,
      borderRadius: 37,
    },
    editImage: {
      width: 78,
      height: 78,
      borderRadius: 39,
    },
    cameraIcon: {
      width: 8,
      height: 8,
      tintColor: 'white',
    },
    cellStyle: {
      backgroundColor: 'white',
      height: 64,
      marginHorizontal: 20,
      marginTop: 54,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      ...Shadow,
    },
    cellIcon: {
      height: 20,
      width: 20,
      marginHorizontal: 10,
      resizeMode:'contain'
    },
    textCell: {
      textAlign: 'center',
      color: Colors.navigationTitle,
    },
    cellArrowIcon: {
      height: 10,
      width: 5,
      marginHorizontal: 10,
      right: 10,
      position: 'absolute',
    },
    cellIcon1:{
      height: 20,
      width: 20,
      marginHorizontal: 10,
      tintColor:'#006D9B',
      // tintColor:'white'
    }
  })

export default ProfileStyle
