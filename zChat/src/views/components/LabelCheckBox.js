import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export const LabelCheckBox = props => {
  let {
    style,
    label,
    rightCheckBoxName,
    rightValue,
    rightDisabled,
    rightOnValueChange,
    leftCheckBoxName,
    leftValue,
    leftDisabled,
    leftOnValueChange
  } = props;
  let {
    height,
    marginHorizontal,
    marginVertical,
    backgroundColor,
    borderRadius,
    ...restStyle
  } = style;
  let container = {
    ...styles.container,
    height,
    marginHorizontal,
    marginVertical,
    backgroundColor,
    borderRadius
  };
  return (
    <View style={container}>
      <View style={styles.label}>
        <Text style={{...restStyle}}>{label}</Text>
      </View>
      <View style={styles.checkbox}>
        <CheckBox
          value={leftValue}
          disabled={leftDisabled}
          onValueChange={leftOnValueChange}
        />
        <Text style={{...restStyle}}>{leftCheckBoxName}</Text>
      </View>
      <View style={styles.checkbox}>
        <CheckBox
          value={rightValue}
          disabled={rightDisabled}
          onValueChange={rightOnValueChange}
        />
        <Text style={{...restStyle}}>{rightCheckBoxName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    flex: 3,
    marginLeft: 10
  },
  checkbox: {
    flex: 3.5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
