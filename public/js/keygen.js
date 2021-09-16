$(document).ready(function(){
  $("#key-generate").click(function(){
    $.post("/apiGen", function(data){
      $("#key").val(data);
    });
  })
})
