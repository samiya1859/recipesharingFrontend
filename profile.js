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
// post recipe



const PostRecipe = (event) => {
    const user = getUserId()
    event.preventDefault();



    const formData = new FormData();
    formData.append('user',user);
    formData.append('title', document.getElementById('recipeName').value);
    formData.append('ingredients', document.getElementById('ingredients').value);
    formData.append('procedure', document.getElementById('procedure').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('category', document.getElementById('category').value);
    formData.append('created', document.getElementById('datetime').value);


    fetch('http://127.0.0.1:8000/recipe/', {
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
};

document.getElementById('recipe-form').addEventListener('submit', PostRecipe);


//  Show your posted recipes

const loadYourRecipes = () => {
    const user_id = getUserId()
    fetch(`http://127.0.0.1:8000/recipe/list/?user=${user_id}`)
    .then((res) => res.json())
    .then((data) =>{
        console.log(data);
        if(Array.isArray(data.results)) {
            displyaYourRecipes(data.results);
        }else {
            console.error('Expected an array in data.results but got:', data);
        }
    })
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
            <a href="#"><h4>${recipe.title}</h4></a>
            <p class="card-text">${getFirst20Words(recipe.ingredients)}</p>
            
            <div class="buttons d-flex gap-2">
                <a href="#" class="edit" >Edit</a>
                <a href="#" class="delete">Delete</a>
            </div>
        `;
        parent.appendChild(div);
    })
}