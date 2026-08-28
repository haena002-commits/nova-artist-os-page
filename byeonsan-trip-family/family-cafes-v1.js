(()=>{
  const CAFES=[
    {
      name:"카페909",
      menu:"오션뷰 · 정원 · 커피 · 차",
      distance:"🚗 소노벨에서 약 1.2km",
      hours:"평일 09:30–19:00 · 주말 09:30–20:00",
      address:"전북 부안군 변산면 변산해변로 277",
      mapUrl:"https://map.naver.com/p/search/부안%20카페909"
    },
    {
      name:"쇼트앤드",
      menu:"감성 카페 · 디저트 · 커피",
      distance:"🚗 가까운 차량 이동",
      hours:"평일 11:00–18:00 · 주말 11:00–19:00",
      notice:"⚠️ 화요일 휴무 정보 있음",
      address:"전북 부안군 변산면 변산해변로 13 2층",
      mapUrl:"https://map.naver.com/p/search/부안%20쇼트앤드"
    },
    {
      name:"더 테라스 카페",
      menu:"바다뷰 · 커피 · 디저트 · 테라스",
      distance:"🚗 가까운 차량 이동",
      hours:"08:00–22:00",
      address:"전북 부안군 변산면 채석강길 33 호텔원 변산 1층",
      mapUrl:"https://map.naver.com/p/search/부안%20더%20테라스%20카페"
    },
    {
      name:"할리스 부안격포채석강점",
      menu:"오션뷰 · 커피 · 디저트",
      distance:"🚗 가까운 차량 이동",
      hours:"08:30–21:30",
      address:"전북 부안군 변산면 채석강길 22-6",
      mapUrl:"https://map.naver.com/p/search/할리스%20부안격포채석강점"
    }
  ];

  function ensureStyle(){
    if(document.getElementById("familyCafeStyle"))return;
    const style=document.createElement("style");
    style.id="familyCafeStyle";
    style.textContent=`
      #restaurants .food-category-tabs{grid-template-columns:repeat(4,minmax(0,1fr))!important}
      #restaurants .food-category-tab[data-category="cafe"].active{background:#f1ebff;color:#6b55a0}
      #restaurants .food-card[data-category="cafe"]{background:linear-gradient(145deg,#f4efff,#fff);border-color:#d8cdef}
      #restaurants .food-card[data-category="cafe"] .food-meal-tag{background:#e9e0ff;color:#6b55a0}
      @media(max-width:420px){#restaurants .food-category-tab{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function cafeCard(d){
    const c=document.createElement("article");
    c.className="food-card";
    c.dataset.category="cafe";
    c.hidden=true;
    c.innerHTML=`<a class="food-card-top" href="${d.mapUrl}" target="_blank" rel="noopener">
      <div class="food-card-copy">
        <div class="food-card-title-row"><strong class="food-card-name"></strong><span class="food-meal-tag">카페</span></div>
        <p class="food-card-menu"></p>
        <div class="food-card-meta"><span class="food-walk"></span></div>
        <span class="food-hours" style="display:block;margin-top:7px;color:#657579;font-size:11px;font-weight:800"></span>
        <span class="food-notice" style="display:block;margin-top:4px;color:#b15d42;font-size:10.5px;font-weight:900"></span>
        <span class="food-address"></span>
      </div>
    </a>`;
    c.querySelector(".food-card-name").textContent=d.name;
    c.querySelector(".food-card-menu").textContent=d.menu;
    c.querySelector(".food-walk").textContent=d.distance;
    c.querySelector(".food-hours").textContent=`🕒 ${d.hours}`;
    c.querySelector(".food-notice").textContent=d.notice||"";
    c.querySelector(".food-address").textContent=d.address;
    return c;
  }

  function showCafe(){
    document.querySelectorAll("#restaurants .food-category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category==="cafe"));
    document.querySelectorAll("#restaurants .food-card").forEach(c=>c.hidden=c.dataset.category!=="cafe");
  }

  function install(){
    ensureStyle();
    const tabs=document.querySelector("#restaurants .food-category-tabs");
    const grid=document.querySelector("#restaurants #foodGuideGrid");
    if(!tabs||!grid||tabs.querySelector('[data-category="cafe"]'))return;

    const button=document.createElement("button");
    button.className="food-category-tab";
    button.dataset.category="cafe";
    button.type="button";
    button.textContent="카페";
    tabs.appendChild(button);

    CAFES.forEach(d=>grid.appendChild(cafeCard(d)));

    document.addEventListener("click",e=>{
      const b=e.target.closest("#restaurants .food-category-tab");
      if(!b)return;
      if(b.dataset.category==="cafe")setTimeout(showCafe,0);
    });
  }

  install();
})();