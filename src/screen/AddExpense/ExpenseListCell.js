import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native'
import { FontStyles } from '../../common/FontStyle'
import { Colors } from '../../common/Colors'
import { Shadow } from '../../common/Shadow'
import ModalImage from '../../Modal/ModalImage'

const ExpenseListCell = props => {
  const { infoDetail, arrImages } = props
  console.log('infoDetail====', infoDetail)
  const [isModelPresented, setIsModelPresented] = useState(false)
  return (
    <View style={styles.viewInfoParentStyle}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModelPresented}>
        <ModalImage
          arrImage={arrImages}
          onPressNotes={() => {
            setIsModelPresented(!isModelPresented)
          }}
        />
      </Modal>

      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text style={styles.textInfoLightStyle}>Expense Type:</Text>
        <Text
          style={[styles.textInfoHeavyStyle, { flex: 1 }]}
          numberOfLines={2}>
          {infoDetail.expense_type}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12, marginRight: 2 }}>
        <Text style={styles.textInfoLightStyle}>Expense Category:</Text>
        <Text style={styles.textInfoHeavyStyle} numberOfLines={2}>
          {infoDetail.expense_category}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Text style={styles.textInfoLightStyle}>Expense Amount:</Text>
        <Text style={styles.textInfoHeavyStyle}>
          {infoDetail.expense_amount}
        </Text>
      </View>

      {arrImages.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text style={styles.textInfoLightStyle}>
              Images:
              {/* <Text style={styles.textInfoHeavyStyle}> {infoDetail.expense_amount}</Text> */}
            </Text>
          </View>

          <FlatList
            style={{ width: '100%' }}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            data={arrImages}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsModelPresented(!isModelPresented)
                  }}>
                  <Image style={styles.imgSampleStyle} source={{ uri: item }} />
                </TouchableOpacity>
              )
            }}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewInfoParentStyle: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 15,
    backgroundColor: Colors.white,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    ...Shadow,
  },
  textInfoLightStyle: {
    color: Colors.colorDarkGray,
    marginRight: 10,
    ...FontStyles.fontMontserrat_Regular15,
  },
  textInfoHeavyStyle: {
    flex: 1,
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_Bold16,
  },
  imgSampleStyle: {
    height: 44,
    width: 65,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 3,
    marginRight: 10,
  },
})

export default ExpenseListCell
