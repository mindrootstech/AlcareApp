import React, { useState, useEffect, Linking } from 'react'
import {
  View,
  Modal,
  Image,
  Button,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native'
import { Colors } from '../../common/Colors'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { FontStyles } from '../../common/FontStyle'
import { notification_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import EmptyNotify from '../../emptyNotification/EmptyNotify'
import Images from '../../common/Images'
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio'
const NotificationListElement = props => {
  const { item } = props

  // {"created_at": "2022-08-27 05:36:32", "description": "unread",
  //  "title": "read", "update_at": "2022-08-27 05:36:32"}

  console.log('---------', item)

  return (
    <View style={{ padding: 5 }}>
      <View style={styles.viewClientListElementStyle}>
        <Text style={styles.textClientNameStyle} numberOfLines={2}> {item.title}</Text>
        <Text numberOfLines={2} style={styles.textClientAddressStyle}>
          {item.description}
        </Text>
        <Text style={styles.textDateStyle}>{item.created_at}</Text>
      </View>
    </View>
  )
}

const Notification = ({ navigation }) => {
  const [apiNotificationResponce, setApiNotificationResponce] = useState(getPixelSizeForLayoutSize)
  const [isShownLoader, setShownLoader] = useState(false)

  useEffect(() => {
    apiNotifications()
  }, [])

  const apiNotifications = async () => {
    setShownLoader(true)

    const response = await postWithParam(notification_url)

    console.log('response1:::::::::::', response)

    if (response.status == true) {
      setShownLoader(false)
      setApiNotificationResponce(response.notification)
      console.log('response.notification:::::::::::', response.notification)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray}}>
      <CommonNavigationHeader
        navigationTitle={'Notifications'}
        showBackButton={true}
        onPressButton={() => {
          navigation.goBack()
        }}
      />
      <View style={styles.viewParentStyle}>
        <FlatList
          style={styles.listClientStyle}
          showsVerticalScrollIndicator={false}
          data={apiNotificationResponce}
          renderItem={({ item, index }) => {
            console.log('item iD:::::::', item.id)
            return <NotificationListElement item={item} />
          }}
        />
         {
        apiNotificationResponce != undefined &&
        apiNotificationResponce.length == 0 &&(
          <View style={[styles.container,]}>
          <Image source={Images.noNotifyPic} style={styles.img}></Image>
          <Text style={styles.text}>No Notification Yet</Text>
        
              <Text style={styles.text2}>When you get notification,they’ll</Text>
              <Text style={styles.text3}> shown up here.</Text>
                     
     
         </View>
        )
      }
        <Loader isLoading={isShownLoader} />
      </View>
      

      
     
     
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  viewParentStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.colorBackgroundGray,
  },
  viewUpperSectionStyle: {
    width: '100%',
  },
  textViewClientStyle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.colorDarkGray,
    marginTop: 69,
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
    shadowColor: Colors.colorShadow,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
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
  listClientStyle: {
    width: '100%',
    marginTop: 20,
  },
  //List Element styles
  viewClientListElementStyle: {
    // height: 107,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  textClientNameStyle: {
    color: Colors.colorDarkGray,
    marginBottom: 5,
    ...FontStyles.fontMontserrat_Medium16,
  },
  textClientAddressStyle: {
    color: Colors.colorClientAddressText,
    ...FontStyles.fontMontserrat_Regular14,
  },
  viewTimeAndContactStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  viewContactItemsStyle: {
    flexDirection: 'row',
    marginTop: 15,
  },
  imgMsgBlueStyle: {
    width: 20,
    height: 20,
  },
  textLastVisitStyle: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.colorClientAddressText,
  },
  textDateStyle: {
    marginTop: 15,
    alignSelf: 'flex-end',
    color: Colors.colorClientAddressText,
    ...FontStyles.fontMontserrat_Regular12,
  },
  container:{
  flex:1,
    alignItems:'center',
    marginTop:-500
},
img:{
    width:200,
    height:200,
    resizeMode:'contain'
},
text:{
    marginTop:15,
    color: '#006D9B',
    // ...FontStyles.fontMontserrat_bold11
    fontWeight:'400'
},
text2:{
    marginTop:10,
    color:'gray',
    fontWeight:'400'
},
text3:{
    color:'gray',
    marginLeft:23,
    fontWeight:'400'
}
})

export default Notification
