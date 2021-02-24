const Posts = require("../models/posts");
const Users = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    let posts = await Posts.find({})
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    let users = await Users.find({});

    return res.render("home", {
      title: "Codeial : Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    req.flash("error", "Error Loading Home Page");
    return res.status(401).send("<h1>Error!</h1>");
  }
};
