import {combineReducers} from 'redux';
import {actionTypes} from '../srcExports';

var user = {};
const userReducer = (state = user, action) => {
  switch (action.type) {
    case actionTypes.USER_UPDATE:
      let newState = {
        ...state,
        ...action.user
      };
      return newState;
    default:
      return state; 
  }
};

var friendList = [];
const userFriendListReducer = (state = friendList, action) => {
  switch (action.type) {
    case actionTypes.USER_FRIEND_LIST:
      let newState = [...action.friendList];
      return newState;
    default:
      return state;
  }
};
var socket = null;
const socketReducer = (state = socket, action) => {
  switch (action.type) {
    case actionTypes.SOCKET_UPDATE:
      return action.socket;
    default:
      return state;
  }
};

const reducers = combineReducers({
  user: userReducer,
  friendList: userFriendListReducer,
  socket: socketReducer
});

export {reducers};
