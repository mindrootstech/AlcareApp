import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Colors } from '../../common/Colors'
import { FontStyles } from '../../common/FontStyle'
import CommonTickBox from '../../Components/CommonTickBox'

const AddAreaServices = (props) => {

    const {
        title,
        surfaceProducts = [],
        onPress,
        preferredProcedure = [],
        itemIndex,
        onPressProcedureTick,
        arrOfSelectedIndex = []

    } = props

    const numberOfColumbs = 2


    return (
        <View>

            {console.log("arrOfSelectedIndex--", arrOfSelectedIndex)}

            {surfaceProducts.length > 0 &&

                <View style={styles.chooseProducts}>
                    <Text style={styles.chooseProductTitle}>
                        Choose Products
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {
                            <FlatList
                                numColumns={numberOfColumbs}
                                showsVerticalScrollIndicator={false}
                                data={surfaceProducts}
                                renderItem={({ item, index }) => {
                                    let filter = arrOfSelectedIndex.filter(value => value == index)
                                    { console.log("filter--", filter) }
                                    var selected = filter.length > 0 ? true : false
                                    return (
                                        <View style={{
                                            width: "45%"
                                        }}>
                                            <CommonTickBox
                                                key={index}
                                                text={item}
                                                isChecked={selected}
                                                onPressTick={() => { onPress(index) }}
                                            />
                                        </View>
                                    );
                                }}
                            />
                        }
                    </View>
                </View>

            }

            {preferredProcedure.length > 0 &&

                <View style={[styles.chooseProducts, { marginBottom: 15 }]}>

                    <Text style={styles.chooseProductTitle}>
                        {title}
                    </Text>

                    <FlatList
                        // columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        data={preferredProcedure}
                        numColumns={2}
                        renderItem={({ item, index }) => {
                            return (

                                <View style={{
                                    width: "45%"
                                }}>

                                    <CommonTickBox
                                        text={item}
                                        isChecked={itemIndex == index ? true : false}
                                        onPressTick={() => { onPressProcedureTick(index) }}
                                    />

                                </View>

                            );
                        }}
                    />

                    {/* <View style={{ flexDirection: 'row' }}>
                        <CommonTickBox
                            text={preferredProcedure[0].productName}
                            isChecked={preferredProcedure[0].isChecked}
                            onPressTick={() => { onPressProcedureTick(0) }}
                        />
                        <CommonTickBox
                            containerStyle={{ marginLeft: 46 }}
                            text={preferredProcedure[1].productName}
                            isChecked={preferredProcedure[1].isChecked}
                            onPressTick={() => { onPressProcedureTick(1) }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <CommonTickBox
                            text={preferredProcedure[2].productName}
                            isChecked={preferredProcedure[2].isChecked}
                            onPressTick={() => { onPressProcedureTick(2) }}
                        />

                        <CommonTickBox
                            containerStyle={{ marginLeft: 89 }}
                            text={preferredProcedure[3].productName}
                            isChecked={preferredProcedure[3].isChecked}
                            onPressTick={() => { onPressProcedureTick(3) }}
                        />
                    </View> */}
                </View>

            }




        </View>
    )
}

export default AddAreaServices

const styles = StyleSheet.create({

    chooseProducts: {

        backgroundColor: Colors.white,
        opacity: 0.7,
        borderRadius: 5,
        marginTop: 20,
        padding: 11
    },
    chooseProductTitle: {
        color: Colors.colorDarkGray,
        ...FontStyles.fontMontserrat_semibold14

    }


});