const Post = require("../models/posts");
const Comments = require("../models/comments");

module.exports.create = function (req, res) {
  // creating post after authentication
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    function (err, post) {
      if (err) {
        console.log("error creating post");
        return;
      }

      return res.redirect("/");
    }
  );
};

module.exports.destroy = function (req, res) {
  // finding the post
  Post.findById(req.params.id, function (err, post) {
    // if such post exist
    if (post) {
      // checking if user authorized to delete
      if (post.user == req.user.id) {
        // saving post id to be used later in deleting comments
        let postId = post.id;

        post.remove();

        // deleting Comments
        Comments.deleteMany({ post: postId }, function (err) {
          if (err) {
            req.flash("error", "Error in Deleting Comments");
            return res.redirect("back");
          }

          // returning back with success flash message
          req.flash("success", "Post Deleted!");
          return res.redirect("back");
        });
      }
    }
    // if post don't exist
    else {
      // returning back with error flash message
      req.flash("error", "Error Deleting Post!");
      return res.redirect("back");
    }
  });
};
