import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Alert,
} from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { Colors } from '../../common/Colors'
import MapView, { Marker, MarkerAnimated } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { SafeAreaView } from 'react-native-safe-area-context'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import * as Location from 'expo-location'
import { Shadow } from '../../common/Shadow'
import CommonBottomButton from '../../Components/CommonBottomButton'

const screen = Dimensions.get('window')
const AspectRatio = screen.width / screen.height
const latitudedelta = 0.09
const longitudelta = latitudedelta * AspectRatio
let latLongDict = {}

const MapScreen = ({ navigation, route }) => {
  const mapRef = useRef(null)
  const MarkerRef = useRef(null)

  const [strAddress, setStrAddress] = useState('')

  const [currentposition, Setcurrentposition] = useState({
    latitude: 37.1555,
    longitude: -121.455,
    latitudeDelta: latitudedelta,
    longitudeDelta: longitudelta,
  })
  const [show, setShow] = useState(false)

  useEffect(() => {
    getOneTimeLocation()
    // const requestLocationPermission = async () => {
    //   if (Platform.OS === 'ios') {
    //   } else {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         {
    //           title: 'Location Access Required',
    //           message: 'This App needs to Access your location',
    //         },
    //       )
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         getOneTimeLocation()
    //       } else {
    //         console.log('Permission Denied')
    //       }
    //     } catch (err) {
    //       console.warn(err)
    //     }
    //   }
    //   getOneTimeLocation()
    // }
    // requestLocationPermission()
    // return () => {
    //   Geolocation.clearWatch('')
    // }
  }, [])

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position----', position)

        Setcurrentposition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        latLongDict = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }

        const locationDict = [
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: latitudedelta,
            longitudeDelta: longitudelta,
          },
        ]
        setArr(locationDict)

        getAddressFromCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        ).then(async location => {
          console.log('fetchedCordinates', location)

          setStrAddress(location)
        })
      },
      error => {
        Alert.alert(
          '',
          ' Allow "Alcare" to access maps to get the most accurate location of the client.',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
            { text: 'OK', onPress: () => { Platform.OS == 'ios' ? Linking.openURL('app-settings://notification/Alcare') : Linking.openSettings() } },

          ],
          { cancelable: false }
        )
      },
      { enableHighAccuracy: false, timeout: 30000 },
    )
  }

  const myApiKey = 'AIzaSyAd1sKNg64YMTAL6CCqCWiyV7CX3xZbJYU'

  function getAddressFromCoordinates(latitude, longitude) {
    console.log(latitude, longitude)

    return new Promise((resolve, reject) => {
      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        myApiKey

      console.log('url----', url)

      fetch(url)
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson-----', JSON.stringify(responseJson))
          if (responseJson.status === 'OK') {
            resolve(responseJson?.results?.[0]?.formatted_address)
          } else {
            reject('not found')
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  const [arr, setArr] = useState([
    {
      latitude: currentposition.latitude,
      longitude: currentposition.latitude,
      latitudeDelta: latitudedelta,
      longitudeDelta: longitudelta,
    },
  ])

  const onChangeRegion = region => {
    console.log('region--s-', region)
    if (region != undefined) {
      setArr([
        {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: latitudedelta,
          longitudeDelta: longitudelta,
        },
      ])

      getAddressFromCoordinates(region.latitude, region.longitude).then(
        async location => {
          console.log('fetchedCordinates', location)

          setStrAddress(location)
        },
      )
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      <CommonNavigationHeader
        navigationTitle={'Address'}
        manualStyle={{ marginTop: '10%' }}
        showRightButton={true}
        onPressButton={() => {
          global.isComingBackFromMapScreen = true
          navigation.goBack()
        }}
        rightButtonTitle={'Submit'}
        showBackButton={true}
        onPressRightButton={() => {
          global.isComingBackFromMapScreen = true
          console.log('========------latLongDict', latLongDict)
          route.params.onSelect(strAddress, latLongDict)
          navigation.goBack()
        }}
      />

      {console.log('arr------', arr)}

      <View style={{ flex: 1 }}>
        {arr[0].latitude != undefined && arr[0].longitude != undefined && (
          <>
            <MapView
              style={StyleSheet.absoluteFillObject}
              // ref={mapRef}
              initialRegion={{
                latitude: currentposition.latitude,
                longitude: currentposition.longitude,
                latitudeDelta: latitudedelta,
                longitudeDelta: longitudelta,
              }}
              region={{
                latitude: arr[0].latitude,
                longitude: arr[0].longitude,
                latitudeDelta: arr[0].latitudeDelta,
                longitudeDelta: arr[0].longitudeDelta,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              //onRegionChange={onChangeRegion}
              onRegionChangeComplete={onChangeRegion}>
              <MarkerAnimated
                coordinate={{
                  latitude: arr[0].latitude,
                  longitude: arr[0].longitude,
                }}
              // onDragEnd={(e) => console.log("location==>>", e.nativeEvent.coordinate)}
              />
            </MapView>

            <GooglePlacesAutocomplete
              placeholder="Search"
              textInputProps={{
                onChangeText: text => {
                  setStrAddress(text)
                },
                value: strAddress,
              }}


              onPress={(data, details = null) => {
                console.log(data, details)

                console.log('formatted_address', details.formatted_address)
                console.log('-----------', details.geometry.location.lat)
                console.log('-----------', details.geometry.location.lng)
                console.log(
                  '-----------',
                  details.geometry.viewport.northeast.lat,
                )
                console.log(
                  '-----------',
                  details.geometry.viewport.southwest.lat,
                )
                latLongDict = {
                  lat: details.geometry.location.lat,
                  long: details.geometry.location.lng,
                }
                // northeast: {lat: 13.17370600858147, lng: 77.88268086666527}
                // southwest: {lat: 12.73428884772176, lng: 77.37919807560223}

                const latDelta =
                  details.geometry.viewport.northeast.lat -
                  details.geometry.viewport.southwest.lat
                const lngDelta = latDelta * AspectRatio

                let array = []
                let dict = {}
                dict.latitude = details.geometry.location.lat
                dict.longitude = details.geometry.location.lng
                  ; (dict.latitudeDelta = latDelta),
                    (dict.longitudeDelta = lngDelta),
                    array.push(dict)
                setArr(array)
                setStrAddress(details.formatted_address)

                console.log(
                  'details.formatted_addressdetails.formatted_addressdetails.formatted_addressdetails.formatted_address',
                  strAddress,
                )

                // MarkerRef.addListener('click', () => {

                //   mapRef.setZoom(8)
                //   mapRef.setCenter(MarkerRef.getPosition())
                // })

                setShow(true)
              }}
              returnKeyType={'search'}
              listViewDisplayed={true} // true/false/undefined
              fetchDetails={true}
              query={{
                key: currentposition .latitude == 37.1555 && currentposition.longitude == -121.455 ?null : 'AIzaSyAd1sKNg64YMTAL6CCqCWiyV7CX3xZbJYU',
                language: 'en',
              }}
              styles={{
                textInput: {
                  height: 45,
                  color: '#5d5d5d',
                  fontSize: 16,
                  ...Shadow,
                  borderRadius: 10,
                  margin: 15,
                },
                description: {
                  fontWeight: '500',
                },
              }}
            />
          </>
        )}
      </View>
    </View>
  )
}
export default MapScreen

// import React, { useState, useEffect, useRef } from 'react'
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native'
// import Geolocation from '@react-native-community/geolocation'
// import { Colors } from '../../common/Colors'
// import MapView, { Marker, MarkerAnimated } from 'react-native-maps'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
// import * as Location from 'expo-location'
// import { Shadow } from '../../common/Shadow'
// import CommonBottomButton from '../../Components/CommonBottomButton'

// const screen = Dimensions.get('window')
// const AspectRatio = screen.width / screen.height
// const latitudedelta = 0.09
// const longitudelta = latitudedelta * AspectRatio
// let latLongDict = {}

// const MapScreen = ({ navigation, route }) => {
//   const mapRef = useRef(null)
//   const MarkerRef = useRef(null)

//   const [strAddress, setStrAddress] = useState('')

//   const [currentposition, Setcurrentposition] = useState({
//     latitude: 37.1555,
//     longitude: -121.455,
//     latitudeDelta: latitudedelta,
//     longitudeDelta: longitudelta,
//   })
//   const [show, setShow] = useState(false)

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             },
//           )
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getOneTimeLocation()
//           } else {
//             console.log('Permission Denied')
//           }
//         } catch (err) {
//           console.warn(err)
//         }
//       }
//       getOneTimeLocation()
//     }
//     requestLocationPermission()
//     return () => {
//       Geolocation.clearWatch('')
//     }
//   }, [])

//   const getOneTimeLocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('position----', position)

//         Setcurrentposition({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         })

//         const locationDict = [
//           {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             latitudeDelta: latitudedelta,
//             longitudeDelta: longitudelta,
//           },
//         ]
//         setArr(locationDict)

//         getAddressFromCoordinates(
//           position.coords.latitude,
//           position.coords.longitude,
//         ).then(async location => {
//           console.log('fetchedCordinates', location)

//           setStrAddress(location)
//         })
//       },
//       error => {
//         console.log(error.message)
//       },
//       { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
//     )
//   }

//   const myApiKey = 'AIzaSyCSXSIW7HwsKujYNfbEClmf-hGBLcCYN0M'

//   function getAddressFromCoordinates(latitude, longitude) {
//     console.log(latitude, longitude)

//     return new Promise((resolve, reject) => {
//       const url =
//         'https://maps.googleapis.com/maps/api/geocode/json?address=' +
//         latitude +
//         ',' +
//         longitude +
//         '&key=' +
//         myApiKey

//       console.log('url----', url)

//       fetch(url)
//         .then(response => response.json())
//         .then(responseJson => {
//           console.log('responseJson-----', JSON.stringify(responseJson))
//           if (responseJson.status === 'OK') {
//             resolve(responseJson?.results?.[0]?.formatted_address)
//           } else {
//             reject('not found')
//           }
//         })
//         .catch(error => {
//           reject(error)
//         })
//     })
//   }

//   const [arr, setArr] = useState([
//     {
//       latitude: currentposition.latitude,
//       longitude: currentposition.latitude,
//       latitudeDelta: latitudedelta,
//       longitudeDelta: longitudelta,
//     },
//   ])

//   const onChangeRegion = region => {
//     console.log('region--s-', region)
//     if (region != undefined) {
//       setArr([
//         {
//           latitude: region.latitude,
//           longitude: region.longitude,
//         },
//       ])

//       getAddressFromCoordinates(region.latitude, region.longitude).then(
//         async location => {
//           console.log('fetchedCordinates', location)

//           setStrAddress(location)
//         },
//       )
//     }
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
//       <CommonNavigationHeader
//         navigationTitle={'Address'}
//         manualStyle={{ marginTop: '10%' }}
//         showRightButton={true}
//         onPressButton={() => {
//           global.isComingBackFromMapScreen = true
//           navigation.goBack()
//         }}
//         rightButtonTitle={'Submit'}
//         showBackButton={true}
//         onPressRightButton={() => {
//           global.isComingBackFromMapScreen = true
//           route.params.onSelect(strAddress, latLongDict)
//           navigation.goBack()
//         }}
//       />
//       <View style={{ flex: 1 }}>
//         {arr[0].latitude != undefined && arr[0].longitude != undefined && (
//           <MapView
//             style={{ flex: 1 }}
//             ref={mapRef}
//             showsMyLocationButton={true}
//             showsUserLocation={true}
//             initialRegion={{
//               latitude: currentposition.latitude,
//               longitude: currentposition.longitude,
//               latitudeDelta: latitudedelta,
//               longitudeDelta: longitudelta,
//             }}
//             region={{
//               latitude: arr[0].latitude,
//               longitude: arr[0].longitude,
//               latitudeDelta: arr[0].latitudeDelta,
//               longitudeDelta: arr[0].longitudeDelta,
//             }}
//             minZoomLevel={2}
//             zoomEnabled={true}
//             image={require('../../assets/mapmarker.png')}
//             onRegionChangeComplete={onChangeRegion}>
//             <MarkerAnimated
//               ref={MarkerRef}
//               coordinate={{
//                 latitude: arr[0].latitude,
//                 longitude: arr[0].longitude,
//               }}
//               title="I am here"
//               image={require('../../assets/mapmarker.png')}
//             />

//             <GooglePlacesAutocomplete
//               placeholder="Search"
//               textInputProps={{
//                 onChangeText: text => {
//                   setStrAddress(text)
//                 },
//                 value: strAddress,
//               }}
//               onPress={(data, details = null) => {
//                 console.log(data, details)

//                 console.log('formatted_address', details.formatted_address)
//                 console.log('-----------', details.geometry.location.lat)
//                 console.log('-----------', details.geometry.location.lng)
//                 console.log(
//                   '-----------',
//                   details.geometry.viewport.northeast.lat,
//                 )
//                 console.log(
//                   '-----------',
//                   details.geometry.viewport.southwest.lat,
//                 )
//                 latLongDict = {
//                   lat: details.geometry.location.lat,
//                   long: details.geometry.location.lng,
//                 }
//                 // northeast: {lat: 13.17370600858147, lng: 77.88268086666527}
//                 // southwest: {lat: 12.73428884772176, lng: 77.37919807560223}

//                 const latDelta =
//                   details.geometry.viewport.northeast.lat -
//                   details.geometry.viewport.southwest.lat
//                 const lngDelta = latDelta * AspectRatio

//                 let array = []
//                 let dict = {}
//                 dict.latitude = details.geometry.location.lat
//                 dict.longitude = details.geometry.location.lng
//                 ;(dict.latitudeDelta = latDelta),
//                   (dict.longitudeDelta = lngDelta),
//                   array.push(dict)
//                 setArr(array)
//                 setStrAddress(details.formatted_address)

//                 console.log(
//                   'details.formatted_addressdetails.formatted_addressdetails.formatted_addressdetails.formatted_address',
//                   strAddress,
//                 )

//                 // MarkerRef.addListener('click', () => {

//                 //   mapRef.setZoom(8)
//                 //   mapRef.setCenter(MarkerRef.getPosition())
//                 // })

//                 setShow(true)
//               }}
//               returnKeyType={'search'}
//               listViewDisplayed={true} // true/false/undefined
//               fetchDetails={true}
//               query={{
//                 key: 'AIzaSyCSXSIW7HwsKujYNfbEClmf-hGBLcCYN0M',
//                 language: 'en',
//               }}
//               styles={{
//                 textInput: {
//                   height: 45,
//                   color: '#5d5d5d',
//                   fontSize: 16,
//                   ...Shadow,
//                   borderRadius: 10,
//                   margin: 15,
//                 },
//                 description: {
//                   fontWeight: '500',
//                 },
//               }}
//             />
//           </MapView>
//         )}
//       </View>
//     </View>
//   )
// }
// export default MapScreen
