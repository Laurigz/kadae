/* ============================================================
   KADAE CART ENGINE — cart.js
   Usado por: productos.html, productos/*.html
   Compatible con carpetas anidadas (ajusta path de rutas)
   ============================================================ */
(function() {
  const STORAGE_KEY = 'kadae_cart_v2';
  const IS_SUB = window.location.pathname.includes('/productos/');
  const ROOT   = IS_SUB ? '../' : '';

  // ── load / save ──────────────────────────────────────────
  function load()  { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e){ return []; } }
  function save(c) { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }

  // ── inject HTML ───────────────────────────────────────────
  function inject() {
    const CART_HTML = `
<!-- ===== CART OVERLAY + DRAWER ===== -->
<div id="kCartOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:800;backdrop-filter:blur(4px);transition:opacity .3s;opacity:0;"></div>
<div id="kCartDrawer" style="position:fixed;top:0;right:0;bottom:0;width:min(480px,100vw);background:#fff;z-index:801;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:-4px 0 40px rgba(0,0,0,.12);">
  <div id="kCartHead" style="padding:1.25rem 1.5rem;border-bottom:2px solid #FFD100;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#fff;">
    <div style="display:flex;align-items:center;gap:.7rem;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <span style="font-family:'Work Sans',sans-serif;font-weight:900;font-size:.95rem;text-transform:uppercase;letter-spacing:.03em;color:#111;">Carrito de Pedido</span>
      <span id="kCartHeadBadge" style="background:#FFD100;color:#0d1117;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.6rem;padding:.15rem .5rem;border-radius:20px;display:none;">0</span>
    </div>
    <button id="kCartClose" style="background:none;border:none;cursor:pointer;padding:.3rem;color:#64748b;display:flex;align-items:center;font-size:1.2rem;" aria-label="Cerrar">✕</button>
  </div>
  <div id="kCartList" style="flex:1;overflow-y:auto;padding:1rem 1.5rem;display:flex;flex-direction:column;gap:.75rem;">
    <div id="kCartEmpty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1rem;opacity:.45;padding:3rem 0;">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#FFD100" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
      <p style="font-family:'Space Grotesk',sans-serif;font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:#94a3b8;">Tu carrito está vacío</p>
    </div>
  </div>
  <div id="kCartFoot" style="display:none;padding:1.25rem 1.5rem;border-top:1px solid #f1f5f9;flex-shrink:0;background:#fafafa;">
    <div style="background:#fff;border:1px solid #e2e8f0;padding:.75rem 1rem;margin-bottom:.85rem;display:flex;justify-content:space-between;align-items:center;">
      <span id="kCartCount" style="font-family:'Space Grotesk',sans-serif;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:#64748b;">0 productos</span>
      <span style="font-family:'Space Grotesk',sans-serif;font-size:.72rem;font-weight:700;color:#94a3b8;">Consultar precios</span>
    </div>
    <button id="kCartWABtn" style="width:100%;background:#25d366;color:#fff;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;padding:.9rem;display:flex;align-items:center;justify-content:center;gap:.6rem;margin-bottom:.5rem;">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Enviar pedido por WhatsApp
    </button>
    <button id="kCartClear" style="width:100%;background:none;border:1px solid #e2e8f0;color:#94a3b8;font-family:'Space Grotesk',sans-serif;font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;padding:.55rem;cursor:pointer;">Vaciar carrito</button>
  </div>
</div>

<!-- ===== QUICK-ADD MODAL ===== -->
<div id="kModal" style="display:none;position:fixed;inset:0;z-index:900;align-items:center;justify-content:center;padding:1.25rem;">
  <div id="kModalBg" style="position:absolute;inset:0;background:rgba(0,0,0,.6);"></div>
  <div id="kModalBox" style="position:relative;z-index:1;background:#fff;width:100%;max-width:420px;box-shadow:0 25px 80px rgba(0,0,0,.25);overflow:hidden;">
    <button id="kModalClose" style="position:absolute;top:.75rem;right:.75rem;background:none;border:none;cursor:pointer;color:#64748b;font-size:1.2rem;z-index:2;">✕</button>
    <img id="kModalImg" src="" alt="" style="width:100%;height:190px;object-fit:contain;background:#f8f9fa;border-bottom:1px solid #f1f5f9;padding:.5rem;"/>
    <div style="padding:1.4rem;">
      <p id="kModalBadge" style="font-family:'Space Grotesk',sans-serif;font-size:.58rem;text-transform:uppercase;letter-spacing:.15em;color:#FFD100;font-weight:700;margin:0 0 .35rem;"></p>
      <h3 id="kModalName" style="font-family:'Work Sans',sans-serif;font-weight:900;font-size:1rem;text-transform:uppercase;color:#111;margin:0 0 .15rem;letter-spacing:-.01em;"></h3>
      <p id="kModalRef" style="font-family:'Space Grotesk',sans-serif;font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin:0 0 1.1rem;"></p>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:.85rem;">
        <span style="font-family:'Space Grotesk',sans-serif;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:#64748b;flex-shrink:0;">Cantidad</span>
        <div style="display:flex;align-items:center;border:1.5px solid #FFD100;border-radius:2px;overflow:hidden;">
          <button id="kQtyDec" style="width:2.2rem;height:2.2rem;background:#fffbea;border:none;font-size:1.1rem;cursor:pointer;color:#0d1117;font-weight:700;">−</button>
          <input id="kQtyInput" type="number" min="1" max="9999" value="1" style="width:3.2rem;height:2.2rem;border:none;border-left:1px solid #FFD100;border-right:1px solid #FFD100;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.95rem;text-align:center;outline:none;background:#fff;"/>
          <button id="kQtyInc" style="width:2.2rem;height:2.2rem;background:#fffbea;border:none;font-size:1.1rem;cursor:pointer;color:#0d1117;font-weight:700;">+</button>
        </div>
      </div>
      <textarea id="kNoteInput" rows="2" placeholder="Observaciones: medidas, material, uso…" style="width:100%;border:none;border-bottom:1.5px solid #e2e8f0;font-family:'Space Grotesk',sans-serif;font-size:.8rem;padding:.4rem 0;outline:none;resize:none;color:#334155;background:transparent;margin-bottom:1.1rem;transition:border-color .2s;"></textarea>
      <button id="kModalConfirm" style="width:100%;background:#FFD100;color:#0d1117;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;padding:.9rem;display:flex;align-items:center;justify-content:center;gap:.5rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
        Agregar al carrito
      </button>
    </div>
  </div>
</div>
`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = CART_HTML;
    document.body.appendChild(wrapper);
    initEvents();
  }

  // ── cart state ────────────────────────────────────────────
  let cart = load();
  let pending = null;

  // ── badge update ──────────────────────────────────────────
  function updateBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    // nav badge
    const nb = document.getElementById('kNavBadge');
    if (nb) { nb.textContent = total; nb.style.display = total > 0 ? 'flex' : 'none'; }
    // head badge
    const hb = document.getElementById('kCartHeadBadge');
    if (hb) { hb.textContent = total; hb.style.display = total > 0 ? 'inline-block' : 'none'; }
  }

  // ── render drawer items ───────────────────────────────────
  function renderCart() {
    const list  = document.getElementById('kCartList');
    const empty = document.getElementById('kCartEmpty');
    const foot  = document.getElementById('kCartFoot');
    const cnt   = document.getElementById('kCartCount');
    if (!list) return;
    list.querySelectorAll('.k-citem').forEach(n => n.remove());
    if (cart.length === 0) {
      empty.style.display = 'flex'; foot.style.display = 'none'; return;
    }
    empty.style.display = 'none'; foot.style.display = 'block';
    const tot = cart.reduce((s, i) => s + i.qty, 0);
    cnt.textContent = tot + ' producto' + (tot !== 1 ? 's' : '');
    cart.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'k-citem';
      el.style.cssText = 'background:#f8fafc;border:1px solid #e2e8f0;display:flex;gap:.75rem;padding:.8rem;align-items:flex-start;animation:kSlideIn .2s ease;';
      el.innerHTML = `
        <img src="${item.img}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;background:#fff;border:1px solid #e2e8f0;flex-shrink:0;"/>
        <div style="flex:1;min-width:0;">
          <p style="font-family:'Work Sans',sans-serif;font-weight:800;font-size:.8rem;text-transform:uppercase;color:#111;margin:0 0 .1rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</p>
          <p style="font-family:'Space Grotesk',sans-serif;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin:0 0 .55rem;">REF: ${item.ref}</p>
          ${item.note ? `<p style="font-size:.68rem;color:#64748b;font-style:italic;margin:0 0 .55rem;">📝 ${item.note}</p>` : ''}
          <div style="display:flex;align-items:center;gap:0;border:1.5px solid #FFD100;border-radius:2px;width:fit-content;overflow:hidden;">
            <button onclick="window.KADAECART.changeQty(${idx},-1)" style="width:1.9rem;height:1.9rem;background:#fffbea;border:none;cursor:pointer;font-size:1rem;font-weight:700;color:#0d1117;">−</button>
            <input type="number" min="1" value="${item.qty}" style="width:2.8rem;height:1.9rem;border:none;border-left:1px solid #FFD100;border-right:1px solid #FFD100;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.85rem;text-align:center;outline:none;background:#fff;" onchange="window.KADAECART.setQty(${idx},this.value)" oninput="window.KADAECART.setQty(${idx},this.value)"/>
            <button onclick="window.KADAECART.changeQty(${idx},1)" style="width:1.9rem;height:1.9rem;background:#fffbea;border:none;cursor:pointer;font-size:1rem;font-weight:700;color:#0d1117;">+</button>
          </div>
        </div>
        <button onclick="window.KADAECART.remove(${idx})" style="background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:1rem;padding:.1rem;flex-shrink:0;transition:color .2s;" onmouseenter="this.style.color='#ef4444'" onmouseleave="this.style.color='#cbd5e1'">✕</button>
      `;
      list.appendChild(el);
    });
  }

  // ── open / close ──────────────────────────────────────────
  function openDrawer() {
    const ov = document.getElementById('kCartOverlay');
    const dr = document.getElementById('kCartDrawer');
    ov.style.display = 'block';
    setTimeout(() => ov.style.opacity = '1', 10);
    dr.style.transform = 'translateX(0)';
    renderCart();
  }
  function closeDrawer() {
    const ov = document.getElementById('kCartOverlay');
    const dr = document.getElementById('kCartDrawer');
    ov.style.opacity = '0';
    dr.style.transform = 'translateX(100%)';
    setTimeout(() => ov.style.display = 'none', 320);
  }

  // ── modal ─────────────────────────────────────────────────
  function openModal(product) {
    pending = product;
    const m = document.getElementById('kModal');
    document.getElementById('kModalImg').src    = product.img;
    document.getElementById('kModalName').textContent  = product.name;
    document.getElementById('kModalRef').textContent   = 'REF: ' + product.ref;
    document.getElementById('kModalBadge').textContent = product.cat || '';
    document.getElementById('kQtyInput').value  = 1;
    document.getElementById('kNoteInput').value = '';
    m.style.display = 'flex';
    setTimeout(() => document.getElementById('kQtyInput').focus(), 80);
  }
  function closeModal() { document.getElementById('kModal').style.display = 'none'; pending = null; }

  // ── cart actions ──────────────────────────────────────────
  function add(product) {
    const ex = cart.find(i => i.ref === product.ref);
    if (ex) { ex.qty += product.qty; if (product.note) ex.note = product.note; }
    else { cart.push({...product}); }
    save(cart); updateBadge();
    // animate nav badge
    const nb = document.getElementById('kNavBadge');
    if (nb) { nb.style.transform = 'scale(1.4)'; setTimeout(() => nb.style.transform = '', 200); }
  }

  // ── init events ───────────────────────────────────────────
  function initEvents() {
    document.getElementById('kCartClose').addEventListener('click', closeDrawer);
    document.getElementById('kCartOverlay').addEventListener('click', closeDrawer);
    document.getElementById('kModalBg').addEventListener('click', closeModal);
    document.getElementById('kModalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });

    document.getElementById('kQtyDec').addEventListener('click', () => {
      const i = document.getElementById('kQtyInput'); i.value = Math.max(1, parseInt(i.value||1)-1);
    });
    document.getElementById('kQtyInc').addEventListener('click', () => {
      const i = document.getElementById('kQtyInput'); i.value = Math.min(9999, parseInt(i.value||1)+1);
    });
    document.getElementById('kModalConfirm').addEventListener('click', () => {
      if (!pending) return;
      add({ ...pending, qty: Math.max(1, parseInt(document.getElementById('kQtyInput').value)||1), note: document.getElementById('kNoteInput').value.trim() });
      closeModal();
      openDrawer();
    });
    document.getElementById('kCartClear').addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) { cart = []; save(cart); updateBadge(); renderCart(); }
    });
    document.getElementById('kCartWABtn').addEventListener('click', () => {
      if (!cart.length) return;
      let msg = '¡Hola Kadae! Quiero consultar por los siguientes productos:\n\n';
      cart.forEach(i => {
        msg += `• *${i.name}* (REF: ${i.ref}) — Cant: ${i.qty}`;
        if (i.note) msg += ` — Obs: ${i.note}`;
        msg += '\n';
      });
      msg += '\n¡Gracias!';
      window.open(`https://api.whatsapp.com/send/?phone=%2B5493471527595&text=${encodeURIComponent(msg)}`, '_blank');
    });

    // wire nav cart button if present
    const navBtn = document.getElementById('kNavCartBtn');
    if (navBtn) navBtn.addEventListener('click', openDrawer);
    const navBtn2 = document.getElementById('kNavCartBtnMob');
    if (navBtn2) navBtn2.addEventListener('click', openDrawer);
  }

  // add keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes kSlideIn{from{opacity:0;transform:translateX(8px);}to{opacity:1;transform:translateX(0);}} input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}`;
  document.head.appendChild(style);

  // ── public API ────────────────────────────────────────────
  window.KADAECART = {
    open:      openDrawer,
    close:     closeDrawer,
    openModal,
    add,
    changeQty(idx, delta) { cart[idx].qty = Math.max(1, (cart[idx].qty||1)+delta); save(cart); updateBadge(); renderCart(); },
    setQty(idx, val)      { const n=parseInt(val); if(!isNaN(n)&&n>=1){cart[idx].qty=n;save(cart);updateBadge();} },
    remove(idx)           { cart.splice(idx,1); save(cart); updateBadge(); renderCart(); },
    // Called from individual product pages
    quickAdd(name, ref, img, cat) { openModal({ name, ref, img, cat }); }
  };

  // inject when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inject(); updateBadge(); });
  } else {
    inject(); updateBadge();
  }

})();
