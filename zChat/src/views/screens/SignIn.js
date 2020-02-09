/* eslint-disable comma-dangle */
import React from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  StyleSheet
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {constants, actions, TextInputIconButton} from '../../srcExports';
import axios from 'axios';
import {commonSv, cryptSv} from '../../../services/servicesExport';
import AsyncStorage from '@react-native-community/async-storage';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userState: {},
      isSecure: true
    };
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <TextInput
            style={styles.txtInput}
            placeholder="enter email"
            keyboardType="email-address"
            autoCorrect={false}
            onChangeText={text => this.setUserSate('email', text)}
          />
          <TextInputIconButton
            style={styles.txtInput}
            placeholder="enter password"
            secureTextEntry={this.state.isSecure}
            autoCorrect={false}
            onChangeText={text => this.setUserSate('password', text)}
            iconName={this.state.isSecure ? 'ios-eye-off' : 'ios-eye'}
            iconSize={30}
            iconColor={'black'}
            onPress={this.toggleSecure}
          />
          <TouchableOpacity style={styles.btn} onPress={this.onPressSignIn}>
            <Text style={styles.txtBtn}>SIGN IN</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
  setUserSate = (key, value) => {
    let {userState} = this.state;
    this.setState({
      userState: {
        ...userState,
        [key]: value
      }
    });
  };
  onPressSignIn = async () => {
    let {userState} = this.state;
    let {navigation, userUpdate} = this.props;
    try {
      if (!userState.email) throw {msg: 'please enter email.'};
      if (!userState.password) throw {msg: 'please enter password.'};
      if (!commonSv.isEmail(userState.email)) throw {msg: 'not an email.'};

      let response = await axios({
        method: 'POST',
        url: constants.USER_SIGNIN,
        data: {
          user: {
            email: userState.email
          }
        }
      });
      if (response.data.isOk) {
        let isMatch = await cryptSv.compare(
          userState.password,
          response.data.user.password
        );
        if (isMatch) {
          await AsyncStorage.setItem('jwt', response.data.jwt);
          delete response.data.user.password;
          userUpdate(response.data.user);
          navigation.navigate('main');
        } else {
          throw {msg: 'wrong password.'};
        }
      }
    } catch(error) {
      //console.log(error);
      if (error.msg) {
        Alert.alert('Note', error.msg);
      } else if (error.response.data.message){
        Alert.alert('Note', error.response.data.message);
      } else {
        Alert.alert('Note', 'an error occurred.');
      }
    }
  };
  toggleSecure = () => {
    this.setState({
      isSecure: !this.state.isSecure
    });
  };
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  txtInput: {
    height: 40,
    marginHorizontal: 20,
    marginVertical: 6,
    backgroundColor: '#06b1c4',
    borderRadius: 4,
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold'
  },
  btn: {
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#057ee8',
    borderRadius: 5,
    justifyContent: 'center'
  },
  txtBtn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({userUpdate: actions.userUpdate}, dispatch);
};
const SignInContainer = connect(
  null,
  mapDispatchToProps
)(SignIn);

export {SignInContainer};
