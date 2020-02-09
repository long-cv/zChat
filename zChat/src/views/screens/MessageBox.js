import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {constants, msgEvent, actions, UserListItem} from '../../srcExports';

class MessageBox extends React.Component {
  constructor(props) {
    //console.log('MessageBox: constructor.');
    super(props);
    this.state = {
      conversationList: [],
      refresh: false
    };
  }
  componentDidMount() {
    //console.log('MessageBox: componentDidMount.');
    let {user, socketUpdate, navigation} = this.props;
    let socket = io(`${constants.HOST}:${constants.PORT}`, {forceNode:true});
    socketUpdate(socket);
    socket.on('connect', () => {
      console.log('user connected.');
    });
    socket.on('disconnect', reason => {
      console.log('user disconnected: ' + reason);
    });
    socket.emit(msgEvent.SUBSCRIBE, user._id);
    this.focusMessageBox = navigation.addListener('didFocus', async () => {
      try {
        let jwt = await AsyncStorage.getItem('jwt');
        let response = await axios({
          method: 'GET',
          url: constants.MESSAGE_GET_CONVERSATION_LIST,
          headers: {
            authorization: `Bearer ${jwt}`
          }
        });
        if (response.data.isOk) {
          this.setState({
            conversationList: response.data.conversationList,
            refresh: !this.refresh
          });
        }
      } catch(error) {
        // console.log(error);
      }
    });
    this.blurMessageBox = navigation.addListener('didBlur', () => {});
  }
  componentWillUnmount() {
    //console.log('MessageBox: componentWillUnmount.');
    this.focusMessageBox.remove();
    this.blurMessageBox.remove();
  }
  render() {
    let {conversationList, refresh} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={conversationList}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.onPressItem(item)}>
              <UserListItem
                style={styles.listItem}
                source={{
                  uri: `${constants.AVATAR_FOLDER}/${item.friend.avatar}`
                }}
                avatarStyle={styles.avatarStyle}
                title={item.friend.name}
                titleStyle={styles.titleItem}
                subTitle={item.message}
                subTitleStyle={styles.subTitleItem}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.conversationId}
          traData={refresh}
        />
      </View>
    );
  }
  onPressItem = async item => {
    let {navigation} = this.props;
    let friend = item.friend;
    try {
      let jwt = await AsyncStorage.getItem('jwt');
      let urlQuery = `isConversationId=1&id=${item.conversationId}`;
      let url = `${constants.MESSAGE_GET_CONVERSATION}?${urlQuery}`;
      let response = await axios({
        method: 'GET',
        url: url,
        headers: {
          authorization: `Bearer ${jwt}`
        }
      });
      if (response.data.isOk) {
        //console.log(response.data);
        let conversationId = item.conversationId;
        let messages = response.data.messages;
        navigation.navigate('messagesStack', {
          friend,
          conversationId,
          messages
        });
      } else {
        Alert.alert('Note', 'unable to chat now. Please try again.');
      }
    } catch(error) {
      //console.log(error);
      Alert.alert('Note', 'an error occurred. Please try again.');
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    backgroundColor: '#79edb9',
    marginVertical: 2
  },
  titleItem: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold'
  },
  subTitleItem: {
    color: 'grey',
    fontSize: 13,
    fontWeight: 'normal'
  },
  avatarStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10
  }
});

const mapStateToProps = state => {
  return {
    user: state.user,
    socket: state.socket
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({socketUpdate: actions.socketUpdate}, dispatch);
}
const MessageBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageBox);

export {MessageBoxContainer};
