import React from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
  UserListItem,
  constants,
  actions,
  msgEvent,
  conversationType
} from '../../srcExports';

class Friends extends React.Component {
  constructor(props) {
    super(props);
    let friendList = this.props.navigation.getParam('friendList');
    this.props.userFriendList(friendList);
  }
  static navigationOptions = () => {
    return {
      tabBarOnPress: async ({navigation, defaultHandler}) => {
        try {
          let jwt = await AsyncStorage.getItem('jwt');
          let response = await axios({
            method: 'GET',
            url: constants.USER_USER_LIST,
            headers: {
              authorization: `Bearer ${jwt}`
            }
          });
          navigation.setParams({friendList: response.data.userList});
        } catch(error) {
          // console.log(error);
        }
        defaultHandler();
      }
    };
  };
  render() {
    let {friendList} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={friendList}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.onPressItem(item)}>
              <UserListItem
                style={styles.listItem}
                source={{uri: `${constants.AVATAR_FOLDER}/${item.avatar}`}}
                avatarStyle={styles.avatarStyle}
                title={item.name}
                titleStyle={styles.titleItem}
                subTitle={item.email}
                subTitleStyle={styles.subTitleItem}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item._id}
        />
      </View>
    );
  }
  onPressItem = async item => {
    let {navigation, socket} = this.props;
    let friend = item;
    try {
      let jwt = await AsyncStorage.getItem('jwt');
      let urlQuery = `isConversationId=0&id=${friend._id}&type=${conversationType.PRIVATE}`;
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
        let conversationId = response.data.conversation;
        let messages = response.data.messages;
        socket.emit(msgEvent.SUBSCRIBE, conversationId);
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
    friendList: state.friendList,
    socket: state.socket
  };
};
const mapDispatchToState = dispatch => {
  return bindActionCreators({userFriendList: actions.userFriendList}, dispatch);
};
const FriendsContainer = connect(
  mapStateToProps,
  mapDispatchToState
)(Friends);

export {FriendsContainer};
