import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  StatusBar,
} from 'react-native'
import { FontStyles } from '../../common/FontStyle'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import SelectDropdown from 'react-native-select-dropdown'
import { Colors } from '../../common/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CommonBottomButton from '../../Components/CommonBottomButton'
import CommonTextAndInput from '../../Components/CommonTextAndInput'
import { get_clients_url } from '../../network/Urls'
import { getAPIAfterLogin } from '../../network'
import Loader from '../../network/Loader'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ModalClients from '../../Modal/ModalClients'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Shadow } from '../../common/Shadow'

const AddArea = ({ navigation, route }) => {
  const isNavigation = route?.params?.isFromNavigation ? true : false
  const clientDetailData = route?.params?.clientData
  // console.log('dfdf========', clientDetailData)
  
  const [isShownLoader, setShownLoader] = useState(false)
  const [arrClient, setArrClient] = useState([])
  const [apiResponceClient, setApiResponceClient] = useState({})

  const [areaName, setAreaName] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [textSelectedClient, setTextSelectedClient] = useState('Choose Client')

  const [selectedClientId, setSelectedClientId] = useState('')
  const areaNameRef = useRef('')
  const lengthRef = useRef('')
  const widthRef = useRef('')
  const heightRef = useRef('')
  const useFocused = useIsFocused()
  const [isModelPresented, setIsModelPresented] = useState(false)

  useEffect(() => {
    refreshParentProfile()
    return () => {
      ressetView()
    }
  }, [useFocused])

  const onClickNext = () => {
    if (selectedClientId == '') {
      alert('Please select client')
    } else if (
      areaNameRef.current.value == '' ||
      areaNameRef.current.value == undefined
    ) {
      alert('Please fill Area name')
    } else if (
      lengthRef.current.value == '' ||
      lengthRef.current.value == undefined
    ) {
      alert('Please fill length')
    } else if (
      widthRef.current.value == '' ||
      widthRef.current.value == undefined
    ) {
      alert('Please fill width')
    } else if (
      heightRef.current.value == '' ||
      heightRef.current.value == undefined
    ) {
      alert('Please fill height')
    } else {
      let formdata = new FormData()

      formdata.append('client_id', selectedClientId)
      formdata.append('name', areaNameRef.current.value)
      formdata.append('length', lengthRef.current.value)
      formdata.append('width', widthRef.current.value)
      formdata.append('height', heightRef.current.value)

      let clientDetailData = {
        id: selectedClientId,
        org_name: textSelectedClient,
      }
      navigation.navigate('AddAreaSecond', {
        areaDictObject: formdata,
        IsComingFromClientDetail: isNavigation,
        clientDetail: clientDetailData,
      })
    }
  }

  const refreshParentProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('ApprovedClients')

      if (value !== null) {
        const clientInfo = JSON.parse(value)
        console.log(clientInfo)
        const arrClientIn = clientInfo.map(object => object.org_name)
        setArrClient(arrClientIn)
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

  const ressetView = () => {
    setArrClient([])
    setSelectedClientId('')
    setTextSelectedClient('Choose Client')
    if (areaNameRef.current != null) {
      areaNameRef.current.value = ''
      areaNameRef.current.clear()
    }
    if (lengthRef.current != null) {
      lengthRef.current.value = ''
      lengthRef.current.clear()
    }
    if (widthRef.current != null) {
      widthRef.current.value = ''
      widthRef.current.clear()
    }
    if (heightRef.current != null) {
      heightRef.current.value = ''
      heightRef.current.clear()
    }
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
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

      <CommonNavigationHeader
        navigationTitle={'Add Area'}
        showRightButton={true}
        rightButtonTitle={'Reset'}
        showBackButton={isNavigation}
        onPressRightButton={() => {
          ressetView()
        }}
        onPressButton={() => {
          navigation.goBack()
        }}
      />

      <View style={styles.stepView}>
        <View style={styles.numberOneView}>
          <Text style={[styles.textTwo, { color: 'white' }]}>1</Text>
        </View>

        <View style={styles.line}></View>

        <View style={styles.numberTwoView}>
          <Text style={styles.textTwo}>2</Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={{
          width: '100%',
          paddingHorizontal: 15,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
        <View style={{ padding: 7 }}>
          <View style={styles.innerView}>
            <View style={{ marginBottom: 20}}>
              <Text style={styles.textChooseClientToDoCalculationStyle}>
                Choose Client to do calculation:
              </Text>

              <TouchableOpacity
                onPress={() => presentClientmodel()}
                activeOpacity={1}
                style={styles.btnDropDownStyle}>
                <View style={styles.viewSelectClientStyle}>
                  <Text style={{color:textSelectedClient == 'Choose Client'? Colors.colorLightGray:Colors.black,
                  ...FontStyles.fontMontserrat_Regular13,
                
                }}>
                    {textSelectedClient}
                  </Text>
                  {!isNavigation &&
                    <Image
                    style={{ height: 9, width: 15, marginRight: 10 }}
                    source={require('../../assets/arrowDownBlue.png')}
                  />
                  }
                  
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <View style={[styles.viewAreaNameStyle, { marginBottom: 10 }]}>
                <View style={styles.viewCircularNumerStyle}>
                  <Text style={styles.textCircularNumerStyle}>1</Text>
                </View>
                <Text style={styles.textAreaNameStyle}>Area Name *</Text>
              </View>

              <CommonTextAndInput
                manualViewStyle={{ marginTop: 0 }}
                placeholder={'Enter Area name'}
                titleStyle={{ height: 0, marginBottom: 0 }}
                // textInputStyle={{ ...FontStyles.fontMontserrat_Regular12 }}
                refInput={areaNameRef}
                onChangeTextFunc={text => setAreaName(text)}
                value={areaName}
                defaultValue={areaName}
                autoCapitalizeProp={'sentences'}
               
              />
            </View>

            <View>
              <View style={styles.viewAreaNameStyle}>
                <View style={styles.viewAreaNameStyle}>
                  <View style={styles.viewCircularNumerStyle}>
                    <Text style={styles.textCircularNumerStyle}>2</Text>
                  </View>
                  <Text style={styles.textAreaNameStyle}>
                    Area Measurements *
                  </Text>
                </View>
              </View>

              <CommonTextAndInput
                commonText={'Length* (ft)'}
                manualViewStyle={{ marginTop: 15 }}
                placeholder={' Enter Length'}
                keyboardType={'numeric'}
                refInput={lengthRef}
                defaultValue={''}
                // onChangeTextFunc={text => setLength(text)}
                // value={length}
                returnKeyType='done'
              />

              <CommonTextAndInput
                commonText={'Width* (ft)'}
                manualViewStyle={{ marginTop: 20 }}
                placeholder={'Enter Width'}
                keyboardType={'numeric'}
                refInput={widthRef}
                onChangeTextFunc={text => setWidth(text)}
                value={width}
                returnKeyType='done'
              />

              <CommonTextAndInput
                commonText={'Height* (ft)'}
                manualViewStyle={{ marginTop: 20 }}
                placeholder={'Enter Height'}
                keyboardType={'numeric'}
                refInput={heightRef}
                onChangeTextFunc={text => setHeight(text)}
                value={height}
                returnKeyType='done'
              />
            </View>

            <View style={{ width: '100%', paddingHorizontal: 20 }}>
              <CommonBottomButton
                onPressButton={onClickNext}
                buttonTitle={'Next'}
                manualButtonStyle={styles.btnNextStyle}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepView: {
    height: 22,
    width: 246,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    // backgroundColor:'red'
  },
  numberOneView: {
    height: 22,
    width: 22.2,
    borderRadius: 11,
    backgroundColor: '#006D9B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    height: 4,
    flexGrow: 1,
    backgroundColor: '#006D9B',
    
  },
  numberTwoView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.colorDarkBlue,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTwo: {
    color: Colors.colorDarkBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  textChooseClientToDoCalculationStyle: {
    marginVertical: 8,
    color: Colors.navigationTitle,
    ...FontStyles.fontMontserrat_Regular15,
  },
  backView: {
    backgroundColor: 'pink',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  innerView: {
    backgroundColor: Colors.colorLightPurple,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
    ...Shadow,
    // backgroundColor:'red'
  },
  txtHeight: {
    borderWidth: 0.5,
    borderColor: Colors.navigationTitle,
    width: '100%',
    height: 38,
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 15,
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
  viewAreaNameStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCircularNumerStyle: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colorDarkBlue,
  },
  textCircularNumerStyle: {
    ...FontStyles.fontMontserrat_Regular11,
    color: 'white',
    marginTop: -1,
  },
  textAreaNameStyle: {
    marginLeft: 10,
    ...FontStyles.fontMontserrat_Regular15,
    color: Colors.navigationTitle,
  },
  btnNextStyle: {
    marginTop: 25,
  },
  viewSelectClientStyle: {
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  textSelectedClientStyle: {
    ...FontStyles.fontMontserrat_Regular13,
    color:Colors.navigationTitle,
  },
})

export default AddArea

// const apiGetClient = async () => {
//   setShownLoader(true)

//   const response = await getAPIAfterLogin(get_clients_url)

//   console.log('response1', response)

//   if (response.status == true) {
//     setShownLoader(false)
//     const arrClientIn = response.clients.map(object => object.org_name)
//     setArrClient(arrClientIn)
//     setApiResponceClient(response.clients)
//   } else {
//     setShownLoader(false)
//     Alert.alert('', response.message)
//   }
// }
