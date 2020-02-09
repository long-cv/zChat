/* eslint-disable comma-dangle */
import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {
  AppLoadingContainer,
  SignInContainer,
  SignUpContainer,
  MessagesContainer,
  MessageBoxContainer,
  FriendsContainer,
  ProfileContainer,
  ProfileUpdateContainer
} from '../srcExports';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const ProfileStackNavigator = createStackNavigator(
  {
    profileStack: {
      screen: ProfileContainer,
      navigationOptions: {
        headerTitle: 'PROFILE'
      }
    },
    profileUpdateStack: {
      screen: ProfileUpdateContainer,
      navigationOptions: {
        headerTitle: 'UPDATE'
      }
    }
  },
  {
    initialRouteName: 'profileStack',
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerTintColor: '#057ee8',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);
const MessagesStackNavigator = createStackNavigator(
  {
    messageBoxStack: {
      screen: MessageBoxContainer,
      navigationOptions: {
        headerTitle: 'Message Box'
      }
    },
    messagesStack: {
      screen: MessagesContainer
    }
  },
  {
    initialRouteName: 'messageBoxStack',
    defaultNavigationOptions: {
      headerTintColor: '#057ee8'
    }
  }
);
const AuthTabNavigator = createBottomTabNavigator(
  {
    signIn: {
      screen: SignInContainer,
      navigationOptions: {
        title: 'SIGN IN'
      }
    },
    signUp: {
      screen: SignUpContainer,
      navigationOptions: {
        title: 'SIGN UP'
      }
    }
  },
  {
    initialRouteName: 'signIn',
    tabBarOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: '#057ee8',
      tabStyle: {
        justifyContent: 'center'
      },
      labelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      showIcon: false
    }
  }
);
const mainTabNavigator = createBottomTabNavigator(
  {
    messages: {
      screen: MessagesStackNavigator,
      navigationOptions: {
        title: 'Messages',
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          return (
            <AntDesignIcon name={'message1'} size={25} color={tintColor} />
          );
        }
      }
    },
    friends: {
      screen: FriendsContainer,
      navigationOptions: {
        title: 'Friends',
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          return (
            <AntDesignIcon name={'contacts'} size={25} color={tintColor} />
          );
        }
      }
    },
    profile: {
      screen: ProfileStackNavigator,
      navigationOptions: {
        title: 'Profile',
        tabBarIcon: ({focused, horizontal, tintColor}) => {
          return <AntDesignIcon name={'profile'} size={25} color={tintColor} />;
        }
      }
    }
  },
  {
    initialRouteName: 'messages',
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      activeBackgroundColor: '#057ee8'
    }
  }
);
const rootSwitchNavigator = createSwitchNavigator(
  {
    auth: AuthTabNavigator,
    main: mainTabNavigator,
    appLoading: AppLoadingContainer
  },
  {
    initialRouteName: 'appLoading'
  }
);
export const AppNavigator = createAppContainer(rootSwitchNavigator);
