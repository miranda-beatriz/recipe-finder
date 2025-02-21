document.getElementById("recipe-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = document.getElementById("query").value;
    fetchRecipes(query);
});

async function fetchRecipes(query) {
    try {
        const response = await fetch(`/api/recipes?query=${query}`);
        if (!response.ok) throw new Error("Error when searching for recipes");
        
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error(error);
        alert("Error when searching for recipes");
    }
}

async function fetchRandomRecipe() {
    try {
        const response = await fetch("/api/random-recipe");
        if (!response.ok) throw new Error("Error when searching for random recipe");
        
        const recipe = await response.json();
        displayRecipes([recipe]);
    } catch (error) {
        console.error(error);
        alert("Error when searching for random recipe");
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipes");
    container.innerHTML = "";
    
    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }
    
    recipes.forEach(({ recipe }) => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe");

        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}">
            <button onclick='saveFavorite(${JSON.stringify(recipe)})'>Save</button>
            <button onclick='rateRecipe("${recipe.label}")'>Rate</button>
        `;
        container.appendChild(recipeElement);
    });
}

async function saveFavorite(recipe) {
    try {
        const response = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipe })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error(error);
        alert("Error saving recipe");
    }
}

async function rateRecipe(label) {
    const rating = prompt("Rate the recipe from 0 to 5:");
    if (rating === null || isNaN(rating) || rating < 0 || rating > 5) {
        alert("Invalid");
        return;
    }
    
    try {
        const response = await fetch("/api/rate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label, rating: Number(rating) })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error(error);
        alert("Error when evaluating recipe");
    }

}

document.getElementById("random-recipe-btn").addEventListener("click", fetchRandomRecipe);
