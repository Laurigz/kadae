// Script to patch productos.html – update "Consultar" buttons for transmisiones
// and wrap each plasticos card in an <a> tag linking to its product page.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'website', 'productos.html');
let html = fs.readFileSync(filePath, 'utf8');

// ── TRANSMISIONES: map each comment to its product slug ──────────────────────

const transmisionMap = [
  { comment: 'CRUCETA K514 CON RODILLOS',    slug: 'cruceta-k514-rodillos' },
  { comment: 'CRUCETA K518 CON RODILLOS',    slug: 'cruceta-k518-rodillos' },
  { comment: 'CRUCETA K521 CON RODILLOS',    slug: 'cruceta-k521-rodillos' },
  { comment: 'CRUCETA K526 CON RODILLOS',    slug: 'cruceta-k526-rodillos' },
  { comment: 'CRUCETA K514 CON BUJES',       slug: 'cruceta-k514-bujes' },
  { comment: 'CRUCETA CR 1002 CON RODILLOS', slug: 'cruceta-cr1002-rodillos' },
  { comment: 'HORQUILLA K518 TRILOBULAR EXT', slug: 'horquilla-k518-trilobular' },
  { comment: 'HORQUILLA K521 OVOIDAL EXT',   slug: 'horquilla-k521-ovoidal' },
  { comment: 'HORQUILLA CON SEGURO A BOLITA',slug: 'horquilla-seguro-bolita' },
  { comment: 'MANCHON DOBLE BULON Z6 1 3/8"', slug: 'manchon-doble-bulon-z6' },
  { comment: 'MANCHON DOBLE BULON Z21 1 3/8"', slug: 'manchon-doble-bulon-z21' },
  { comment: 'MANCHON DOBLE BULON Z6 CON PE Z6', slug: 'manchon-mdb-z6-pe-z6' },
  { comment: 'TUBO TRILOBULAR K518 EXT',     slug: 'tubo-trilobular-k518' },
  { comment: 'TUBO OVOIDAL K526 EXT',        slug: 'tubo-ovoidal-k526' },
  { comment: 'TUBO CUADROLOBULAR EXTERIOR',  slug: 'tubo-cuadrolobular' },
  { comment: 'BUJE BROCHADO Z21 1 3/8"',     slug: 'buje-brochado-z21' },
  { comment: 'BUJE C/SEGURO A BOLITAS Z6',   slug: 'buje-seguro-bolitas-z6' },
  { comment: 'BUJE PARA ENGRANAJE',          slug: 'buje-engranaje' },
  { comment: 'LIMITADOR 2 BULONES K518 SAB Z6', slug: 'limitador-2-bulones-k518' },
  { comment: 'LIMITADOR',                    slug: 'limitador' },
  { comment: 'ZAFE 8R 2F MDB Z6 CON HORQUILLA K518', slug: 'zafe-8r-2f-mdb-z6' },
  { comment: 'BARRA CON PROTECTOR',          slug: 'barra-con-protector' },
  { comment: 'BLINDAJE MODELO NUEVO',        slug: 'blindaje-modelo-nuevo' },
  { comment: 'ADAPTADOR BUJE Ø32',           slug: 'adaptador-buje-32' },
];

// For each transmision product block, replace the "Consultar" button href and text.
// We split the HTML by comment markers, process each chunk, then rejoin.

for (const { comment, slug } of transmisionMap) {
  const pattern = new RegExp(
    `(<!-- ${comment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} -->)([\s\S]*?)(<!-- )`,
    ''
  );
  // Simpler approach: find the "Consultar" link that immediately follows this comment block.
  // We'll do a targeted string replacement in each product "card" region.
  // Strategy: between the comment marker and the NEXT comment marker (or end of transmisiones section),
  // replace href="contacto.html" with the product page AND the text "Consultar" with "Ver Detalles".
}

