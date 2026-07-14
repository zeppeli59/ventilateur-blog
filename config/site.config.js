// ============================================================
// CONFIGURATION DU SITE — à personnaliser avant le premier lancement
// ============================================================
export const siteConfig = {
  // Nom affiché du site
  nom: "AirGuide",
  baseline: "Le guide indépendant du ventilateur",

  // Domaine final du site (utilisé pour le sitemap, les balises canonical et Open Graph)
  // Remplace par ton propre nom de domaine une fois acheté, ou par ton adresse GitHub Pages
  // ex: "https://tonpseudo.github.io/ventilateur-blog" ou "https://airguide.fr"
  domaine: process.env.SITE_DOMAIN || "https://EXEMPLE.github.io/ventilateur-blog",

  // Tag d'affiliation Amazon (Amazon Associates)
  // Format attendu : "monsite-21" (France) — à récupérer une fois ton compte Amazon Associates validé
  // Tant que tu n'as pas de tag, le site fonctionne avec un tag factice "SANS-TAG-21"
  // pour que tu puisses tester la génération — remplace-le avant la mise en ligne réelle.
  amazonTag: process.env.AMAZON_TAG || "SANS-TAG-21",

  // Domaine Amazon à cibler (amazon.fr pour un public francophone)
  amazonDomaine: "amazon.fr",

  // Email de contact affiché en pied de page
  contactEmail: process.env.CONTACT_EMAIL || "contact@example.com",

  // Nombre d'articles générés par jour (1 = un article/jour comme demandé)
  articlesParJour: 1,

  // Longueur cible des articles
  motsCibles: 2500,
};
