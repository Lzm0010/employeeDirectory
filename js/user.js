$(document).ready(function(){

  /*-----------------------
  ELEMENT & HTML VARIABLES
  ------------------------*/

  const $overlay = $('<div id="overlay"></div>');
  const $modal = $('<div id="modal"></div>');
  const $label = $('<label for="search">Search:</label>');
  const $input = $('<input type="text" name="q" id="search" />');
  const $notFound = $('<div class="not-found">Sorry no match found!</div>');
  let usersHTML;
  let modalHTML;
  let inputValue;


  /*-----------------
  AJAX REQUEST
  ------------------*/

  //make AJAX request then if succesful
  //insert all users html
  //add listeners for a modal with data passed in
  $.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us',
    dataType: 'json',
    success: function(data) {
      usersHTML = "<ul>";
      $.each(data.results, function(i, user){
          displayUser(i, user);
      });
      usersHTML += "</ul>";

      $("#users").html(usersHTML);
      addModalListener(data.results);
      addSearchListener(data.results);
    },
    error: function(data){
      console.log(data);
    }
  });


  /*-----------------
  DISPLAY FUNCTIONS
  ------------------*/

  //Display user
  function displayUser(id, user){
    usersHTML += `<li data-id='${id}'>`;
    usersHTML += `<div class='image'><img src="${user.picture.large}"/></div>`;
    usersHTML += `<div class="info">`;
    usersHTML += `<div class='fullname'>${user.name.first} ${user.name.last}</div>`;
    usersHTML += `<div class='email'>${user.email}</div>`;
    usersHTML += `<div class='city'>${user.location.city}</div>`;
    usersHTML += `</div>`;
    usersHTML += `</li>`;

    return usersHTML;
  }


  //display user modal with appropriate user info
  function displayUserModal(users, user, userId){
    $("body").append($overlay);
    $overlay.append($modal);
    modalHTML = "";
    modalHTML += `<div id="close"><i class="fa fa-window-close fa-2x" aria-hidden="true"></i></div>`;
    modalHTML += `<div data-id="${userId}">`;
    modalHTML += `<div class="info">`;
    modalHTML += `<div class='image'><img src="${user.picture.large}"/></div>`;
    modalHTML += `<div class='fullname'>${user.name.first} ${user.name.last}</div>`;
    modalHTML += `<div class='username'>${user.login.username}</div>`;
    modalHTML += `<div class='email'>${user.email}</div>`;
    modalHTML += `<div class='city'>${user.location.city}</div>`;
    modalHTML += `<div class='cell'>${user.cell}</div>`;
    modalHTML += `<div class='address'>${user.location.street} ${user.location.city}, ${user.location.state} ${user.location.postcode}</div>`;
    modalHTML += `<div class='dob'>Birthday: ${dobFormat(user.dob)}</div>`;
    modalHTML += `</div>`;
    modalHTML += `<div id="previous"><i class="fa fa-arrow-circle-left fa-2x" aria-hidden="true"></i></div><div id="next"><i class="fa fa-arrow-circle-right fa-2x" aria-hidden="true"></i></div>`;
    modalHTML += `</div>`;
    $modal.html(modalHTML);
    modalListeners(users, userId);
  }


  //format date of birth
  function dobFormat(dob){
    let month = dob.slice(5, -12);
    let day = dob.slice(8, -9);
    let year = dob.slice(0, 4);
    return `${month}/${day}/${year}`;
  }


  //search the directory by name or username.
  //use index of to search against input value
  //add hidden class to user list item if user doesnt match query
  //if no users are pushed add not found message
  function searchUsers(query, users){
    let matched = [];

    users.forEach((user, i) => {
      let firstName = user.name.first;
      let lastName = user.name.last;
      let username = user.login.username;
      let $userElement = $(`li[data-id='${i}']`);

      if (query.length > 0 && (firstName.indexOf(query) > -1 || lastName.indexOf(query) > -1 || username.indexOf(query) > -1)){
        $userElement.removeClass('hidden');
        matched.push(user);
      } else if (query.length === 0){
        $userElement.removeClass('hidden');
      } else {
        $userElement.addClass('hidden');
      }

      if(query.length === 0){
        $notFound.remove();
      } else if (matched.length === 0){
        $('#searchMe').append($notFound);
      } else {
        $notFound.remove();
      }
    });
  }


  /*-----------------
  EVENT FUNCTIONS
  ------------------*/

  //Create listener for modal that will pop up when any of the user’s row is clicked
  //store user id from data-id attribute that is attached to user row
  function addModalListener(data){
    $("li").click(function(){
      user = $(this).attr("data-id");
      displayUserModal(data, data[user], user);
    });
  }


  //add a listener to check if the search changes
  function addSearchListener(users){
    $('#searchMe').append($label);
    $('#searchMe').append($input);

    $('#search').on("input", function(){
      inputValue = $(this).val();
      searchUsers(inputValue, users);
    })
  }


  //create listeners for closing the modal, and next & prev users
  function modalListeners(users, userId){
    $("#close").click(function(){
      $(this).parent().parent().remove();
    });

    $("#next").click(function(){
      $(this).parent().remove();
      nextUser(users, userId);
    });

    $("#previous").click(function(){
      $(this).parent().remove();
      prevUser(users, userId);
    });
  }


  //adds listener to modal that moves to next user
  //make sure a number is passed in for id
  //include edge case
  function nextUser(users, userId){
    userId = parseInt(userId);
    if(userId >= users.length - 1){
      displayUserModal(users, users[0], 0);
    } else {
      displayUserModal(users, users[userId + 1], userId + 1);
    }
  }


  //adds listener to modal that moves to previous user
  //include edge case
  function prevUser(users, userId){
    if(userId === 0){
      displayUserModal(users, users[users.length - 1], users.length - 1);
    } else {
      displayUserModal(users, users[userId - 1], userId - 1);
    }
  }
}); //end ready
