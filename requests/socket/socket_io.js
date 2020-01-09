import createRoom from './createRoom.js';
import bcrypt from 'bcryptjs';

function runSocket(server, io) {
  const lobby = io.of('/rooms');
  const usersCurrent = [];
  const usersRoom = [];
  const rooms = [];
  let existingUser = '';

  const findCurrentUser = (users, user) => {
    for (let findIndex in users) {
      if (users[findIndex].id === user.id) {
        return existingUser = findIndex;
      }
    }
  };

  lobby.on('connection', function(socket) {
    let currentUser = '';

    socket.on('create_user', (user) => {
      // Grab "User Display Name"
      const userName = user.display_name;

      // Push to users array
      if (usersCurrent.filter(c => c.id === user.id).length === 0) {
        user.amount = 1;

        usersCurrent.push(user), usersRoom.push(userName);

        console.log(`User: ${userName} has joined!`);
      } else {
        let existingUserIndex = '';

        existingUserIndex = findCurrentUser(usersCurrent, user);

        if (existingUserIndex !== '') {
          usersCurrent[existingUserIndex].amount += 1;
        }

        console.log(`User count ${usersCurrent[existingUser].amount}, @${usersCurrent[existingUser].display_name}`);
      }

      lobby.emit('servers', rooms);
      currentUser = user;
    });

    socket.on('disconnect', function(socket) {
      let existingUserIndex = findCurrentUser(usersCurrent, currentUser);
      console.log(usersCurrent[existingUserIndex]);
      let currentAmount = usersCurrent.length > 0 && usersCurrent[existingUserIndex] !== undefined ? usersCurrent[existingUserIndex].amount : false;

      if (currentAmount <= 1) {
        console.log(`User ${currentUser.display_name} has left!`);
        usersCurrent.splice(existingUserIndex, 1);

        // Remove user's rooms
      } else if (currentAmount > 1 && currentAmount !== false) {
        usersCurrent[existingUserIndex].amount -= 1;
      }
    });

    /** @param {object} data - Holds data {'name': '', 'id': '', 'display_name': ''} **/
    socket.on('createRoom', (data) => {
      const randID = (Math.floor(Math.random() * 8999) + 1000);
      let existingRooms = rooms.filter(curr => curr.id === data.id);

      if (!existingRooms.length) {
        let roomError = false;        
        // Settings Validation

        // 1. Check if proper room name
        if (data.settings['room-name'].replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\\/?]/g, '').length < 3) {
          socket.emit('roomError', {'room_name': 'Room Name must be greater than 2 characters!'});
          roomError = true;
        } 

        if (!roomError) {
          console.log(`User: ${data.display_name}, created a room!`);

          // Name equals the ID of the room 
          data.name = randID;

          // Host of the current room
          const host = data.id;

          const addToRooms = (hash=null) => {
            data.users = [];
            if (data.settings.hasOwnProperty('password')) {
              data.password = {'hash': hash}
              delete data.settings.password;
            }

            rooms.push(data);

            socket.emit('serverCreated', {'roomData': rooms, 'roomID': randID, 'host': host, 'passwordProtected': data.settings.hasOwnProperty('password')});
            lobby.emit('servers', rooms);
          }

          // Create a new namespace based on ID
          if (data.settings.hasOwnProperty('password')) {
            // Hash password
            bcrypt.hash(data.settings['password'], 10, function(err, hash) {
              addToRooms(hash);
              createRoom.createRoom(io, randID, rooms, host, lobby); 
            });
          } else {
            addToRooms();
            createRoom.createRoom(io, randID, rooms, host, lobby); 
          }         
        }
      } else {
        console.log('You\'ve already made a room!');
      }
    });
    
    socket.on('checkLock', (data) => {
      const currentRoom = rooms.findIndex(curr => String(curr.name) === data.roomID);  
      console.log(data);

      if (rooms[currentRoom] === undefined) {
        console.log('Yes, this room doesn\'t exist!');
        return false;
      }

      // Check user limit
      if (rooms[currentRoom].settings['user-limit_'].length 
          && rooms[currentRoom].users.length >= +rooms[currentRoom].settings['user-limit_']
          && rooms[currentRoom].token !== data.token) {
          console.log('Room limit reached!');
          socket.emit('lockedRoom', {'userLimit': true});
          return false;
      } 

      if (data.password === undefined) {
        if (currentRoom > -1 && rooms[currentRoom].hasOwnProperty('password')) {
          socket.emit('lockedRoom', {'passwordProtected': true, 'roomName': rooms[currentRoom].settings['room_name'], 'token': rooms[currentRoom].token});
        } else {
          socket.emit('lockedRoom', {'passwordProtected': false});
        }
      } else {
        bcrypt.compare(data.password, rooms[currentRoom].password.hash, function(err, res) {
          socket.emit('passwordCheck', res);
        });
      }
    });
  });
}

export {runSocket}
