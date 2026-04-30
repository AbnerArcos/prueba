document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("search");
  const items = document.querySelectorAll(".item");
  const filters = document.querySelectorAll(".filter");
  const greeting = document.getElementById("greeting");

  let currentCategory = "all";

  /* 🔥 SALUDO AUTOMÁTICO */
  function actualizarSaludo() {
    const hora = new Date().getHours();

    if (hora >= 6 && hora < 12) {
      greeting.textContent = "Buenos días";
    } else if (hora >= 12 && hora < 19) {
      greeting.textContent = "Buenas tardes";
    } else {
      greeting.textContent = "Buenas noches";
    }
  }

  actualizarSaludo();

  /* 🔥 FILTROS */
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentCategory = btn.dataset.category;
      filterItems();
    });
  });

  /* 🔥 BUSCADOR */
  searchInput.addEventListener("input", filterItems);

  function filterItems() {
    const search = searchInput.value.toLowerCase().trim();

    items.forEach(item => {
      const name = item.querySelector("h3").textContent.toLowerCase();
      const desc = item.querySelector("p").textContent.toLowerCase();
      const category = item.dataset.category;

      const matchText = name.includes(search) || desc.includes(search);
      const matchCategory = currentCategory === "all" || category === currentCategory;

      if (matchText && matchCategory) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

});