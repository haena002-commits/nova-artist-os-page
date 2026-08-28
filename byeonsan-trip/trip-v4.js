(()=>{
  const KEY="byeonsan-trip-draft-v4";
  const LEGACY="byeonsan-trip-draft-v1";
  const MEAL_PATCH_KEY="byeonsan-meal-plan-2026-08-28-v1";

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
  const wrap=document.querySelector(".wrap");
  const toggle=document.getElementById("editToggle");
  const dock=document.getElementById("editorDock");
  const status=document.getElementById("editorStatus");
  const fileInput=document.getElementById("draftFileInput");
  const dialog=document.getElementById("restaurantDialog");
  const form=document.getElementById("restaurantForm");
  let editing=false,saveTimer,activeCat="sashimi";

  function parseStored(key){
    try{const d=JSON.parse(localStorage.getItem(key)||"");return d&&d.html?d:null}catch(e){return null}
  }

  function migrate(){
    const d=parseStored(KEY)||parseStored(LEGACY);
    if(!d)return false;
    const box=document.createElement("div");
    box.innerHTML=d.html;
    ["day1","day2","day3"].forEach(id=>{
      const old=box.querySelector("#"+id+" .timeline");
      const now=document.querySelector("#"+id+" .timeline");
      if(old&&now)now.innerHTML=old.innerHTML;
    });
    return true;
  }

  function restOld(){
    const d=parseStored(KEY);
    if(!d)return[];
    const box=document.createElement("div");
    box.innerHTML=d.html;
    return [...box.querySelectorAll(".food-card")].map(c=>({
      name:c.querySelector(".food-card-name")?.textContent.trim(),
      visited:c.dataset.visited==="true",
      scheduledDay:c.dataset.scheduledDay||""
    })).filter(x=>x.name);
  }

  function idFor(n){
    let h=0;
    for(const c of n){h=((h<<5)-h)+c.codePointAt(0);h|=0}
    return"r"+Math.abs(h);
  }

  function createCard(d,state={}){
    const c=document.createElement("article");
    c.className="food-card";
    c.dataset.restaurantId=idFor(d.name);
    c.dataset.category=d.category;
    c.dataset.mapUrl=d.mapUrl;
    c.dataset.visited=String(!!state.visited);
    if(state.scheduledDay)c.dataset.scheduledDay=state.scheduledDay;

    const distance=d.distanceText||`🚶 도보 약 ${d.walk}분${d.driveRecommended?" · 차량 추천":""}`;
    c.innerHTML=`<a class="food-card-top" href="${d.mapUrl}" target="_blank" rel="noopener">
      <div class="food-card-copy">
        <div class="food-card-title-row"><strong class="food-card-name"></strong><span class="food-meal-tag">${CATS[d.category]}</span><span class="food-complete-badge">✓ 완료</span></div>
        <p class="food-card-menu"></p>
        <div class="food-card-meta"><span class="food-walk"></span></div>
        <span class="food-hours" style="display:block;margin-top:7px;color:#657579;font-size:11px;font-weight:800"></span>
        <span class="food-notice" style="display:block;margin-top:4px;color:#b15d42;font-size:10.5px;font-weight:900"></span>
        <span class="food-address"></span>
      </div>
    </a>
    <details class="food-card-plan"><summary>일정 설정 · 방문 기록</summary><div class="food-plan-simple">
      <label class="food-day-field">날짜<select class="food-day"><option value="">일정 없음</option><option value="day1">8/30 일</option><option value="day2">8/31 월</option><option value="day3">9/1 화</option></select></label>
      <label class="food-visited-label"><input class="food-visited" type="checkbox"> 다녀옴</label>
      <span class="food-card-status">아직 일정 없음</span>
    </div></details>`;

    c.querySelector(".food-card-name").textContent=d.name;
    c.querySelector(".food-card-menu").textContent=d.menu;
    c.querySelector(".food-walk").textContent=distance;
    c.querySelector(".food-hours").textContent=d.hours?`🕒 ${d.hours}`:"";
    c.querySelector(".food-notice").textContent=d.notice||"";
    c.querySelector(".food-address").textContent=d.address||"";
    c.querySelector(".food-day").value=state.scheduledDay||"";
    c.querySelector(".food-visited").checked=!!state.visited;
    visit(c,!!state.visited,false);
    return c;
  }

  function renderRestaurants(){
    const old=new Map(restOld().map(x=>[x.name,x]));
    const p=document.getElementById("restaurants");
    p.innerHTML=`<div class="day-head"><h2 class="date-title">맛집 리스트</h2><div class="food-guide-head-actions"><span class="day-chip">🍴 소노벨 기준 거리</span><button class="food-guide-add" type="button">+ 맛집 추가</button></div></div>
      <p class="food-guide-intro">카테고리별로 골라보고, 카드 전체를 누르면 네이버 지도가 열립니다.</p>
      <div class="food-category-tabs"><button class="food-category-tab active" data-category="sashimi">횟집</button><button class="food-category-tab" data-category="grill">고기&amp;</button><button class="food-category-tab" data-category="lunch">점심</button></div>
      <div class="food-guide-grid" id="foodGuideGrid"></div>`;
    const g=p.querySelector("#foodGuideGrid");
    BASE.forEach(d=>g.appendChild(createCard(d,old.get(d.name)||{})));
    filter(activeCat);
  }

  function filter(cat){
    activeCat=CATS[cat]?cat:"sashimi";
    document.querySelectorAll(".food-category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category===activeCat));
    document.querySelectorAll(".food-card").forEach(c=>c.hidden=c.dataset.category!==activeCat);
  }

  function linkForItem(i){
    const old=i.querySelector("a.place-link");
    if(old){i.dataset.link=old.href;old.closest(".actions")?.remove();i.classList.add("link-item")}
    if(i.dataset.link)i.classList.add("link-item");
  }

  function normalize(){
    document.querySelectorAll(".item").forEach(i=>{
      const icon=i.querySelector(".icon");
      if(i.classList.contains("food")&&icon)icon.textContent="🍽️";
      if(i.classList.contains("move")&&icon)icon.textContent="🚗";
      linkForItem(i);
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

  const SCHEDULE_LINK_RULES=[
    [/^적벽강$/,"https://map.naver.com/p/search/부안%20적벽강"],
    [/^카페909$/,"https://map.naver.com/p/search/부안%20카페909"],
    [/^(?:소노벨 변산으로 이동|소노벨 변산 - 체크인|호텔 구경 & 근처 산책|숙소 복귀|체크아웃|호텔 조식)$/,"https://map.naver.com/p/search/소노벨%20변산"],
    [/^고사포해수욕장 이동(?:\s*\(차\s*15분\))?$/,"https://map.naver.com/p/search/부안%20고사포해수욕장"],
    [/^고사포해수욕장 - 갯벌 체험$/,"https://map.naver.com/p/search/부안%20고사포해수욕장"],
    [/^오션플레이$/,"https://map.naver.com/p/search/소노벨%20변산%20오션플레이"],
    [/^점심 · 채석강맛집$/,"https://map.naver.com/p/search/부안%20채석강맛집"],
    [/^저녁 · 변산반도횟집$/,"https://naver.me/G65tM2lT"],
    [/^점심 · 바다마을식당$/,"https://map.naver.com/p/search/부안%20바다마을식당"],
    [/^저녁 · 채석강해물전골조개찜막회$/,"https://map.naver.com/p/search/부안%20채석강해물전골조개찜막회"],
    [/^점심 · 김인경 원조 바지락죽$/,"https://map.naver.com/p/search/부안%20김인경%20원조%20바지락죽"]
  ];

  function auditScheduleLinks(){
    let changed=false;
    document.querySelectorAll(".item").forEach(i=>{
      const title=i.querySelector(".editable-title-text")?.textContent.trim()||"";
      const rule=SCHEDULE_LINK_RULES.find(([pattern])=>pattern.test(title));
      if(!rule)return;
      if(i.dataset.link!==rule[1]){i.dataset.link=rule[1];changed=true}
      i.classList.add("link-item");
    });
    return changed;
  }

  function applyRecommendedMeals(force=false){
    if(!force&&localStorage.getItem(MEAL_PATCH_KEY))return false;
    let changed=false;
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
        changed=true;
      });
    });
    localStorage.setItem(MEAL_PATCH_KEY,"1");
    return changed;
  }

  function scheduleCard(c){
    const day=c.querySelector(".food-day").value;
    const existing=document.querySelector(`.restaurant-schedule[data-restaurant-id="${c.dataset.restaurantId}"]`);
    if(!day){existing?.remove();delete c.dataset.scheduledDay;visit(c,c.querySelector(".food-visited").checked,false);save();return}
    const d=BASE.find(x=>idFor(x.name)===c.dataset.restaurantId);
    if(!d)return;
    const time=d.category==="lunch"?["12:00","13:00"]:["18:00","19:30"];
    const t=document.querySelector("#"+day+" .timeline");
    let i=existing;
    if(!i){
      i=document.createElement("div");
      i.className="item food restaurant-schedule link-item";
      i.dataset.restaurantId=c.dataset.restaurantId;
      i.innerHTML='<div class="time"></div><div><div class="title"><span class="icon">🍽️</span><span class="editable-title-text"></span><span class="restaurant-complete-badge">✓ 완료</span></div><p class="desc">맛집 리스트에서 선택한 식당.</p></div>';
    }
    i.dataset.link=d.mapUrl;
    i.querySelector(".time").textContent=time[0]+" - "+time[1];
    i.querySelector(".editable-title-text").textContent=d.name;
    t.appendChild(i);
    c.dataset.scheduledDay=day;
    sortTimeline(t);
    visit(c,c.querySelector(".food-visited").checked,false);
    refresh();
    save("일정 반영됨");
  }

  function linked(c){return document.querySelector(`.restaurant-schedule[data-restaurant-id="${c.dataset.restaurantId}"]`)}

  function visit(c,v,doSave=true){
    c.classList.toggle("visited",v);
    c.dataset.visited=String(v);
    linked(c)?.classList.toggle("restaurant-completed",v);
    const st=c.querySelector(".food-card-status");
    if(st)st.textContent=c.dataset.scheduledDay?(v?"방문 완료":({day1:"8/30",day2:"8/31",day3:"9/1"}[c.dataset.scheduledDay]+" 일정")):(v?"방문 완료":"아직 일정 없음");
    if(doSave)save();
  }

  function sortTimeline(t){
    const div=t.querySelector(".ampm-divider");
    const items=[...t.children].filter(n=>n.classList.contains("item"));
    items.sort((a,b)=>mins(a)-mins(b));
    div?.remove();
    items.forEach(i=>t.appendChild(i));
    const aft=items.find(i=>mins(i)>=720);
    if(aft){const d=document.createElement("div");d.className="ampm-divider";d.innerHTML="<span>오후</span>";t.insertBefore(d,aft)}
  }

  function mins(i){
    const m=i.querySelector(".time")?.textContent.match(/(\d{1,2}):(\d{2})/);
    return m?+m[1]*60 + +m[2]:9999;
  }

  function clean(){
    const c=wrap.cloneNode(true);
    c.querySelectorAll(".item-edit-tools,.food-card-edit-tools").forEach(n=>n.remove());
    c.querySelectorAll("[contenteditable]").forEach(n=>n.removeAttribute("contenteditable"));
    return c;
  }

  function save(msg){
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{
      localStorage.setItem(KEY,JSON.stringify({version:4,html:clean().innerHTML,updatedAt:new Date().toISOString()}));
      status.textContent=msg||"자동 저장됨";
    },100);
  }

  function editableNodes(){
    return document.querySelectorAll(".hero-kicker,.hero-pin,.eyebrow,h1,.hero-lede,.hero-facts span,.date-title,.day-chip,.time,.editable-title-text,.desc,.food-card-name,.food-card-menu");
  }

  function addTools(i){
    if(i.querySelector(".item-edit-tools"))return;
    const d=document.createElement("div");
    d.className="item-edit-tools";
    d.innerHTML='<button class="item-delete" type="button">이 일정 삭제</button>';
    d.querySelector("button").onclick=()=>{if(confirm("이 일정을 삭제할까요?")){i.remove();save("삭제됨")}};
    i.appendChild(d);
  }

  function addCardTools(c){
    if(c.querySelector(".food-card-edit-tools"))return;
    const d=document.createElement("div");
    d.className="food-card-edit-tools";
    d.innerHTML='<button class="food-card-delete" type="button">이 맛집 삭제</button>';
    d.querySelector("button").onclick=()=>{if(confirm("이 맛집을 삭제할까요?")){c.remove();save("삭제됨")}};
    c.appendChild(d);
  }

  function refresh(){
    editableNodes().forEach(n=>editing?n.setAttribute("contenteditable","true"):n.removeAttribute("contenteditable"));
    document.querySelectorAll(".item").forEach(i=>editing?addTools(i):i.querySelector(".item-edit-tools")?.remove());
    document.querySelectorAll(".food-card").forEach(c=>editing?addCardTools(c):c.querySelector(".food-card-edit-tools")?.remove());
  }

  function setEditing(v){
    editing=v;
    document.body.classList.toggle("editing",v);
    dock.hidden=!v;
    toggle.hidden=v;
    refresh();
    status.textContent=v?"수정 가능":"준비됨";
    if(!v)save("저장됨");
  }

  function currentPanel(){
    const id=document.querySelector('input[name=tripday]:checked')?.id;
    const map={tab1:"day1",tab2:"day2",tab3:"day3"};
    return map[id]?document.getElementById(map[id]):null;
  }

  function addSchedule(){
    const p=currentPanel();
    if(!p)return alert("날짜 탭을 먼저 선택해 주세요.");
    const type=document.getElementById("itemKind").value;
    const cfg={normal:["item","📌"],major:["item major","⭐"],food:["item food","🍽️"],move:["item move","🚗"],minor:["item minor","🧳"],cafe:["item cafe","☕"]}[type];
    const i=document.createElement("div");
    i.className=cfg[0];
    i.innerHTML=`<div class="time">00:00 - 00:00</div><div><div class="title"><span class="icon">${cfg[1]}</span><span class="editable-title-text">새 일정</span></div><p class="desc">설명을 입력하세요.</p></div>`;
    p.querySelector(".timeline").appendChild(i);
    refresh();
    save("추가됨");
  }

  function exportDraft(copy=false){
    const p={version:4,html:clean().innerHTML,updatedAt:new Date().toISOString()};
    const text=JSON.stringify(p);
    if(copy){navigator.clipboard?.writeText(text);status.textContent="복사됨"}
    else{const a=document.createElement("a");a.href="data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(p,null,2));a.download="byeonsan-trip-draft.json";a.click()}
  }

  migrate();
  renderRestaurants();
  normalize();
  const mealChanged=applyRecommendedMeals();
  const linkChanged=auditScheduleLinks();
  if(mealChanged||linkChanged)save(linkChanged?"지도 링크 점검됨":"추천 식당 반영됨");

  toggle.onclick=()=>setEditing(true);
  document.getElementById("closeEditorBtn").onclick=()=>setEditing(false);
  document.getElementById("addItemBtn").onclick=addSchedule;
  document.getElementById("sortItemsBtn").onclick=()=>{const p=currentPanel();if(p){sortTimeline(p.querySelector(".timeline"));save("정렬됨")}};
  document.getElementById("saveDraftBtn").onclick=()=>save("저장됨");
  document.getElementById("downloadDraftBtn").onclick=()=>exportDraft(false);
  document.getElementById("copyDraftBtn").onclick=()=>exportDraft(true);
  document.getElementById("importDraftBtn").onclick=()=>fileInput.click();
  document.getElementById("resetDraftBtn").onclick=()=>{if(confirm("이 기기의 편집 내용을 지울까요?")){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY);localStorage.removeItem(MEAL_PATCH_KEY);location.reload()}};
  document.getElementById("cancelRestaurantBtn").onclick=()=>dialog.close();

  document.addEventListener("click",e=>{
    const cat=e.target.closest(".food-category-tab");
    if(cat)filter(cat.dataset.category);
    if(e.target.closest(".food-guide-add")){
      form.reset();
      document.getElementById("restaurantCategoryInput").value=activeCat;
      dialog.showModal();
      return;
    }
    const i=e.target.closest(".item.link-item");
    if(i&&!editing&&!e.target.closest("button,input,select"))window.open(i.dataset.link,"_blank","noopener");
  });

  document.addEventListener("change",e=>{
    if(e.target.matches(".food-day"))scheduleCard(e.target.closest(".food-card"));
    if(e.target.matches(".food-visited"))visit(e.target.closest(".food-card"),e.target.checked);
  });

  document.addEventListener("input",e=>{
    if(editing&&e.target.closest("[contenteditable=true]")){
      auditScheduleLinks();
      save();
    }
  });

  form.onsubmit=e=>{
    e.preventDefault();
    const name=document.getElementById("restaurantNameInput").value.trim();
    if(!name)return;
    const d={
      name,
      category:document.getElementById("restaurantCategoryInput").value,
      menu:document.getElementById("restaurantMenuInput").value.trim()||"메뉴",
      address:document.getElementById("restaurantAddressInput").value.trim(),
      distanceText:document.getElementById("restaurantWalkInput").value.trim()?`🚶 도보 약 ${document.getElementById("restaurantWalkInput").value.trim()}분`:"거리 미입력",
      mapUrl:document.getElementById("restaurantMapInput").value.trim()||("https://map.naver.com/p/search/"+encodeURIComponent(name))
    };
    BASE.push(d);
    document.getElementById("foodGuideGrid").appendChild(createCard(d));
    filter(d.category);
    refresh();
    save("맛집 추가됨");
    dialog.close();
  };

  fileInput.onchange=()=>{
    const f=fileInput.files?.[0];
    if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      try{const d=JSON.parse(r.result);if(!d.html)throw 0;localStorage.setItem(KEY,JSON.stringify(d));localStorage.removeItem(MEAL_PATCH_KEY);location.reload()}
      catch{alert("올바른 편집본이 아닙니다.")}
    };
    r.readAsText(f);
  };
})();