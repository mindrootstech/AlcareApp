import React, { Component, useContext } from 'react'
import { keys } from '../common/Keys'

import { } from 'react'

// import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetworkUtils from './NetworkUtills'
import ConstantsKeys from './ConstantsKeys'
import { AuthContext } from '../common/context'

const baseURL = ConstantsKeys.baseURL

async function postWithParamAndReturnTextFromApi(subUrl, param) {
  let fullUrl = `${baseURL}/${subUrl}`

  try {
    let response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })

    if (response.status == 200) {
      let responseJson = await response.json()
      return responseJson
    } else {
      let responseJson = {
        status: 'ServerError',
        responseCode: response.status,
        message:
          'Something went wrong server side so please try after some time. \n Server error code:' +
          response.status,
      }

      return responseJson
    }
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function getAPI(subUrl) {
  const isConnected = await NetworkUtils.isNetworkAvailable()

  if (isConnected == false) {
    let dictError = {
      status: 'false',
      message:
        'Your internet is not working. please check you internet connection',
    }
    return dictError
  }

  let fullUrl = `${baseURL}${subUrl}`

  console.log(fullUrl)

  try {
    let response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function getAPIAfterLogin(subUrl) {
  const isConnected = await NetworkUtils.isNetworkAvailable()
  if (isConnected == false) {
    let dictError = {
      status: 'false',
      message:
        'Your internet is not working. please check you internet connection',
    }
    return dictError
  }

  let fullUrl = `${baseURL}${subUrl}`

  console.log(fullUrl)

  try {
    const authToken = await AsyncStorage.getItem('token')
    if (authToken == 'undefined') {
      let dictError = {
        status: 'false',
        message: 'Your login session expired, please logout',
      }
      return dictError
    }
    console.log('Auth Token : ', authToken)
    let response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      },
    })
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.log("------getAPiatuer----------",error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function loginWithPost(subUrl, param) {
  let fullUrl = `${baseURL}${subUrl}`

  console.log(fullUrl)

  try {
    let response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // "Content-Type": "application/json",
        'Content-Type': 'multipart/form-data',
      },
      body: param,
    })
    console.log('response', response)
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function checkEmailWithPost(subUrl, param) {
  let fullUrl = `${baseURL}${subUrl}`

  console.log(fullUrl)

  try {
    let response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: param,
    })
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function postWithParam(subUrl, param, method = 'POST') {
  // console.log( "parammmmmmm::::::::",subUrl, param,)

  const isConnected = await NetworkUtils.isNetworkAvailable()

console.log("isConnected","djekhkene",isConnected)


  if (isConnected == false) {
    let dictError = {
      status: 'false',
      message:
        'Your internet is not working. please check you internet connection',
    }
    return dictError
  }
  let fullUrl = `${baseURL}${subUrl}`
  console.log('url:::', fullUrl)
  try {
    const authToken = await AsyncStorage.getItem('token')
    console.log(
      'sendingToken :::: authToken:authToken:authToken:authToken',
      authToken,
    )
    if (authToken == 'undefined') {
      let dictError = {
        status: 'false',
        message: 'Your login session expired, please logout',
      }
      return dictError
    }
    let response = await fetch(fullUrl, {
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: param,
    })
    console.log('responseberfor json', response)

    let responseJson = await response.json()


    console.log("----------responseJson-------,", responseJson)

    // if (responseJson.message == 'Unauthenticated.') {

    //   Alert.alert(
    //     "",
    //     'Your session has expired. Please login again',
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => {
    //           global.isUserIn = undefined
    //           global.isComingFromMapScreen = undefined
    //           global.isComingBackFromMapScreen = undefined
    //           global.isNavigatedToMapGlobal = undefined
    //           global.viewClientData = undefined
    //           global.userId = undefined
    //         }
    //       },
    //     ],
    //     { cancelable: false },
    //   );
    //   return
    // }

    return responseJson
  } catch (error) {
    console.log("error===", error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function postWithoutParam(subUrl, method = 'POST') {
  const isConnected = await NetworkUtils.isNetworkAvailable()

  if (isConnected == false) {
    let dictError = {
      status: 'false',
      message:
        'Your internet is not working. please check you internet connection',
    }
    return dictError
  }
  let fullUrl = `${baseURL}${subUrl}`
  console.log('url:::', fullUrl)
  try {
    const authToken = await AsyncStorage.getItem('token')
    console.log('sendingToken :::: authToken:::', authToken)
    if (authToken == 'undefined') {
      let dictError = {
        status: 'false',
        message: 'Your login session expired, please logout',
      }
      return dictError
    }
    let response = await fetch(fullUrl, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type':
          'multipart/form-data:boundary=---------------------------974767299852498929531610575',
        Authorization: `Bearer ${authToken}`,
      },
    })
    console.log(response)


    let responseJson = await response.json()

    console.log(responseJson)
    return responseJson
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

async function uploadedFile(subUrl, param) {
  const isConnected = await NetworkUtils.isNetworkAvailable()

  if (isConnected == false) {
    let dictError = {
      status: 'false',
      message:
        'Your internet is not working. please check you internet connection',
    }
    return dictError
  }
  let fullUrl = `${baseURL}${subUrl}`

  try {
    const authToken = await AsyncStorage.getItem('kAuthToken')
    if (authToken == 'undefined') {
      let dictError = {
        status: 'false',
        message: 'Your login session expired, please logout',
      }
      return dictError
    }
    let response = await fetch(fullUrl, {
      method: 'post',
      body: param,
      headers: {
        'Content-Type': 'multipart/form-data; ',
        Authorization: `Bearer ${authToken}`,
      },
    })
    let responseJson = await response.json()
    return responseJson
  } catch (error) {
    console.log(error)
    let dictError = {
      status: 'false',
      message: 'Something went wrong, please try after some time.',
    }
    return dictError
  }
}

export { getAPI }
export { getAPIAfterLogin }
export { loginWithPost }
export { checkEmailWithPost }
export { postWithParam }
export { uploadedFile }
export { postWithParamAndReturnTextFromApi }
export { postWithoutParam }
