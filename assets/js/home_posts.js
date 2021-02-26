{
  // using block scope and let/const to prevent conflict

  // method to submit form data as ajax request
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault(); // preventing default form submission
      $.ajax({
        type: "post", // req type
        url: "/posts/create", // action route
        data: newPostForm.serialize(), // serializing form data into json
        success: function (data) {
          // function to be executed on successful form submission first arg is data sent by server
          //   calling the newPostDom function and storing returned DOM li object in newPost
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          new PostComment(data.data.post._id);
          newNoty("Posted!", "success");
        },
        error: function (error) {
          // function to be executed on error in putting req
          console.log(error.responseText);
        },
      });

      $("textarea", newPostForm).val("");
    });
  };

  //  method to create post dom
  let newPostDom = function (post) {
    return $(`
<li class="post-list-item" id="post-${post._id}">

    <div class="post-head">
        <span> ${post.user.name} </span>
        <span class="buttons">
            <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete</a>
        </span>
    </div>
    <p>${post.content}</p>
    <hr />

    <form action="/comments/create" method="POST" class="add-comment-form" id="comment-form-${post._id}">
        <input type="text" name="content" placeholder="Type Comment Here..." autocomplete="off" />
        <input type="hidden" name="post" value="${post._id}" />
        <button type="submit" class="button">Comment</button>
    </form>

    <div class="comment-list-container">

        <h3 class="comment-heading">No Comments</h3>

        <ul id="post-${post._id}-comments-list">
    
        </ul>
    </div>
    </li>
      `);
  };

  // delete post function
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (event) {
      event.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          newNoty("Post Deleted", "success");
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let delPostButtons = document.querySelectorAll(".delete-post-button");
  for (let button of delPostButtons) {
    deletePost(button);
  }
  createPost();
}
