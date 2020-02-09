import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {constants, actions} from '../../srcExports';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class AppLoading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isServerRunning: true
    };
  }
  render() {
    let {isLoading, isServerRunning} = this.state;
    return (
      <View style={styles.container}>
        {isLoading && <ActivityIndicator size={120} />}
        {!isServerRunning && <Text>Unable to connect to server</Text>}
      </View>
    );
  }
  componentDidMount() {
    this.authUser();
  }
  // checking server is running or not
  checkServer = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${constants.HOST}:${constants.PORT}/`, {timeout: 2000})
        .then(response => {
          this.setState({
            isLoading: true,
            isServerRunning: true
          });
          resolve({isRunning: true});
        })
        .catch(error => {
          //console.log(error);
          this.setState({
            isLoading: false,
            isServerRunning: false
          });
          reject({isRunning: false});
        });
    });
  };
  //authenticate/authorize user.
  authUser = async () => {
    let {navigation, userUpdate} = this.props;
    try {
      await this.checkServer();
      let jwt = await AsyncStorage.getItem('jwt');
      if (jwt) {
        let response = await axios({
          method: 'GET',
          url: constants.USER_INFO,
          headers: {
            authorization: `Bearer ${jwt}`
          }
        });
        userUpdate(response.data.user);
        navigation.navigate('main');
      } else {
        navigation.navigate('auth');
      }
    } catch (error) {
      // console.log(error);
      // server is running or not
      if (typeof error.isRunning === 'undefined') {
        navigation.navigate('auth');
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({userUpdate: actions.userUpdate}, dispatch);
};
const AppLoadingContainer = connect(
  null,
  mapDispatchToProps
)(AppLoading);

export {AppLoadingContainer};
