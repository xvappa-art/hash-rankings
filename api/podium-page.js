export default async function handler(req, res) {
  const host = req.headers.host;
  const source = await fetch(`https://${host}/index.html`);
  let html = await source.text();

  const css = `<style id="hash-podium-reference-design">
/* Reference-style HASH RANKINGS podium */
.podium-section{margin:28px 0 34px!important;padding:0!important;text-align:center}
.podium-section .section-heading,.podium-section .podium-kicker{display:block!important;color:#ffb23e!important;font-size:11px!important;line-height:1!important;letter-spacing:2px!important;font-weight:900!important;text-transform:uppercase!important;margin:0 0 10px!important}
.podium-section .podium-heading{display:block!important;color:#f4f5ef!important;font-size:30px!important;line-height:1.05!important;font-weight:950!important;letter-spacing:-1px!important;margin:0 0 10px!important}
.podium-section .podium-subtitle{display:block!important;max-width:540px!important;margin:0 auto 20px!important;color:#73766f!important;font-size:12px!important;line-height:1.45!important}
.podium-section .podium-subtitle::after{content:"";display:block;width:96px;height:1px;background:#5d4628;margin:18px auto 0}
.podium{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)!important;gap:14px!important;align-items:end!important;padding:8px 0 0!important;max-width:900px!important;margin:0 auto!important}
.podium-card{position:relative!important;display:flex!important;flex-direction:column!important;text-align:left!important;overflow:hidden!important;background:#0c0c0c!important;border:1px solid #565656!important;border-radius:8px!important;padding:0!important;min-height:414px!important;height:414px!important;box-shadow:none!important}
.podium-card.place-1{order:2!important;border-color:#a8752c!important;min-height:414px!important;height:414px!important;padding:0!important;transform:translateY(-40px)!important;box-shadow:0 0 0 1px #6b4b1f55!important}
.podium-card.place-2{order:1!important;transform:translateY(0)!important}
.podium-card.place-3{order:3!important;border-color:#9b651e!important;transform:translateY(0)!important}
.podium-place{height:50px!important;display:flex!important;align-items:center!important;padding:0 16px!important;margin:0!important;color:#ffb23e!important;font-size:12px!important;line-height:1!important;letter-spacing:1.4px!important;font-weight:900!important;text-transform:uppercase!important;border-bottom:1px solid #5a3e1c!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.podium-card.place-2 .podium-place{color:#e5e5e5!important;border-bottom-color:#414141!important}
.podium-card.place-3 .podium-place{color:#ff8f22!important}
.podium-avatar{position:relative!important;width:calc(100% - 10px)!important;height:calc(100% - 60px)!important;min-height:0!important;margin:5px!important;border-radius:5px!important;border:1px solid #555!important;background:#1c1c1c!important;overflow:hidden!important;display:grid!important;place-items:center!important;color:#ff922b!important;font-size:38px!important;font-weight:900!important}
.podium-card.place-1 .podium-avatar{height:calc(100% - 60px)!important;border-color:#6b583d!important}
.podium-avatar img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
.podium-avatar::after{content:"";position:absolute;inset:45% 0 0;background:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.78) 100%);pointer-events:none}
.podium-name{position:absolute!important;left:20px!important;bottom:18px!important;z-index:3!important;margin:0!important;color:#fff!important;font-size:16px!important;line-height:1.1!important;font-weight:950!important;text-shadow:0 1px 8px #000!important}
.podium-card.place-1 .podium-name{font-size:17px!important}
.podium-score{position:absolute!important;left:20px!important;bottom:48px!important;z-index:3!important;margin:0!important;color:#ffbd56!important;font-size:11px!important;font-weight:700!important}
.podium-score{font-size:0!important}
.podium-score::after{font-size:11px!important;content:""}
.podium-movement{position:absolute!important;top:12px!important;right:14px!important;z-index:5!important;border-radius:3px!important;padding:5px 8px!important;font-size:10px!important;line-height:1!important;font-weight:900!important;letter-spacing:.2px!important;border:0!important;background:#102d1c!important;color:#23c86d!important}
.podium-movement.down{background:#351818!important;color:#ff4d4d!important}
.podium-movement.neutral{background:#292929!important;color:#aaa!important}
.podium-place::first-letter{color:inherit}
@media(max-width:720px){
  .podium{grid-template-columns:1fr!important;gap:12px!important;padding-top:0!important}
  .podium-card,.podium-card.place-1{height:390px!important;min-height:390px!important;transform:none!important}
  .podium-card.place-1{order:1!important}.podium-card.place-2{order:2!important}.podium-card.place-3{order:3!important}
}
</style>`;

  const script = `<script id="hash-podium-reference-script">
(function(){
  function update(){
    const section=document.querySelector('.podium-section');
    const podium=document.getElementById('podium');
    if(!section||!podium)return;

    let kicker=section.querySelector('.podium-kicker');
    if(!kicker){
      kicker=section.querySelector('.section-heading');
      if(kicker){kicker.className='podium-kicker';}
    }
    if(kicker) kicker.textContent='♕ THIS CYCLE';

    let heading=section.querySelector('.podium-heading');
    if(!heading){
      heading=document.createElement('h2');
      heading.className='podium-heading';
      const anchor=kicker||section.firstElementChild;
      if(anchor) anchor.after(heading); else section.prepend(heading);
    }
    heading.textContent='The Podium';

    let subtitle=section.querySelector('.podium-subtitle');
    if(!subtitle){
      subtitle=document.createElement('p');
      subtitle.className='podium-subtitle';
      heading.after(subtitle);
    }
    subtitle.textContent='The three highest placements of the published cycle, with their score and recent trajectory.';

    const cards=[...podium.querySelectorAll('.podium-card')].slice(0,3);
    const labels=['WINNER','RUNNER UP','THIRD'];
    cards.forEach(function(card,i){
      card.classList.remove('place-1','place-2','place-3');
      card.classList.add('place-'+(i+1));
      const place=card.querySelector('.podium-place');
      if(place) place.textContent=labels[i];
      const score=card.querySelector('.podium-score');
      if(score) score.setAttribute('aria-hidden','true');
      let avatar=card.querySelector('.podium-avatar');
      if(avatar){
        const img=avatar.querySelector('img');
        if(img) img.loading='eager';
      }
    });
  }
  const observer=new MutationObserver(update);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',update); else update();
})();
</script>`;

  html = html.replace('</head>', css + '\n</head>');
  html = html.replace('</body>', script + '\n</body>');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send(html);
}
