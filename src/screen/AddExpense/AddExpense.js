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
  ImageBackground,
  Modal,
  Keyboard
} from 'react-native'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { Colors } from '../../common/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonBottomButton from '../../Components/CommonBottomButton'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import { FontStyles } from '../../common/FontStyle'
import { create_clients_url, saveExpense, view_clients_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { useIsFocused } from '@react-navigation/native'
import { Shadow } from '../../common/Shadow'
import SelectDropdown from 'react-native-select-dropdown'
import ModalClientContacts from '../../Modal/ModalClientContacts'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import Images from '../../common/Images'
import DocumentPicker from 'react-native-document-picker';
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker';
import ModalClients from '../../Modal/ModalClients'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import ModalGalleryImage from './ModalGalleryImage'; 
import ModalGalleryImage from '../../Modal/ModalGalleryImage'

const AddExpense = ({ navigation, route }) => {
  const isNavigation = route?.params?.isFromNavigation ? true : false
  const clientDetailData = route?.params?.clientData

  console.log("clientDetailData========", clientDetailData);

  const [showHospital, setShowHospital] = useState(false)
  const [showPharma, setShowPharma] = useState(false)
  const orgNameRef = useRef(null)
  const expanseCategoryRef = useRef('')
  const expanceAmountRef = useRef('')
  const expanseDateRef = useRef('')
  const actionSheet = useRef(null)
  // const isNavigate = useRef(false)
  const [isShownLoader, setShownLoader] = useState(false)
  const useFocused = useIsFocused()
  const [strOrganisationAddress, setOrganisationAddress] = useState('')
  const [organizationType, setOrganizationType] = useState('')
  const [isNavigatedToMap, setIsNavigatedToMap] = useState(false)
  const [latLongDict, setLatLongDict] = useState({})
  const [isModelPresented, setIsModelPresented] = useState(false)
  const [userList, setUserList] = useState([])
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [isDateSet, setIsDateSet] = useState(false)
  const [dateInFormat, setDateInFormat] = useState('')
  const [documentData, setDocumentData] = useState([])
  const [arrImageProfile, setArrImageProfile] = useState([])
  const [textSelectedClient, setTextSelectedClient] = useState('Select Client')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [apiResponceClient, setApiResponceClient] = useState({})
  const [expenseCategory, setExpenseCategory] = useState('')
  const [expenseType, setExpenseType] = useState('')
  const [dateInFormat1, setDateInFormat1] = useState('')
  // const arrTypes = [
  //   'Hospital',
  //   'Pharmaceutical',
  //   'Manufacturing',
  //   'Food Processing houses',
  //   'Hospitality',
  //   'Others',
  // ]
  const arrTypes = [
    'Medical',
    'Transportation',
    'Food',
    'Housing',
    'Others',
  ]

  const arrExpenseType = [
    'Headquater',
    'X',
    'Out',
   
  ]

  useEffect(() => {
    console.log('=======')
    // refreshParentProfile()

  }, [])


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



  const apiViewClient = async () => {
    setShownLoader(true)

    const response = await postWithParam(view_clients_url)

    console.log('response1:::::::::::', response)

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

  // const onPressDeleteContact = index => {
  //   Alert.alert('', 'Are you sure you want to remove this contact?', [
  //     {
  //       text: 'Cancel',
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK',
  //       onPress: () => {
  //         const contacts = [...userList]
  //         contacts.splice(index, 1)
  //         setUserList(contacts)
  //       },
  //     },
  //   ])
  // }

  const onPressSubmitUser = userDict => {
    setIsModelPresented(!isModelPresented)

    const data = [...userList]
    data.push(userDict)
    console.log('--------data', data)
    setUserList(data)
  }

  const ImageListComponent = props => {
    const { item, index } = props
    const [isModelPresented, setIsModelPresented] = useState(false)

    return (
      <View style={{ height: 60, width: 70, alignItems: 'center', padding: 9 }}>
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
            styles.btnCancelStyle,
            { height: 14, width: 14, marginTop: -50, marginRight: -8, borderRadius: 9 },
          ]}>
          <Image
            source={Images.crossBlack}
            style={styles.imgCrossForGalleryStyle}
          />
        </TouchableOpacity>
      </View>
    )
  }




  const showActionSheet = index => {
    actionSheet.current.show()
  }

  const onPressCancel = index => {

    arrImageProfile.splice(index, 1)

    setArrImageProfile([...arrImageProfile])
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

  const presentClientmodel = () => {
    if (apiResponceClient.length == 0) {
      alert('No client found!')
    } else {
      if (!isNavigation) {
        setIsModelPresented(!isModelPresented)
      }
    }
  }


  const refreshParentProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('ApprovedClients')

      if (value !== null) {
        const clientInfo = JSON.parse(value)
        console.log(clientInfo)
        const arrClientIn = clientInfo.map(object => object.org_name)

        setApiResponceClient(clientInfo)
        if (isNavigation) {

          setTextSelectedClient(clientDetailData.org_name)
          setSelectedClientId(clientDetailData.id)
        }
      }
    } catch (error) {
      alert(error)
    }
  }
  const onPressSubmit = () => {
    if (expenseType == '') {
      alert('Please select the expense type')

    }
     else if (
      expenseCategory == '') {
      alert('Please select expanse category')
    } else if (
      expanceAmountRef.current.value == '' ||
      expanceAmountRef.current.value == undefined
    ) {
      alert('Please enter expense amount')
    }
    // else if
    //   (dateInFormat == '') {
    //   alert('Please select Date')
    // }
    // else if (arrImageProfile.length == 0) {
    //   alert('Please attach file')
    // }
    else {
      apiAddExpense()
    }
  }
  const apiAddExpense = async () => {
    setShownLoader(true)
    let formatDate = new Date(dateInFormat1)
    let formdata = new FormData()
    formdata.append('expense_type', expenseType)
    formdata.append('category', expenseCategory)
    formdata.append('amount', expanceAmountRef.current.value)
    // formdata.append('date', moment(formatDate).format('YYYY-MM-DD'))
    console.log("formData====", formdata);

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
    console.log('formdata===========', formdata)
    // console.log('formatDate===========',)

    const response = await postWithParam(saveExpense, formdata)

    // console.log('///....',response)


    setShownLoader(false)
    if (response.status == true) {

      // setUserList([])
      Alert.alert('', 'Expense submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } else {

      Alert.alert('', response.message)
    }

  }

  const setPicker = () => {

    Keyboard.dismiss()

    setTimeout(() => {
      setOpen(true)
    }, 100)

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
        <CommonNavigationHeader
          navigationTitle={'Add Expense'}
          showBackButton={true}
          showPlusIcon={false}
          showRightButton={false}
          onPressButton={() => navigation.goBack()}
        />

        <DatePicker
          modal
          open={open}
          date={date}
          mode={'date'}
          onConfirm={date => {
            let formatDate = moment(date)
              .utcOffset('+05:30')
              .format('DD-MM-YYYY')
            setDateInFormat(formatDate)

            let formatDate1 = moment(date)
              .utcOffset('+05:30')
              .format('YYYY-MM-DD')
            setDateInFormat1(formatDate1)
            Keyboard.dismiss()
            setOpen(false)
            setDate(date)
            setIsDateSet(true)
          }}
          onCancel={() => { Keyboard.dismiss(), setOpen(false) }}
        />


        <Modal
          animationType="slide"
          transparent={true}
          visible={isModelPresented}>
          <ModalClients
            onPressNotes={() => {
              setIsModelPresented(!isModelPresented)
            }}
            arrClients={apiResponceClient}
            onSelectClient={selectedClient => {
              console.log('============fdfdfdf====as', selectedClient)
              setTextSelectedClient(selectedClient.org_name)
              setSelectedClientId(selectedClient.id)
              setIsModelPresented(!isModelPresented)
            }}
          />
        </Modal>
        {/* <Modal
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
        </Modal> */}
        <View style={styles.ViewContainer}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled">
            <View style={{ marginBottom: 91, padding: 4 }}>
              <View style={styles.TextInputView}>

                {/* <View style={{ marginBottom: 5, marginTop: 10 }}>
                  <Text style={styles.textChooseClientToDoCalculationStyle}>
                   Expense Type
                  </Text>

                  <TouchableOpacity
                    onPress={() => presentClientmodel()}
                    activeOpacity={1}
                    style={styles.btnDropDownStyle}>
                    <View style={styles.viewSelectClientStyle}>
                      <Text style={{
                        ...FontStyles.fontMontserrat_Regular13,
                        color: textSelectedClient == 'Select Client' ? Colors.colorLightGray : Colors.black,
                      }}>
                        jkjkj
                      </Text>

                     
                        <Image
                          style={styles.imgDropdownArrow}
                          source={require('../../assets/arrowDownBlue.png')}
                        />
                     
                    </View>
                  </TouchableOpacity>
                </View> */}

                <Text style={styles.textType}>Expense Type</Text>
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
                    color: expenseType != "" ? Colors.black : Colors.colorLightGray,
                    textAlign: 'left',
                    // color: Colors.navigationTitle,
                    ...FontStyles.fontMontserrat_Regular14
                  }}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  dropdownStyle={{ width: '80%', borderRadius: 10 }}
                  data={arrExpenseType}
                  onSelect={(selectedItem, index) => {
                    setExpenseType(arrExpenseType[index])
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  defaultButtonText="Select Expense Type"
                />


                <Text style={styles.textType}>Expense Category</Text>
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
                    color: expenseCategory != "" ? Colors.black : Colors.colorLightGray,
                    textAlign: 'left',
                    // color: Colors.navigationTitle,
                    ...FontStyles.fontMontserrat_Regular14
                  }}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  dropdownStyle={{ width: '80%', borderRadius: 10 }}
                  data={arrTypes}
                  onSelect={(selectedItem, index) => {
                    setExpenseCategory(arrTypes[index])
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  defaultButtonText="Select Category"
                />
                <CommonTextAndInput
                  textInputCommonStyle={styles.TextInput}
                  textCommonStyle={styles.TextInputTitle}
                  manualViewStyle={styles.TextInputStyle}
                  commonText="Expense Amount (₹) "
                  refInput={expanceAmountRef}
                  placeholder="Enter Amount "
                  keyboardType="numeric"
                  returnKeyType='done'

                />

                {/* <Text style={styles.textType}>Expense Date</Text>
                <View style={styles.dateview}>
                  <TouchableOpacity style={{ flexDirection: 'row' }}
                    activeOpacity={1}
                    onPress={() => { setPicker() }}>
                    <Text style={{
                      ...FontStyles.fontMontserrat_Regular13, color: isDateSet != "" ? Colors.black : Colors.colorLightGray,
                      width: '85%', marginLeft: 13,alignSelf:'center'

                    }}>
                      {isDateSet ? `${dateInFormat}` : 'Select Date '}
                    </Text>
                    <Image source={Images.calender} style={{ width: 20, height: 20,resizeMode:'contain' }}></Image>
                  </TouchableOpacity>

                </View> */}

                <Text style={styles.textOrgAddStyle}>
                  Attach File
                </Text>
                <View style={styles.viewCameraAndImagesStyle}>
                  <TouchableOpacity
                    onPress={showActionSheet}
                    style={[styles.btnCameraStyle]}>
                    <Image
                      style={styles.imgCameraStyle}
                      source={Images.camera}
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
    height: 9,
    width: 15,
    // resizeMode: 'contain',
    //  backgroundColor:"red",
    tintColor: 'black'
  },
  btnDropdown: {
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    width: '100%',
    backgroundColor: 'white',
    height: 38,
    borderRadius: 5,
    textAlign: 'left',
    color: "black"
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
  imgTrash: {
    marginTop: 2,
    height: 20,
    width: 20,
    resizeMode: 'contain',
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
  cameraImg: {
    width: 16,
    height: 14
  },
  imgText: {
    color: '#006D9B',
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '300'
  },
  addImages: {
    flexDirection: 'row',
    marginVertical: 10,
    height: 30
  },
  dateview: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    // paddingHorizontal: 15,
    color: 'black',
    backgroundColor: 'white',
    height: 38,
    justifyContent: 'center'
  },
  viewCameraAndImagesStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
    marginVertical: 10
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
    resizeMode: 'contain'
  },
  imgCrossForGalleryStyle: {
    height: 8,
    width: 8,
    tintColor: Colors.colorDarkBlue,
    resizeMode: 'contain'
  },
  imgGalleryStyle: {
    height: 45,
    width: 55,
    // marginLeft: 1,
    // backgroundCoslor:'green'

  },
  imgCrossStyle: {
    height: 18,
    width: 18,
    tintColor: Colors.colorDarkBlue,
  },
  btnCancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 9,
    alignSelf: 'flex-end',
    // marginTop: -12,
    // marginRight: -25,
  },
  textChooseClientToDoCalculationStyle: {
    marginVertical: 8,
    color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_Regular15,
  },
  viewSelectClientStyle: {
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSelectedClientStyle: {
    ...FontStyles.fontMontserrat_Regular13,
    color: Colors.navigationTitle,

  },
  btnDropDownStyle: {
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    width: '100%',
    backgroundColor: 'white',
    height: 38,
    borderRadius: 5,
    justifyContent: 'center',
  },
})

export default AddExpense
