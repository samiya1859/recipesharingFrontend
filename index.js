// loading all categories
const loadCategories = () => {
    fetch('http://127.0.0.1:8000/recipe/category/')
        .then((res) => res.json())
        .then((data) => {
            console.log('API response:', data);
            if (Array.isArray(data)) {
                displayCategories(data);
            } else {
                console.error('Expected an array but:', data);
            }
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });
};

const displayCategories = (categories) => {
    const parent = document.getElementById('category');
    if (!parent) {
        console.log('Parent element not found');
        return;
    }
    parent.innerHTML = '';

    categories.forEach((category) => {
        const div = document.createElement('div');
        div.classList.add('category-list');
        div.innerHTML = `
            <a href="#">${category.category}</a>
        `;
        parent.appendChild(div);
    });
};

loadCategories();



// Function to load all recipes from the API



const loadAllRecipe = (search) => {
    console.log(search);
    fetch(`http://127.0.0.1:8000/recipe/list/?search=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            console.log('API response:', data);
            if (Array.isArray(data.results)) {
                displayAllRecipe(data.results);
            } else {
                console.error('Expected an array in data.results but got:', data);
            }
        })
        .catch((error) => {
            console.error('Error fetching recipes:', error);
        });
};

// Function to display all recipes
const displayAllRecipe = (recipes) => {
    const parent = document.getElementById('allRecipes');
    if (!parent) {
        console.log('Parent element not found');
        return;
    }
    parent.innerHTML = '';
    recipes.forEach((recipe) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <img src="${recipe.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4>${recipe.title}</h4>
                <p class="card-text">${getFirst20Words(recipe.ingredients)}</p>
                <a href="recipeDetails.html?recipeId=${recipe.id}">See more..</a>
            </div>
        `;
        parent.appendChild(div);
    });
}

// Load all recipes on page load
loadAllRecipe();



const getparams = () => {
    const params = new URLSearchParams(window.location.search).get("recipeId");
    console.log(params);
}
getparams();

const handleSearch = () => {
    const value = document.getElementById("search").value;
    console.log(value);
    loadAllRecipe(value)
}
handleSearch();

function getFirst20Words(text) {
    const words = text.split(' ');
    const first20Words = words.slice(0, 20);
    return first20Words.join(' ') + (words.length > 20 ? '...' : '');
}