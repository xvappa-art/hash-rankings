export default async function handler(req, res) {
  const host = req.headers.host;
  const source = await fetch(`https://${host}/index.html`);
  let html = await source.text();

  const oldPodium = `    <section class="podium-section">\n      <div class="section-heading">🏆 TOP 3 PODIUM</div>\n      <div id="podium" class="podium"></div>\n    </section>`;

  const newPodium = `    <section class="podium-section">\n      <div class="podium-kicker">♛ THIS CYCLE</div>\n      <h2 class="podium-heading">The Podium</h2>\n      <p class="podium-subtitle">The three highest-ranked members this cycle. Scores and profile photos stay synced with the existing HASH RANKINGS data.</p>\n      <div id="podium" class="podium"></div>\n    </section>`;

  if (html.includes(oldPodium)) html = html.replace(oldPodium, newPodium);

  const css = `<style id="hash-podium-redesign">
.podium-section,.feature-grid{margin:30px 0}
.podium-section{position:relative;padding:8px 0 4px}
.podium-section .podium-kicker{color:var(--lime);font-size:10px;letter-spacing:3px;font-weight:950;text-transform:uppercase;margin-bottom:8px}
.podium-section .podium-heading{font-size:clamp(30px,5vw,46px);font-weight:950;letter-spacing:-1.8px;line-height:1;margin:0 0 8px}
.podium-section .podium-subtitle{color:var(--muted);font-size:13px;line-height:1.55;margin:0 0 22px;max-width:650px}
.podium{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.16fr) minmax(0,1fr);gap:14px;align-items:end;padding:8px 0 0}
.podium-card{position:relative;text-align:left;overflow:hidden;overflow-wrap:anywhere;background:linear-gradient(180deg,#20221e 0%,#151714 100%);border:1px solid #373a32;border-radius:18px;padding:18px;min-height:245px;box-shadow:0 14px 34px #0007}
.podium-card.place-1{order:2;border:1px solid #ff922b;min-height:315px;padding:22px;transform:translateY(-22px);box-shadow:0 20px 48px #000a,0 0 0 1px #ff922b22}
.podium-card.place-2{order:1}.podium-card.place-3{order:3}
.podium-place{font-size:10px;font-weight:950;color:#aaa99f;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:13px}
.podium-card.place-1 .podium-place{color:var(--lime)}
.podium-avatar{width:100%;height:190px;border-radius:13px;margin:0 0 15px;border:1px solid #45483e;font-size:42px;background:#292d23;color:var(--lime);display:grid;place-items:center;overflow:hidden;font-weight:900}
.podium-card.place-1 .podium-avatar{height:230px;border-color:#8a5429}
.podium-avatar img{width:100%;height:100%;object-fit:cover}
.podium-name{font-weight:950;font-size:20px;line-height:1.15;margin:0 0 7px}
.podium-card.place-1 .podium-name{font-size:25px}
.podium-score{color:var(--lime);font-weight:950;font-size:15px}
.podium-movement{position:absolute;top:15px;right:15px;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:950;letter-spacing:.4px;border:1px solid #3e4b3f;background:#1a261c;color:#78d68d}
.podium-movement.down{border-color:#5b3434;background:#29191a;color:#ff7777}
.podium-movement.neutral{border-color:#46483f;background:#292b26;color:#b7b8ad}
@media(max-width:720px){.podium{grid-template-columns:1fr;gap:12px}.podium-card.place-1{order:1;transform:none;min-height:300px}.podium-card.place-2{order:2}.podium-card.place-3{order:3}.podium-avatar,.podium-card.place-1 .podium-avatar{height:230px}}
</style>`;

  html = html.replace('</head>', css + '\n</head>');

  const oldFn = `function renderPodium(){
           const top=sortedMembers().slice(0,3);
           document.getElementById("podium").innerHTML=top.length?top.map((m,i)=>`
            <div class="podium-card place-${i+1}">
             <div class="podium-place">${["🥇 1ST PLACE","🥈 2ND PLACE","🥉 3RD PLACE"][i]}</div>
             <div class="podium-avatar">${avatarContent(m)}</div>
             <div class="podium-name">${esc(m.name)}</div>
             <div class="podium-score">${Number(m.score)} pts</div>
            </div>`).join(""):'<div class="feature-empty">Add members to fill the podium.</div>';
          }`;

  const newFn = `function renderPodium(){
           const top=sortedMembers().slice(0,3);
           const labels=["#1 · WINNER","#2 · RUNNER-UP","#3 · THIRD PLACE"];
           document.getElementById("podium").innerHTML=top.length?top.map((m,i)=>{
            const hasPrevious=m.previousScore!=null&&Number.isFinite(Number(m.previousScore));
            const change=hasPrevious?Number(m.score)-Number(m.previousScore):0;
            const movement=!hasPrevious?"NEW":change>0?`▲ +${change}`:change<0?`▼ ${change}`:"—";
            const movementClass=!hasPrevious?"neutral":change>0?"":"down";
            return `<div class="podium-card place-${i+1}">
             <div class="podium-movement ${movementClass}">${movement}</div>
             <div class="podium-place">${labels[i]}</div>
             <div class="podium-avatar">${avatarContent(m)}</div>
             <div class="podium-name">${esc(m.name)}</div>
             <div class="podium-score">${Number(m.score)} POINTS</div>
            </div>`;
           }).join(""):'<div class="feature-empty">Add members to fill the podium.</div>';
          }`;

  if (html.includes(oldFn)) html = html.replace(oldFn, newFn);

  const fallbackScript = `<script id="hash-podium-redesign-fallback">
(function(){
  function enhance(){
    const section=document.querySelector('.podium-section');
    const podium=document.getElementById('podium');
    if(!section||!podium||!podium.children.length)return;
    if(!section.querySelector('.podium-kicker')){
      const heading=section.querySelector('.section-heading');
      if(heading){heading.className='podium-kicker';heading.textContent='♛ THIS CYCLE';}
    }
    if(!section.querySelector('.podium-heading')){
      const h=document.createElement('h2');h.className='podium-heading';h.textContent='The Podium';section.insertBefore(h,podium);
    }
    [...podium.children].slice(0,3).forEach((card,i)=>{
      if(card.querySelector('.podium-movement'))return;
      card.classList.add(`place-${i+1}`);
      const badge=document.createElement('div');badge.className='podium-movement neutral';badge.textContent='THIS CYCLE';card.appendChild(badge);
    });
  }
  const observer=new MutationObserver(enhance);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  enhance();
})();
</script>`;

  html = html.replace('</body>', fallbackScript + '\n</body>');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send(html);
}
