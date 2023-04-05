import {
  Image,
  StyleSheet,
  Text,
  SectionList,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../common/Colors'
import { FontStyles } from '../../common/FontStyle'
import AreaCard from '../../Components/AreaCard'
import Images from '../../common/Images'
import { Title } from 'react-native-paper'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import CommonBottomButton from '../../Components/CommonBottomButton'
import { Shadow } from '../../common/Shadow'
import { areaCalculation_url, sendQuote_url } from '../../network/Urls'
import { postWithParam } from '../../network'
import Loader from '../../network/Loader'
import { ScrollView, FlatList } from 'react-native-gesture-handler'

const AreanDetails = ({ route, navigation }) => {
  const areaId = route.params.areaId
  console.log('----------------8areaId', areaId)
  const [emptyArry, setEmptyArr] = useState([])
  const [apiResponceAreaDetail, setApiResponceAreaDetail] = useState(false)
  const [isShownLoader, setShownLoader] = useState(false)

  let DATA = []

  const [listData, setListData] = useState([])

  useEffect(() => {
    console.log('sdfsd')
    apiAreaDetail()
  }, [])

  const apiAreaDetail = async () => {
    setShownLoader(true)

    let formdata = new FormData()

    formdata.append('areaid', areaId)

    const response = await postWithParam(areaCalculation_url, formdata)

    console.log('aeraId::::23:::::::', response.data)

    if (response.status == true) {
      setShownLoader(false)
      setApiResponceAreaDetail(response.data[0])

      console.log('---------------listData', listData)

      let arrlist = []

      if (response.data[0].hasOwnProperty('SurfaceCleaning')) {
        arrlist.push({
          id: 1,
          title: 'Surface',
        })
      }
      if (response.data[0].hasOwnProperty('HighEndCleaning')) {
        arrlist.push({
          id: 2,
          title: 'HighEndCleaning',
        })
      }
      if (response.data[0].hasOwnProperty('EnvironmentCleaning')) {
        arrlist.push({
          id: 3,
          title: 'Environment',
        })
      }
      setListData(arrlist)
      console.log('---------------arrlist', arrlist)

      console.log('---------------listData', listData)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const apiSendQuote = async () => {
    setShownLoader(true)
    let formdata = new FormData()
    formdata.append('areaid', areaId)
    const response = await postWithParam(sendQuote_url, formdata)
    console.log('aeraId:::::::::::', response.data)
    if (response.status == true) {
      setShownLoader(false)
      alert('Email sent successfully')
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const onPressShowDetails = params => {
    console.log(params.id, 'befremoveIndex')
    const newIndex = emptyArry.filter(x => x == params.id)
    if (params.id == newIndex) {
      const removeIndex = emptyArry.filter(x => x !== params.id)
      setEmptyArr(removeIndex)
      console.log(emptyArry, 'befremoveIndex')
    } else {
      setEmptyArr(prevArr => [...prevArr, params.id])
      console.log(emptyArry, 'dfsndk')
    }
  }

  const convertObjectToArray = data => {
    let procDataDay = Object.assign({}, data)
    let finalSectionData = []
    delete procDataDay['weekly_usage']

    //   "weekdata": {
    //     "productCount": 2,
    //     "data": {
    //         "Monday": "DRLS13aN",
    //         "Tuesday": "Sanosil-Hospital"
    //     }
    // }

    if (data.hasOwnProperty('Monday')) {
      console.log('========true', true)
      procDataDay = Object.keys(procDataDay).map(function (key) {
        return { day: key, product: procDataDay[key] }
      })
      finalSectionData.push({
        title1: 'Day',
        title2: 'Product',
        data: procDataDay,
      })
    } else {
      console.log('========false', data.weekdata.productCount)
      console.log('========data.weekdata.data', data.weekdata.data)
      const productCount = data.weekdata.productCount

      const contentData = {
        monday: data.weekdata.data.Monday,
        tuesday:
          productCount == 2 || productCount == 3
            ? data.weekdata.data.Tuesday
            : '',
        wednesday: productCount == 3 ? data.weekdata.data.Wednesday : '',
      }
      finalSectionData.push({
        title1: 'Week',
        title2: 'Monday',
        title3: 'Tuesday',
        title4: 'Wednesday',
        daysCount: productCount,
        data: [
          {
            week: 'Week1',
            ...contentData,
          },
          {
            week: 'Week2',
            ...contentData,
          },
          {
            week: 'Week3',
            ...contentData,
          },
          {
            week: 'Week4',
            ...contentData,
          },
        ],
      })
    }

    let procDataWeekly = data.weekly_usage
    procDataWeekly = procDataWeekly.map(function (item) {
      return {
        day: item.product_name,
        product: item.weekly,
        waterUsage: item.waterUsage,
      }
    })
    finalSectionData.push({
      title1: 'Surface',
      subtitle1: '(Weekly Requirement)',
      title2: 'Water Usage',
      subtitle2: '(Ltr.)',
      data: procDataWeekly,
    })

    return finalSectionData
  }

  const TotalListHeader = () => {
    return (
      <View style={[styles.listHeaderStyle2, { borderTopWidth: 1 }]}>
        <Text
          style={[styles.listHeaderStyle, { marginTop: 15, marginRight: 10 }]}>
          Product
        </Text>
        <Text
          style={[
            styles.listHeaderStyle,
            { marginTop: 15, textAlign: 'center' },
          ]}>
          Weekly Usage (ML)
        </Text>
        <Text
          style={[
            styles.listHeaderStyle,
            { marginTop: 15, textAlign: 'center' },
          ]}>
          Monthly Usage (ML)
        </Text>
        <Text
          style={[
            styles.listHeaderStyle,
            { marginTop: 15, textAlign: 'center' },
          ]}>
          Monthly Usage (Ltr)
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CommonNavigationHeader
          navigationTitle={apiResponceAreaDetail.area_name}
          onPressButton={() => navigation.goBack()}
          showBackButton={true}
          manualStyle={{ paddingHorizontal: 5 }}
        />

        <AreaCard areaBoxDetail={apiResponceAreaDetail} />

        <Text
          style={{
            ...FontStyles.fontMontserrat_Bold12,
            color: Colors.textBoldColor,
            marginVertical: 20,
          }}>
          Total (All Products)
        </Text>

        <FlatList
          data={apiResponceAreaDetail.totalAllProduct}
          scrollEnabled={false}
          ListHeaderComponent={() => TotalListHeader()}
          renderItem={({ item, index }) => {
            console.log('----------------item55', item)

            return (
              <View
                style={[
                  styles.listHeaderStyle2,
                  { borderTopWidth: 1, alignItems: 'center' },
                ]}>
                <Text
                  style={{
                    flex: 0.7,
                    color: Colors.textBoldColor,
                    ...FontStyles.fontMontserrat_Medium14,
                    paddingTop: 10,
                  }}>
                  {item.product}
                </Text>
                <Text style={styles.detailsStyle}>{item.weekly}</Text>
                <Text style={[styles.detailsStyle, { flex: 0.6 }]}>
                  {item.monthy}
                </Text>
                <Text style={[styles.detailsStyle, { flex: 0.6 }]}>
                  {item.monthy_litre}
                </Text>
              </View>
            )
          }}
        />
        {listData.map((item, index) => {
          const openList =
            emptyArry.findIndex(x => x == item.id) >= 0 ? true : false

          if (item.title == 'Surface') {
            DATA = convertObjectToArray(apiResponceAreaDetail.SurfaceCleaning)
          } else if (item.title == 'HighEndCleaning') {
            DATA = convertObjectToArray(apiResponceAreaDetail.HighEndCleaning)
          } else {
            DATA = convertObjectToArray(
              apiResponceAreaDetail.EnvironmentCleaning,
            )
          }

          return (
            <View style={{ padding: 4 }} key={index}>
              <View
                style={{
                  backgroundColor: Colors.dropDwnView,
                  marginTop: 15,
                  paddingHorizontal: 5,
                  backgroundColor: 'white',
                  borderRadius: 6,
                  ...Shadow,
                }}>
                <TouchableOpacity
                  style={styles.dropDwnStyle1}
                  onPress={() => onPressShowDetails(item)}
                  activeOpacity={1}>
                  <Text
                    style={{
                      ...FontStyles.fontMontserrat_SemiBold12,
                      color: Colors.textBoldColor,
                    }}>
                    Recommended procedure for: {item.title}
                  </Text>
                  <View style={{ justifyContent: 'center' }}>
                    {openList == false ? (
                      <Image
                        source={Images.plus_Icon}
                        style={{ height: 18, width: 18, alignSelf: 'center' }}
                      />
                    ) : (
                      <Image
                        source={Images.minusIcon}
                        style={{ height: 2, width: 11, alignSelf: 'center' }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {openList && (
                  <SectionList
                    sections={DATA}
                    style={{ marginBottom: 10 }}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ section, item, index }) => {
                      console.log('-------section.title1', section.title1)
                      return (
                        <View>
                          {section.title1 == 'Week' ? (
                            <View
                              style={[
                                styles.sectionItemStyle,
                                {
                                  borderBottomWidth:
                                    index < DATA[0].data.length - 1 ? 1 : 0,
                                  marginBottom:
                                    index >= DATA[0].data.length - 1 ? 20 : 1,
                                },
                              ]}>
                              <Text style={styles.sectionListDay}>
                                {item.week}
                              </Text>
                              <Text
                                style={[
                                  styles.sectionListProduct,
                                  {
                                    textAlign: 'center',
                                    marginLeft:
                                      section.daysCount == 1 ? 100 : 0,
                                  },
                                ]}>
                                {item.monday}
                              </Text>
                              {(section.daysCount == 2 ||
                                section.daysCount == 3) && (
                                <Text
                                  style={[
                                    styles.sectionListProduct,
                                    { paddingLeft: 20 },
                                  ]}>
                                  {item.tuesday}
                                </Text>
                              )}
                              {section.daysCount == 3 && (
                                <Text
                                  style={[
                                    styles.sectionListProduct,
                                    {
                                      textAlign: 'center',
                                    },
                                  ]}>
                                  {item.wednesday}
                                </Text>
                              )}
                            </View>
                          ) : (
                            <View style={[styles.sectionItemStyle]}>
                              <Text style={styles.sectionListDay}>
                                {item.day}
                              </Text>
                              <Text style={[styles.sectionListProduct]}>
                                {item.product}
                              </Text>
                              <Text
                                style={[
                                  styles.sectionListProduct,
                                  {
                                    flex: 0.5,
                                  },
                                ]}>
                                {item.waterUsage}
                              </Text>
                            </View>
                          )}
                        </View>
                      )
                    }}
                    renderSectionHeader={(title, index) => {
                      console.log('==========title', title)
                      return (
                        <View>
                          {title.section.title1 === 'Week' ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 8,
                                marginBottom: 15,
                              }}>
                              <Text style={[styles.sectionHeaderStyle]}>
                                {title.section.title1}
                              </Text>
                              <Text
                                style={[
                                  styles.sectionHeaderStyle,
                                  {
                                    marginRight:
                                      title.section.daysCount == 3
                                        ? 20
                                        : title.section.daysCount == 2
                                        ? 0
                                        : 20,
                                    marginLeft:
                                      title.section.daysCount == 3
                                        ? 30
                                        : title.section.daysCount == 2
                                        ? 15
                                        : 0,
                                  },
                                ]}>
                                {title.section.title2}
                              </Text>
                              {(title.section.daysCount == 2 ||
                                title.section.daysCount == 3) && (
                                <Text
                                  style={[
                                    styles.sectionHeaderStyle,
                                    {
                                      marginRight:
                                        title.section.daysCount == 2 ? 20 : 0,
                                    },
                                  ]}>
                                  {title.section.title3}
                                </Text>
                              )}
                              {title.section.daysCount == 3 && (
                                <Text style={[styles.sectionHeaderStyle]}>
                                  {title.section.title4}
                                </Text>
                              )}
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 8,
                                marginTop:
                                  title.section.title1 == 'Surface' ? 20 : 0,
                              }}>
                              <View>
                                <Text style={[styles.sectionHeaderStyle, {}]}>
                                  {title.section.title1}
                                </Text>
                                <Text
                                  style={[
                                    styles.sectionHeaderStyle,
                                    { ...FontStyles.fontMontserrat_SemiBold9 },
                                  ]}>
                                  {title.section.subtitle1}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex:
                                    title.section.title2 === 'Product'
                                      ? 0.62
                                      : 0,
                                }}>
                                <Text style={[styles.sectionHeaderStyle]}>
                                  {title.section.title2}
                                </Text>
                                <Text
                                  style={[
                                    styles.sectionHeaderStyle,
                                    { ...FontStyles.fontMontserrat_SemiBold9 },
                                  ]}>
                                  {title.section.subtitle2}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )
                    }}
                  />
                )}
              </View>
            </View>
          )
        })}
        <View>
          <CommonBottomButton
            buttonTitle={'Send for Quote'}
            onPressButton={() => apiSendQuote()}
            manualButtonStyle={{ marginTop: 70, marginBottom: 40 }}
          />
        </View>
        <Loader isLoading={isShownLoader} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.colorBackgroundGray,
  },
  listView: {
    marginTop: 30,
  },
  listHeaderStyle: {
    width: 80,
    alignSelf: 'center',
    color: Colors.textBoldColor,
    ...FontStyles.fontMontserrat_SemiBold12,
  },
  listHeaderStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Colors.borderColor,
    alignContent: 'center',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  dropDwnStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  detailsStyle: {
    paddingTop: 10,
    ...FontStyles.fontMontserrat_semibold14,
    color: Colors.theamColor,
    flex: 0.7,
    alignContent: 'center',
    textAlign: 'center',
  },
  sectionListDay: {
    flex: 1,
    ...FontStyles.fontMontserrat_Medium14,
    color: Colors.textColor,
  },
  sectionListProduct: {
    flex: 1,
    ...FontStyles.fontMontserrat_semibold14,
    color: Colors.theamColor,
  },
  sectionHeaderStyle: {
    ...FontStyles.fontMontserrat_Medium12,
    color: Colors.textColor,
  },
  sectionItemStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 7,
    paddingLeft: 8,
  },
})

