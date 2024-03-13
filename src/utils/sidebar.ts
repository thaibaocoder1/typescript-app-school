import { showSpinner, hideSpinner } from "./spinner";
import { CatalogProps, Catalog } from "../models/Catalog";

export async function renderSidebar(idElement: string) {
  const sidebar = document.querySelector(idElement);
  if (!sidebar) return;
  sidebar.textContent = "";
  try {
    showSpinner();
    const data = await Catalog.loadAll();
    hideSpinner();
    data.forEach((item: CatalogProps) => {
      const linkElement = document.createElement("a");
      linkElement.className = "nav-item nav-link";
      linkElement.href = `/shop.html?slug=${item.slug}`;
      linkElement.textContent = item.title;
      sidebar.appendChild(linkElement);
    });
  } catch (error) {
    console.log(error);
  }
}
