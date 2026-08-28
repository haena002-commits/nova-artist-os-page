(()=>{
  const NAVER_URL="https://naver.me/xTTVxJMX";

  function applyFamilyOverrides(){
    const dinner=[...document.querySelectorAll("#day1 .item.food")].find(item=>item.querySelector(".time")?.textContent.trim()==="17:30 - 19:00");
    if(dinner){
      const title=dinner.querySelector(".editable-title-text");
      const desc=dinner.querySelector(".desc");
      if(title)title.textContent="저녁 · 청상어횟집";
      if(desc)desc.textContent="도보 이동 · 회 · 해산물";
      dinner.dataset.link=NAVER_URL;
      dinner.classList.add("link-item");
    }

    const card=[...document.querySelectorAll(".food-card")].find(c=>c.querySelector(".food-card-name")?.textContent.trim()==="청상어횟집");
    if(card){
      const link=card.querySelector(".food-card-top");
      if(link)link.href=NAVER_URL;
    }
  }

  applyFamilyOverrides();
})();