// console.log("hello");
// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();

//     reader.onload = function (e) {
//       $("#image_preview").attr("src", e.target.result);
//     };

//     reader.readAsDataURL(input.files[0]); // convert to base64 string
//   }
// }

// $("#imgInp").change(function () {
//   readURL(this);
// });

var loadFile = function (event) {
  var output = document.getElementById("image_preview");
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
};