// Better approach: split by <!-- ... --> comment delimiters and patch each section.
const transmisionComments = transmisionMap.map(t => `<!-- ${t.comment} -->`);

// We'll work section by section by splitting on comment markers
let result = html;

for (const { comment, slug } of transmisionMap) {
  const marker = `<!-- ${comment} -->`;
  const markerIdx = result.indexOf(marker);
  if (markerIdx === -1) {
    console.warn(`⚠ Comment not found: ${marker}`);
    continue;
  }

  // Find the next HTML comment after this marker (or a safe end boundary)
  const afterMarker = result.indexOf('<!-- ', markerIdx + marker.length);
  const sectionEnd = afterMarker === -1 ? result.indexOf('</div>', markerIdx + marker.length) + 6 : afterMarker;

  // Extract the section
  let section = result.slice(markerIdx, sectionEnd);

  // Replace the Consultar button inside this section only
  section = section.replace(
    /href="contacto\.html" class="bg-primary-container[^"]*"[^>]*>Consultar<\/a>/,
    `href="productos/${slug}.html" class="bg-primary-container text-on-primary-fixed px-4 py-1.5 rounded-sm label-text text-[10px] font-bold uppercase hover:bg-black hover:text-primary-container transition-colors no-underline">Ver Detalles</a>`
  );

  result = result.slice(0, markerIdx) + section + result.slice(sectionEnd);
  console.log(`✓  Transmision patched: ${slug}`);
}

// ── PLÁSTICOS: wrap each .group card in an <a> tag ──────────────────────────

const plasticosMap = [
  { search: 'alt="Accesorios para chimangos"',            slug: 'accesorios-chimangos' },
  { search: 'alt="Accesorios para piletas de natacion"',  slug: 'accesorios-piletas' },
  { search: 'alt="Acoples Flexibles"',                    slug: 'acoples-flexibles' },
  { search: 'alt="Arandelas"',                            slug: 'arandelas' },
  { search: 'alt="Baños Quimicos"',                       slug: 'banos-quimicos' },
  { search: 'alt="Boquillas"',                            slug: 'boquillas' },
  { search: 'alt="Caños de bajada"',                      slug: 'canos-de-bajada' },
  { search: 'alt="Caja de velocidad"',                    slug: 'caja-velocidad' },
  { search: 'alt="Cajones"',                              slug: 'cajones' },
  { search: 'alt="Cangilones"',                           slug: 'cangilones' },
  { search: 'alt="Comederos"',                            slug: 'comederos' },
  { search: 'alt="Conos desparramadores"',                slug: 'conos-desparramadores' },
  { search: 'alt="Contenedores"',                         slug: 'contenedores' },
  { search: 'alt="Cosechadoras"',                         slug: 'cosechadoras' },
  { search: 'alt="Empuñaduras"',                          slug: 'empunaduras' },
  { search: 'alt="Fertilizacion"',                        slug: 'fertilizacion' },
  { search: 'alt="Filtros"',                              slug: 'filtros' },
  { search: 'alt="Filtros de linea"',                     slug: 'filtros-de-linea' },
  { search: 'alt="Frigorificos"',                         slug: 'frigorificos' },
  { search: 'alt="Guardabarros"',                         slug: 'guardabarros' },
  { search: 'alt="Iluminacion"',                          slug: 'iluminacion' },
  { search: 'alt="Karting"',                              slug: 'karting' },
  { search: 'alt="Mangueras - Tubos"',                    slug: 'mangueras-tubos' },
  { search: 'alt="Mezcladores"',                          slug: 'mezcladores' },
  { search: 'alt="Pantallas Protectoras"',                slug: 'pantallas-protectoras' },
  { search: 'alt="Porta manuales"',                       slug: 'porta-manuales' },
  { search: 'alt="Prensa caños"',                         slug: 'prensa-canos' },
  { search: 'alt="Puas"',                                 slug: 'puas' },
  { search: 'alt="Regatones"',                            slug: 'regatones' },
  { search: 'alt="Rejillas"',                             slug: 'rejillas' },
  { search: 'alt="Sembradoras"',                          slug: 'sembradoras' },
  { search: 'alt="Soportes"',                             slug: 'soportes' },
  { search: 'alt="Tanques"',                              slug: 'tanques' },
  { search: 'alt="Tapas para mazas"',                     slug: 'tapas-mazas' },
  { search: 'alt="Tapas para tanques"',                   slug: 'tapas-tanques' },
  { search: 'alt="Tolvas"',                               slug: 'tolvas' },
  { search: 'alt="Varios"',                               slug: 'varios' },
  { search: 'alt="Ventiladores"',                         slug: 'ventiladores' },
];

