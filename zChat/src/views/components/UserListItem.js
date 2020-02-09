import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export const UserListItem = props => {
  let {
    style,
    source,
    avatarStyle,
    title,
    titleStyle,
    subTitle,
    subTitleStyle
  } = props;
  let container = {
    ...styles.container,
    ...style
  };
  return (
    <View style={container}>
      <Image source={source} style={avatarStyle} />
      <View style={styles.titleArea}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={subTitleStyle}>{subTitle}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  titleArea: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginLeft: 15
  }
});
