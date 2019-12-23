$(document).ready(function() {
  $(".tweet-input").bind('input propertychange', function() {
    let counter = 140;
    let inputLength = $(this).val().length;
    counter = counter - inputLength;
    $(this).siblings("span").html(counter);
    if (counter < 0) {
      $(this).siblings("span").addClass("counter-red");
    } else {
      $(this).siblings("span").removeClass("counter-red");
    }
    if (counter >= 0 && counter < 140) {
      $(".error").remove();
    }
  });
});


