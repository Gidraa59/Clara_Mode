// ================= NAVIGATION ENTRE LES ÉCRANS =================
// Chaque écran est une <section id="vue-NOM"> dans index.html.
// Tout élément avec data-vue="NOM" (onglets du menu, cartes de l'accueil)
// affiche l'écran correspondant quand on appuie dessus.

const titre = document.getElementById("titre");
const sousTitre = document.getElementById("sous-titre");

function afficherVue(nom) {
  // 1. On montre seulement l'écran demandé
  document.querySelectorAll(".vue").forEach((v) => {
    v.hidden = v.id !== "vue-" + nom;
  });

  // 2. On met en couleur l'onglet actif
  document.querySelectorAll(".onglet").forEach((o) => {
    o.classList.toggle("actif", o.dataset.vue === nom);
  });

  // 3. On met à jour l'en-tête
  if (nom === "accueil") {
    const maintenant = new Date();
    titre.textContent = maintenant.getHours() < 18 ? "Bonjour" : "Bonsoir";
    const date = maintenant.toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    });
    sousTitre.textContent = date.charAt(0).toUpperCase() + date.slice(1);
  } else {
    titre.textContent = document.getElementById("vue-" + nom).dataset.titre;
    sousTitre.textContent = "";
  }

  window.scrollTo(0, 0);
}

// Un seul écouteur pour tous les boutons qui ont un data-vue
document.addEventListener("click", (e) => {
  const cible = e.target.closest("[data-vue]");
  if (cible) afficherVue(cible.dataset.vue);
});

// ================= LISTE DE COURSES =================
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

const liste = document.getElementById("liste");
const messageVide = document.getElementById("vide");
const compteur = document.getElementById("compteur-courses");

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

  // Petit résumé affiché sur la carte « Courses » de l'accueil
  const restants = articles.filter((a) => !a.fait).length;
  if (restants === 0) compteur.textContent = "Rien à acheter";
  else compteur.textContent = restants + (restants > 1 ? " articles à acheter" : " article à acheter");
}

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

// ================= DÉMARRAGE =================
afficher();
afficherVue("accueil");

// Mode « appli » : le service worker met les fichiers en cache
// pour que l'appli s'ouvre même sans réseau.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
