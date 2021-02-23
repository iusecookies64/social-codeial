const Posts = require("../models/posts");

module.exports.home = function (req, res) {
  Posts.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .exec(function (err, posts) {
      if (err) {
        console.log("error fetching posts from db");
        return;
      }

      return res.render("home", {
        title: "Codeial : Home",
        posts: posts,
      });
    });
};
