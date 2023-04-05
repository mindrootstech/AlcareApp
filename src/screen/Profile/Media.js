import {
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  StatusBar,
  Text,
  Platform,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { FontStyles } from '../../common/FontStyle'
import { Colors } from '../../common/Colors'
import { media_url } from '../../network/Urls'
import { getAPIAfterLogin } from '../../network'
import Loader from '../../network/Loader'
import { Thumbnail } from 'react-native-thumbnail-video'
import { Shadow } from '../../common/Shadow'
import RNFetchBlob from 'rn-fetch-blob'

const Media = ({ navigation }) => {
  const DATA = [
    { icon: require('../../assets/mediaBG.png') },
    { icon: require('../../assets/mediaBG.png') },
    { icon: require('../../assets/mediaBG.png') },
    { icon: require('../../assets/mediaBG.png') },
  ]

  let [apiResponce_Media, setApiResponce_Media] = useState({})

  const [isShownLoader, setShownLoader] = useState(false)

  let [downloaded, setisdownloaded] = useState(true)

  useEffect(() => {
    apiMedia()
  }, [])

  const redirectURL = index => {
    Linking.openURL(apiResponce_Media[index].url)
  }

  const apiMedia = async () => {
    setShownLoader(true)

    const response = await getAPIAfterLogin(media_url)

    console.log('response1', response)

    if (response.status == true) {
      setShownLoader(false)
      setApiResponce_Media(response.data.media)
      console.log('success======', apiResponce_Media)
    } else {
      setShownLoader(false)
      Alert.alert('', response.message)
    }
  }

  const actualDownload = item => {
    console.log('=========--------item.document', item)

    const { dirs } = RNFetchBlob.fs
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const url = item.document

    const fileExt = item.extension.extension
    const docName = `${item.name}.${item.extension.extension}`

    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: docName,
      path: `${dirToSave}/${docName}`,
    }
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: fileExt,
      },
      android: {
        fileCache: true,
        addAndroidDownloads: configfb,
      },
    })

    RNFetchBlob.config(configOptions)
      .fetch('GET', url, {})
      .then(res => {
        if (Platform.OS === 'ios') {
          // RNFetchBlob.fs.createFile(res.path(), 'base64')
          setShownLoader(false)
          RNFetchBlob.ios.previewDocument(res.path())
        } else {
          setShownLoader(false)
          alert(`${docName} downloaded successfully`)
        }
        console.log('The file saved to ', res.path())
      })
      .catch(e => {
        setShownLoader(false)
        alert('Something went wrong, please try after some time')
        console.log(e)
      })
  }

  const downloadFile = async item => {
    if (Platform.OS == 'ios') {
      setShownLoader(true)
      actualDownload(item)
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setShownLoader(true)
          actualDownload(item)
        } else {
          Alert.alert(
            'Permission Denied!',
            'You need to give storage permission to download the file',
          )
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  const onPressMediaCell = (isYoutube, item, index) => {
    if (isYoutube) {
      console.log(apiResponce_Media[index].youtubelink)
      Linking.openURL(apiResponce_Media[index].youtubelink)
    } else {
      downloadFile(item)
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
      <View style={styles.MainViewContainer}>
        <CommonNavigationHeader
          navigationTitle={'Media'}
          onPressButton={() => navigation.goBack()}
          showBackButton={true}
        />

        {apiResponce_Media != undefined && apiResponce_Media.length == 0 && (
          <View style={styles.viewStyleNoData}>
            <Image
              style={styles.imageNoData}
              source={require('../../assets/noMedia.png')}
            />
            <Text
              style={{
                color: Colors.colorDarkBlue,
                ...FontStyles.fontMontserrat_Regular12,
              }}>
              No Media Found
            </Text>
          </View>
        )}
        <View style={styles.FlatListView}>
          <FlatList
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={apiResponce_Media}
            numColumns={2}
            renderItem={({ item, index }) => {
              console.log(
                '-----=========apiResponce_Media[index]youtubelink',
                apiResponce_Media[index].youtubelink,
              )
              const isYouTubeLink =
                apiResponce_Media[index].youtubelink != 'null' ? true : false

              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onPressMediaCell(isYouTubeLink, item, index)}
                  style={styles.Card}>
                  {isYouTubeLink ? (
                    <Thumbnail
                      style={{ height: '100%', width: '100%', borderRadius: 6 }}
                      url={apiResponce_Media[index].youtubelink}
                      showPlayIcon={true}
                      onPress={() => {
                        Linking.openURL(apiResponce_Media[index].youtubelink)
                      }}
                    />
                  ) : (
                    <View style={{ flex: 1 }}>
                      <Image
                        style={styles.imgDocStyle}
                        source={require('../../assets/Doc.png')}
                      />
                      <Text style={styles.textDocNameStyle}>
                        {item.name}.{item.extension.extension}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
      <Loader isLoading={isShownLoader} />
    </SafeAreaView>
  )
}

export default Media

const styles = StyleSheet.create({
  MainViewContainer: {
    flex: 1,
    backgroundColor: Colors.colorBackgroundGray,
  },

  FlatListView: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  Card: {
    backgroundColor: 'white',
    height: 130,
    borderRadius: 6,
    margin: 5,
    width: '47%',
    marginBottom: 15,
    padding: 8,
    ...Shadow,
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
  },
  imgDocStyle: {
    height: 36,
    width: 26,
    marginTop: 28,
    alignSelf: 'center',
    borderRadius: 6,
  },
  textDocNameStyle: {
    marginTop: 10,
    alignSelf: 'center',
  },
})

// export const downloadFile = async (file: GenericFile) => {
//   const signalError = () => {
//     showMessage(i18n.t('file_download_failed'), colors.RED);
//   };

//   const signalSuccess = () => {
//     showMessage(i18n.t('file_download_success'), colors.GREEN);
//   };

//   const downloadUrl = await buildDownloadUrl(file);

//   try {
//     const {
//       dirs: { DownloadDir, DocumentDir },
//     } = RNFetchBlob.fs;
//     const isIOS = Platform.OS === 'ios';
//     const directoryPath = Platform.select({
//       ios: DocumentDir,
//       android: DownloadDir,
//     });
//     const filePath = `${directoryPath}/${file.name}`;
//     const fileExt = file.ext;
//     var mimeType = '';

//     if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
//       mimeType = 'image/*';
//     }
//     if (fileExt === 'pdf') {
//       mimeType = 'application/pdf';
//     }
//     if (fileExt === 'avi' || fileExt === 'mp4' || fileExt === 'mov') {
//       mimeType = 'video/*';
//     }

//     const configOptions = Platform.select({
//       ios: {
//         fileCache: true,
//         path: filePath,
//         appendExt: fileExt,
//         notification: true,
//       },
//       android: {
//         fileCache: true,
//         appendExt: fileExt,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           mime: mimeType,
//           title: file.name,
//           mediaScannable: true,
//           notification: true,
//         },
//       },
//     });

//     RNFetchBlob.config(configOptions as RNFetchBlobConfig)
//       .fetch('GET', downloadUrl)
//       .then((resp) => {
//         console.log(resp);
//         signalSuccess();
//         if (isIOS) {
//           RNFetchBlob.ios.openDocument(resp.data);
//         }
//       })
//       .catch((e) => {
//         signalError();
//         console.log('fetch error: ', e);
//       });
//   } catch (error) {
//     console.log('general error: ', error);
//   }
// };

// const historyDownload = () => {
//   //Function to check the platform
//   //If iOS the start downloading
//   //If Android then ask for runtime permission
//   if (Platform.OS === 'ios') {
//     downloadHistory()
//   } else {
//     try {
//       PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'storage title',
//           message: 'storage_permission',
//         },
//       ).then(granted => {
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           //Once user grant the permission start downloading
//           console.log('Storage Permission Granted.')
//           downloadHistory()
//         } else {
//           //If permission denied then show alert 'Storage Permission
//           // Not Granted'
//           Alert.alert('storage_permission')
//         }
//       })
//     } catch (err) {
//       //To handle permission related issue
//       console.log('error', err)
//     }
//   }
// }

// const downloadHistory = async () => {
//   const { config, fs } = RNFetchBlob
//   let PictureDir = fs.dirs.PictureDir
//   let date = new Date()
//   let options = {
//     fileCache: true,
//     addAndroidDownloads: {
//       //Related to the Android only
//       useDownloadManager: true,
//       notification: true,
//       path: 'http://www.africau.edu/images/default/sample.pdf',
//       description: 'Risk Report Download',
//     },
//   }
//   config(options)
//     .fetch('GET', url)
//     .then(res => {
//       //Showing alert after successful downloading
//       console.log('res -> ', JSON.stringify(res))
//       alert('Report Downloaded Successfully.')
//     })
// }

// const downloadFile = async () => {
//   const file = 'http://www.africau.edu/images/default/sample.pdf'
//   const signalError = () => {
//     showMessage(i18n.t('file_download_failed'), colors.RED)
//   }

//   const signalSuccess = () => {
//     showMessage(i18n.t('file_download_success'), colors.GREEN)
//   }

//   const downloadUrl = await buildDownloadUrl(file)

//   try {
//     const {
//       dirs: { DownloadDir, DocumentDir },
//     } = RNFetchBlob.fs
//     const isIOS = Platform.OS === 'ios'
//     const directoryPath = Platform.select({
//       ios: DocumentDir,
//       android: DownloadDir,
//     })
//     const filePath = `${directoryPath}/${file.name}`
//     const fileExt = file.ext
//     var mimeType = ''

//     if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
//       mimeType = 'image/*'
//     }
//     if (fileExt === 'pdf') {
//       mimeType = 'application/pdf'
//     }
//     if (fileExt === 'avi' || fileExt === 'mp4' || fileExt === 'mov') {
//       mimeType = 'video/*'
//     }

//     const configOptions = Platform.select({
//       ios: {
//         fileCache: true,
//         path: filePath,
//         appendExt: fileExt,
//         notification: true,
//       },
//       android: {
//         fileCache: true,
//         appendExt: fileExt,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           mime: mimeType,
//           title: file.name,
//           mediaScannable: true,
//           notification: true,
//         },
//       },
//     })

//     RNFetchBlob.config(configOptions)
//       .fetch('GET', downloadUrl)
//       .then(resp => {
//         console.log(resp)
//         signalSuccess()
//         if (isIOS) {
//           RNFetchBlob.ios.openDocument(resp.data)
//         }
//       })
//       .catch(e => {
//         signalError()
//         console.log('fetch error: ', e)
//       })
//   } catch (error) {
//     console.log('general error: ', error)
//   }
// }

// const permissionFunc = async () => {
//   if (Platform.OS == 'ios') {
//     actualDownload()
//   } else {
//     if (downloaded) {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         )
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           actualDownload()
//         } else {
//           showSnackbar(
//             'You need to give storage permission to download the file',
//           )
//         }
//       } catch (err) {
//         console.warn(err)
//       }
//     } else {
//       showSnackbar('File is already downloaded.')
//     }
//   }
// }

// const actualDownload = () => {
//   const { dirs } = RNFetchBlob.fs
//   const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
//   const configfb = {
//     fileCache: true,
//     useDownloadManager: true,
//     notification: true,
//     mediaScannable: true,
//     title: 'pdfInfo.pdf',
//     path: `${dirToSave}/${'pdfInfo.pdf'}`,
//   }
//   const configOptions = Platform.select({
//     ios: {
//       fileCache: configfb.fileCache,
//       title: configfb.title,
//       path: configfb.path,
//       appendExt: 'pdf',
//     },
//     android: configfb,
//   })

//   console.log('The file saved to 23233', configfb, dirs)

//   RNFetchBlob.config(configOptions)
//     .fetch(
//       'GET',
//       `https://aquatherm.s3.ap-south-1.amazonaws.com/pdfs/${'pdfInfo.pdf'}`,
//       {},
//     )
//     .then(res => {
//       if (Platform.OS === 'ios') {
//         RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64')
//         RNFetchBlob.ios.previewDocument(configfb.path)
//       }
//       setisdownloaded(false)
//       if (Platform.OS == 'android') {
//         showSnackbar('File downloaded')
//       }
//       console.log('The file saved to ', res)
//     })
//     .catch(e => {
//       setisdownloaded(true)
//       showSnackbar(e.message)
//       console.log('The file saved to ERROR', e.message)
//     })
// }

//before=======================================
// RNFetchBlob.config({
//   fileCache: true,
//   addAndroidDownloads: {
//     useDownloadManager: true,
//     notification: true,
//     mediaScannable: true,
//     title: `test.pdf`,
//     path: `${dirToSave}/test.pdf`,
//   },
// })
//   .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf', {})
//   .then(res => {
//     if (Platform.OS === 'ios') {
//       // RNFetchBlob.fs.writeFile(res.data, 'base64')
//       // RNFetchBlob.ios.previewDocument(res.path())
//     }
//     console.log('The file saved to ', res.path())
//   })
//   .catch(e => {
//     console.log(e)
//   })

// const configOptions = Platform.select({
//   ios: {
//     fileCache: true,
//     path: `${dirToSave}/test.pdf`,
//     appendExt: fileExt,
//     notification: true,
//   },
//   android: {
//     fileCache: true,
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       notification: true,
//       mediaScannable: true,
//       title: `test.pdf`,
//       path: `${dirToSave}/test.pdf`,
//     },
//   },
// })

// RNFetchBlob.config(configOptions)
//   .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf', {})
//   .then(res => {
//     if (Platform.OS === 'ios') {
//       // RNFetchBlob.fs.writeFile(res.data, 'base64')
//       // RNFetchBlob.ios.previewDocument(res.path())
//     }
//     console.log('The file saved to ', res.path())
//   })
//   .catch(e => {
//     console.log(e)
//   })

// const { dirs } = RNFetchBlob.fs
// const dirToSave =
//   Platform.OS == 'ios' ? dirs.MainBundleDir : dirs.DownloadDir
// console.log('=========---------dirToSave', dirToSave)
// const {
//   dirs: { DownloadDir, DocumentDir },
// } = RNFetchBlob.fs
// const isIOS = Platform.OS === 'ios'
// const dirToSave = Platform.select({
//   ios: DocumentDir,
//   android: DownloadDir,
// })
