
    const CATEGORIES = ["Electronics","Fashion","Home & Kitchen","Health & Beauty","Sports","Mobiles","Groceries","Toys"];
    // A small list of realistic product name parts to construct names
    const NAME_ADJ = ["Pro","Mini","Classic","Smart","Eco","Premium","Deluxe","Plus","Ultra","Max"];
    const NAME_NOUN = ["Headphones","Blender","T-Shirt","Sneakers","Watch","Phone","Backpack","Shampoo","Football","Microwave","Tablet","Sunglasses","Speaker","Laptop", "Toaster", "Camera"];

    const PRODUCTS_COUNT = 30; // generate 30 products (user requested ~30)
    const products = [];

    function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
    function sample(arr){ return arr[Math.floor(Math.random()*arr.length)] }

    // Generate product dataset
    for(let i=1;i<=PRODUCTS_COUNT;i++){
      const name = `${sample(NAME_ADJ)} ${sample(NAME_NOUN)} ${i}`;
      const category = sample(CATEGORIES);
      const price = rand(8000,220000); // UGX
      const isDeal = Math.random() < 0.35;
      const oldPrice = isDeal ? Math.round(price * (1 + Math.random()*0.45)) : null;
      products.push({
        id: `p-${i}`,
        name,
        category,
        price,
        oldPrice,
        isDeal,
        image: `https://picsum.photos/seed/oner-${i}/600/400`
      });
    }

    /* =========================
       State
       ========================= */
    let state = {
      q: "",
      category: "All",
      sort: "relevance",
      cart: {}, // { productId: qty }
    };

    /* =========================
       DOM refs
       ========================= */
    const productsGrid = document.getElementById("products-grid");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const categoryList = document.getElementById("category-list");
    const sortSelect = document.getElementById("sort-select");
    const cartCount = document.getElementById("cart-count");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const openCartBtn = document.getElementById("open-cart");
    const toggleFiltersBtn = document.getElementById("toggle-filters");
    const sidebar = document.getElementById("sidebar");

    /* =========================
       Render helpers
       ========================= */
    function formatUGX(n){
      return "UGX " + Number(n).toLocaleString("en-UG");
    }

    function computeFiltered(){
      let list = products.slice();

      // filter by query
      if(state.q && state.q.trim().length){
        const q = state.q.toLowerCase().trim();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }

      // filter by category
      if(state.category && state.category !== "All"){
        list = list.filter(p => p.category === state.category);
      }

      // sort
      switch(state.sort){
        case "price-asc":
          list.sort((a,b)=>a.price-b.price); break;
        case "price-desc":
          list.sort((a,b)=>b.price-a.price); break;
        case "name-az":
          list.sort((a,b)=>a.name.localeCompare(b.name)); break;
        case "name-za":
          list.sort((a,b)=>b.name.localeCompare(a.name)); break;
        default:
          // relevance (keep generated order)
          break;
      }

      return list;
    }

    function renderProducts(){
      const list = computeFiltered();
      productsGrid.innerHTML = "";
      if(list.length === 0){
        productsGrid.innerHTML = `<div class="muted" style="padding:1rem">No products match your search.</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      list.forEach(p=>{
        const card = document.createElement("article");
        card.className = "card";
        card.setAttribute("tabindex","0");
        card.innerHTML = `
          <div class="media">
            ${p.isDeal ? `<div class="deal-badge">-${Math.round(((p.oldPrice||p.price)-p.price)/(p.oldPrice||p.price)*100)}%</div>` : ""}
            <img src="${p.image}" alt="${p.name}" width="600" height="400" style="width:100%;height:100%;object-fit:cover">
          </div>
          <div class="content">
            <div class="prod-title">${p.name}</div>
            <div class="prod-cat muted">${p.category}</div>
            <div class="price-row">
              <div class="price">${formatUGX(p.price)}</div>
              ${p.oldPrice ? `<div class="old">${formatUGX(p.oldPrice)}</div>` : ""}
            </div>
            <div class="actions" style="margin-top:.6rem">
              <button class="btn primary" data-add="${p.id}">Add to cart</button>
              <button class="btn ghost" data-wish="${p.id}">Wishlist</button>
            </div>
          </div>
        `;
        frag.appendChild(card);
      });
      productsGrid.appendChild(frag);
    }

    /* =========================
       Category UI
       ========================= */
    function renderCategories(){
      categoryList.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.textContent = "All";
      allBtn.className = "active";
      allBtn.addEventListener("click", ()=>{ setCategory("All"); });
      categoryList.appendChild(allBtn);

      CATEGORIES.forEach(cat=>{
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.addEventListener("click", ()=>{ setCategory(cat); });
        categoryList.appendChild(btn);
      });
      updateCategoryActive();
    }

    function updateCategoryActive(){
      const buttons = categoryList.querySelectorAll("button");
      buttons.forEach(b=>{
        b.classList.toggle("active", b.textContent === state.category);
      });
    }

    function setCategory(cat){
      state.category = cat;
      updateCategoryActive();
      renderProducts();
    }

    /* =========================
       Cart logic
       ========================= */
    function addToCart(productId){
      if(!state.cart[productId]) state.cart[productId] = 0;
      state.cart[productId] += 1;
      persistCart();
      updateCartUI();
    }

    function removeFromCart(productId){
      delete state.cart[productId];
      persistCart();
      updateCartUI();
    }

    function updateCartQty(productId, qty){
      if(qty <= 0) removeFromCart(productId);
      else state.cart[productId] = qty;
      persistCart();
      updateCartUI();
    }

    function cartItemsList(){
      return Object.entries(state.cart).map(([id,qty])=>{
        const prod = products.find(p=>p.id===id);
        return { ...prod, qty };
      });
    }

    function cartTotal(){
      return cartItemsList().reduce((sum,item)=>sum + (item.price * item.qty), 0);
    }

    function updateCartUI(){
      const list = cartItemsList();
      cartItemsEl.innerHTML = "";
      if(list.length === 0){
        cartItemsEl.innerHTML = `<div class="muted">Your cart is empty</div>`;
      } else {
        const frag = document.createDocumentFragment();
        list.forEach(item=>{
          const el = document.createElement("div");
          el.className = "cart-item";
          el.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="meta">
              <div style="font-weight:800">${item.name}</div>
              <div class="muted" style="font-size:0.9rem">${formatUGX(item.price)} × <span class="qty">${item.qty}</span></div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:800">${formatUGX(item.price * item.qty)}</div>
              <div style="margin-top:.4rem">
                <button class="btn ghost" data-decrease="${item.id}">-</button>
                <button class="btn ghost" data-increase="${item.id}">+</button>
              </div>
            </div>
          `;
          frag.appendChild(el);
        });
        cartItemsEl.appendChild(frag);
      }
      cartCount.textContent = Object.values(state.cart).reduce((s,n)=>s+n,0);
      cartTotalEl.textContent = formatUGX(cartTotal());
      // Update drawer aria
      cartDrawer.setAttribute("aria-hidden", list.length === 0 ? "true" : "false");
    }

    function persistCart(){
      try { localStorage.setItem("oner_cart", JSON.stringify(state.cart)); } catch(e){}
    }
    function restoreCart(){
      try {
        const raw = localStorage.getItem("oner_cart");
        if(raw){ state.cart = JSON.parse(raw); }
      } catch(e){}
    }

    /* =========================
       Event wiring + delegations
       ========================= */
    // Search interactions
    searchInput.addEventListener("input", (e)=>{
      state.q = e.target.value;
      renderProducts();
    });
    searchBtn.addEventListener("click", ()=>{
      state.q = searchInput.value;
      renderProducts();
    });
    sortSelect.addEventListener("change", (e)=>{
      state.sort = e.target.value;
      renderProducts();
    });

    // Delegate Add to cart / wishlist, cart qty changes
    document.body.addEventListener("click", (e)=>{
      const addId = e.target.closest("[data-add]")?.getAttribute("data-add");
      const incId = e.target.closest("[data-increase]")?.getAttribute("data-increase");
      const decId = e.target.closest("[data-decrease]")?.getAttribute("data-decrease");
      const wishId = e.target.closest("[data-wish]")?.getAttribute("data-wish");
      if(addId) {
        addToCart(addId);
        // small visual feedback
        e.target.textContent = "Added";
        setTimeout(()=>{ e.target.textContent = "Add to cart"; }, 900);
      }
      if(incId){
        updateCartQty(incId, (state.cart[incId]||0) + 1);
      }
      if(decId){
        updateCartQty(decId, (state.cart[decId]||0) - 1);
      }
      if(wishId){
        alert("Wishlist feature (demo) — product saved to wishlist.");
      }
    });

    // Cart open / close
    openCartBtn.addEventListener("click", ()=>{
      const wasOpen = cartDrawer.classList.contains("show");
      if(wasOpen) {
        cartDrawer.classList.remove("show");
        openCartBtn.setAttribute("aria-expanded","false");
      } else {
        cartDrawer.classList.add("show");
        openCartBtn.setAttribute("aria-expanded","true");
      }
    });

    // close cart when clicking outside
    document.addEventListener("click", (e)=>{
      if(cartDrawer.classList.contains("show")){
        const inside = cartDrawer.contains(e.target) || openCartBtn.contains(e.target);
        if(!inside){
          cartDrawer.classList.remove("show");
          openCartBtn.setAttribute("aria-expanded","false");
        }
      }
    });

    // Cart increase/ decrease delegated above; also add keyboard support
    cartItemsEl.addEventListener("click", (e)=>{
      // handled globally - placeholder if needed
    });

    // Filters toggle (mobile)
    toggleFiltersBtn.addEventListener("click", ()=>{
      const shown = sidebar.style.display !== "none";
      if(window.innerWidth <= 900){
        sidebar.style.display = shown ? "none" : "block";
        toggleFiltersBtn.setAttribute("aria-pressed", !shown);
      } else {
        // desktop: just focus the sidebar
        sidebar.scrollIntoView({behavior:"smooth"});
      }
    });

    // keyboard escape closes cart
    document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape"){
        cartDrawer.classList.remove("show");
        openCartBtn.setAttribute("aria-expanded","false");
      }
    });

    /* =========================
       Init
       ========================= */
    function init(){
      restoreCart();
      renderCategories();
      renderProducts();
      updateCartUI();
      // Accessibility: allow pressing Enter on search input to run search
      searchInput.addEventListener("keydown", (ev)=>{
        if(ev.key === "Enter"){ state.q = searchInput.value; renderProducts(); }
      });
    }

    init();

  