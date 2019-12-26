//import { json } from "body-parser";

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
//function for allowing only safe characters to be inputted when submitting tweet
const escape = function(str) {
  let p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
};

//Generate a HTML containing individual tweet infos
const createTweetElement = function(input) {
  let currentTime = Date.now();
  let elapsed = currentTime - input.created_at;
  elapsed = elapsed / 1000 / 60 / 60 / 24;
  elapsed = Math.floor(elapsed);

  const $tweet = $(`<article class="tweet">
                    <div class="header-container">
                      <div>
                        <img src="${input.user.avatars}"/>
                        <span class="userName">${input.user.name}</span>
                      </div>
                        <span class="userHandle">${input.user.handle}</span>
                    </div>
                    <p class="tweet-text">${escape(input.content.text)}</p>
                    <footer> 
                      <span>${elapsed} days ago</span> 
                      <img src="images/footer-icon.png"></img> 
                    </footer>
                    </article>
  `);
  return $tweet;
};

const renderTweets = function(tweetObjs) {
  for (let tweetObj of tweetObjs) {
    $('.tweets').prepend(createTweetElement(tweetObj));
  }
};

const loadTweets = function() {
  $.ajax({
    url: '/tweets',
    method: 'GET',
    success: function(data) {
      $('.tweet').remove();
      renderTweets(data);
    }
  });
};

$(document).ready(function() {
  let submitHidden = true;
  //toggles the display of the tweet submission box
  $('#toggleSubmit').click(function() {
    if (submitHidden) {
      $('.container').addClass("nav-show");
      $('.new-tweet textarea').focus();
      $('.error').show("fast"); //shows error message if there is one when tweet submit box is revealed
      submitHidden = false;
    } else if (!submitHidden) {
      $('.container').removeClass("nav-show");
      $('.error').hide("fast"); //hides error message if there is one when hiding tweet submit box
      submitHidden = true;
    }
  });
  loadTweets();
  $(".new-tweet form").submit(function(event) {
    const charCounter = parseInt(($(".new-tweet span").text()));
    if (charCounter >= 0 && charCounter < 140) { //submit new tweet to database only when input character count is satisfactory
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: $(".new-tweet .tweet-input").serialize(),
        success: function() { //reset submission box for future submissions
          $('.new-tweet .tweet-input').val('');
          $(".new-tweet .counter").text('140');
          loadTweets();
        },
        error: function(xhr) {
          console.log(xhr);
        },
      });

      //Show error if input is too large, or empty
    } else if (charCounter < 0 && !$(".error p").length) {
      $(` 
      <div class="error">
        <p>Tweet is too large. Please respect our 140 character limit</p>
      </div>
      `).prependTo(".container");
      $(".error").hide().slideDown("fast");
    } else if (charCounter === 140 && !$(".error p").length) {
      $(`
      <div class="error">
        <p>Tweet is empty!! You need to type something</p>
      </div>
      `).prependTo(".container");
      $(".error").hide().slideDown("fast");
    }
    event.preventDefault();
  });
});

