import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Alert,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native'
import { Colors } from '../../common/Colors'
import CommonNavigationHeader from '../../Components/CommonNavigationHeader'
import { getExpense } from '../../network/Urls'
import Loader from '../../network/Loader'
import { postWithParam } from '../../network'
import { FontStyles } from '../../common/FontStyle'
import ExpenseListCell from './ExpenseListCell'
import { useIsFocused } from '@react-navigation/native'

const ExpenseList = ({ route, navigation }) => {
    const useFocused = useIsFocused()
    const [isShownLoader, setShownLoader] = useState(false)
    const [arrExpense, setExpenseArray] = useState([])
    const [isResponseGet, setResponseGet] = useState(false)
    useEffect(() => {
        console.log('sdfsd')
        apiGetExpense()
    }, [useFocused])

    const apiGetExpense = async () => {
        setShownLoader(true)
        const response = await postWithParam(getExpense)
        console.log('response1:::::::::::', response)
        if (response.status == true) {
            setExpenseArray(response.expense)
            setShownLoader(false)
            setResponseGet(true)
        } else {
            setShownLoader(false)
            Alert.alert('', response.message)
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
            <CommonNavigationHeader
                navigationTitle={"Expenses"}
                showBackButton={true}
                showPlusIcon={true}
                showRightButton={true}
                onPressButton={() => navigation.goBack()}
                onPressRightButton={() => navigation.navigate("AddExpense")}
            />
            
            {arrExpense.length == 0 && isResponseGet == true && isShownLoader == false &&
                <View style={styles.viewStyleNoData}>
                    <Image
                        style={styles.imageNoData}
                        source={require('../../assets/noExpense.png')}
                    />
                    <Text
                        style={{
                            color: Colors.colorDarkBlue,
                            ...FontStyles.fontMontserrat_SemiBold13,
                        }}>
                        No Expenses
                    </Text>
                    <Text
                        style={{
                            color: Colors.colorDarkGray,
                            ...FontStyles.fontMontserrat_Regular14,
                            marginTop: 5
                        }}>
                        You have not added any expense yet.
                    </Text>
                </View>
            }

            <ScrollView>
                {arrExpense.length > 0 && arrExpense != undefined &&
                    arrExpense.map((x) => {
                        return (
                            <View>
                                <ExpenseListCell
                                    infoDetail={x}
                                    arrImages={x.image}
                                />
                            </View>
                        )

                    })


                }
            </ScrollView>
            <Loader isLoading={isShownLoader} />
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        paddingHorizontal: 20,
    },
    btnBackStyle: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 26,
    },
    btnLenceStyle: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    btnInfoStyle: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 26,
    },

    btnMoveStyle: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgLenceStyle: {
        height: 18,
        width: 18,
    },
    imgMoveForwardStyle: {
        alignSelf: 'center',
        height: 18,
        width: 18,
    },
    imgBackStyle: {
        alignSelf: 'center',
        height: 13,
        width: 21,
    },
    textRecentReportStyle: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: '400',
        color: 'black',
    },
    textInfoAreaNotesStyle: {
        fontWeight: '400',
        color: Colors.colorDarkGray,
    },
    viewStyleNoData: {
        width: '100%',
        marginTop: 120,
        alignItems: 'center',
    },
    imageNoData: {
        height: 170,
        width: 269,
        marginBottom: 15,
        resizeMode: 'stretch',
    },
    imageNoNotesData: {
        height: 170,
        width: 194,
        marginBottom: 15,
        resizeMode: 'stretch',
    },
    btnAddNoteStyle: {
        marginTop: 20,
        width: '50%',
        alignSelf: 'center',
    },
    txtContacts: {
        color: Colors.navigationTitle,
        ...FontStyles.fontMontserrat_Bold17,
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
    imgAddBtn: {
        height: 16,
        width: 16,
    },
})

export default ExpenseList