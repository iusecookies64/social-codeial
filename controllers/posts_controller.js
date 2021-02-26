const Post = require("../models/posts");
const Comments = require("../models/comments");
const Users = require("../models/user");

module.exports.create = async function (req, res) {
  // creating post after authentication
  let post = await Post.create({
    content: req.body.content,
    user: req.user._id,
  });

  // let user = await Users.findById(post.user);
  // sending post as json if req is XMLHttpRequest
  if (req.xhr) {
    return res.status(200).json({
      data: {
        post: post,
      },
      message: "Post Created",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    // finding the post
    let post = await Post.findById(req.params.id);
    // if such post exist
    if (post) {
      // checking if user authorized to delete
      if (post.user == req.user.id) {
        // saving post id to be used later in deleting comments
        let postId = post.id;
        post.remove();

        // deleting Comments
        await Comments.deleteMany({ post: postId });
        // returning back with success flash message

        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id,
            },
            message: "Post Deleted",
          });
        }
      }
    }
    return res.redirect("back");
  } catch (error) {
    req.flash("error", "Error Deleting Post");
    return res.redirect("/");
  }
};
