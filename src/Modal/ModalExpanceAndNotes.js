import React, { useState } from 'react'
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  Modal,
} from 'react-native'
import { Colors } from '../common/Colors'
import { FontStyles } from '../common/FontStyle'
import Images from '../common/Images'
import ModalAddNotes from './ModalAddNotes'

const ModalExpanceAndNotes = props => {
  const { clientID, onPressCancel, navigation,clinetDetail,route } = props
  const [isModelPresented, setIsModelPresented] = useState(false)
  // const clientDetail = route.params.clientDetail
  console.log('clinetdata/////',clinetDetail)
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        fullScreen={false}
        visible={isModelPresented}>
        <ModalAddNotes
          onPressNotes={() => {
            setIsModelPresented(!isModelPresented)
          }}
          clientId={clientID}
          // clientName={clientName}
          // clientDetail={clientDetail}
        />
      </Modal>
      <TouchableOpacity activeOpacity={1} onPress={() => onPressCancel()}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setIsModelPresented(!isModelPresented)}
            style={styles.modalView}>
            <Image style={styles.notesImg} source={Images.addNotesIcon}></Image>
            <Text
              style={{
              ...FontStyles.fontMontserrat_Bold17,
                color: '#6E6B7B',
                marginTop: 18,
              }}>
              Add Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onPressCancel()
              navigation.navigate('AddExpense',{
                isFromNavigation: true,
                clientData: clinetDetail})
            }}
            style={styles.modalView}>
            <Image
              style={styles.expenseIcon}
              source={Images.addExpenseIcon}></Image>
            <Text
              style={{
                ...FontStyles.fontMontserrat_Bold17,
                color: '#6E6B7B',
                marginTop: 18,
              }}>
              Add Expense
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#00000095',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 144,
    width: '39%',
    margin: 10,
  },

  notesImg: {
    width: 33.67,
    height: 45,
    resizeMode: 'contain',
  },
  expenseIcon: {
    width: 33.67,
    height: 45,
    resizeMode: 'contain',
  },
})
export default ModalExpanceAndNotes
