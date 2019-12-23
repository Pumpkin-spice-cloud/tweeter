//import { json } from "body-parser";

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const escape = function(str) {
  let p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
};

const createTweetElement = function(input) {
  let currentTime = Date.now();
  let elapsed = currentTime - input.created_at;
  elapsed = elapsed / 1000 / 60 / 60 / 24;
  elapsed = Math.floor(elapsed);


  const $text = `<span class="tweet-text">${escape(input.content.text)}</span>`;
  const $tweet = $(`<article>
                    <div class="header-container">
                    <div class="header-text">
                    <img src="${input.user.avatars}"/>
                      <span class="userName">${input.user.name}</span>
                      <span class="userHandle">${input.user.handle}</span>
                      </div>
                    </div>
                    
                    

  `).addClass("tweet");
  const $tweet2 = $(`<footer><span>${elapsed} days ago</span> <img src="images/footer-icon.png"></img> </footer>
                    </article>)
  `);
  $tweet.append($text).append($tweet2);
  return $tweet;

};

const renderTweets = function(tweetObjs) {
  for (let tweetObj of tweetObjs) {
    $('.tweets').prepend(createTweetElement(tweetObj));
  }
};



$(document).ready(function() {
  let hideSubmit = true;
  $('#toggleSubmit').click(function() {
    if (hideSubmit) {
      $('.container').addClass("nav-show");
      $('.tweetSubmit textarea').focus();
      hideSubmit = false;
    } else if (!hideSubmit) {
      $('.container').removeClass("nav-show");

      hideSubmit = true;
    }
  });

  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function(data) {
        $('.tweet').empty();
        renderTweets(data);
      }
    });
  };
  loadTweets();



  $(".tweetSubmit form").submit(function(event) {
    const charCounter = parseInt(($(".tweetSubmit span").text()));

    if (charCounter >= 0 && charCounter < 140) {

      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: $(".tweetSubmit textarea").serialize(),

        success: function() {
          $('.tweetSubmit textarea').val('');
          $(".tweetSubmit span").text('140');
          loadTweets();


        },
        error: function(xhr, desc, err) {
          console.log(xhr);
        },
        // $('article.tweet').append(tweet);
      });
    } else if (charCounter < 0 && !$(".error p").length) {

      $(`
      <div class="error">
        <p>Tweet is too large </p>
      </div>
      `).prependTo(".container");

      $(".error").hide().slideDown("fast");

    } else if (charCounter === 140 && !$(".error p").length) {
      $(`
      <div class="error">
        <p>Type something bud </p>
      </div>
      `).prependTo(".container");
      $(".error").hide().slideDown("fast");

    }


    event.preventDefault();
  });
});

