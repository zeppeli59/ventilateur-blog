import { siteConfig } from "../../config/site.config.js";
import { disclosureAffiliation } from "./affiliate.js";

const typeLabel = { comparatif: "Comparatif", guide: "Guide complet", article: "Article" };

function head(title, description, canonical) {
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="${siteConfig.domaine}/styles/main.css">
  <link rel="alternate" type="application/rss+xml" title="${siteConfig.nom}" href="${siteConfig.domaine}/rss.xml">`;
}

function header() {
  return `<header class="site-header">
    <a class="logo" href="${siteConfig.domaine}/">${siteConfig.nom}<span class="logo__dot">.</span></a>
    <nav class="site-nav">
      <a href="${siteConfig.domaine}/#comparatifs">Comparatifs</a>
      <a href="${siteConfig.domaine}/#guides">Guides</a>
      <a href="${siteConfig.domaine}/#articles">Articles</a>
    </nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <p>${siteConfig.nom} — ${siteConfig.baseline}</p>
    ${disclosureAffiliation}
    <p><a href="mailto:${siteConfig.contactEmail}">${siteConfig.contactEmail}</a></p>
  </footer>`;
}

export function pageArticle(article) {
  const canonical = `${siteConfig.domaine}/articles/${article.slug}.html`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (article.faqJSON || []).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.reponse },
    })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titreSEO,
    description: article.metaDescription,
    datePublished: article.date,
    author: { "@type": "Organization", name: siteConfig.nom },
  };

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  ${head(article.titreSEO, article.metaDescription, canonical)}
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
  ${header()}
  <main class="article">
    <p class="breadcrumb"><a href="${siteConfig.domaine}/">Accueil</a> / <span>${typeLabel[article.type] || "Article"}</span></p>
    <span class="badge badge--${article.type}">${typeLabel[article.type] || "Article"}</span>
    <p class="article__date">Publié le ${article.dateAffichage}</p>
    ${article.contenuHTML}
  </main>
  ${footer()}
</body>
</html>`;
}

export function pageAccueil(articles) {
  const parType = (t) => articles.filter((a) => a.type === t).slice(0, 12);
  const carte = (a) => `<a class="carte" href="${siteConfig.domaine}/articles/${a.slug}.html">
      <span class="carte__badge badge--${a.type}">${typeLabel[a.type]}</span>
      <h3>${a.titreSEO.replace(/\s*\|.*$/, "")}</h3>
      <p>${a.excerpt}</p>
      <span class="carte__date">${a.dateAffichage}</span>
    </a>`;

  const section = (id, titre, items) => `
    <section id="${id}" class="section">
      <h2>${titre}</h2>
      <div class="grille">${items.map(carte).join("\n")}</div>
    </section>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  ${head(`${siteConfig.nom} — ${siteConfig.baseline}`, "Comparatifs, guides d'achat et conseils indépendants pour choisir le bon ventilateur selon votre besoin.", siteConfig.domaine)}
</head>
<body>
  ${header()}
  <main>
    <section class="hero">
      <p class="hero__eyebrow">Mis à jour tous les jours</p>
      <h1>Trouvez le ventilateur qui vous correspond vraiment</h1>
      <p class="hero__sub">Comparatifs, guides complets et conseils pratiques, sans jargon marketing.</p>
    </section>
    ${section("comparatifs", "Comparatifs", parType("comparatif"))}
    ${section("guides", "Guides complets", parType("guide"))}
    ${section("articles", "Articles", parType("article"))}
  </main>
  ${footer()}
</body>
</html>`;
}

export function fluxRSS(articles) {
  const items = articles
    .slice(0, 30)
    .map(
      (a) => `<item>
        <title><![CDATA[${a.titreSEO}]]></title>
        <link>${siteConfig.domaine}/articles/${a.slug}.html</link>
        <guid>${siteConfig.domaine}/articles/${a.slug}.html</guid>
        <pubDate>${new Date(a.date).toUTCString()}</pubDate>
        <description><![CDATA[${a.excerpt}]]></description>
      </item>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${siteConfig.nom}</title>
  <link>${siteConfig.domaine}</link>
  <description>${siteConfig.baseline}</description>
  ${items}
</channel></rss>`;
}

export function sitemapXML(articles) {
  const urls = [siteConfig.domaine, ...articles.map((a) => `${siteConfig.domaine}/articles/${a.slug}.html`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map((u) => `<url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
}
