import React from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import {
  constants,
  msgEvent,
  TextInputIconButton,
  MessageListItem,
  UserListItem
} from '../../srcExports';

class Messages extends React.Component {
  static navigationOptions = ({navigation}) => {
    let friend = navigation.getParam('friend');
    return {
      headerTitle: () => (
        <UserListItem
          source={{uri: `${constants.AVATAR_FOLDER}/${friend.avatar}`}}
          avatarStyle={styles.avatarStyle}
          title={friend.name}
          titleStyle={styles.titleStyle}
          subTitle={friend.email}
          subTitleStyle={styles.subTitleStyle}
        />
      )
    };
  };
  constructor(props) {
    //console.log('messages: constructor.');
    super(props);
    this.state = {
      messages: [],
      msgInput: '',
      refresh: false
    };
  }
  componentDidMount() {
    //console.log('messages: componentDidMount.');
    let {socket} = this.props;
    this.focusMessages = this.props.navigation.addListener('didFocus', () => {
      let {navigation} = this.props;
      this.setState({
        messages: navigation.getParam('messages'),
        refresh: !this.state.refresh
      });
      socket.emit(msgEvent.SUBSCRIBE, navigation.getParam('conversationId'));
      socket.on(msgEvent.NEW_MESSAGE, message => {
        this.addMessage(message);
      });
    });
    this.blurMessages = this.props.navigation.addListener('didBlur', () => {
      let {navigation} = this.props;
      socket.emit(msgEvent.UNSUBSCRIBE, navigation.getParam('conversationId'));
      socket.off(msgEvent.NEW_MESSAGE);
    });
  }
  componentWillUnmount() {
    //console.log('messages: componentWillUnmount.');
    this.focusMessages.remove();
    this.blurMessages.remove();
  }
  render() {
    let {messages} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <FlatList
            data={messages}
            renderItem={this.renderMessageItem}
            keyExtractor={item => item._id}
            extraData={this.state.refresh}
          />
          <TextInputIconButton
            style={styles.txtInput}
            placeholder="message"
            autoCorrect={false}
            onChangeText={text => this.setMsgInput(text)}
            value={this.state.msgInput}
            iconName={'md-send'}
            iconSize={30}
            iconColor={'black'}
            onPress={this.onPressSend}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
  setMsgInput = value => {
    this.setState({
      msgInput: value
    });
  };
  onPressSend = () => {
    let {msgInput} = this.state;
    if (!msgInput) return;
    let {socket, user, navigation} = this.props;
    let conversationId = navigation.getParam('conversationId');
    let message = {
      _id: Date.now().toString(),
      idTo: conversationId,
      idFrom: user._id,
      content: this.state.msgInput
    };
    socket.emit(msgEvent.SEND_MESSAGE, message, result => {
      if (result.isOk) {
        this.addMessage(message);
      }
    });
    // clear message input.
    this.setState({
      msgInput: ''
    });
  };
  addMessage = msg => {
    let {messages} = this.state;
    messages.push(msg);
    this.setState({
      refresh: !this.state.refresh
    });
  };
  renderMessageItem = ({item}) => {
    let {user} = this.props;
    let isUserSend = item.idFrom === user._id;
    let msgContainerStyle = {
      alignItems: isUserSend ? 'flex-end' : 'flex-start'
    };
    let bgStyle = {
      backgroundColor: isUserSend ? '#6cf0c1' : '#f564b4',
      borderRadius: 4,
      marginVertical: 2,
      paddingHorizontal: 10,
      paddingVertical: 6
    };
    let msgStyle = {
      fontSize: 16
    };
    return (
      <MessageListItem
        message={item.content}
        msgContainerStyle={msgContainerStyle}
        bgStyle={bgStyle}
        msgStyle={msgStyle}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  txtInput: {
    height: 40,
    backgroundColor: '#06b1c4',
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold'
  },
  titleStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  subTitleStyle: {
    color: 'grey',
    fontSize: 13,
    fontWeight: 'normal'
  },
  avatarStyle: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});
const mapStateToProps = state => {
  return {
    user: state.user,
    socket: state.socket
  };
};
const MessagesContainer = connect(
  mapStateToProps,
  null
)(Messages);

export {MessagesContainer};
