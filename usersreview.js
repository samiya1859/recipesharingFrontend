// editing comments
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const commentId = urlParams.get('commentId');
    console.log(commentId);
    if (commentId) {
        fetchCommentData(commentId);
    }

    const form = document.getElementById('updated-comment-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            editSubmitCommentData(event, commentId);
        });
    }
});

const fetchCommentData = (commentId) => {
    console.log(commentId);
    return fetch(`http://127.0.0.1:8000/recipe/comment/${commentId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to fetch comment data');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        setFormData(data);
    })
    .catch((error) => console.error('Error fetching comment:', error));
};

const setFormData = (commentData) => {
    console.log(commentData);

    document.getElementById("updaterecipeId").value = commentData.recipe;
    document.getElementById("updatedcomment").value = commentData.comment;
    document.getElementById("updatedrating").value = commentData.rating;
    
    const createdDateTime = new Date(commentData.created);
    const formattedCreatedDateTime = createdDateTime.toISOString().slice(0, 16);
    document.getElementById("updateddatetime").value = formattedCreatedDateTime;
};

const editSubmitCommentData = async (event, commentId) => {
    event.preventDefault();
    const commentor = getUserId();

    const formData = new FormData();
    formData.append('commentor', commentor);
    formData.append('recipe', document.getElementById('updaterecipeId').value);
    formData.append('comment', document.getElementById('updatedcomment').value);
    formData.append('rating', document.getElementById('updatedrating').value);
    
    formData.append('created', document.getElementById('updateddatetime').value);
    
    fetch(`http://127.0.0.1:8000/recipe/comment/${commentId}/`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData,
    })
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Failed to update comment');
        }
    })
    .then((data) => {
        console.log(data);
        alert('Comment updated successfully');
    })
    .catch((error) => {
        console.error('Error:', error.message);
        alert('Failed to update Comment!');
    });
};