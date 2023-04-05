import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';


const CommonBackBlueButton = (props) => {

    const { manualButtonStyle, onPressButton, disable = false, opacity = 1 } = props;

    return (
        <TouchableOpacity
            onPress={onPressButton}
            disabled={disable}
            style={[styles.btnStyle, manualButtonStyle]}
        >
            <Image style={[styles.imgBackBlueStyle, { opacity: opacity }]} source={require('../assets/backBlue.png')} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 35,
        width: 35,
        
    },
    imgBackBlueStyle: {
        height: 32,
        width: 32
    }
})

export default CommonBackBlueButton






