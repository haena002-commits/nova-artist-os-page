(()=>{
  const BASE=[
    {name:"청상어횟집",category:"sashimi",menu:"회 · 해산물",walk:"10",hours:"12:00–21:30",mapUrl:"https://naver.me/FuzD6L2o"},
    {name:"변산반도횟집",category:"sashimi",menu:"회 · 해산물",walk:"12",hours:"일 10:00–22:00 · 월·화 10:00–21:00",mapUrl:"https://naver.me/G65tM2lT"},
    {name:"격포 어촌계회센터 B동 13호",category:"sashimi",menu:"제철회 · 해산물 · 조개탕",walk:"25",hours:"10:00–21:00",address:"전북 부안군 변산면 격포항길 24-8 B동 13호",mapUrl:"https://map.naver.com/p/search/격포%20어촌계회센터%20B동%2013호"},

    {name:"채석강키조개삼합",category:"grill",menu:"키조개삼합 · 해산물구이 · 술안주",walk:"10",hours:"10:00–22:00",address:"전북 부안군 채석강길 36",mapUrl:"https://naver.me/FXnj7MjI"},
    {name:"채석강해물전골조개찜막회",category:"grill",menu:"조개찜 · 해물전골 · 조개구이 · 술안주",walk:"8",hours:"12:00–22:00",address:"전북 부안군 변산면 채석강길 22-10 2층",mapUrl:"https://map.naver.com/p/search/부안%20채석강해물전골조개찜막회"},
    {name:"피어51",category:"grill",menu:"펍 · 맥주 · 스테이크/해산물 안주",walk:"1",hours:"18:00–22:00",notice:"우천 시 운영 변동 가능",address:"전북 부안군 소노로 10 소노벨변산 1층 야외광장",mapUrl:"https://naver.me/FQueN7tg"},

    {name:"백합식당",category:"lunch",menu:"백합돌솥밥 · 백합죽 · 백합탕",walk:"5",hours:"08:00–20:30 · BT 15:00–16:30",mapUrl:"https://map.naver.com/p/search/부안%20백합식당"},
    {name:"바다마을식당",category:"lunch",menu:"바지락칼국수 · 백합죽",walk:"8",hours:"08:00–20:00 · LO 19:30",mapUrl:"https://map.naver.com/p/search/부안%20바다마을식당"},
    {name:"군산식당",category:"lunch",menu:"백합정식",walk:"13",hours:"08:00–20:00경",mapUrl:"https://map.naver.com/p/search/부안%20군산식당"},
    {name:"마식당",category:"lunch",menu:"화덕 생선구이 · 한식",walk:"7",hours:"09:00–16:00 · LO 15:10",notice:"⚠️ 9/1 화요일 휴무",address:"전북 부안군 격포항길 13 마식당",mapUrl:"https://naver.me/FNt085gG"},
    {name:"채석강맛집",category:"lunch",menu:"간장게장 · 새우장 · 생선구이 · 백합찜 · 해물칼국수",distanceText:"🚗 가까운 차량 이동",hours:"일 08:00–21:00 · 월 09:00–21:00",notice:"⚠️ 9/1 화요일 휴무",address:"전북 부안군 변산면 변산해변로 25",mapUrl:"https://map.naver.com/p/search/부안%20채석강맛집"},
    {name:"김인경 원조 바지락죽",category:"lunch",menu:"뽕잎바지락죽 · 인삼바지락죽 · 바지락뽕잎전",distanceText:"🚗 차량 이동",hours:"08:00–19:00 · BT 15:00–16:00",notice:"월요일 오후 운영 정보는 출처별 차이 있음",address:"전북 부안군 변산면 묵정길 18",mapUrl:"https://map.naver.com/p/search/부안%20김인경%20원조%20바지락죽"},
    {name:"변산명인바지락죽",category:"lunch",menu:"인삼바지락죽 · 바지락전 · 바지락회무침",distanceText:"🚗 차량 이동",hours:"08:40–18:10 · BT 15:00–16:00",address:"전북 부안군 변산해변로 794",mapUrl:"https://naver.me/FM9FKE2o"}
  ];

  const CATS={sashimi:"횟집",grill:"고기&",lunch:"점심"};
  let active="sashimi";

  function card(d){
    const c=document.createElement("article");
    c.className="food-card";
    c.dataset.category=d.category;
    const distance=d.distanceText||`🚶 도보 약 ${d.walk}분`;
    c.innerHTML=`<a class="food-card-top" href="${d.mapUrl}" target="_blank" rel="noopener">
      <div class="food-card-copy">
        <div class="food-card-title-row"><strong class="food-card-name"></strong><span class="food-meal-tag">${CATS[d.category]}</span></div>
        <p class="food-card-menu"></p>
        <div class="food-card-meta"><span class="food-walk"></span></div>
        <span class="food-hours" style="display:block;margin-top:7px;color:#657579;font-size:11px;font-weight:800"></span>
        <span class="food-notice" style="display:block;margin-top:4px;color:#b15d42;font-size:10.5px;font-weight:900"></span>
        <span class="food-address"></span>
      </div>
    </a>`;
    c.querySelector(".food-card-name").textContent=d.name;
    c.querySelector(".food-card-menu").textContent=d.menu;
    c.querySelector(".food-walk").textContent=distance;
    c.querySelector(".food-hours").textContent=d.hours?`🕒 ${d.hours}`:"";
    c.querySelector(".food-notice").textContent=d.notice||"";
    c.querySelector(".food-address").textContent=d.address||"";
    return c;
  }

  function render(){
    const p=document.getElementById("restaurants");
    p.innerHTML=`<div class="day-head"><h2 class="date-title">맛집 리스트</h2><span class="day-chip">🍴 소노벨 기준 거리</span></div>
      <p class="food-guide-intro">카테고리별로 골라보고, 카드 전체를 누르면 네이버 지도가 열립니다.</p>
      <div class="food-category-tabs"><button class="food-category-tab active" data-category="sashimi">횟집</button><button class="food-category-tab" data-category="grill">고기&amp;</button><button class="food-category-tab" data-category="lunch">점심</button></div>
      <div class="food-guide-grid" id="foodGuideGrid"></div>`;
    const g=p.querySelector("#foodGuideGrid");
    BASE.forEach(d=>g.appendChild(card(d)));
    filter(active);
  }

  function filter(cat){
    active=CATS[cat]?cat:"sashimi";
    document.querySelectorAll(".food-category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===active));
    document.querySelectorAll(".food-card").forEach(c=>c.hidden=c.dataset.category!==active);
  }

  function normalizeLinks(){
    document.querySelectorAll(".item").forEach(i=>{
      const a=i.querySelector("a.place-link");
      if(a){i.dataset.link=a.href;a.closest(".actions")?.remove();i.classList.add("link-item")}
      if(i.dataset.link)i.classList.add("link-item");
    });
  }

  const RECOMMENDED_MEALS={
    day1:{
      "12:00 - 13:00":{title:"점심 · 채석강맛집",desc:"게장 · 생선구이 · 백합찜",mapUrl:"https://map.naver.com/p/search/부안%20채석강맛집"},
      "17:30 - 19:00":{title:"저녁 · 변산반도횟집",desc:"도보 이동 회 · 해산물",mapUrl:"https://naver.me/G65tM2lT"}
    },
    day2:{
      "12:30 - 13:20":{title:"점심 · 바다마을식당",desc:"바지락칼국수 · 백합죽.",mapUrl:"https://map.naver.com/p/search/부안%20바다마을식당"},
      "18:00 - 20:00":{title:"저녁 · 채석강해물전골조개찜막회",desc:"도보 약 8분 · 조개찜/해물전골",mapUrl:"https://map.naver.com/p/search/부안%20채석강해물전골조개찜막회"}
    },
    day3:{
      "11:30 - 12:20":{title:"점심 · 김인경 원조 바지락죽",desc:"부안 대표 바지락죽",mapUrl:"https://map.naver.com/p/search/부안%20김인경%20원조%20바지락죽"}
    }
  };

  function applyRecommendedMeals(){
    Object.entries(RECOMMENDED_MEALS).forEach(([day,slots])=>{
      const timeline=document.querySelector(`#${day} .timeline`);
      if(!timeline)return;
      [...timeline.querySelectorAll(".item.food")].forEach(item=>{
        const time=item.querySelector(".time")?.textContent.trim();
        const rec=slots[time];
        if(!rec)return;
        const title=item.querySelector(".editable-title-text");
        const desc=item.querySelector(".desc");
        if(title)title.textContent=rec.title;
        if(desc)desc.textContent=rec.desc;
        item.dataset.link=rec.mapUrl;
        item.classList.add("link-item");
      });
    });
  }

  render();
  normalizeLinks();
  applyRecommendedMeals();

  document.addEventListener("click",e=>{
    const b=e.target.closest(".food-category-tab");
    if(b)filter(b.dataset.category);
    const i=e.target.closest(".item.link-item");
    if(i&&!e.target.closest("button,input,select"))window.open(i.dataset.link,"_blank","noopener");
  });
})();