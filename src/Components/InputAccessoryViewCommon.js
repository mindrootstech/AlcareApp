import React from "react";
import {
  Text,
  InputAccessoryView,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Keyboard } from "react-native";
import { Colors } from "../common/Colors";
import { FontStyles } from "../common/FontStyle";

const windowWidth = Dimensions.get("window").width;

const InputAccessoryViewCommon = (props) => {
  const { inputAccessoryViewID } = props;

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.viewInputAccessory}>
        <TouchableOpacity
          style={styles.btnInputAccessory}
          onPress={() => Keyboard.dismiss()}
        >
          <Text style={styles.textDone}>Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
};

const styles = StyleSheet.create({
  viewInputAccessory: {
    width: windowWidth,
    backgroundColor: Colors.colorBackgroundGray,
    alignItems: "flex-end",
  },
  btnInputAccessory: {
    height: 40,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  textDone: {
    color: '#0e53c2',
    ...FontStyles.fontMontserrat_Medium15,
    fontWeight:"600",
    fontSize:16
    
  },
});

export default InputAccessoryViewCommon;
