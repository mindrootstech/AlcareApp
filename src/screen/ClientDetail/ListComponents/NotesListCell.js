import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Colors } from '../../../common/Colors'
import ModalImage from '../../../Modal/ModalImage'
import { FontStyles } from '../../../common/FontStyle'
import { Shadow } from '../../../common/Shadow'

const NotesListCell = props => {
  const { noteDetail } = props

  const [isModelPresented, setIsModelPresented] = useState(false)

  return (
    <View style={{ padding: 4 }}>
      <View style={styles.viewParentStyle}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModelPresented}>
          <ModalImage
            arrImage={noteDetail.image}
            onPressNotes={() => {
              setIsModelPresented(!isModelPresented)
            }}
          />
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Text style={styles.textInfoHeavyStyle}>{noteDetail.created_by}</Text>
          <Text style={styles.textInfoLightStyle}>
            {noteDetail.site == 1 ? 'Onsite' : 'Offsite'}
          </Text>
        </View>
        <Text style={styles.textNotesStyle}>{noteDetail.note}</Text>

        {noteDetail.image.length > 0 && (
          <FlatList
            style={{ width: '100%' }}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            data={noteDetail.image}
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
        )}

        <Text style={[styles.textInfoLightStyle, { alignSelf: 'flex-end' }]}>
          {noteDetail.created_at}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewParentStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 15,
    backgroundColor: Colors.colorLightSkyBlue,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    ...Shadow,
  },
  textInfoLightStyle: {
    color: Colors.colorDarkGray,
    marginRight: 10,
    ...FontStyles.fontMontserrat_Medium11,
  },
  textInfoHeavyStyle: {
    color: Colors.colorDarkGray,
    ...FontStyles.fontMontserrat_semibold15,
  },
  textNotesStyle: {
    color: Colors.colorDarkGray,
    marginTop: 10,
    ...FontStyles.fontMontserrat_Regular15,
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

export default NotesListCell
