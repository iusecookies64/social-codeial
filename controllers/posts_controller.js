const Post = require("../models/posts");

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
