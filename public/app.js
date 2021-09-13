$(document).ready(function(){
        var url,slug;
        $("#submit").click(function(){
          url=$("#url").val();
          slug=$("#slug").val();
          $.post("/url",{url: url,slug: slug}, function(data){
            if(data != "") {
                $("#result").val("http://akurls.herokuapp.com/"+data);
              }
            if (data == "slug in use") {
                $("#result").val(data);
            }
          });
        });
      });
      
 // Copy function
   function copy() {
      /* Get the text field */
      var copyText = document.getElementById("result");
    
      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */
    
       /* Copy the text inside the text field */
      navigator.clipboard.writeText(copyText.value);
    
      /* Alert the copied text */
      alert("Copied the text");
    }
      
      
      
      