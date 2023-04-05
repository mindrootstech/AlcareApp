import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Alert, ViewStyle, Linking, StyleSheet,SafeAreaView,StatusBar } from 'react-native';
import { Colors } from '../../common/Colors';
import WebView from 'react-native-webview';
import Loader from '../../network/Loader';
import CommonNavigationHeader from '../../Components/CommonNavigationHeader';
const Webview = ({ navigation, route }) => {

    const [isLoading, setLoading] = useState(false);

    let title = route.params?.Title

    useEffect(() => {
        setLoading(true)
    }, [])

    return (
        <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.colorBackgroundGray }}>
      {Platform.OS === 'ios' ? (
        <StatusBar translucent backgroundColor={Colors.colorBackgroundGray} />
      ) : (
        <StatusBar backgroundColor={Colors.colorBackgroundGray} />
      )}
        <View style={styles.mainContainer}>

            <CommonNavigationHeader
                navigationTitle={'Privacy Policy'}
                onPressButton={() => navigation.goBack()}
                showBackButton={true}
            />


            <View style={styles.container}>
                <WebView
                    showsVerticalScrollIndicator={false}
                    onLoadEnd={() => {
                        setLoading(false);
                    }}
                    source={{ uri: route.params?.Link }}
                />



            </View>
            <Loader isLoading={isLoading} />
        </View>
        </SafeAreaView>
    );
};
export default Webview
const styles = StyleSheet.create({
    container: {
        flex: 1,
    
    },
    mainContainer: {
        flex: 1,
        // backgroundColor: Colors.theamColor
    }
})
