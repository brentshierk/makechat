//index.js
$(document).ready(()=>{
    const socket = io.connect();
    let currentUser;
    // Get the online users from the server
    socket.emit('get online users');
  
    //Keep track of the current user
    let currentUser;
    socket.emit('user changed channel', "General");

  //Users can change the channel by clicking on its name.
  $(document).on('click', '.channel', (e)=>{
    let newChannel = e.target.textContent;
    socket.emit('user changed channel', newChannel);
  });
  
    $('#create-user-btn').click((e)=>{
      e.preventDefault();
      if($('#username-input').val().length > 0){
        socket.emit('new user', $('#username-input').val());
        // Save the current user when created
        currentUser = $('#username-input').val();
        $('.username-form').remove();
        $('.main-container').css('display', 'flex');
      }
    });
  
    $('#send-chat-btn').click((e) => {
        e.preventDefault();
        // Get the client's channel
        let channel = $('.channel-current').text();
        let message = $('#chat-input').val();
        if(message.length > 0) {
          socket.emit('new message', {
            sender : currentUser,
            message : message,
            //Send the channel over to the server
            channel : channel
          });
          $('#chat-input').val("");
        }
      });
  
    //socket listeners
    socket.on('new user', (username) => {
      console.log(`${username} has joined the chat`);
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    })

    //Output the new message
    socket.on('new message', (data) => {
        $('.message-container').append(`
        <div class="message">
            <p class="message-user">${data.sender}: </p>
            <p class="message-text">${data.message}</p>
        </div>
    `);
  })
  socket.on('get online users', (onlineUsers) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  })
  //Refresh the online user list
  socket.on('user has left', (onlineUsers) => {
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<p>${username}</p>`);
    }
  });
  // Add the new channel to the channels list (Fires for all clients)
socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });
  
  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${message.sender}: </p>
          <p class="message-text">${message.message}</p>
        </div>
      `);
    });
  });
  
  })