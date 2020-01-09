let message = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at pellentesque tortor. 
Pellentesque sed laoreet est, at luctus ante. Phasellus et sapien massa. 
Nullam porta tellus et ligula venenatis dignissim. Aliquam sed lacus sed est rutrum laoreet.`

export default function({roomName="Name_1", messageText=message, roomGenre, displayName="User_1", name="5692", users=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], roomPrivate=false}) {
    this.name = name;
    this.users = users
    this.settings = {};

    this.settings['room-name'] = roomName;
    this.settings['message-text'] = messageText;
    this.settings['room-genre'] = roomGenre;
    this['display_name'] = displayName;
    this.settings['room-private_'] = roomPrivate;
}
