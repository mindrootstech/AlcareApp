// import { StyleSheet, Text, View ,Image} from 'react-native'
// import React from 'react'
// import Images from '../common/Images'
// import { FontStyles } from '../common/FontStyle'

// export default function EmptyNotify(){

//   return (
//     <View style={[styles.container,]}>
//      <Image source={Images.noNotifyImg} style={styles.img}></Image>
//      <Text style={styles.text}>No Notification Yet</Text>
//     <View style={{width:210}}> 
//          <Text style={styles.text2}>When you get notification,they’ll</Text>
//          <Text style={styles.text3}> shown up here.</Text>
                
//  </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         justifyContent:'center',
//         alignItems:'center',
//         backgroundColor:'white'
//     },
//     img:{
//         width:200,
//         height:200
//     },
//     text:{
//         marginTop:15,
//         color: '#006D9B',
//         // ...FontStyles.fontMontserrat_bold11
//         fontWeight:'400'
//     },
//     text2:{
//         marginTop:10,
//         color:'gray',
//         fontWeight:'400'
//     },
//     text3:{
//         color:'gray',
//         marginLeft:50,
//         fontWeight:'400'
//     }
// })


import React, { Component } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import  NetInfo from "@react-native-community/netinfo";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  CheckConnectivity = () => {
    // For Android devices
    if (Platform.OS === "android") {
     
      NetInfo.fetch().then(state => {
        const isConnected = state.isConnected
        if (isConnected) {
            Alert.alert("You are online!");
          } else {
            Alert.alert("You are offline!");
          }
      });
    } else {
      // For iOS devices
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    }
  };

  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      Alert.alert("You are offline!");
    } else {
      Alert.alert("You are online!");
    }
  };

  render() {
    return (
      <View style={{alignItems:'center',justifyContent:'center',marginTop:200}}>
        <Button
          onPress={() => this.CheckConnectivity()}
          title="Check Internet Connectivity"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}