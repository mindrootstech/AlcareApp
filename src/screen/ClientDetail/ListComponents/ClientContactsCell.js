import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native'
import { Colors } from '../../../common/Colors'
import { FontStyles } from '../../../common/FontStyle'
import { Shadow } from '../../../common/Shadow'
import ModalAddContactNote from '../../../Modal/ModalAddContactNote'

const ClientContactsCell = props => {
  const { infoDetail, clientId } = props
  const [isModelPresented, setIsModelPresented] = useState(false)

  console.log('infoDetail-----------', infoDetail)
  // {"contact_no": "1231231213", "created_at": "Nov 18 2022",
  // "designation": "ios", "email": "test@gmail.com", "id": 37,
  // "last_name": "test", "name": "Test"}

  return (
    <View style={styles.viewInfoParentStyle}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModelPresented}>
        <ModalAddContactNote
          onPressNotes={() => {
            setIsModelPresented(!isModelPresented)
          }}
          clientId={clientId}
          contactId={infoDetail.id}
        />
      </Modal>
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text style={styles.textInfoLightStyle}>First Name:</Text>
        <Text
          style={[styles.textInfoHeavyStyle, { flex: 1 }]}
          numberOfLines={2}>
          {infoDetail.name}
        </Text>
        <TouchableOpacity
          onPress={() => setIsModelPresented(!isModelPresented)}
          style={styles.btnStyle}>
          <Image
            style={[styles.imgBackBlueStyle]}
            source={require('../../../assets/addNoteContact.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12, marginRight: 2 }}>
        <Text style={styles.textInfoLightStyle}>Last Name:</Text>
        <Text style={styles.textInfoHeavyStyle} numberOfLines={2}>
          {infoDetail.last_name}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Text style={styles.textInfoLightStyle}>Phone Number:</Text>
        <Text style={styles.textInfoHeavyStyle}>{infoDetail.contact_no}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <Text style={styles.textInfoLightStyle}>
          Designation:
          <Text style={styles.textInfoHeavyStyle}>
            {' '}
            {infoDetail.designation}
          </Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewInfoParentStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 15,
    backgroundColor: Colors.colorLightSkyBlue,
    width: '98%',
    marginVertical: 15,
    marginLeft: '1%',
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
  btnStyle: {
    height: 35,
    width: 35,
    // backgroundColor: 'red',
    marginRight: -10,
    marginTop: -10,
    alignItems: 'flex-end',
  },
  imgBackBlueStyle: {
    height: 32,
    width: 32,
  },
})

export default ClientContactsCell
