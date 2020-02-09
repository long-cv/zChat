import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  StyleSheet,
  View
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
  DateTimePicker,
  LabelCheckBox,
  LabelTextInput,
  TextInputIconButton,
  constants,
  actions
} from '../../srcExports';
import {commonSv, cryptSv} from '../../../services/servicesExport';
import {styles} from './SignIn';

class ProfileUpdate extends React.Component {
  constructor(props) {
    super(props);
    let {user} = this.props;
    this.state = {
      userState: {
        gender: user.gender,
        birthday: user.birthday
      },
      isSecure: true,
      showDateTimePicker: false
    };
  }
  render() {
    let {user} = this.props;
    let {userState} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <LabelTextInput
            style={styles.txtInput}
            labelText="Name"
            placeholder={user.name}
            onChangeText={text => this.setUserState('name', text)}
          />
          <LabelCheckBox
            style={styles.txtInput}
            label="Gender"
            leftCheckBoxName="Female"
            leftValue={this.state.userState.gender === 0}
            leftDisabled={this.state.userState.gender === 0}
            leftOnValueChange={() => this.setUserState('gender', 0)}
            rightCheckBoxName="Male"
            rightValue={this.state.userState.gender === 1}
            rightDisabled={this.state.userState.gender === 1}
            rightOnValueChange={() => this.setUserState('gender', 1)}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              this.setShowDateTimePicker(!this.state.showDateTimePicker)
            }>
            <LabelTextInput
              style={styles.txtInput}
              labelText="Birthday"
              placeholder={
                userState.birthday
                  ? commonSv.formatDate(userState.birthday)
                  : 'touch here'
              }
              editable={false}
            />
          </TouchableOpacity>
          <LabelTextInput
            style={styles.txtInput}
            labelText="Phone"
            placeholder={
              user.phoneNumber ? user.phoneNumber : 'enter phone number'
            }
            onChangeText={text => this.setUserState('phoneNumber', text)}
          />
          <TextInputIconButton
            style={styles.txtInput}
            placeholder="enter new password"
            autoCorrect={false}
            secureTextEntry={this.state.isSecure}
            onChangeText={text => this.setUserState('password', text)}
            iconName={this.state.isSecure ? 'ios-eye-off' : 'ios-eye'}
            iconSize={30}
            iconColor={'black'}
            onPress={this.toggleSecure}
          />
          <TouchableOpacity style={styles.btn} onPress={this.onPressSubmit}>
            <Text style={styles.txtBtn}>SUBMIT</Text>
          </TouchableOpacity>
          {this.state.showDateTimePicker && (
            <DateTimePicker
              style={puStyle.datePicker}
              date={
                userState.birthday ? new Date(userState.birthday) : new Date()
              }
              mode="date"
              locale="vi"
              onDateChange={date =>
                this.setUserState('birthday', date.toDateString())
              }
              onPress={() => this.setShowDateTimePicker(false)}
            />
          )}
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
  onPressSubmit = async () => {
    let {userState} = this.state;
    let {userUpdate, navigation, user} = this.props;
    try {
      if (!(userState.name || userState.phoneNumber || userState.password)) {
        if (
          userState.gender === user.gender &&
          userState.birthday === user.birthday
        )
          throw {msg: 'nothing changed.'};
      }
      if (
        userState.phoneNumber &&
        !commonSv.isPhoneNumber(userState.phoneNumber)
      )
        throw {msg: 'not a phone number.'};
      if (userState.password) {
        let hashPassword = await cryptSv.hash(userState.password);
        userState.password = hashPassword;
      }
      let jwt = await AsyncStorage.getItem('jwt');
      let response = await axios({
        method: 'PUT',
        url: constants.USER_UPDATE,
        headers: {
          authorization: `Bearer ${jwt}`
        },
        data: {
          user: userState
        }
      });
      if (response.data.isOk) {
        let newUser = {
          ...user,
          ...userState
        };
        userUpdate(newUser);
        navigation.navigate('profileStack');
      }
    } catch(error) {
      //console.log(error.response.config);
      if (error.msg) {
        Alert.alert('Note', error.msg);
      } else if (error.response.data.message) {
        Alert.alert('Note', error.response.data.message);
      } else {
        Alert.alert('Note', 'error in updating profile.');
      }
    }
  };
  toggleSecure = () => {
    this.setState({
      isSecure: !this.state.isSecure
    });
  };
  setShowDateTimePicker = show => {
    this.setState({showDateTimePicker: show});
  };
}
const puStyle = StyleSheet.create({
  datePicker: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 20,
    right: 20,
    bottom: 70,
    alignItems: 'stretch',
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  }
});
const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({userUpdate: actions.userUpdate}, dispatch);
};
const ProfileUpdateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileUpdate);

export {ProfileUpdateContainer};
