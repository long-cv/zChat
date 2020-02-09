import React from 'react';
import {View, Text} from 'react-native';

export const MessageListItem = props => {
  let {message, msgContainerStyle, bgStyle, msgStyle} = props;
  return (
    <View style={msgContainerStyle}>
      <View style={bgStyle}>
        <Text style={msgStyle}>{message}</Text>
      </View>
    </View>
  );
};
