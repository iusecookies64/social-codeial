const Comments = require("../models/comments");
const Post = require("../models/posts");

module.exports.create = async function (req, res) {
  // checking if post exist
  let post = await Post.findById({ _id: req.body.post });
  if (post) {
    // post is found we create comment
    let comment = await Comments.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post,
    });

    post.comments.push(comment);
    post.save();

    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment: comment,
        },
        message: "Comment Created",
      });
    }
    return res.redirect("/");
  } else {
    console.log("Post Not Found");
    return res.redirect("/");
  }
};

module.exports.destroy = function (req, res) {
  // finding comment
  Comments.findById(req.params.id, function (err, comment) {
    // finding post related to comment
    Post.findById(comment.post, function (err, post) {
      // checking for authentication
      if (comment.user == req.user.id || post.user == req.user.id) {
        // storing post id to delete comment from later

        let postId = post.id;

        comment.remove();

        Post.findByIdAndUpdate(
          postId,
          { $pull: { comments: req.params.id } },
          function (err, post) {
            if (req.xhr) {
              return res.status(200).json({
                data: {
                  comment_id: req.params.id,
                },
                message: "Comment Deleted",
              });
            }

            req.flash("success", "Comment Deleted Successfully");
            return res.redirect("/");
          }
        );
      } else {
        req.flash("error", "You Are Not Authorized");
        return res.redirect("/");
      }
    });
  });
};
