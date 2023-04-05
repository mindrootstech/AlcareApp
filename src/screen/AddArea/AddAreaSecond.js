import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { Colors } from '../../common/Colors'
import { FontStyles } from '../../common/FontStyle'
import CommonTickBox from '../../Components/CommonTickBox'
import AddAreaServices from './AddAreaServices'
import CommonSwitch from '../../Components/CommonSwitch'
import CommonBottomButton from '../../Components/CommonBottomButton'
import {
  get_catagories_with_products_url,
  add_area_url,
} from '../../network/Urls'
import { postWithoutParam, postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { Shadow } from '../../common/Shadow'

const AddAreaSecond = ({ route, navigation }) => {
  const areaDictObject = route?.params?.areaDictObject
  const isComingFromClientDetail = route?.params?.IsComingFromClientDetail
  const clientDetailData = route?.params?.clientDetail
  // console.log('============------------clientDetail', clientDetail)

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(!isEnabled)
  const [isSelected, setSelected] = useState(false)
  const [isShownLoader, setShownLoader] = useState(false)

  const preferredProcedure = [
    'Thrice a Day',
    'Twice a Day',
    'Once a Day',
    'Alternate',
    'Weekly',
  ]

  const [apiResponce, setApiResponce] = useState({})

  const [selectedValues, setSelectedValues] = useState({
    surfaceCleaning: [],
    carbolisation: [],
    environmentCleaning: [],
  })

  const [surfaceCleaning, setSurfaceCleaning] = useState([])
  const [carbolisation, setCarbolisation] = useState([])
  const [environmentCleaning, setEnvironmentCleaning] = useState([])

  const [selectedProcedureValue, setSelectedProcedureValue] = useState({
    surfaceCleaning: -1,
    carbolisation: -1,
    environmentCleaning: -1,
  })

  const [dictEnableToggles, setEnableToggles] = useState({
    surfaceCleaning: false,
    carbolisation: false,
    environmentCleaning: false,
  })

  const onPressTick = (title, index) => {
    var arr = selectedValues[title]
    var filter = arr.filter(value => value == index)
    if (filter.length > 0) {
      const newArr = arr.filter(item => item !== index)
      arr = newArr
    } else {
      if (selectedValues[title].length > 2) {
        alert("User can't select more than 3 Products")
        return
      }
      arr.push(index)
    }

    selectedValues[title] = arr

    switch (title) {
      case 'surfaceCleaning':
        setSurfaceCleaning(arr.map(index => apiResponce[0].products[index].id))
        break
      case 'carbolisation':
        setCarbolisation(arr.map(index => apiResponce[2].products[index].id))
        break
      case 'environmentCleaning':
        setEnvironmentCleaning(
          arr.map(index => apiResponce[1].products[index].id),
        )
        break
      default:
        alert('No title exist====')
    }

    console.log(arr)
    setSelected(!isSelected)
  }

  const toggleSwitches = items => {
    var dict = dictEnableToggles
    dict[items] = !dict[items]
    setEnableToggles(dict)
    setSelected(!isSelected)
  }

  const onPressProcedureTick = (title, index) => {
    var value = selectedProcedureValue[title]

    value = value == index ? -1 : index

    selectedProcedureValue[title] = value

    setSelected(!isSelected)
  }

  const onPressResetButton = () => {
    setEnableToggles({
      surfaceCleaning: false,
      carbolisation: false,
      environmentCleaning: false,
    })

    setSelectedValues({
      surfaceCleaning: [],
      carbolisation: [],
      environmentCleaning: [],
    })

    setSelectedProcedureValue({
      surfaceCleaning: -1,
      carbolisation: -1,
      environmentCleaning: -1,
    })

    setSelected(!isSelected)
  }

  const apiAddAreaDataWithCatagoriesAndProducts = async () => {
    setShownLoader(true)

    const response = await postWithoutParam(get_catagories_with_products_url)
    console.log('66666666666666666response1', response)
    if (response.status == true) {
      setShownLoader(false)
      setApiResponce(response.data)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const procedureIdByIndex = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        return 3
      case 1:
        return 2
      case 2:
        return 1
      case 3:
        return 4
      case 4:
        return 5
      default:
        return -1
    }
  }

  const onPressSubmit = () => {
    console.log(apiResponce[2].category.id)

    let serviceData = []

    if (dictEnableToggles.surfaceCleaning) {
      if (surfaceCleaning.length == 0) {
        alert('Please select atleast one product')
        return
      } else if (selectedProcedureValue.surfaceCleaning == -1) {
        alert('Please select one of the given Procedure')
        return
      } else {
        const dictData = {
          category: apiResponce[0].category.id,
          products: surfaceCleaning.toString(),
          procedure: procedureIdByIndex(selectedProcedureValue.surfaceCleaning),
        }
        serviceData.push(dictData)
      }
    }
    if (dictEnableToggles.carbolisation) {
      if (carbolisation.length == 0) {
        alert('Please select atleast one product')
        return
      } else if (selectedProcedureValue.carbolisation == -1) {
        alert('Please select one of the given Procedure')
        return
      } else {
        const dictData = {
          category: apiResponce[2].category.id,
          products: carbolisation.toString(),
          procedure: procedureIdByIndex(selectedProcedureValue.carbolisation),
        }
        serviceData.push(dictData)
      }
    }
    if (dictEnableToggles.environmentCleaning) {
      if (environmentCleaning.length == 0) {
        alert('Please select atleast one product')
        return
      } else if (selectedProcedureValue.environmentCleaning == -1) {
        alert('Please select one of the given Procedure')
        return
      } else {
        const dictData = {
          category: apiResponce[1].category.id,
          products: environmentCleaning.toString(),
          procedure: procedureIdByIndex(
            selectedProcedureValue.environmentCleaning,
          ),
        }
        serviceData.push(dictData)
      }
    }

    if (
      !dictEnableToggles.surfaceCleaning &&
      !dictEnableToggles.carbolisation &&
      !dictEnableToggles.environmentCleaning
    ) {
      alert('Please select atlease one service')
    } else if (!isEnabled) {
      alert('Please select the confirmation check')
    } else {
      areaDictObject.append('services', JSON.stringify(serviceData))

      // console.log('-----------areaDictObject', areaDictObject)
      apiAddArea(areaDictObject)
    }
  }

  const apiAddArea = async areaDictObject => {
    setShownLoader(true)

    const response = await postWithParam(add_area_url, areaDictObject)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      if (isComingFromClientDetail) {
        navigation.pop(2)
      } else {
        navigation.navigate('ClientDetail', {
          clientDetail: clientDetailData,
          isComingFromAreaScreen: true,
        })
      }
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  useEffect(() => {
    apiAddAreaDataWithCatagoriesAndProducts()
  }, [])

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
      <View style={styles.container}>
        <CommonNavigationHeader
          navigationTitle={'Add Area'}
          showRightButton={true}
          rightButtonTitle={'Reset'}
          showBackButton={true}
          onPressRightButton={() => {
            onPressResetButton()
          }}
          onPressButton={() => {
            navigation.goBack()
          }}
        />

        <View style={styles.stepView}>
          <View style={styles.numberOneView}>
            <Text style={styles.textTwo}>1</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.numberTwoView}>
            <Text style={[styles.textTwo, { color: 'white' }]}>2</Text>
          </View>
        </View>

        <ScrollView>
          <View style={styles.backView}>
            <View style={{ marginBottom: 20, paddingVertical: 4 }}>
              <View style={styles.innerView}>
                <View style={styles.viewTitleWithNumber}>
                  <View style={styles.numberViewStyle}>
                    <Text
                      style={{
                        ...FontStyles.fontMontserrat_Regular11,
                        color: 'white',
                      }}>
                      3
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: 10,
                      ...FontStyles.fontMontserrat_Regular15,
                      color: Colors.navigationTitle,
                    }}>
                    Services Required *
                  </Text>
                </View>

                <CommonSwitch
                  title={'Surface Cleaning'}
                  onValueChangePress={() => {
                    toggleSwitches('surfaceCleaning')
                  }}
                  isEnabled={dictEnableToggles.surfaceCleaning}
                />

                {dictEnableToggles.surfaceCleaning &&
                  apiResponce[0].products != undefined && (
                    <AddAreaServices
                      surfaceProducts={apiResponce[0].products.map(
                        data => data.name,
                      )}
                      preferredProcedure={preferredProcedure}
                      title={'Preferred Procedure'}
                      arrOfSelectedIndex={selectedValues['surfaceCleaning']}
                      itemIndex={selectedProcedureValue['surfaceCleaning']}
                      onPressProcedureTick={index => {
                        onPressProcedureTick('surfaceCleaning', index)
                      }}
                      onPress={index => onPressTick('surfaceCleaning', index)}
                    />
                  )}

                <CommonSwitch
                  title={'High End Cleaning'}
                  onValueChangePress={() => {
                    toggleSwitches('carbolisation')
                  }}
                  isEnabled={dictEnableToggles.carbolisation}
                />

                {dictEnableToggles.carbolisation &&
                  apiResponce[2].products != undefined && (
                    <AddAreaServices
                      surfaceProducts={apiResponce[2].products.map(
                        data => data.name,
                      )}
                      preferredProcedure={preferredProcedure}
                      title={'Preferred Procedure'}
                      arrOfSelectedIndex={selectedValues['carbolisation']}
                      itemIndex={selectedProcedureValue['carbolisation']}
                      onPressProcedureTick={index => {
                        onPressProcedureTick('carbolisation', index)
                      }}
                      onPress={index => onPressTick('carbolisation', index)}
                    />
                  )}

                <CommonSwitch
                  title={'Environment Cleaning'}
                  onValueChangePress={() => {
                    toggleSwitches('environmentCleaning')
                  }}
                  isEnabled={dictEnableToggles.environmentCleaning}
                />

                {dictEnableToggles.environmentCleaning &&
                  apiResponce[1].products != undefined && (
                    <AddAreaServices
                      surfaceProducts={apiResponce[1].products.map(
                        data => data.name,
                      )}
                      preferredProcedure={preferredProcedure}
                      title={'Preferred Procedure'}
                      arrOfSelectedIndex={selectedValues['environmentCleaning']}
                      itemIndex={selectedProcedureValue['environmentCleaning']}
                      onPressProcedureTick={index => {
                        onPressProcedureTick('environmentCleaning', index)
                      }}
                      onPress={index =>
                        onPressTick('environmentCleaning', index)
                      }
                    />
                  )}

                <View style={{ marginRight: 15 }}>
                  <CommonTickBox
                    text={
                      'I confirm the above information is correct and up-to-date.'
                    }
                    isChecked={isEnabled}
                    onPressTick={() => {
                      toggleSwitch()
                    }}
                    containerStyle={{ alignItems: 'flex-start' }}
                    buttonContainerStyle={{ marginTop: 7 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View>
          <CommonBottomButton
            onPressButton={onPressSubmit}
            manualButtonStyle={{ marginBottom: 28, marginHorizontal: 20 }}
            buttonTitle="Submit"
          />
        </View>
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

export default AddAreaSecond

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorBackgroundGray,
  },
  stepView: {
    height: 22,
    width: 246,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
  },
  numberTwoView: {
    height: 22,
    width: 22,
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
  numberOneView: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.colorDarkBlue,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:0.3
  },
  textTwo: {
    color: Colors.colorDarkBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  backView: {
    flex: 1,
    backgroundColor: Colors.colorBackgroundGray,
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
  },
  viewTitleWithNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberViewStyle: {
    height: 15,
    width: 15,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.colorDarkBlue,
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
  viewSurfaceCleaning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chooseProducts: {
    backgroundColor: Colors.white,
    opacity: 0.7,
    borderRadius: 5,
    marginTop: 20,
    padding: 11,
  },
  chooseProductTitle: {
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_semibold14,
  },
})
