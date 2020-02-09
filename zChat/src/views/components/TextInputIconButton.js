import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

export const TextInputIconButton = props => {
  let {style, iconName, iconSize, iconColor, onPress, ...restProps} = props;
  let {
    height,
    marginHorizontal,
    marginVertical,
    backgroundColor,
    borderRadius,
    ...restStyle
  } = style;
  let viewStyle = {
    ...styles.container,
    height,
    marginHorizontal,
    marginVertical,
    backgroundColor,
    borderRadius
  };
  let inputStyle = {
    ...styles.input,
    height,
    ...restStyle
  };
  return (
    <View style={viewStyle}>
      <TextInput style={inputStyle} {...restProps} />
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Ionicon name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 9
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
