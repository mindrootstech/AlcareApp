import { StyleSheet } from 'react-native'
import { Fonts } from './Fonts'
import { Colors } from './Colors'

import { Dimensions } from 'react-native'

const { width, fontScale } = Dimensions.get('window')

export const FontStyles = StyleSheet.create({
  //Light Fonts
  fontMontserrat_Normal12: { fontFamily: Fonts.Montserrat_Light, fontSize: 12 },
  fontMontserrat_Normal13: { fontFamily: Fonts.Montserrat_Light, fontSize: 13 },

  fontMontserrat_Normal14: { fontFamily: Fonts.Montserrat_Light, fontSize: 14 },
  fontMontserrat_Normal15: { fontFamily: Fonts.Montserrat_Light, fontSize: 15 },

  fontMontserrat_Light22: { fontFamily: Fonts.Montserrat_Light, fontSize: 22 },
  fontMontserrat_Light23: { fontFamily: Fonts.Montserrat_Light, fontSize: 23 },

  //Regular Fonts
  fontMontserrat_Regular10: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 10,
  },
  fontMontserrat_Regular11: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 11,
  },
  fontMontserrat_Regular12: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 12,
  },
  fontMontserrat_Regular13: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 13,
    // color:Colors.navigationTitle
  },
  fontMontserrat_Regular14: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 14,
  },
  fontMontserrat_Regular15: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 15,
  },
  fontMontserrat_Regular16: {
    fontFamily: Fonts.Montserrat_Regular,
    fontSize: 16,
  },

  //Medium Fonts
  fontMontserrat_Medium14: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 14,
  },
  fontMontserrat_Medium15: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 15,
  },
  fontMontserrat_Medium16: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 16,
  },
  fontMontserrat_Medium17: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 17,
  },
  fontMontserrat_Medium18: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 18,
  },
  fontMontserrat_Medium11: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 11,
  },
  fontMontserrat_Medium12: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 12,
  },
  fontMontserrat_Medium13: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 13,
  },
  fontMontserrat_Medium10: {
    fontFamily: Fonts.Montserrat_Medium,
    fontSize: 10,
  },

  //SemiBold Fonts
  fontMontserrat_semibold11: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 11,
  },
  fontMontserrat_semibold14: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 14,
  },
  fontMontserrat_semibold15: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 15,
  },
  fontMontserrat_semibold16: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 16,
  },
  fontMontserrat_semibold17: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 17,
  },

  fontMontserrat_SemiBold9: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 9,
  },
  fontMontserrat_SemiBold10: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 10,
  },
  fontMontserrat_SemiBold12: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 12,
  },
  fontMontserrat_SemiBold13: {
    fontFamily: Fonts.Montserrat_semiBold,
    fontSize: 13,
  },

  //Bold Fonts
  fontMontserrat_Bold15: { fontFamily: Fonts.Montserrat_Bold, fontSize: 15 },
  fontMontserrat_Bold16: { fontFamily: Fonts.Montserrat_Bold, fontSize: 16 },

  fontMontserrat_Bold17: { fontFamily: Fonts.Montserrat_Bold, fontSize: 17 },
  fontMontserrat_Bold18: { fontFamily: Fonts.Montserrat_Bold, fontSize: 18 },
  fontMontserrat_Bold19: { fontFamily: Fonts.Montserrat_Bold, fontSize: 19 },

  fontMontserrat_Bold22: { fontFamily: Fonts.Montserrat_Bold, fontSize: 22 },
  fontMontserrat_Bold23: { fontFamily: Fonts.Montserrat_Bold, fontSize: 23 },

  fontMontserrat_Bold12: { fontFamily: Fonts.Montserrat_Bold, fontSize: 12 },
  fontMontserrat_Bold13: { fontFamily: Fonts.Montserrat_Bold, fontSize: 13 },
})
