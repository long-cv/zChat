import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {TextInputIconButton, constants, actions} from '../../srcExports';
import {commonSv, cryptSv} from '../../../services/servicesExport';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './SignIn';

class SignUp extends React.Component {
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
            placeholder="enter name"
            onChangeText={text => this.setUserState('name', text)}
          />
          <TextInput
            style={styles.txtInput}
            placeholder="enter email"
            keyboardType="email-address"
            autoCorrect={false}
            onChangeText={text => this.setUserState('email', text)}
          />
          <TextInputIconButton
            style={styles.txtInput}
            placeholder="enter password"
            autoCorrect={false}
            secureTextEntry={this.state.isSecure}
            onChangeText={text => this.setUserState('password', text)}
            iconName={this.state.isSecure ? 'ios-eye-off' : 'ios-eye'}
            iconSize={30}
            iconColor={'black'}
            onPress={this.toggleSecure}
          />
          <TouchableOpacity style={styles.btn} onPress={this.onPressSignUp}>
            <Text style={styles.txtBtn}>SIGN UP</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
  setUserState = async (key, value) => {
    let {userState} = this.state;
    await this.setState({
      userState: {
        ...userState,
        [key]: value
      }
    });
  };
  onPressSignUp = async () => {
    let {userState} = this.state;
    let {userUpdate, navigation} = this.props;
    try {
      if (!userState.name) throw {msg: 'please enter name.'};
      if (!userState.email) throw {msg: 'please enter email.'};
      if (!userState.password) throw {msg: 'please enter password.'};
      if (!commonSv.isEmail(userState.email)) throw {msg: 'not an email.'};

      let hashPassword = await cryptSv.hash(userState.password);
      userState.password = hashPassword;
      let response = await axios({
        method: 'POST',
        url: constants.USER_SIGNUP,
        data: {
          user: userState
        }
      });
      if (response.data.isOk) {
        userUpdate(response.data.user);
        await AsyncStorage.setItem('jwt', response.data.jwt);
        navigation.navigate('main');
      } else if (response.status === 201) {
        Alert.alert('Note', 'sign up successfully, please sign in.');
        navigation.navigate('signIn');
      }
    } catch(error) {
      if (error.msg) {
        Alert.alert('Note', error.msg);
      } else if (error.response.data.message) {
        Alert.alert('Note', error.response.data.message);
      } else {
        Alert.alert('Note', 'error in signing up.');
      }
    }
  };
  toggleSecure = () => {
    this.setState({
      isSecure: !this.state.isSecure
    });
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({userUpdate: actions.userUpdate}, dispatch);
};
const SignUpContainer = connect(
  null,
  mapDispatchToProps
)(SignUp);

export {SignUpContainer};
