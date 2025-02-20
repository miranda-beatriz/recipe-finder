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

        const img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.label;

        const title = document.createElement("h2");
        title.textContent = recipe.label;

        const link = document.createElement("a");
        link.href = recipe.url;
        link.textContent = "Ver Receita";
        link.target = "_blank";

        recipeElement.append(img, title, link);
        container.appendChild(recipeElement);
    });
}
