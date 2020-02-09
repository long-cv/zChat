import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import DatePicker from 'react-native-date-picker';

export const DateTimePicker = props => {
  let {style, onPress, ...restProps} = props;
  let {color, textAlign, fontSize, fontWeight, ...restStyle} = style;
  let dp = {
    alignItems: 'center'
  };
  let btn = {
    backgroundColor: '#057ee8'
  }
  let txtBtn = {
    color,
    textAlign,
    fontSize,
    fontWeight
  };
  return (
    <View style={{...restStyle}}>
      <View style={dp}>
        <DatePicker {...restProps} />
      </View>
      <TouchableHighlight style={btn} onPress={onPress}>
        <Text style={txtBtn}>OK</Text>
      </TouchableHighlight>
    </View>
  );
};