export default AreanDetails

{
  /* <View style={styles.listView}>
          <FlatList
            data={array}
            scrollEnabled={false}
            ListHeaderComponent={() => headerList()}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={[
                    styles.listHeaderStyle2,
                    { borderTopWidth: 1, alignItems: 'center' },
                  ]}>
                  <Text
                    style={{
                      flex: 0.7,
                      color: Colors.textBoldColor,
                      ...FontStyles.fontMontserrat_Medium14,
                      paddingTop: 10,
                    }}>
                    {item.Product}
                  </Text>
                  <Text style={styles.detailsStyle}>{item.weekly_Usage}</Text>
                  <Text style={[styles.detailsStyle, { flex: 0.4 }]}>
                    {item.Monthly_Usage_Ltr}
                  </Text>
                </View>
              )
            }}
          />
        </View> */
}

// const headerList = () => {
//   return (
//     <View style={styles.listHeaderStyle2}>
//       {<Text style={styles.listHeaderStyle}>Product</Text>}
//       <Text style={styles.listHeaderStyle}>Weekly Usage (ML)</Text>
//       <Text style={styles.listHeaderStyle}>monthly Usage (ML)</Text>
//     </View>
//   )
// }

// const Item = ({ item, index }) => {
//   return (
//     <View
//       style={[
//         styles.sectionItemStyle,
//         {
//           borderBottomWidth: index < DATA[0].data.length - 1 ? 1 : 0,
//           marginBottom: index >= DATA[0].data.length - 1 ? 20 : 1,
//         },
//       ]}>
//       <Text style={styles.sectionListDay}>{item.day}</Text>
//       <Text style={[styles.sectionListProduct]}>{item.product}</Text>
//       <Text style={[styles.sectionListProduct, { flex: 0.31 }]}>
//         {item.waterUsage}
//       </Text>
//     </View>
//   )
// }
