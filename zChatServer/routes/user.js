const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt/jwt');
const model = require('../model/model');
const httpSttCode = require('../constants/httpStatusCode');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config/config');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();
module.exports = router;

const authUser = require('../services/authUser');

// handle user info request
router.get('/info', authUser, async (request, response) => {
  let cursor = model.dbRead('user', {_id: new ObjectId(request.userPayload._id)}, {limit: 1});
  try {
    let user = await cursor.next();
    if (!user) return response.status(httpSttCode.NOT_FOUND).json({isOk: false, message: "user not found."});
    response.status(httpSttCode.OK).json({isOk: true, message: "found user info.", user});
  } catch(error) {
    response.status(httpSttCode.BAD_REQUEST).json({isOk: false, messeage: "Error in getting user info.", error});
  }
});
// handle user sign up request
router.post('/signup', async (request, response) => {
  let code = httpSttCode.BAD_REQUEST;
  try {
	//console.log('user: ', request.body.user);
    let cursor = model.dbRead('user', {email: request.body.user.email}, {limit: 1});
    let doc = await cursor.next();
    //console.log('doc: ', doc);
    if (doc) return response.status(code).json({isOk: false, message: "email is in using."});
	
	let newUser = request.body.user;
	newUser.avatar = config.avatarDefault;
	let result = await model.dbCreate('user', [newUser], {});
	code = httpSttCode.CREATED;
	//console.log(result);
	let user = result.ops[0];
	//console.log(user);
	let token = await jwt.sign({_id: user._id});
	delete user.password;
	response.status(code).json({isOk: true, message: "sign up successfully.", user, jwt: token});
  } catch(error) {
	if (code === httpSttCode.CREATED) {
      response.status(code).json({isOk: false, message: "error in generating user token.", error});
	} else {
	  response.status(code).json({isOk: false, message: "error in signing up.", error});
	}
  }
});
//handle user sign in request
router.post('/signin', async (request, response) => {
  try {
    let user = request.body.user;
    // check email is using or not
    let cursor = model.dbRead('user', {email: user.email}, {limit: 1});
    let doc = await cursor.next();
    if (!doc) return response.status(httpSttCode.NOT_FOUND).json({isOk: false, message: "email has not registered yet."});
    
    let token = await jwt.sign({_id: doc._id});
    response.status(httpSttCode.OK).json({isOk: true, message: "sign in successfully.", user: doc, jwt: token});
  } catch(error) {
    response.status(httpSttCode.NOT_FOUND).json({isOk: false, message: "error in signing in.", error});
  }
});
//handle user info update request
router.put('/update', authUser, async (request, response) => {
  try {
    let update = request.body.user;
    //console.log(update);
    //console.log(request.userPayload);
    let result = await model.dbUpdate('user', {_id: new ObjectId(request.userPayload._id)}, {$set: {...update}}, {});
    //console.log(result);
	if (result.result.nModified > 0) {
      response.status(httpSttCode.CREATED).json({isOk: true, message: "updated successfully."});
    } else {
      response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "update failed."});
    }
  } catch(error) {
    //console.log(error);
    response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "error in updating", error});
  }
});
// handle user avatar update request
updateAvatar = multer({dest: path.join(__dirname, '../public/' + config.avatarFolder)}).single('avatar')
router.put('/avatar', authUser, updateAvatar, async (request, response) => {
  if (!request.file) return response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "no avatar to updated."});
  try {
    let _id = new ObjectId(request.userPayload._id);
    // identify user
    let cursor = model.dbRead('user', {_id}, {limit: 1});
    let user = await cursor.next();
    if (!user) return response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "can not identify user."});
    // rename avatar
    let avatarName = user._id + Date.now();
    await fs.rename(request.file.path, request.file.destination +'\\' + avatarName);
    // update avatar field
    let result = await model.dbUpdate('user', {_id}, {$set: {avatar: avatarName}}, {});
    if (result.result.nModified > 0) {
	  delete user.password;
      response.status(httpSttCode.CREATED).json({isOk: true, message: "avatar updated.", user: {...user, avatar: avatarName}});
      // remove old avatar
      if (user.avatar !== config.avatarDefault) {
        fs.unlink(request.file.destination + '\\' + user.avatar);
      }
    } else {
      response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "update avatar failed."});
    }
  } catch(error) {
    response.status(httpSttCode.INTERNAL_SERVER_ERROR).json({isOk: false, message: "error in updating avatar", error});
  }
});
// handle user list request
router.get('/userlist', authUser, async (request, response) => {
  let userID = new ObjectId(request.userPayload._id);
  let query = {_id: {$ne: userID}}
  let cursor = model.dbRead('user', query, {projection: {'name': 1, 'email': 1, 'avatar': 1}});
  try {
    let userList = await cursor.toArray();
    response.status(httpSttCode.OK).json({isOk: true, message: "getting user list successfully.", userList});
  } catch(error) {
    response.status(httpSttCode.INTERNAL_SERVER_ERROR).json({isOk: false, message: "getting user list failed.", error});
  }
});