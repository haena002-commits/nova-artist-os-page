(()=>{
  const DINNER_URL="https://naver.me/xTTVxJMX";

  function item({time,title,desc="",icon="📍",kind="major",link=""}){
    const el=document.createElement("div");
    el.className=`item ${kind}${link?" link-item":""}`.trim();
    if(link)el.dataset.link=link;
    el.innerHTML=`<div class="time"></div><div><div class="title"><span class="icon"></span><span class="editable-title-text"></span></div>${desc?'<p class="desc"></p>':""}</div>`;
    el.querySelector(".time").textContent=time;
    el.querySelector(".icon").textContent=icon;
    el.querySelector(".editable-title-text").textContent=title;
    if(desc)el.querySelector(".desc").textContent=desc;
    return el;
  }

  function applyDay1Route(){
    const timeline=document.querySelector("#day1 .timeline");
    if(!timeline)return;

    const start=[...timeline.querySelectorAll(".item")].find(i=>i.querySelector(".time")?.textContent.trim()==="08:00 - 11:50");
    const lunch=[...timeline.querySelectorAll(".item.food")].find(i=>i.querySelector(".time")?.textContent.trim()==="12:00 - 13:00");
    const dinner=[...timeline.querySelectorAll(".item.food")].find(i=>/저녁/.test(i.querySelector(".editable-title-text")?.textContent||""));
    if(!start||!lunch||!dinner)return;

    // Keep the currently selected lunch untouched.
    // Keep the current dinner restaurant/link, only move its time earlier for sunset.
    const dinnerTitle=dinner.querySelector(".editable-title-text");
    const dinnerDesc=dinner.querySelector(".desc");
    if(dinnerTitle)dinnerTitle.textContent="저녁 · 청상어횟집";
    if(dinnerDesc)dinnerDesc.textContent="도보 이동 · 회 · 해산물";
    dinner.querySelector(".time").textContent="17:00 - 18:10";
    dinner.dataset.link=DINNER_URL;
    dinner.classList.add("link-item");

    const divider=document.createElement("div");
    divider.className="ampm-divider";
    divider.innerHTML="<span>오후</span>";

    const route=[
      start,
      divider,
      lunch,
      item({time:"13:10 - 13:45",title:"채석강",desc:"점심 후 채석강 산책과 해식절벽 구경.",icon:"🌊",kind:"major",link:"https://map.naver.com/p/search/부안%20채석강"}),
      item({time:"13:55 - 14:40",title:"적벽강 · 수성당",desc:"적벽강 풍경과 수성당을 함께 둘러보기.",icon:"🌊",kind:"major",link:"https://map.naver.com/p/search/부안%20적벽강%20수성당"}),
      item({time:"14:50 - 15:30",title:"카페909",desc:"바다 보면서 커피 한 잔.",icon:"☕",kind:"cafe",link:"https://map.naver.com/p/search/부안%20카페909"}),
      item({time:"15:40 - 15:55",title:"숙소로 이동",icon:"🚗",kind:"move"}),
      item({time:"16:00 - 16:50",title:"소노벨 변산 · 체크인 & 휴식",desc:"짐 정리하고 저녁 전 잠깐 쉬기.",icon:"🏨",kind:"minor",link:"https://map.naver.com/p/search/소노벨%20변산"}),
      dinner,
      item({time:"18:10 - 18:30",title:"솔섬으로 이동",icon:"🚗",kind:"move"}),
      item({time:"18:30 - 19:20",title:"솔섬 · 일몰",desc:"19:05 전후 해넘이 감상.",icon:"🌅",kind:"major",link:"https://map.naver.com/p/search/부안%20솔섬"})
    ];

    timeline.replaceChildren(...route);

    const chip=document.querySelector("#day1 .day-chip");
    if(chip)chip.textContent="🌅 채석강 · 적벽강 · 솔섬 일몰";

    const card=[...document.querySelectorAll(".food-card")].find(c=>c.querySelector(".food-card-name")?.textContent.trim()==="청상어횟집");
    if(card){
      const link=card.querySelector(".food-card-top");
      if(link)link.href=DINNER_URL;
    }
  }

  applyDay1Route();
})();