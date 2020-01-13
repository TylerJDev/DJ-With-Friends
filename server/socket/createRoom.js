import request from 'request'

// # Code improvements
// * Make curretRoom variable global to newRoom scope 

function createRoom(io, id, rooms, host, lobby) {
    const newRoom = io.of(`/${id}`);
    const usersRoom = {};
    let roomHost = host;

    newRoom.on('connection', function(socket) {
        let currentUser = {};

        // On connection to new room, all "sockets" currently connected
        // Should be emited data on new "socket" (user)

        // Grab details of user after emitting to newRoom
        socket.on('userDetails', (data) => {
            const user = new createUser(data);
            if (usersRoom[id] === undefined) {
                usersRoom[id] = [];
            }
            
            let usersPreExist = usersRoom[id].find(curr => curr.id === data.id);
            
            currentUser = {'id': data.id, 'room_id': id, currentHost: data.id === host, devices: JSON.parse(data.devices)};

            let currentRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);  

            if (usersPreExist === undefined) {
                usersRoom[id].push(user);

                // Update lobby by emitting usersRooms
                lobby.emit('updateLobby', rooms);

                // Add user to "rooms.user" array
                if (rooms[currentRoom] !== undefined) {
                    if (rooms[currentRoom].hasOwnProperty('users') === false) {
                        rooms[currentRoom].users = [];
                    }

                    rooms[currentRoom].users.push(user);

                    // Add queue to room if not current
                    if (rooms[currentRoom].hasOwnProperty('queue') === false) {
                        rooms[currentRoom].queue = [];
                        rooms[currentRoom].skipCount = new Set();
                        rooms[currentRoom].currentTrack = {'track': '', 'currentPlaying': false, 'artist': ''};
                    }
                }

            } else {
                // Add to user count
                let currUser = '';
                usersRoom[id].forEach((item, index) => {
                    if (item.id === data.id) {
                        usersRoom[id][index].userCount += 1;
                        currUser = usersRoom[id][index];
                    }
                });

                console.log(`Added count: ${currUser.userCount}`);
            }   
            newRoom.emit('user', usersRoom[id]);
            newRoom.emit('currentTrack', rooms[currentRoom].currentTrack);
        });

        // Upon user adding "song" to queue
        socket.on('addQueue', (data) => {
            let currentRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);

            // If queue empty, play track
            if (rooms[currentRoom].queue.length === 0) {
                playTrack(data);
            }
            
            // Add track to queue
            rooms[currentRoom].queue.push(data);

            // Emit to entire room 
            newRoom.emit('addedQueue', rooms[currentRoom].queue);
        });

        // Utilize Spotify API to handle "play" state
        const playTrack = (data) => {
            console.log(data);

            let currentRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);
            const userCurrent = {
                access_token: rooms[currentRoom] !== undefined ? rooms[currentRoom].users.filter(curr => curr.id === roomHost)[0].access_token : '',
                user: rooms[currentRoom] !== undefined ? rooms[currentRoom].users.filter(curr => curr.id === roomHost)[0] : '',
            }

            // const access_token = rooms[currentRoom].users.filter(curr => curr.id === roomHost)[0].access_token;

            // Grab the next track in the queue
            let nextTrack = rooms[currentRoom].queue.length > 0 ? rooms[currentRoom].queue[0].trackURI : false; 
            let nextTrackName = rooms[currentRoom].queue.length > 0 ? rooms[currentRoom].queue[0].trackName : '';
            let nextTrackArtist = rooms[currentRoom].queue.length > 0 ? rooms[currentRoom].queue[0].trackArtist : '';
            let userDevices = [];
            let options = {};

            if (nextTrack === false) {
                // Grab track from data passed
                if (data === undefined) {
                    pauseTrack(userCurrent.access_token);
                    return false; 
                }

                console.log('Play: ' + data.trackName);
                nextTrack = data.trackURI;
                nextTrackName = data.trackName;
                nextTrackArtist = data.trackArtist;
            }

            console.log(data.trackArtist);
            

            //# DEV-NOTE: The user could be allowed to see which device to pick from if there are multiple devices
            //# This could be done via a modal popup using sockets to emit this data to the user
            try {
                userDevices = userCurrent.user.devices.devices.filter(curr => curr['is_restricted'] === false);
                let deviceID = userDevices.length ? `?device_id=${userDevices[0].id}` : ''

                options = {
                    url: `https://api.spotify.com/v1/me/player/play${deviceID}`,
                    headers: { 'Authorization': 'Bearer ' + userCurrent.access_token },
                    body: JSON.stringify({
                    "uris": [nextTrack],
                    })
                }
            } catch (TypeError) {
                console.log('Couldn\'t find device(s)!');
                // Emit to user!
                return false;
            }

            request.put(options, function(error, response, body) {
              let errorFound = '';

              try {
                let errorOf = JSON.parse(body)['error'];
                if (errorOf.hasOwnProperty('status')) {
                    console.log('An error has occurred! ' + JSON.stringify(errorOf));
                    // Emit to room
                    // ...
                    errorFound = true;
                }
                return true;
              } catch(SyntaxError) {
                errorFound = false;
              }
            
              // If there is no error with playing the track
              if (!errorFound) {
                  // Set timer
                  console.log(`Set timeout to ${data.trackDuration}`);
                  setTimeout(() => { checkTrack() }, data.trackDuration - 10000);

                  // Emit current queue to room
                  newRoom.emit('addedQueue', rooms[currentRoom].queue)

                  // Emit current track to room
                  console.log(nextTrackArtist);
                  newRoom.emit('currentTrack', {'track': nextTrackName, 'currentPlaying': true, 'artist': nextTrackArtist});
                  rooms[currentRoom].currentTrack = {'track': nextTrackName, 'currentPlaying': true, 'artist': nextTrackArtist};

                  const checkTrack = () => {

                    // Check the current playback state 
                    const playbackOptions = {
                        url: 'https://api.spotify.com/v1/me/player',
                        headers: { 'Authorization': 'Bearer ' + userCurrent.access_token },
                    }

                    request.get(playbackOptions, function(error, response, body) {
                        const trackDetails = JSON.parse(body);
                        
                        // If track is playing, pause for room

                        // Check time versus data.trackDuration
                        console.log(`Current duration: ${trackDetails.progress_ms}, Track duration: ${data.trackDuration}`);

                        // if (trackDetails.progress_ms >= data.trackDuration - 10000) {
                            const timeLeft = (data.trackDuration - trackDetails.progress_ms);
                            setTimeout(function() {
                                console.log('Track finished!');
                                // Remove track from queue
                                const trackIndex = rooms[currentRoom].queue.findIndex(curr => curr.trackURI === nextTrack);
                                newRoom.emit('removeFromQueue', rooms[currentRoom].queue[trackIndex]);

                                console.log(`Track index at ${trackIndex}, ${rooms[currentRoom].queue[trackIndex]}`);

                                rooms[currentRoom].queue.splice(trackIndex, 1);
                                rooms[currentRoom].skipCount.clear();

                                playTrack(rooms[currentRoom].queue[0]);
                            }, timeLeft);
                        // }

                    });
                  }
              }
            });
        }

        const pauseTrack = (access_token) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/pause',
                headers: { 'Authorization': 'Bearer ' + access_token },
            }

            request.put(options, function(error, resp, body) {
                console.log(error);
                console.log(body);
            });
        }

        socket.on('skipTrack', function(data) {
            let currentRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);
            console.log('Skip Track?');

            // Check current queue
            console.log(rooms[currentRoom].queue);

            // If there are no tracks in the queue
            if (!rooms[currentRoom].queue.length) {
                newRoom.emit('trackSkipped', {'error': 'No tracks in queue currently!'});
            }

            // Check if current user is the host
            if (currentUser.currentHost === true) {
                if (rooms[currentRoom].queue.length) {
                    skipTrack();
                }
            } else {
                // Add to room "skip" vote
                rooms[currentRoom].skipCount.add(currentUser.id);
                console.log(rooms[currentRoom].skipCount)

                console.log(`Voted to skip! Votes must reach at least ${Math.ceil(rooms[currentRoom].users.length * 0.66)} to be skipped!`);
                // Vote must reach at least 66% of total users in room to be skipped
                if (rooms[currentRoom].skipCount.size >= Math.ceil(rooms[currentRoom].users.length * 0.66)) {
                    skipTrack();
                }
            }

            function skipTrack() {
                rooms[currentRoom].queue.splice(0, 1);
                console.log(`Track Skipped! Now playing ${rooms[currentRoom].queue[0]}`);

                playTrack(rooms[currentRoom].queue[0]);
                newRoom.emit('trackSkipped', {'success': `Track now playing: ${rooms[currentRoom].queue[0]}`});

                pauseTrack(rooms[currentRoom].users.filter(curr => curr.id === roomHost)[0].access_token);
            }
        });
 
        socket.on('disconnect', function(socket) {      
            // Check how many occurances of "user"
            let userOccur = usersRoom[currentUser.room_id].filter(curr => curr.id === currentUser.id);

            // If the last occurance of user has left
            if (userOccur[0] !== undefined && userOccur[0].userCount === 1) {
                console.log(`${currentUser.id} has left room #${currentUser.room_id}`);
                newRoom.emit('disconnected', currentUser.id);

                // Remove user from usersRoom array
                let userIndex = usersRoom[currentUser.room_id].findIndex(curr => curr.id === currentUser.id);

                // Remove user from rooms array
                let currentRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);
                if (rooms[currentRoom] !== undefined) {
                    rooms[currentRoom].users.forEach((c, i) => { 
                        if (c.id === currentUser.id) {
                            rooms[currentRoom].users.splice(i, 1);
                        }
                    });
                }

                if (userIndex > -1 ) {
                    usersRoom[currentUser.room_id].splice(userIndex, 1);
                    newRoom.emit('user', usersRoom[id]);
                }

                // Check if room is empty
                if (!usersRoom[currentUser.room_id].length) {
                    deleteRoom(rooms, currentUser, usersRoom);
                }
            } else if (userOccur[0] !== undefined) {
                usersRoom[currentUser.room_id].forEach((item, index) => {
                    if (item.id === [currentUser.id]) {
                        usersRoom[currentUser.room_id][index].userCount -= 1;
                    }
                });
            } else {
                deleteRoom(rooms, currentUser, usersRoom);
            }
        });
    });
}

function createUser(data) {
    this.name = data.name;
    this.id = data.id;
    this.userCount = 1;
    this.access_token = data.access_token;
    this.devices = JSON.parse(data.devices);
}

function deleteRoom(rooms, currentUser, usersRoom) {
    // TEST: Ensure correct room is removed!
    console.log(`Room ${currentUser.room_id} has been deleted!`);

    delete usersRoom[currentUser.room_id];
    console.log('Index: ' + rooms.findIndex(curr => curr.name === currentUser.room_id));

    let findIndexRoom = rooms.findIndex(curr => curr.name === currentUser.room_id);
    rooms.splice(findIndexRoom, 1);
};

module.exports = {createRoom: createRoom};