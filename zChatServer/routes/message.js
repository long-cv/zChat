const express = require('express');
const model = require('../model/model');
const ObjectId = require('mongodb').ObjectId;

const router = express.Router();
module.exports = router;

const httpSttCode = require('../constants/httpStatusCode');
const authUser = require('../services/authUser');
const conversationType = require('../constants/conversationType');

// get conversation Id if not available and messages of it.
router.get('/conversation', authUser, async (request, response) => {
  console.log(request.query.isConversationId);
  if (parseInt(request.query.isConversationId) === 1) {
	console.log(request.query.id);
    let msgCursor = model.dbRead('message', {idTo: request.query.id}, {});
    try {
      let messages = await msgCursor.toArray();
	  //console.log('message: ', messages);
      response.status(httpSttCode.OK).json({isOk: true, message: "get message is done.", messages});
    } catch(error) {
      response.status(httpSttCode.INTERNAL_SERVER_ERROR).json({isOk: false, message: "error in getting", messages: []});
    }
  } else {
    let type = parseInt(request.query.type);
    if (type === conversationType.PRIVATE) {
      let userId = request.userPayload._id;
      let frdId = request.query.id;
      let query = {
        $and: [{participant: {$all: [userId, frdId]}}, {type}]
      };
      let options = {
        limit: 1,
        projection: {'_id': 1}
      };
      let cursor = model.dbRead('conversation', query, options);
      try {
        let conversation = await cursor.next();
        if (conversation) {
          let idTo = ObjectId(conversation._id).toString();
          let msgCursor = model.dbRead('message', {idTo}, {});
          let messages = await msgCursor.toArray();
          response.status(httpSttCode.OK)
                  .json({isOk: true, message: "get message is done.", conversation: conversation._id, messages});
        } else {
          conversation = {
            _id: new ObjectId(),
            participant: [userId, frdId],
            type: conversationType.PRIVATE
          };
          response.status(httpSttCode.OK)
                  .json({isOk: true, message: "new conversation.", conversation: conversation._id, messages: []});
          await model.dbCreate('conversation', [conversation], {});
        }
      } catch (error) {
        console.log(error);
        response.status(httpSttCode.INTERNAL_SERVER_ERROR).json({isOk: false, message: "error in getting message", error});
      }
    } else {
      response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "not support this type yet."});
    }
  }
});
// get conversation list, the last message of each, people chat with.
router.get('/conversationlist', authUser, async (request, response) => {
  let userId = request.userPayload._id;
  //console.log('user id: ', userId);
  let conversationCursor = model.dbRead('conversation', {participant: {$all: [userId]}}, {});
  try {
    let hasConversation = await conversationCursor.hasNext();
    if (hasConversation) {
      let conversationList = [];
      let conversations = await conversationCursor.toArray();
      //console.log('conversation array: ', conversations);
      for (conversation of conversations) {
        let conversationId = ObjectId(conversation._id).toString();
        //console.log('conversationId: ', conversationId);
        let query = {
          $query: {idTo: conversationId}
        };
        let options = {
          limit: 1,
          projection: {'content': 1}
        };
        // get the last message.
        let msgCursor = model.dbRead('message', query, options).hint({$natural: -1});
        let message = await msgCursor.next();
        if (message) {
          let conversationItem = {conversationId};
          conversationItem.message = message.content;
          if (parseInt(conversation.type) === conversationType.PRIVATE) {
            let frdId = conversation.participant[0];
            if (frdId === userId) {
              frdId = conversation.participant[1];
            }
            let frdCursor = model.dbRead('user', {_id: ObjectId(frdId)}, {limit: 1, projection: {'name': 1, 'email': 1, 'avatar': 1}});
            let friend = await frdCursor.next();
            conversationItem.friend = friend;
            conversationList.push(conversationItem);
            //console.log('conversationList in for: ', conversationList);
          }
        }
      }
      //console.log('conversationList: ', conversationList);
      return response.status(httpSttCode.OK).json({isOk: true, message: "conversation list is done.", conversationList});
    }
    response.status(httpSttCode.BAD_REQUEST).json({isOk: false, message: "no have conversation"});
  } catch(errpr) {
    response.status(httpSttCode.INTERNAL_SERVER_ERROR).json({isOk: false, message: "an error occurred in getting conversation list"});
  }
})