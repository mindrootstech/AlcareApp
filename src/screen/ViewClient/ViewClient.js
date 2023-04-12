import React, { useState, useEffect } from 'react'
import {
  View,
  Modal,
  Image,
  Linking,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native'
import ModalAddNotes from '../../Modal/ModalAddNotes'
import ModalExpanceAndNotes from '../../Modal/ModalExpanceAndNotes'
import { Colors } from '../../common/Colors'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { view_clients_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { useIsFocused } from '@react-navigation/native'
import { FontStyles } from '../../common/FontStyle'
import { Shadow } from '../../common/Shadow'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

// import {} from 'react-native'

const ViewClientListElement = props => {
  const { item, index, navigation, onPressCell } = props

  const [isModelPresented, setIsModelPresented] = useState(false)

  const openEmailOrPhone = (emailOrPhone, isEmail) => {
    // if (item.is_approved == 1) {
    isEmail
      ? Linking.openURL(`mailto:${emailOrPhone}`)
      : Linking.openURL(`tel:${emailOrPhone}`)
    // } else {
    //   alert('Admin approval is still pending.')
    // }
  }

  const openNotes = phone => {
    setIsModelPresented(!isModelPresented)
    // if (item.is_approved == 1) {
    //   setIsModelPresented(!isModelPresented)
    // } else {
    //   alert('Admin approval is still pending.')
    // }
  }

  return (
    <TouchableOpacity onPress={onPressCell} activeOpacity={1}>
      <View style={{ paddingVertical: 5 }}>
        <View style={styles.viewClientListElementStyle}>
          <Modal
            animationType="slide"
            transparent={true}
            fullScreen={false}
            visible={isModelPresented}>
            <ModalAddNotes
              onPressNotes={() => {
                setIsModelPresented(!isModelPresented)
              }}
              clientId={item.id}
            />
          </Modal>
          {/* <Modal
            animationType="slide"
            transparent={true}
            fullScreen={false}
            visible={isModelPresented}>
            <ModalExpanceAndNotes
              onPressCancel={() => {
                setIsModelPresented(!isModelPresented)
              }}
              clientID={item.id}
              navigation={navigation}
              clinetDetail={item}
            />
          </Modal> */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              numberOfLines={1}
              style={[
                styles.textClientNameStyle,
                { ...FontStyles.fontMontserrat_Medium17 },
              ]}>
              {item.org_name}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.textDateStyle1,
                {
                  ...FontStyles.fontMontserrat_Regular13,
                  color:
                    item.is_approved == 1
                      ? Colors.colorClientAddressText
                      : '#FF7F7F',
                },
              ]}>
              {item.is_approved == 1 ? 'Approved' : 'Approval Pending'}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[
              styles.textClientAddressStyle,
              { ...FontStyles.fontMontserrat_Regular15 },
            ]}>
            {item.address}
          </Text>
          <View style={styles.viewTimeAndContactStyle}>
            <View style={styles.viewContactItemsStyle}>
              <TouchableOpacity
                onPress={() => openEmailOrPhone(item.email, true)}>
                <Image
                  style={styles.imgMsgBlueStyle}
                  source={require('../../assets/massegeBlue.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openEmailOrPhone(item.contact_no, false)}>
                <Image
                  style={[styles.imgMsgBlueStyle, { marginLeft: 15 }]}
                  source={require('../../assets/callBlue.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openNotes()}>
                <Image
                  style={[styles.imgMsgBlueStyle, { marginLeft: 15 }]}
                  source={require('../../assets/notesBlue.png')}
                />
              </TouchableOpacity>
            </View>
            {item.is_approved == 1 && (
              <View style={styles.viewContactItemsStyle}>
                <Text
                  style={[
                    styles.textLastVisitStyle,
                    { ...FontStyles.fontMontserrat_Medium13 },
                  ]}>
                  Last Visit
                </Text>
                <Text
                  style={[
                    styles.textDateStyle,
                    { ...FontStyles.fontMontserrat_Regular13 },
                  ]}>
                  : {item.last_visit}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const ViewClient = ({ navigation }) => {
  // const {  } = props;
  const useFocused = useIsFocused()
  const [clientDetailArray, setCientDetailArray] = useState()
  const [clientDetailArrayForSearch, setClientDetailArrayForSearch] = useState()
  const [isShownLoader, setShownLoader] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  useEffect(() => {
    console.log('sdfsd')
    if (global.viewClientData == undefined) {
      apiViewClient()
    } else {
      setCientDetailArray(global.viewClientData)
      setClientDetailArrayForSearch(global.viewClientData)
    }
  }, [useFocused])

  const apiViewClient = async (refreshLoad = false) => {
    if (refreshLoad == true) {
      setShownLoader(false)
    } else {
      setShownLoader(true)
    }

    const response = await postWithParam(view_clients_url)

    console.log('response1:::::::::::', response)

    if (response.status == true) {
      setShownLoader(false)
      global.viewClientData = response.data.clients_detail
      setCientDetailArray(response.data.clients_detail)
      setClientDetailArrayForSearch(response.data.clients_detail)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const onPressViewClientCell = item => {
    navigation.navigate('ClientDetail', { clientDetail: item })
    // if (item.is_approved == 1) {
    //   navigation.navigate('ClientDetail', { clientDetail: item })
    // } else {
    //   alert('Admin approval is still pending.')
    // }
  }

  const onChangeSearchText = text => {
    setClientDetailArrayForSearch(
      clientDetailArray.filter(item => {
        return item.org_name.toLowerCase().includes(text.toLowerCase())
      }),
    )
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    apiViewClient(true)
    // wait(2000).then(() => setRefreshing(false))
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
      <CommonNavigationHeader
        navigationTitle={'View Clients'}
        showRightButton={true}
        showPlusIcon={true}
        onPressRightButton={() => navigation.navigate('AddClient')}
      />

      <View style={styles.viewParentStyle}>
        <View style={styles.viewSearchBarStyle}>
          <View style={styles.viewSearchBarInnerStyle}>
            <TextInput
              placeholder="Search"
              placeholderTextColor={Colors.borderColor}
              style={[
                styles.textInputSearchStyle,
                { ...FontStyles.fontMontserrat_semibold15, color: 'black' },
              ]}
              onChangeText={text => onChangeSearchText(text)}
            />
            <Image
              style={styles.imgLenceBlueStyle}
              source={require('../../assets/lenceBlue.png')}
            />
          </View>
        </View>

        {clientDetailArrayForSearch != undefined &&
          clientDetailArrayForSearch.length == 0 && (
            <View style={styles.viewStyleNoData}>
              <Image
                style={styles.imageNoData}
                source={require('../../assets/noClient.png')}
              />
              <Text
                style={{
                  color: Colors.colorDarkBlue,
                  ...FontStyles.fontMontserrat_Regular12,
                }}>
                No Client Found
              </Text>
            </View>
          )}
        <FlatList
          style={styles.listClientStyle}
          showsVerticalScrollIndicator={false}
          data={clientDetailArrayForSearch}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => {
            console.log('item iD:::::::', item.id)
            return (
              <ViewClientListElement
                navigation={navigation}
                item={item}
                index={index}
                onPressCell={() => onPressViewClientCell(item)}
              />
            )
          }}
        />
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>

    // </TouchableWithoutFeedback>
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
    ...Shadow,
  },
  textInputSearchStyle: {
    width: '90%',
    fontWeight: '400',
    fontSize: 14,
    textDecorationLine: 'none',
  },
  imgLenceBlueStyle: {
    width: 18,
    height: 18,
    marginRight: 1,
  },
  listClientStyle: {
    width: '100%',
    marginTop: 20,
    // backgroundColor: 'red',
  },
  //List Element styles
  viewClientListElementStyle: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: 'white', //Colors.colorClientListElement,
    marginBottom: 5,
    marginTop: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Shadow,
  },
  textClientNameStyle: {
    fontWeight: '500',
    color: Colors.colorDarkGray,
    marginBottom: 5,
    width: 180,
  },
  textClientAddressStyle: {
    fontWeight: '400',
    fontSize: 14,
    color: Colors.colorClientAddressText,
  },
  viewTimeAndContactStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    // marginBottom: 20,
    // backgroundColor:"red"
  },
  viewContactItemsStyle: {
    flexDirection: 'row',
  },
  imgMsgBlueStyle: {
    width: 28,
    height: 28,
  },
  textLastVisitStyle: {
    fontWeight: '500',
    fontSize: 14,
    color: Colors.colorClientAddressText,
  },
  textDateStyle: {
    fontWeight: '400',
    fontSize: 14,
    color: Colors.colorClientAddressText,
  },
  viewStyleNoData: {
    width: '100%',
    marginTop: 100,
    alignItems: 'center',
  },
  imageNoData: {
    height: 200,
    width: 250,
    marginBottom: 15,
    resizeMode: 'stretch',
  },
  textDateStyle1: {
    fontWeight: '400',
    fontSize: 14,
    color: Colors.colorClientAddressText,
  },
})

export default ViewClient
