import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export const LabelTextInput = props => {
  let {style, labelText, contentText, ...restProps} = props;
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
  let txtInput = {
    ...styles.content,
    height,
    ...restStyle
  };
  return (
    <View style={container}>
      <View style={styles.label}>
        <Text style={{...restStyle}}>{labelText}</Text>
      </View>
      <TextInput style={txtInput} {...restProps} />
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
    marginLeft: 10,
    justifyContent: 'center'
  },
  content: {
    flex: 7
  }
});
