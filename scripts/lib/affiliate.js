import { siteConfig } from "../../config/site.config.js";

/**
 * Construit un lien affilié Amazon "de recherche" pour un mot-clé donné.
 * Avantage : fonctionne dès aujourd'hui, sans ASIN précis à connaître,
 * et ne prétend jamais qu'un produit précis a telle caractéristique inventée.
 */
export function lienAffilieRecherche(motCle) {
  const q = encodeURIComponent(motCle);
  return `https://www.${siteConfig.amazonDomaine}/s?k=${q}&tag=${siteConfig.amazonTag}`;
}

/**
 * Construit un lien affilié direct vers une fiche produit si tu connais l'ASIN
 * (à renseigner plus tard dans config/products.json une fois que tu auras
 * sélectionné de vrais produits à mettre en avant).
 */
export function lienAffilieASIN(asin) {
  return `https://www.${siteConfig.amazonDomaine}/dp/${asin}?tag=${siteConfig.amazonTag}`;
}

/**
 * Transforme les marqueurs {{AFFILIATE:motclé|Texte du bouton}} générés par le modèle
 * en vrais encarts HTML cliquables, stylés comme une "fiche technique".
 */
export function injecterEncartsAffilies(html) {
  const regex = /\{\{AFFILIATE:([^|]+)\|([^}]+)\}\}/g;
  return html.replace(regex, (_, motCle, label) => {
    const url = lienAffilieRecherche(motCle.trim());
    return `
    <aside class="cta-produit" role="complementary">
      <p class="cta-produit__eyebrow">Sélection Amazon</p>
      <a class="cta-produit__bouton" href="${url}" target="_blank" rel="nofollow sponsored noopener">
        ${label.trim()} →
      </a>
    </aside>`;
  });
}

/**
 * Bandeau de transparence obligatoire (charte Amazon Associates).
 */
export const disclosureAffiliation = `
<p class="disclosure">
  En tant que Partenaire Amazon, ce site réalise un bénéfice sur les achats remplissant les conditions requises.
  Les liens présents dans cet article peuvent être des liens affiliés.
</p>`;
