const Comments = require("../models/comments");
const Post = require("../models/posts");

module.exports.create = function (req, res) {
  // checking if post exist

  Post.findById({ _id: req.body.post }, function (err, post) {
    if (err) {
      console.log("error finding post in comment", err);
      return res.redirect("/");
    }
    //ok should i try reinstalling mongoose nope error in finding a post
    if (post) {
      // post is found we create comment
      Comments.create(
        {
          content: req.body.content,
          user: req.user._id,
          post: req.body.post,
        },
        function (err, comment) {
          if (err) {
            console.log("error creating comment ");
            return;
          }

          post.comments.push(comment);
          post.save();

          return res.redirect("/");
        }
      );
    } else {
      console.log("Post Not Found");
      return res.redirect("/");
    }
  });
};
