import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {
  LabelCheckBox,
  LabelTextInput,
  constants,
  actions
} from '../../srcExports';
import {commonSv} from '../../../services/servicesExport';

class Profile extends React.Component {
  render() {
    let {user} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.avatarArea}>
          <TouchableOpacity onPress={this.onPressAvatar}>
            <Image
              source={{uri: `${constants.AVATAR_FOLDER}/${user.avatar}`}}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
          <Text style={styles.txtName}>{user.name}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.info}>
          <LabelTextInput
            style={styles.txtInfo}
            labelText="Email"
            value={user.email}
            editable={false}
          />
          <LabelCheckBox
            style={styles.txtInfo}
            label="Gender"
            leftCheckBoxName="Female"
            leftValue={user.gender === 0}
            leftDisabled={true}
            leftOnValueChange={() => {}}
            rightCheckBoxName="Male"
            rightValue={user.gender === 1}
            rightDisabled={true}
            rightOnValueChange={() => {}}
          />
          <LabelTextInput
            style={styles.txtInfo}
            labelText="Birthday"
            value={user.birthday ? commonSv.formatDate(user.birthday) : ''}
            editable={false}
          />
          <LabelTextInput
            style={styles.txtInfo}
            labelText="Phone"
            value={user.phoneNumber}
            editable={false}
          />
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.btn} onPress={this.onPressUpdate}>
          <Text style={styles.txtBtn}>UPDATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.onPressSignOut}>
          <Text style={styles.txtBtn}>SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    );
  }
  onPressUpdate = () => {
    this.props.navigation.navigate('profileUpdateStack');
  };
  onPressSignOut = async () => {
    let {navigation, userUpdate, userFriendList} = this.props;
    try {
      await AsyncStorage.removeItem('jwt');
      userUpdate({});
      userFriendList([]);
      navigation.navigate('auth');
    } catch(error) {
      Alert.alert('error', 'unable to sign out now, please try again.')
    }
  };
  onPressAvatar = () => {
    let options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: false
      }
    };
    ImagePicker.showImagePicker(options, async res => {
      if (res.didCancel || res.customButton || res.error) {
        return;
      }
      let avatar = new FormData();
      avatar.append('avatar', {
        uri: res.uri,
        name: res.fileName,
        type: res.type
      });
      try {
        let jwt = await AsyncStorage.getItem('jwt');
        let response = await axios({
          method: 'PUT',
          url: constants.USER_AVATAR,
          headers: {
            authorization: `Bearer ${jwt}`,
            'Content-Type': 'multipart/form-data'
          },
          data: avatar
        });
        if (response.data.isOk) {
          this.props.userUpdate(response.data.user);
        }
      } catch(error) {
        Alert.alert('error', 'updating avatar failed.');
      }
    });
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  avatarArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20
  },
  info: {
    flex: 6,
    marginHorizontal: 20
  },
  btn: {
    //flex: 1,
    height: 40,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 4,
    backgroundColor: '#057ee8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    width: 100,
    height: 100
  },
  txtName: {
    color: 'black',
    fontSize: 27,
    fontWeight: 'bold'
  },
  txtInfo: {
    height: 40,
    marginVertical: 6,
    backgroundColor: '#06b1c4',
    borderRadius: 4,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  txtBtn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  separator: {
    borderWidth: 1,
    marginHorizontal: 20
  }
});

const mapStateToProps = state => {
  return {user: state.user};
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({
      userUpdate: actions.userUpdate,
      userFriendList: actions.userFriendList
    },
    dispatch
  );
};
const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

export {ProfileContainer};
