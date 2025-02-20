document.getElementById("recipe-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = document.getElementById("query").value;
    fetchRecipes(query);
});

async function fetchRecipes(query) {
    try {
        const response = await fetch(`/api/recipes?query=${query}`);
        if (!response.ok) throw new Error("Erro ao buscar receitas");
        
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error(error);
        alert("Erro ao buscar receitas");
    }
}

async function fetchRandomRecipe() {
    try {
        const response = await fetch("/api/random-recipe");
        if (!response.ok) throw new Error("Erro ao buscar receita aleatória");
        
        const recipe = await response.json();
        displayRecipes([recipe]);
    } catch (error) {
        console.error(error);
        alert("Erro ao buscar receita aleatória");
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipes");
    container.innerHTML = "";
    
    if (recipes.length === 0) {
        container.innerHTML = "<p>Nenhuma receita encontrada.</p>";
        return;
    }
    
    recipes.forEach(({ recipe }) => {
        const recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe");

        recipeElement.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}">
            <button onclick='saveFavorite(${JSON.stringify(recipe)})'>Salvar</button>
            <button onclick='rateRecipe("${recipe.label}")'>Avaliar</button>
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
        alert("Erro ao salvar receita");
    }
}

async function rateRecipe(label) {
    const rating = prompt("Dê uma nota de 0 a 5 para a receita:");
    if (rating === null || isNaN(rating) || rating < 0 || rating > 5) {
        alert("Nota inválida");
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
        alert("Erro ao avaliar receita");
    }
}

// Botão para receita aleatória
document.getElementById("random-recipe-btn").addEventListener("click", fetchRandomRecipe);
