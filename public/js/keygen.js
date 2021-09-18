$(document).ready(function(){
  $("#key-generate").click(function(){
    $.post("/apiKeyGen", function(data){
      $("#key").val(data);
    });
  })
})
