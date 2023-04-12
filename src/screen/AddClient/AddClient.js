import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { Colors } from '../../common/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonBottomButton from '../../Components/CommonBottomButton'
import CommonTextAndInput1 from '../../Components/CommonTextAndInput1'
import { FontStyles } from '../../common/FontStyle'
import { create_clients_url, view_clients_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { useIsFocused } from '@react-navigation/native'
import { Shadow } from '../../common/Shadow'
import SelectDropdown from 'react-native-select-dropdown'
import ModalClientContacts from '../../Modal/ModalClientContacts'

const AddClient = ({ navigation }) => {
  const [isShownLoader, setShownLoader] = useState(false)
  const useFocused = useIsFocused()
  const [strOrganisationAddress, setOrganisationAddress] =
    useState('Select Address')
  const [organizationType, setOrganizationType] = useState('')

  const [latLongDict, setLatLongDict] = useState({})
  const [isModelPresented, setIsModelPresented] = useState(false)
  const [userList, setUserList] = useState([])

  const [userDictInfo, setUserDictInfo] = useState({
    organizationName: '',
    emailAddress: '',
    contactNumber: '',
  })

  const arrTypes = [
    'Hospital',
    'Pharmaceutical',
    'Manufacturing',
    'Food Processing houses',
    'Hospitality',
    'Others',
  ]
  useEffect(() => {
    console.log(global.isComingFromMapScreen)
    if (useFocused && global.isComingFromMapScreen !== true) {
      setUserDictInfo(prevState => ({
        ...prevState,
        organizationName: '',
        emailAddress: '',
        contactNumber: '',
      }))
      setOrganizationType('')
    }
  }, [useFocused])

  const onPressSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    const { organizationName, emailAddress, contactNumber } = {
      ...userDictInfo,
    }

    if (organizationType == '') {
      alert('Please select the Organization type')
      return
    }

    if (!organizationName) {
      alert('Please select the Organization name')
      return
    }
    if (!emailAddress) {
      alert('Please enter your email ')
      return
    }
    if (reg.test(emailAddress) === false) {
      alert('Please enter valid email-address ')
      return
    }

    if (!contactNumber) {
      alert('Please enter contact number ')
      return
    }
    if (contactNumber.length < 10) {
      alert('Please enter correct contact number ')
      return
    }

    if (strOrganisationAddress == 'Select Address') {
      alert('Please enter Organization address ')
      return
    }

    apiAddClient()
  }

  const orgTypeKey = orgType => {
    switch (orgType) {
      case 'Hospital':
        return 1
      case 'Pharmaceutical':
        return 2
      case 'Manufacturing':
        return 3
      case 'Food Processing houses':
        return 4
      case 'Hospitality':
        return 5
      case 'Others':
        return 6
      default:
        console.log('No org found')
        break
    }
  }

  const apiAddClient = async () => {
    setShownLoader(true)
    let formData = new FormData()
    formData.append('org_name', userDictInfo.organizationName)
    formData.append('address', strOrganisationAddress)
    formData.append('lat', latLongDict.lat ? latLongDict.lat : 0.0)
    formData.append('long', latLongDict.long ? latLongDict.long : 0.0)
    formData.append('contact_no', userDictInfo.contactNumber)
    formData.append('email', userDictInfo.emailAddress)
    formData.append('type', orgTypeKey(organizationType))
    formData.append('contact_details', JSON.stringify(userList))

    const response = await postWithParam(create_clients_url, formData)

    if (response.status == true) {
      apiViewClient()
      setShownLoader(false)

      Alert.alert('', 'Client added successfully', [
        {
          text: 'OK',
          onPress: () => {
            setUserDictInfo(prevState => ({
              ...prevState,
              organizationName: '',
              emailAddress: '',
              contactNumber: '',
            }))
            setOrganizationType('')
            setOrganisationAddress('Select Address')
            setUserList([])
            navigation.navigate('ViewClient')
          },
        },
      ])
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const apiViewClient = async () => {
    setShownLoader(true)
    const response = await postWithParam(view_clients_url)
    if (response.status == true) {
      setShownLoader(false)
      global.viewClientData = response.data.clients_detail
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const onSelectLocation = (item, latLong) => {
    console.log(
      '--------------global.isNavigatedToMapGlobal',
      global.isNavigatedToMapGlobal,
    )

    setLatLongDict(latLong)
    console.log('onSelectLocation----latLong--', latLong)
    setOrganisationAddress(item)
    console.log('strOrganisationAddress{}{}{}{}{}', strOrganisationAddress)
  }

  const onPressAddress = () => {
    global.isComingFromMapScreen = true
    console.log(
      '--------------global.isNavigatedToMapGlobal',
      global.isNavigatedToMapGlobal,
    )
    navigation.navigate('MapScreen', {
      onSelect: onSelectLocation,
    })
  }

  const onPressDeleteContact = index => {
    Alert.alert('', 'Are you sure you want to remove this contact?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          const contacts = [...userList]
          contacts.splice(index, 1)
          setUserList(contacts)
        },
      },
    ])
  }

  const onPressSubmitUser = userDict => {
    setIsModelPresented(!isModelPresented)

    const data = [...userList]
    data.push(userDict)
    setUserList(data)
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
        {Platform.OS === 'ios' ? (
          <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
        ) : (
          <StatusBar backgroundColor={Colors.colorBackgroundGray} />
        )}
        <CommonNavigationHeader navigationTitle={'Add Client'} />

        <Modal
          animationType="slide"
          transparent={true}
          fullScreen={false}
          visible={isModelPresented}>
          <ModalClientContacts
            onPressNotes={() => {
              setIsModelPresented(!isModelPresented)
            }}
            onSubmit={userData => onPressSubmitUser(userData)}
          />
        </Modal>
        <View style={styles.ViewContainer}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled">
            <View style={{ marginBottom: 91, padding: 4 }}>
              <View style={styles.TextInputView}>
                <Text style={styles.textType}>Organization Type</Text>
                <SelectDropdown
                  buttonStyle={styles.btnDropdown}
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        style={styles.imgDropdownArrow}
                        source={require('../../assets/arrowDownBlue.png')}
                      />
                    )
                  }}
                  buttonTextStyle={{
                    color:
                      organizationType != ''
                        ? Colors.black
                        : Colors.colorLightGray,

                    textAlign: 'left',
                    // color: Colors.navigationTitle,
                    ...FontStyles.fontMontserrat_Regular13,
                  }}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  dropdownStyle={{ width: '80%', borderRadius: 10 }}
                  data={arrTypes}
                  onSelect={(selectedItem, index) => {
                    setOrganizationType(arrTypes[index])
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  defaultButtonText="Choose Type"
                />
                <CommonTextAndInput1
                  textInputCommonStyle={styles.TextInput}
                  textCommonStyle={styles.TextInputTitle}
                  manualViewStyle={styles.TextInputStyle}
                  commonText="Organization Name"
                  value={userDictInfo.organizationName}
                  onChangeText={text => {
                    setUserDictInfo(prevState => ({
                      ...prevState,
                      organizationName: text,
                    }))
                  }}
                  placeholder="Organization Name"
                  autoCapitalizeProp={'sentences'}
                />

                <CommonTextAndInput1
                  textInputCommonStyle={styles.TextInput}
                  textCommonStyle={styles.TextInputTitle}
                  manualViewStyle={styles.TextInputStyle}
                  commonText="Email Address"
                  onChangeText={text => {
                    setUserDictInfo(prevState => ({
                      ...prevState,
                      emailAddress: text,
                    }))
                  }}
                  value={userDictInfo.emailAddress}
                  keyboardType={'email-address'}
                  placeholder="Email Address"
                />

                <CommonTextAndInput1
                  textInputCommonStyle={styles.TextInput}
                  textCommonStyle={styles.TextInputTitle}
                  manualViewStyle={styles.TextInputStyle}
                  commonText="Contact No."
                  value={userDictInfo.contactNumber}
                  onChangeText={text => {
                    setUserDictInfo(prevState => ({
                      ...prevState,
                      contactNumber: text,
                    }))
                  }}
                  returnKeyType="done"
                  maxLength={10}
                  keyboardType={'number-pad'}
                  placeholder="Contact No."
                />

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onPressAddress()}>
                  <Text style={styles.textOrgAddStyle}>
                    Organisation Address
                  </Text>
                  <Text
                    style={{
                      color:
                        strOrganisationAddress == 'Select Address'
                          ? Colors.colorLightGray
                          : Colors.black,

                      ...FontStyles.fontMontserrat_Regular13,
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: Colors.navigationTitle,
                      paddingHorizontal: 15,
                      paddingTop: 10,
                      backgroundColor: 'white',
                      height: 38,
                      marginBottom: 15,
                    }}
                    numberOfLines={1}>
                    {strOrganisationAddress}
                  </Text>
                </TouchableOpacity>
                <FlatList
                  // style={styles.listClientStyle}
                  showsVerticalScrollIndicator={false}
                  data={userList}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ padding: 4 }}>
                        <View style={styles.viewCellInternal}>
                          <View>
                            <Text style={styles.textClientNameStyle}>
                              {`${item.first_name} ${item.last_name}`}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={styles.textClientAddressStyle}>
                              {item.detail_email}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => onPressDeleteContact(index)}
                            style={styles.btnTrash}>
                            <Image
                              style={styles.imgTrash}
                              source={require('../../assets/trash.png')}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.viewSeprator} />
                      </View>
                    )
                  }}
                />
                <TouchableOpacity
                  onPress={() => setIsModelPresented(!isModelPresented)}
                  style={styles.btnAddContacts}>
                  <Text style={styles.textAdd}>{'Add Contact '}</Text>
                  <Image
                    style={styles.imgAddBtn}
                    source={require('../../assets/plus_Icon.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <CommonBottomButton
            onPressButton={onPressSubmit}
            manualButtonStyle={{ marginBottom: 28 }}
            buttonTitle="Submit"
          />
        </View>
        <Loader isLoading={isShownLoader} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  ViewContainer: {
    flex: 1,
    backgroundColor: Colors.colorBackgroundGray,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  ButtonImageView: {
    height: 20,
    width: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.colorDarkBlue,
    marginRight: 10,
  },
  ImageStyle: {
    height: 8,
    width: 10,
  },
  SelectImageView: {
    flexDirection: 'row',
    marginLeft: 14,
    alignItems: 'center',
  },
  TextInputStyle: {
    marginTop: 23,
  },
  TextInputView: {
    width: '100%',
    backgroundColor: Colors.colorLightPurple,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    ...Shadow,
  },
  TextInputTitle: {
    // ...FontStyles.fontMontserrat_Regular14,
  },
  TextInput: {
    backgroundColor: 'white',
    // ...FontStyles.fontMontserrat_Regular12,
  },
  textAlignE: {
    alignSelf: 'center',
    ...FontStyles.fontMontserrat_Normal14,
  },
  textOrgAddStyle: {
    ...FontStyles.fontMontserrat_Regular15,
    marginBottom: 8,
    color: Colors.navigationTitle,
    marginTop: 20,
  },
  textInputOrgAddStyle: {
    ...FontStyles.fontMontserrat_Regular13,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: 'white',
    height: 38,
    marginBottom: 15,
  },
  imgDropdownArrow: {
    height: 8,
    width: 20,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  btnDropdown: {
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    width: '100%',
    backgroundColor: 'white',
    height: 38,
    borderRadius: 5,
    textAlign: 'left',
  },
  textDropdown: {
    textAlign: 'left',
    // color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_Regular13,
  },
  dropdownRowTextStyle: {
    padding: 10,
    textAlign: 'left',
  },
  imgAddBtn: {
    height: 16,
    width: 16,
  },
  imgTrash: {
    marginTop: 2,
    height: 20,
    width: 20,
    resizeMode: 'contain',
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
  textType: {
    ...FontStyles.fontMontserrat_Regular15,
    marginBottom: 8,
    color: Colors.navigationTitle,
    marginTop: 20,
  },
  //List Element styles
  viewClientListElementStyle: {
    height: 100,
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
  textDateStyle: {
    marginTop: 15,
    alignSelf: 'flex-end',
    color: Colors.colorClientAddressText,
    ...FontStyles.fontMontserrat_Regular12,
  },
  viewSeprator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 5,
  },
  viewCellInternal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnTrash: {
    height: 30,
    width: 30,
    alignItems: 'flex-end',
    marginTop: 5,
  },
})

export default AddClient
