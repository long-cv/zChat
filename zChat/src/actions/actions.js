import {actionTypes} from '../srcExports';

export const userUpdate = user => {
  return {
    type: actionTypes.USER_UPDATE,
    user
  };
};
export const userFriendList = friendList => {
  return {
    type: actionTypes.USER_FRIEND_LIST,
    friendList
  };
};
export const socketUpdate = socket => {
  return {
    type: actionTypes.SOCKET_UPDATE,
    socket
  };
};
