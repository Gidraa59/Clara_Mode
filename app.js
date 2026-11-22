// ---------- 1. Données ----------
// Les articles sont stockés dans le téléphone (localStorage), sous forme de texte JSON.
// Un article = { id: 123, texte: "Lait", fait: false }
const CLE = "courses-v1";

function charger() {
  try {
    return JSON.parse(localStorage.getItem(CLE)) || [];
  } catch {
    return []; // si les données sont illisibles, on repart d'une liste vide
  }
}

function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(articles));
}

let articles = charger();

// ---------- 2. Affichage ----------
const liste = document.getElementById("liste");
const messageVide = document.getElementById("vide");

// On reconstruit toute la liste à chaque changement : simple et suffisant ici.
function afficher() {
  liste.innerHTML = "";

  for (const article of articles) {
    const li = document.createElement("li");
    if (article.fait) li.classList.add("fait");

    // Case à cocher
    const case_ = document.createElement("input");
    case_.type = "checkbox";
    case_.checked = article.fait;
    case_.addEventListener("change", () => {
      article.fait = case_.checked;
      sauvegarder();
      afficher();
    });

    // Texte (textContent et non innerHTML : plus sûr)
    const texte = document.createElement("span");
    texte.textContent = article.texte;

    // Bouton supprimer
    const bouton = document.createElement("button");
    bouton.className = "supprimer";
    bouton.textContent = "✕";
    bouton.setAttribute("aria-label", "Supprimer " + article.texte);
    bouton.addEventListener("click", () => {
      articles = articles.filter((a) => a.id !== article.id);
      sauvegarder();
      afficher();
    });

    li.append(case_, texte, bouton);
    liste.append(li);
  }

  messageVide.hidden = articles.length > 0;
}

// ---------- 3. Actions ----------
document.getElementById("formulaire").addEventListener("submit", (e) => {
  e.preventDefault(); // empêche le rechargement de la page
  const saisie = document.getElementById("saisie");
  const texte = saisie.value.trim();
  if (!texte) return;

  articles.push({ id: Date.now(), texte, fait: false });
  sauvegarder();
  afficher();
  saisie.value = "";
});

document.getElementById("nettoyer").addEventListener("click", () => {
  articles = articles.filter((a) => !a.fait);
  sauvegarder();
  afficher();
});

afficher();

// ---------- 4. Mode « appli » : service worker ----------
// Il met les fichiers en cache pour que l'appli s'ouvre même sans réseau.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
