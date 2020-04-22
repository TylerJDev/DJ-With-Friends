const message = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at pellentesque tortor. 
Pellentesque sed laoreet est, at luctus ante.
`;

export function MockRoom({
  roomName = 'Name_1', messageText = message, roomGenre, displayName = 'User_1', name = '5692', users, roomPrivate = false, timeCreated, server_id,
}) {
  this.name = name + Math.floor(Math.random() * 10);
  this.users = users;
  this.settings = {};
  this.timeCreated = timeCreated;

  this.settings['room-name'] = roomName;
  this.settings['message-text'] = messageText;
  this.settings['room-genre'] = roomGenre;
  this.display_name = displayName;
  this.settings['room-private_'] = roomPrivate;
  this.server_id = server_id;
}

export const mockData = [new MockRoom({roomName: 'Tyler\'s room!', messageText: 'Yes this is my room', roomGenre: 'Hip Hop', roomPrivate: true, displayName: 'Tyler Jones', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 1, server_id: 'abcdef',}),
  new MockRoom({roomName: 'Summertime', roomGenre: 'All', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 2, server_id: 'ghijkl',}),
  new MockRoom({roomName: 'Doomsday 22', roomGenre: 'Rap', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 3, server_id: 'mnopqrs',}),
  new MockRoom({roomName: 'Lofi beats to chill & study to', roomGenre: 'World music', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: 'tuvwxyz',}),
  new MockRoom({roomName: 'Windmills of your mind', roomGenre: 'Jazz', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: '123456',}),
  new MockRoom({roomName: 'My room!', messageText: 'Yes this is my room', roomGenre: 'Hip Hop', roomPrivate: true, displayName: 'Tyler Jones', users: [1, 2, 3, 4, 5], timeCreated: new Date().getTime() + 1, serverID: 'abcdef',}),
  new MockRoom({roomName: 'Rain on the day', roomGenre: 'All', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 2, server_id: 'ghijkl',}),
  new MockRoom({roomName: 'Eggs in a basic (rap)', roomGenre: 'Rap', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 3, server_id: 'mnopqrs',}),
  new MockRoom({roomName: 'ZA WORLDO', roomGenre: 'World music', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, serverID: 'tuvwxyz',}),
  new MockRoom({roomName: 'Jazzy jazz', roomGenre: 'Jazz', users: [{ '': 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: '123456',}),
  new MockRoom({roomName: 'Jazzy jazz 2', roomGenre: 'Jazz', users: [{ '': 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: '123456',}),
  new MockRoom({roomName: 'Jazzy jazz 3', roomGenre: 'Jazz', users: [{ '': 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: '123456',}),
  new MockRoom({roomName: 'Jazzy jazz 4', roomGenre: 'Jazz', users: [{ '': 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { '': 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }, { name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], timeCreated: new Date().getTime() + 4, server_id: '123456',}),
];
