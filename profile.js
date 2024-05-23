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


const getUserId = () => {
    const isLoggedin = localStorage.getItem("user_id");
    if(isLoggedin){
        return isLoggedin;
    }
    else{
        return "Not a logged in  user";
    }
}

function getFirst20Words(text) {
    const words = text.split(' ');
    const first20Words = words.slice(0, 20);
    return first20Words.join(' ') + (words.length > 20 ? '...' : '');
}

// Show user information
const loadUserInfo = () => {
    const user = getUserId();
    if(user){
        fetch(`https://recipesharingbackend-dpiy.onrender.com/user/list/${user}`)
        .then((res)=> res.json())
        .then((data) => {
            console.log(data);
            displayProfileData(data);
        })
    }
}
const displayProfileData = (user) => {
    const span = document.getElementById("user-info")
    span.innerHTML=`
       <h5>${user.first_name} ${user.last_name}</h5>
       <h6>${user.email}</h6>
    `;
}
loadUserInfo();


// post recipe
const PostRecipe = (event) => {
    const user = getUserId()
    event.preventDefault();
    if(user){
        const formData = new FormData();
        formData.append('user',user);
        formData.append('title', document.getElementById('recipeName').value);
        formData.append('ingredients', document.getElementById('ingredients').value);
        formData.append('procedure', document.getElementById('procedure').value);
        formData.append('image', document.getElementById('image').files[0]);
        formData.append('category', document.getElementById('category').value);
        formData.append('created', document.getElementById('datetime').value);
    
    
        fetch('https://recipesharingbackend-dpiy.onrender.com/recipe/list/', {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: formData,
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
              } else {
                return res.json();
              }
        })
        .then((data) => {
            console.log(data);
            alert('Recipe posted successfully');
        })
        .catch((error) => {
            console.error('Error:', error.message);
            alert('Failed to post recipe!');
        });
    } else{
        alert("Only Logged in user are allowed to post recipes.Please log in first");
        console.error("Login required");
    }
 
};

document.getElementById('recipe-form').addEventListener('submit', PostRecipe);




//  Show your posted recipes

const loadYourRecipes = () => {
    const user_id = getUserId()
    if(user_id){
        fetch(`https://recipesharingbackend-dpiy.onrender.com/recipe/list/?user=${user_id}`)
    .then((res) => res.json())
    .then((data) =>{
        console.log(data);
        if(Array.isArray(data.results)) {
            displyaYourRecipes(data.results);
        }else {
            console.error('Expected an array in data.results but got:', data);
        }
    })
    } else{
        alert('Login or register first');
        console.error("Login required");
    }
    
}
const displyaYourRecipes = (recipes) => {
    const parent = document.getElementById("allRecipes");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; 

    recipes.forEach((recipe) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <img src="${recipe.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <a href="recipeDetails.html?recipeId=${recipe.id}">${recipe.title}</a>
            <p class="card-text">${getFirst20Words(recipe.ingredients)}</p>
            
            <div class="buttons d-flex gap-2">
            <a href="editrecipe.html?recipeId=${recipe.id}" class="edit">Edit</a>


                <a onclick="deleteRecipe(${recipe.id})" href="#" class="delete">Delete</a>
            </div>
        `;
        parent.appendChild(div);
    })
}
loadYourRecipes();

// deletiong recipe
function deleteRecipe(recipeId) {
    const user = getUserId();
    if (user){
        const confirmation = confirm("Are you sure you want to delete this recipe?");
    
    // If the user confirms deletion, send a DELETE request to the server
    if (confirmation) {
        fetch(`https://recipesharingbackend-dpiy.onrender.com/recipe/list/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete recipe');
            }

            console.log('recipe deleted successfully');
            alert("recipe deleted successfully")
            
        })
        .catch(error => {
            console.error('Error deleting recipe:', error);
            
        });
    }
    } else{
        alert("You cannot delete a recipe. You are not a logged in user");
        console.error("Login required");
    }

    
}




// Editing and Updating recipe
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');
    
    if (recipeId) {
        fetchRecipeData(recipeId);
    }

    const form = document.getElementById('updated-recipe-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            editSubmitRecipeData(event, recipeId);
        });
    }
});

const fetchRecipeData = (recipeId) => {
    return fetch(`https://recipesharingbackend-dpiy.onrender.com/recipe/list/${recipeId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        setFormData(data);
    })
    .catch((error) => console.error('Error fetching recipe:', error));
};

const setFormData = (recipeData) => {
    document.getElementById("UpdatedrecipeName").value = recipeData.title;
    document.getElementById("Updatedingredients").value = recipeData.ingredients;
    document.getElementById("Updatedprocedure").value = recipeData.procedure;
    document.getElementById("Updatedcategory").value = recipeData.category;
    const createdDateTime = new Date(recipeData.created);
    const formattedCreatedDateTime = createdDateTime.toISOString().slice(0, 16);
    document.getElementById("Updateddatetime").value = formattedCreatedDateTime;
};

const editSubmitRecipeData = (event, recipeId) => {
    event.preventDefault();
    const user = getUserId();

    const formData = new FormData();
    formData.append('user', user);
    formData.append('title', document.getElementById('UpdatedrecipeName').value);
    formData.append('ingredients', document.getElementById('Updatedingredients').value);
    formData.append('procedure', document.getElementById('Updatedprocedure').value);
    const imageFile = document.getElementById('Updatedimage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    formData.append('category', document.getElementById('Updatedcategory').value);
    formData.append('created', document.getElementById('Updateddatetime').value);

    fetch(`https://recipesharingbackend-dpiy.onrender.com/recipe/list/${recipeId}/`, {
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
            return res.text().then(text => { throw new Error(text); });
        }
    })
    .then((data) => {
        console.log(data);
        alert('Recipe updated successfully');
    })
    .catch((error) => {
        console.error('Error:', error.message);
        alert('Failed to update recipe!');
    });
};




