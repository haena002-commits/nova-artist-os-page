(()=>{
  const LAT=35.63;
  const LON=126.47;
  const REFRESH_MS=30*60*1000;

  const WEATHER={
    0:["☀️","맑음"],1:["🌤️","대체로 맑음"],2:["⛅","구름 조금"],3:["☁️","흐림"],
    45:["🌫️","안개"],48:["🌫️","안개"],51:["🌦️","이슬비"],53:["🌦️","이슬비"],55:["🌧️","비"],
    56:["🌧️","어는 비"],57:["🌧️","어는 비"],61:["🌦️","약한 비"],63:["🌧️","비"],65:["🌧️","강한 비"],
    66:["🌧️","어는 비"],67:["🌧️","강한 어는 비"],71:["🌨️","약한 눈"],73:["🌨️","눈"],75:["❄️","강한 눈"],
    77:["🌨️","싸락눈"],80:["🌦️","소나기"],81:["🌧️","소나기"],82:["⛈️","강한 소나기"],
    85:["🌨️","눈소나기"],86:["❄️","강한 눈소나기"],95:["⛈️","뇌우"],96:["⛈️","우박 동반 뇌우"],99:["⛈️","강한 뇌우"]
  };

  function ensureBox(){
    const hero=document.querySelector(".hero");
    if(!hero)return null;
    let box=hero.querySelector("#heroWeather");
    if(box)return box;
    box=document.createElement("div");
    box.id="heroWeather";
    box.className="hero-weather";
    box.setAttribute("role","status");
    box.setAttribute("aria-live","polite");
    box.innerHTML='<div class="hero-weather-icon">🌤️</div><div class="hero-weather-copy"><div class="hero-weather-main">변산 날씨 확인 중…</div><div class="hero-weather-sub">현재 정보를 불러오고 있어요</div></div>';
    const facts=hero.querySelector(".hero-facts");
    if(facts)hero.insertBefore(box,facts);else hero.appendChild(box);
    return box;
  }

  function n(v){return Number.isFinite(Number(v))?Math.round(Number(v)):null}

  async function loadWeather(){
    const box=ensureBox();
    if(!box)return;
    try{
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=1`;
      const res=await fetch(url,{cache:"no-store"});
      if(!res.ok)throw new Error("weather request failed");
      const data=await res.json();
      const cur=data.current||{};
      const daily=data.daily||{};
      const code=Number(cur.weather_code);
      const [icon,label]=WEATHER[code]||["🌤️","현재 날씨"];
      const temp=n(cur.temperature_2m);
      const feels=n(cur.apparent_temperature);
      const high=n(daily.temperature_2m_max?.[0]);
      const low=n(daily.temperature_2m_min?.[0]);
      const rain=n(daily.precipitation_probability_max?.[0]);
      const time=typeof cur.time==="string"?cur.time.slice(11,16):"";

      box.innerHTML=`<div class="hero-weather-icon">${icon}</div><div class="hero-weather-copy"><div class="hero-weather-main">변산 ${temp??"-"}° · ${label}</div><div class="hero-weather-sub">체감 ${feels??"-"}° · 최고 ${high??"-"}° / 최저 ${low??"-"}° · 강수 ${rain??"-"}%${time?` · ${time} 기준`:""}</div></div>`;
      box.classList.remove("weather-error");
    }catch(err){
      box.innerHTML='<div class="hero-weather-icon">🌥️</div><div class="hero-weather-copy"><div class="hero-weather-main">변산 날씨</div><div class="hero-weather-sub">날씨 정보를 불러오지 못했어요</div></div>';
      box.classList.add("weather-error");
    }
  }

  ensureBox();
  loadWeather();
  setInterval(loadWeather,REFRESH_MS);
})();