{
  "rules": {
    "room_names": {
      // any logged in user can get a list of room names
      ".read": "auth !== null",

      "$room_id": {
        // this is just for documenting the structure of rooms, since
        // they are read-only and no write rule allows this to be set
        ".validate": "newData.isString()"
      }
    },

    "members": {
       // I can join or leave any room (otherwise it would be a boring demo)
       // I can have a different name in each room just for fun
       "$room_id": {
          // any member can read the list of member names
          ".read": "data.child(auth.uid).exists()",

          // room must already exist to add a member
          ".validate": "root.child('room_names/'+$room_id).exists()",

          "$user_id": {
             ".write": "auth.uid === $user_id",
             ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 20"
          }
       }
    },

    "messages": {
      "$room_id": {
        // the list of messages for a room can be read by any member
        ".read": "root.child('members/'+$room_id+'/'+auth.uid).exists()",

        // room we want to write a message to must be valid
        ".validate": "root.child('room_names/'+$room_id).exists()",

        "$message_id": {
          // a new message can be created if it does not exist, but it
          // cannot be modified or deleted
          // any member of a room can write a new message
          ".write": "root.child('members/'+$room_id+'/'+auth.uid).exists() && !data.exists() && newData.exists()",

          // the room attribute must be a valid key in room_names/ (the room must exist)
          // the object to write must have a name, message, and timestamp
          ".validate": "newData.hasChildren(['user', 'message', 'timestamp'])",

          // the message must be written by logged in user
          "user": {
             ".validate": "newData.val() === auth.uid"
          },

          // the message must be longer than 0 chars and less than 50
          "message": { ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 50" },

          // messages cannot be added in the past or the future
          // clients should use firebase.database.ServerValue.TIMESTAMP
          // to ensure accurate timestamps
          "timestamp": { ".validate": "newData.val() <= now" },

          // no other fields can be included in a message
          "$other": { ".validate": false }
        }
      }
    }
  }
}