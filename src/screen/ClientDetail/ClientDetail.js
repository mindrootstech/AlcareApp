import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import InfoListCell from './ListComponents/InfoListCell'
import AreaListCell from './ListComponents/AreaListCell'
import NotesListCell from './ListComponents/NotesListCell'
import ClientContactsCell from './ListComponents/ClientContactsCell'
import { Colors } from '../../common/Colors'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { client_info_url, saveContact_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { FontStyles } from '../../common/FontStyle'
import CommonBottomButton from '../../Components/CommonBottomButton'
import ModalAddNotes from '../../Modal/ModalAddNotes'
import { useIsFocused } from '@react-navigation/native'
import { Shadow } from '../../common/Shadow'
import ModalClientContacts from '../../Modal/ModalClientContacts'

const ClientDetail = ({ route, navigation }) => {
  const clientDetail = route.params.clientDetail
  const isComingFromAreaScreen = route.params.isComingFromAreaScreen
  const [isNavigationWithoutTap, setIsNavigationWithoutTap] = useState(true)

  console.log('fdfgd=====gfdgdfgdfgdfgd====', isComingFromAreaScreen)
  const useFocused = useIsFocused()
  const arrTopBar = ['Info', 'Area', 'Notes', 'Contact']
  const [arrTappedTopBarItem, setArrTappedTopBarItem] = useState([])
  const [selectedTopBarItem, setSelectedTopBarItem] = useState(arrTopBar[0])
  let [apiResponce_Info_Area_Notes, setapiResponce_Info_Area_Notes] = useState(
    {},
  )

  const onPressTopBarItem = item => {
    setSelectedTopBarItem(item)
  }

  const onPressCell = item => {
    navigation.navigate('AreanDetails', { areaId: item.id })
  }

  const [clientDetailArray, setCientDetailArray] = useState([])

  const [isShownLoader, setShownLoader] = useState(false)

  const [isModelPresented, setIsModelPresented] = useState(false)

  const [isContactModelPresented, setIsContactModelPresented] = useState(false)

  const onPressSubmitUser = userDict => {
    setIsContactModelPresented(!isContactModelPresented)

    // console.log('--------userDict', userDict)

    apiAddContact(userDict)
    // apiClientInfo()
    // setUserList(data)
  }

  useEffect(() => {
    // if (arrTappedTopBarItem.includes(selectedTopBarItem)) {
    //   console.log('=========already exist')
    // } else {
    //   apiClientInfo()
    //   arrTappedTopBarItem.push(selectedTopBarItem)
    //   arrTapped = [...arrTappedTopBarItem]
    //   setArrTappedTopBarItem(arrTapped)
    //   console.log('=============added')
    // }
    if (
      isComingFromAreaScreen != undefined &&
      isComingFromAreaScreen == true &&
      isNavigationWithoutTap
    ) {
      setSelectedTopBarItem(arrTopBar[1])
      setIsNavigationWithoutTap(false)
    }
    apiClientInfo()
    //
  }, [selectedTopBarItem, useFocused])

  const addArea = () => {
    navigation.navigate('AddArea', {
      isFromNavigation: true,
      clientData: clientDetail,
    })
  }

  const onClickPlusBtn = () => {
    console.log('test')

    if (selectedTopBarItem == 'Area') {
      addArea()
    } else if (selectedTopBarItem == 'Notes') {
      setIsModelPresented(!isModelPresented)
    } else if (selectedTopBarItem == 'Contact') {
      setIsContactModelPresented(!isContactModelPresented)
    }
  }

  const goBackAction = () => {
    if (isComingFromAreaScreen != undefined && isComingFromAreaScreen == true) {
      navigation.pop(2)
    } else {
      navigation.goBack()
    }
  }

  const apiAddContact = async userDetail => {
    console.log('userDetail', userDetail)
    setShownLoader(true)
    // {"designation": "SDFDSFSF", "detail_contact": "2321213211",
    //  "detail_email": "fsf@GMAIL.COM", "first_name": "Fdsf", "last_name": "sdf"}
    let formdata = new FormData()
    formdata.append('client_id', clientDetail.id)
    formdata.append('name', userDetail.first_name)
    formdata.append('last_name', userDetail.last_name)
    formdata.append('email', userDetail.detail_email)
    formdata.append('designation', userDetail.designation)
    formdata.append('contact_no', userDetail.detail_contact)
    const response = await postWithParam(saveContact_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      apiClientInfo()
    } else {
      setShownLoader(false)
      
      Alert.alert('', response.message)
    }
  }

  const apiClientInfo = async () => {
    setShownLoader(true)
    console.log(
      'selectedTopBarItem.toLowerCase()',
      selectedTopBarItem.toLowerCase(),
    )
    let formdata = new FormData()
    formdata.append('client_id', clientDetail.id)
    formdata.append('type', selectedTopBarItem.toLowerCase())
    const response = await postWithParam(client_info_url, formdata)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      setapiResponce_Info_Area_Notes(response.data)
      console.log(
        'success========apiResponce_Info_Area_Notes======',
        apiResponce_Info_Area_Notes,
      )
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
      <CommonNavigationHeader
        navigationTitle={clientDetail.org_name}
        showBackButton={true}
        showPlusIcon={selectedTopBarItem == 'Info' ? false : true}
        showRightButton={selectedTopBarItem == 'Info' ? false : true}
        onPressButton={() => goBackAction()}
        onPressRightButton={() => onClickPlusBtn()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        fullScreen={false}
        visible={isContactModelPresented}>
        <ModalClientContacts
          onPressNotes={() => {
            setIsContactModelPresented(!isContactModelPresented)
          }}
          onSubmit={userData => onPressSubmitUser(userData)}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModelPresented}>
        <ModalAddNotes
          onPressNotes={() => {
            setIsModelPresented(!isModelPresented)
            apiClientInfo()
          }}
          clientId={clientDetail.id}
        />
      </Modal>

      <View style={styles.viewStyle}>
        <View style={styles.viewInfoAreaNotesStyle}>
          {arrTopBar.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPressTopBarItem(item)}
                style={[
                  styles.btnInfoStyle,
                  {
                    backgroundColor:
                      item == selectedTopBarItem ? 'white' : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.textInfoAreaNotesStyle,
                    { ...FontStyles.fontMontserrat_Regular13 },
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {selectedTopBarItem == 'Info' &&
          apiResponce_Info_Area_Notes.client_info != undefined &&
          apiResponce_Info_Area_Notes.client_info.length == 0 && (
            <View style={styles.viewStyleNoData}>
              <Image
                style={styles.imageNoData}
                source={require('../../assets/noInfo.png')}
              />
              <Text
                style={{
                  color: Colors.colorDarkBlue,
                  ...FontStyles.fontMontserrat_Regular13,
                }}>
                No Info Found
              </Text>
            </View>
          )}
        {selectedTopBarItem == 'Area' &&
          apiResponce_Info_Area_Notes.area != undefined &&
          apiResponce_Info_Area_Notes.area.length == 0 && (
            <View style={styles.viewStyleNoData}>
              <Image
                style={styles.imageNoData}
                source={require('../../assets/noArea.png')}
              />
              <Text
                style={{
                  color: Colors.colorDarkBlue,
                  ...FontStyles.fontMontserrat_Regular13,
                }}>
                No Areas Found
              </Text>
            </View>
          )}
        {selectedTopBarItem == 'Area' &&
          apiResponce_Info_Area_Notes.area != undefined &&
          apiResponce_Info_Area_Notes.area.length == 0 && (
            <CommonBottomButton
              onPressButton={() => addArea()}
              manualButtonStyle={styles.btnAddNoteStyle}
              buttonTitle={'Add Area'}
            />
          )}

        {selectedTopBarItem == 'Notes' &&
          apiResponce_Info_Area_Notes.note != undefined &&
          apiResponce_Info_Area_Notes.note.length == 0 && (
            <View style={styles.viewStyleNoData}>
              <Image
                style={styles.imageNoNotesData}
                source={require('../../assets/noNotes.png')}
              />
              <Text
                style={{
                  color: Colors.colorDarkBlue,
                  ...FontStyles.fontMontserrat_Regular13,
                }}>
                No Notes Found
              </Text>
            </View>
          )}
        {selectedTopBarItem == 'Notes' &&
          apiResponce_Info_Area_Notes.note != undefined &&
          apiResponce_Info_Area_Notes.note.length == 0 && (
            <CommonBottomButton
              onPressButton={() => {
                setIsModelPresented(!isModelPresented)
              }}
              manualButtonStyle={styles.btnAddNoteStyle}
              buttonTitle={'Add Notes'}
            />
          )}

        {selectedTopBarItem == 'Contact' &&
          apiResponce_Info_Area_Notes.client_contact != undefined &&
          apiResponce_Info_Area_Notes.client_contact.length == 0 && (
            <View style={styles.viewStyleNoData}>
              <Image
                style={styles.imageNoNotesData}
                source={require('../../assets/noContact.png')}
              />
              <Text
                style={{
                  color: Colors.colorDarkBlue,
                  ...FontStyles.fontMontserrat_Regular13,
                }}>
                No Contact Found
              </Text>
            </View>
          )}
        {selectedTopBarItem == 'Contact' &&
          apiResponce_Info_Area_Notes.client_contact != undefined &&
          apiResponce_Info_Area_Notes.client_contact.length == 0 && (
            <CommonBottomButton
              onPressButton={() => {
                setIsContactModelPresented(!isContactModelPresented)
              }}
              manualButtonStyle={styles.btnAddNoteStyle}
              buttonTitle={'Add Contact'}
            />
          )}

        {/* //info Section */}
        {selectedTopBarItem == 'Info' &&
          apiResponce_Info_Area_Notes.client_info != undefined && (
            <View>
              <InfoListCell
                infoDetail={apiResponce_Info_Area_Notes.client_info}
              />
            </View>
          )}

        {/* //Area Section */}
        {selectedTopBarItem == 'Area' &&
          apiResponce_Info_Area_Notes.area != undefined && (
            <FlatList
              style={{ marginTop: 20, }}
              showsVerticalScrollIndicator={false}
              data={apiResponce_Info_Area_Notes.area.reverse()}
              renderItem={({ item, index }) => {
                return (
                  <AreaListCell
                    item={item}
                    index={index}
                    onPress={() => {
                      onPressCell(item)
                    }}
                  />
                )
              }}
            />
          )}

        {/* //Notes Section */}
        {selectedTopBarItem == 'Notes' &&
          apiResponce_Info_Area_Notes.note != undefined && (
            <FlatList
              style={{ marginTop: 20 }}
              showsVerticalScrollIndicator={false}
              data={apiResponce_Info_Area_Notes.note.reverse()}
              renderItem={({ item, index }) => {
                return (
                  <NotesListCell
                    noteDetail={apiResponce_Info_Area_Notes.note[index]}
                  />
                )
              }}
            />
          )}

        {selectedTopBarItem == 'Contact' &&
          apiResponce_Info_Area_Notes.client_contact != undefined && (
            <FlatList
              // style={{ marginTop: 20 }}
              showsVerticalScrollIndicator={false}
              data={apiResponce_Info_Area_Notes.client_contact}
              renderItem={({ item, index }) => {
                console.log(
                  'apiResponce_Info_Area_Notes.client_contact',
                  apiResponce_Info_Area_Notes.client_contact,
                )
                return (
                  <ClientContactsCell
                    infoDetail={
                      apiResponce_Info_Area_Notes.client_contact[index]
                    }
                    clientId={clientDetail.id}
                  />
                )
              }}
            />
          )}
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    paddingHorizontal: 20,
  },
  btnBackStyle: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 26,
  },
  btnLenceStyle: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  btnInfoStyle: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 26,
  },
  viewInfoAreaNotesStyle: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 4,
    padding: 7,
    height: 34,
    borderRadius: 5,
    backgroundColor: Colors.colorLightSkyBlue,
    ...Shadow,
  },
  btnMoveStyle: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgLenceStyle: {
    height: 18,
    width: 18,
  },
  imgMoveForwardStyle: {
    alignSelf: 'center',
    height: 18,
    width: 18,
  },
  imgBackStyle: {
    alignSelf: 'center',
    height: 13,
    width: 21,
  },
  textRecentReportStyle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
  },
  textInfoAreaNotesStyle: {
    fontWeight: '400',
    color: Colors.colorDarkGray,
  },
  viewStyleNoData: {
    width: '100%',
    marginTop: 120,
    alignItems: 'center',
  },
  imageNoData: {
    height: 170,
    width: 269,
    marginBottom: 15,
    resizeMode: 'stretch',
  },
  imageNoNotesData: {
    height: 170,
    width: 194,
    marginBottom: 15,
    resizeMode: 'stretch',
  },
  btnAddNoteStyle: {
    marginTop: 20,
    width: '50%',
    alignSelf: 'center',
  },
  txtContacts: {
    color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_Bold17,
  },
  btnAddContacts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  textAdd: {
    ...FontStyles.fontMontserrat_Medium17,
    color: Colors.colorDarkBlue,
  },
  imgAddBtn: {
    height: 16,
    width: 16,
  },
})

export default ClientDetail
