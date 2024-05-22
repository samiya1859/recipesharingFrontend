// recipe details
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if the cookie contains the specified name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const recipeDetails = (recipe) => {
  console.log(recipe);
  const parent = document.getElementById("recipe-details");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("row","text-center");
    div.innerHTML=`
    <div class="col-md-5">
    <div class="recipe-img">
      <img src="${recipe.image}" alt="">
    </div>
</div>
<div class="col-md-7 p-5">
  <div class="recipe-text">
      <span><h6>Recipe id -${recipe.id}</h6></span>
      <h3>${recipe.title}</h3>
      <span>By UserId-${recipe.user}</span><br>
      <span>created on - ${recipe.created}</span><br>
      <h6>Ingredients:  ${recipe.ingredients}</h6> <br>
      <span><h6>Procedure - ${recipe.procedure}</h6></span>
  </div>
</div>
    `;
    parent.appendChild(div);
}


// loading all comments by productId

const displayAllcomments = (comments) => {
    console.log(comments);
    const parent = document.getElementById("slide-coment");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = "";

    comments.forEach((comment) => {
        const div = document.createElement("div");
        div.classList.add("slide-visible");
        div.innerHTML = `
        <h5>Commented by Userid - ${comment.commentor}</h5>
        <h6>Commented on - ${comment.created}</h6>
        <span>${comment.comment}</span>
        <h5>${comment.rating}</h5>
    
        `;
        parent.appendChild(div);

    });
}







const getUserId = () => {
    const isLoggedin = localStorage.getItem("user_id");
    if(isLoggedin){
        return isLoggedin;
    }
    else{
        return "Not a logged in  user";
    }
}

// post commnet

const PostComment = async (event) => {
    event.preventDefault();

    const commentor = getUserId();
    const recipe = document.getElementById("recipeId").value;
    const comment = document.getElementById("comment").value;
    const created = document.getElementById("datetime").value;
    const rating = document.getElementById("rating").value; 

    const alreadyReviewed = await isReviewed(recipe, commentor);
    if (alreadyReviewed) {
        alert("You have already commented on this recipe. Now you can edit or delete it.");
        return;
    }

    const commentInfo = {
        commentor,
        recipe,
        comment,
        created,
        rating
    };

    fetch(`http://127.0.0.1:8000/recipe/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentInfo),
    })
    .then((res) => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) });
        }
        return res.json();
    })
    .then((data) => {
        console.log(data);
        alert("Added comment on this recipe Successfully");
    })
    .catch((error) => {
        console.error("Error:", error.message);
        alert("Comment failed!");
    });
};

document.getElementById('comment-form').addEventListener('submit', PostComment);




const isReviewed = async (recipeId, userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/recipe/comment/?commentor=${userId}&recipe=${recipeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.length > 0;
    } catch (error) {
        console.error("Error:", error.message);
        return false;
    }
};



// get your reviews

const displayAllYourcomments = (comments) => {
    const parent = document.getElementById("Your_comments");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; 

    comments.forEach((comment) => {
        const div = document.createElement("div");
        div.classList.add("card")
        div.innerHTML = `
        <h6>${comment.comment}</h6>
        <p>${comment.rating}</p>
        <span>${comment.created}</span>
        <div class="com-buttons d-flex gap-2">
            <a href="#">Edit</a>
            <a onclick="deletecomment(${comment.id})" href="#">Delete</a>
        </div>
        `;
        parent.appendChild(div);
    })
}


// deleting commet
function deletecomment(commentId) {

    const confirmation = confirm("Are you sure you want to delete this comment?");
    
    // If the user confirms deletion, send a DELETE request to the server
    if (confirmation) {
        fetch(`http://127.0.0.1:8000/recipe/comment/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            console.log('Review deleted successfully');
            alert("Review deleted successfully")
            
        })
        .catch(error => {
            console.error('Error deleting review:', error);
            
        });
    }
}



const getparams = () => {
    const params = new URLSearchParams(window.location.search).get("recipeId");
    console.log(params);
    fetch(`http://127.0.0.1:8000/recipe/list/${params}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        recipeDetails(data)
    })

    fetch(`http://127.0.0.1:8000/recipe/comment/?recipe=${params}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (Array.isArray(data.results)) {
            displayAllcomments(data.results);
        } else {
            console.error('Expected an array in data.results but got:', data);
        }
    })
    
    const user_id = getUserId()
    fetch(`http://127.0.0.1:8000/recipe/comment/?commentor=${user_id}&recipe=${params}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (Array.isArray(data.results)) {
            displayAllYourcomments(data.results);
        } else {
            console.error('Expected an array in data.results but got:', data);
        }
    })
}
getparams();
