$(document).ready(function(){
        var url,slug;
        $("#submit").click(function(){
          url=$("#url").val();
          slug=$("#slug").val();
          $.post("/url",{url: url,slug: slug}, function(data){
            if(data != "") {
                $("#result").val("http://akurls.ml/"+data);
                $(".result").css({display:"flex"});
              }
            if (data == "slug in use") {
                $("#result").val(data);
                $(".result").css({display:"flex"});
            }
          });
        });
      });
  /*   custom slug  */
    // $(document).ready(function(){
    //     var slug-text;
    //     $("#custom-slug").click(function(){
    //       slug-text=$("#custom-slug").text();
    //       console.log(slug-text)
    //       if (slug-text == "Use Custom Slug") {
    //         $("#slug").css({display:"block"});
    //         $("#custom-slug").text("Don't Use Custom Slug")
    //       }
    //     });
    // });
    
    function customSlug() {
      var slugText = document.getElementById('custom-slug').innerText;
      
      if (slugText == "Use Custom Slug") {
        document.getElementById('custom-slug').innerText = "Don't Use Custom Slug";
        document.getElementById('slug').style.display = "block";
      }
      if (slugText == "Don't Use Custom Slug") {
        document.getElementById('custom-slug').innerText = "Use Custom Slug";
        document.getElementById('slug').value = "";
        document.getElementById('slug').style.display = "none";
      }
    }
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
      
      
      
      