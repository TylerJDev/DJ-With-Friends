import { createUser } from './events/createUser.js';
import { disconnect } from './events/disconnect.js';
import { createRoom } from './events/createRoom.js';
import { checkLock } from './events/checkLock.js';
import * as store from './store/index.js';

export const runSocket = function(server, io) {
  const lobby = io.of('/rooms');
  let servStore = store.globalStore;
  servStore.lobby = lobby;

  /* 
  * To ensure that each user who joins the lobby
  * is placed in their own seperate room.
  * This allows for custom messages to be sent to
  * each user without sending to the entire lobby.
  */
  io.sockets.on('connection', function (socket) {
    socket.join(socket.id); // socket.id ensures unique room per user
    io.sockets.in(socket.id).emit('rooms', servStore.rooms);
  });

  lobby.on('connection', function(socket) {
    socket.on('create_user', (user) => { createUser(user, socket, io); });
    socket.on('disconnect', () => { disconnect(socket); });
    socket.on('createRoom', (data) => {createRoom(data, socket, lobby, io)}); 
    socket.on('checkLock', (data) => { checkLock(data, socket)});
  });
}