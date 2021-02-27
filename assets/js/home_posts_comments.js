// function to change add-comment-form submission to AJAX

let currentUser = document.querySelector("#loggedInUserData").getAttribute("data-user");

let newNoty = function (text, status) {
  new Noty({
    theme: "relax",
    text: `${text}`,
    type: `${status}`,
    layout: "topRight",
    timeout: 1500,
  }).show();
};

class PostComment {
  constructor(postId) {
    this.post = $(`post-${postId}`);
    this.newCommentForm = $(`#comment-form-${postId}`);
    this.commentList = $(`#post-${postId}-comments-list`); // comment container inside this.post
    newComment(this.newCommentForm, this.commentList);
    // converting all delete buttons to ajax
    this.deleteButtons = $(" .delete-comment-button", this.commentList);
    for (let button of this.deleteButtons) {
      deleteComment(button);
    }
  }
}

let newComment = function (newCommentForm, commentList) {
  newCommentForm.submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/comments/create",
      data: newCommentForm.serialize(),
      success: function (data) {
        // call the function that create the comment dom
        let newComment = newCommentDom(data.data.comment);
        commentList.prepend(newComment); // pre-pending to current comment list container
        deleteComment($(" .delete-comment-button", newComment));
        newNoty("Comment Posted", "success");
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });

    $("input:text", newCommentForm).val("");
  });
};

let newCommentDom = function (comment) {
  return $(`
    <li class="comment-${comment._id} comment">
      <span>
        <span> ${currentUser} </span>
        <span>
          <a href="/comments/destroy/${comment._id}" class="delete-comment-button">Delete</a>
        </span>
      </span>
      <p>${comment.content}</p>
    </li>
      `);
};

let deleteComment = function (deleteLink) {
  $(deleteLink).click(function (e) {
    e.preventDefault();

    $.ajax({
      type: "get",
      url: $(deleteLink).prop("href"),
      success: function (data) {
        $(`.comment-${data.data.comment_id}`).remove();
        newNoty("Comment Deleted", "success");
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });
};

// converting all posts form and delete buttons to ajax
let posts = $(".post-list-item");
for (let post of posts) {
  new PostComment($(post).prop("id").slice(5));
}