// For plasticos cards, change <div class="group flex flex-col fade-up"> to an <a> tag
// We find each card by locating its img alt text, then find the opening <div class="group..."> before it,
// and the closing </div> that ends that card (4 closing divs later).
// Simpler: replace the div opening of each card with an <a> tag.

for (const { search, slug } of plasticosMap) {
  const imgIdx = result.indexOf(search);
  if (imgIdx === -1) {
    console.warn(`⚠ Image alt not found: ${search}`);
    continue;
  }

  // Walk backwards from imgIdx to find the <div class="group flex flex-col fade-up">
  const divPattern = '<div class="group flex flex-col fade-up">';
  const divIdx = result.lastIndexOf(divPattern, imgIdx);
  if (divIdx === -1) {
    console.warn(`⚠ Parent div not found for: ${search}`);
    continue;
  }

  // Replace opening div with an <a> tag
  const aTag = `<a href="productos/${slug}.html" class="group flex flex-col fade-up no-underline">`;
  result = result.slice(0, divIdx) + aTag + result.slice(divIdx + divPattern.length);

  // Now find the matching closing </div> for this card by counting depth
  // Start from aTag position + aTag length
  let depth = 1;
  let pos = divIdx + aTag.length;
  while (depth > 0 && pos < result.length) {
    const nextOpen = result.indexOf('<div', pos);
    const nextClose = result.indexOf('</div>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        // Replace </div> with </a>
        result = result.slice(0, nextClose) + '</a>' + result.slice(nextClose + 6);
        break;
      }
      pos = nextClose + 6;
    }
  }

  console.log(`✓  Plástico patched: ${slug}`);
}

// Handle special cards without images (Moldes para Quesos, Pallets) - find by h3 text
const noImageCards = [
  { h3: 'Moldes para Quesos', slug: 'moldes-quesos' },
  { h3: 'Pallets', slug: 'pallets' },
];

for (const { h3, slug } of noImageCards) {
  const h3Pattern = `>${h3}<`;
  const h3Idx = result.indexOf(h3Pattern);
  if (h3Idx === -1) {
    console.warn(`⚠ h3 not found: ${h3}`);
    continue;
  }

  const divPattern = '<div class="group flex flex-col fade-up">';
  const divIdx = result.lastIndexOf(divPattern, h3Idx);
  if (divIdx === -1) {
    console.warn(`⚠ Parent div not found for: ${h3}`);
    continue;
  }

  const aTag = `<a href="productos/${slug}.html" class="group flex flex-col fade-up no-underline">`;
  result = result.slice(0, divIdx) + aTag + result.slice(divIdx + divPattern.length);

  let depth = 1;
  let pos = divIdx + aTag.length;
  while (depth > 0 && pos < result.length) {
    const nextOpen = result.indexOf('<div', pos);
    const nextClose = result.indexOf('</div>', pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        result = result.slice(0, nextClose) + '</a>' + result.slice(nextClose + 6);
        break;
      }
      pos = nextClose + 6;
    }
  }

  console.log(`✓  Plástico (no-img) patched: ${slug}`);
}

fs.writeFileSync(filePath, result, 'utf8');
console.log('\n✅  productos.html actualizado correctamente.');
