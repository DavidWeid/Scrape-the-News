$(function() {
  $.ajax("/test", {
    type: "GET"
  }).then(function(data) {
    console.log(data);
  });
});
