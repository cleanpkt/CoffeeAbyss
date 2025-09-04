// Coffee Abyss — simple incremental coffee clicker

const VERSION = 2;
const SAVE_KEY = "coffeeAbyss.save";

// Click boosters (multiple types)
const CLICK_BOOSTERS_DEF = [
  { id: 'handTamping', name: 'ハンドタンピング', baseCost: 50, growth: 1.15, add: 1, desc: '抽出前に粉を手作業で均一に押し固める行為。わずかな力加減の違いが湯の浸透性を変え、抽出効率を高めるとされる。' },
  { id: 'baristaHands', name: 'バリスタの手さばき', baseCost: 200, growth: 1.15, add: 2, desc: '熟練の注湯技術を模倣。安定した回転運動により、液体の抽出効率が強化される。' },
  { id: 'caffeineAwaken', name: 'カフェイン覚醒', baseCost: 800, growth: 1.15, add: 3, desc: '一時的な神経伝達速度の上昇。操作速度が実質的に倍加し、結果として抽出量が向上する。' },
  { id: 'doublePot', name: '二重ポット法', baseCost: 3000, growth: 1.15, add: 5, desc: '一度の操作で二つのポットを同時に抽出。出力の並列化を実現した手法。' },
  { id: 'infiniteStir', name: '無限攪拌棒', baseCost: 12000, growth: 1.15, add: 8, desc: '摩耗しない素材でできた撹拌棒。物理的限界を超えた回転数を保持できる。' },
  { id: 'rhythmPour', name: 'リズム注湯', baseCost: 48000, growth: 1.16, add: 13, desc: '音楽的リズムに同期して湯を注ぐ。心理的快楽によりクリック効率が倍増すると報告されている。' },
  { id: 'hyperFocus', name: '超集中モード', baseCost: 190000, growth: 1.16, add: 21, desc: '使用者の脳波を同期させ、無意識下でのマイクロクリックを発生させる。' },
  { id: 'quantumTap', name: '量子タップ', baseCost: 760000, growth: 1.17, add: 34, desc: '一度のクリックが多世界的に複製され、観測時にすべての結果が集約される。' },
  { id: 'divineFinger', name: '神の一指（Divine Finger）', baseCost: 3000000, growth: 1.18, add: 55, desc: '神話的存在の介入を仮定。人知を超える圧力が指先に宿り、抽出量が桁違いに増加する。' },
];

const FACILITIES_DEF = [
  { id: 'handdrip', name: 'ハンドドリップ台', baseCost: 100, growth: 1.15, cps: 1, desc: '重力と一定の流速を利用して抽出効率を安定化させる。基礎的なコーヒー生成装置。' },
  { id: 'siphon', name: 'サイフォンセット', baseCost: 300, growth: 1.15, cps: 2, desc: '上下フラスコ間の気圧差を応用。対流のサイクルが理論上もっとも美しいとされる抽出法。' },
  { id: 'frenchpress', name: 'フレンチプレス', baseCost: 800, growth: 1.15, cps: 3, desc: 'ステンレスフィルターにより微粉を保持。油脂成分の再現性が高い点で学術的価値がある。' },
  { id: 'homeEspresso', name: '家庭用エスプレッソマシン', baseCost: 2000, growth: 1.15, cps: 5, desc: '高圧ポンプを組み込んだ小型装置。分単位での安定供給が可能となる。' },
  { id: 'proEspresso', name: '業務用エスプレッソマシン', baseCost: 6000, growth: 1.15, cps: 8, desc: 'ボイラー二基を備え、常時数十cc/秒の抽出を実現。都市部カフェ文化の礎を築いた。' },
  { id: 'giantRoaster', name: '巨大焙煎タービン', baseCost: 18000, growth: 1.15, cps: 12, desc: '航空機用エンジンを改造。熱流体力学的に理想的な豆の膨張率を得る。' },
  { id: 'dripPlant', name: '工場ライン式ドリッププラント', baseCost: 60000, growth: 1.15, cps: 20, desc: '数百基のドリップ装置をベルトコンベアに直列化。分単位でプール一杯分を供給可能。' },
  { id: 'coffeeTanker', name: 'コーヒー専用タンカー', baseCost: 150000, growth: 1.15, cps: 35, desc: '海上に浮かぶ抽出・貯蔵施設。大気汚染の影響を最小限に抑えられるのが利点。' },
  { id: 'cave', name: '地下貯蔵カフェ洞窟（自然抽出水路）', baseCost: 400000, growth: 1.15, cps: 60, desc: '石灰岩層をフィルターに利用。天然のミネラルを帯びた高純度コーヒーが湧出する。' },
  { id: 'coffeeFalls', name: 'コーヒー滝（地形レベル）', baseCost: 1000000, growth: 1.15, cps: 100, desc: '地質構造そのものをコーヒー水脈に転換。地形単位での流出を確認。' },
  { id: 'nanoFilter', name: 'ナノフィルター精製システム', baseCost: 3000000, growth: 1.15, cps: 170, desc: '分子ふるい技術でカフェイン・クロロゲン酸を分離制御。理論上限りなく純粋な液体を得る。' },
  { id: 'quantumDripper', name: '量子ドリッパー', baseCost: 10000000, growth: 1.15, cps: 280, desc: '観測ごとに複数宇宙で並行抽出。最終的に収束した確率波が一箇所に集約される。' },
  { id: 'gravitySiphon', name: '重力透過サイフォン', baseCost: 30000000, growth: 1.15, cps: 450, desc: '相対論的効果を利用し、重力場を透過する抽出流路を確立。地球規模の安定供給が可能。' },
  { id: 'blackholeFurnace', name: 'ブラックホール抽出炉', baseCost: 100000000, growth: 1.15, cps: 700, desc: '事象の地平線近傍での物質変換。理論上、質量エネルギーのほぼ全てをコーヒー化できる。' },
  { id: 'timeReverseSiphon', name: '時間反転サイフォン', baseCost: 300000000, growth: 1.15, cps: 1100, desc: '未来で消費された液体を過去に逆流。消費量に比例して供給量が増加するパラドックス装置。' },
  { id: 'summoningCircle', name: 'コーヒー召喚陣', baseCost: 1000000000, growth: 1.15, cps: 1700, desc: '幾何学的図形を用いた供給儀式。異界より「純粋コーヒー素」を呼び出すことが可能。' },
  { id: 'infiniteCup', name: '無限カップ', baseCost: 3000000000, growth: 1.15, cps: 2600, desc: '液面が常に満たされる古代遺物。注いでも減らないことが観察記録から確認されている。' },
  { id: 'kaldiGoats', name: 'カルディの山羊群', baseCost: 10000000000, growth: 1.15, cps: 4000, desc: '伝承に登場する覚醒した山羊。彼らの存在域ではコーヒー豆が自然発生的に繁茂する。' },
  { id: 'coffeeTemple', name: 'コーヒー神殿', baseCost: 30000000000, growth: 1.15, cps: 6000, desc: '集団的祈祷によって液体が湧出。宗教儀式と工業供給を融合した初の試み。' },
  { id: 'yggdrasilBranch', name: '宇宙樹イグドラシルのコーヒー枝', baseCost: 100000000000, growth: 1.15, cps: 9000, desc: '神話上の大樹から滴る黒い露。生態学的スケールを超えた供給を約束する。' },
  { id: 'galaxyRoaster', name: '銀河焙煎機', baseCost: 300000000000, growth: 1.15, cps: 14000, desc: '恒星の核融合炉を利用して豆を焙煎。銀河系単位で均質な味を提供する。' },
  { id: 'nebulaFilter', name: '星雲フィルター', baseCost: 1000000000000, growth: 1.15, cps: 22000, desc: '星間ガスを濾過して直接抽出。分子雲そのものを巨大なドリッパーと見なす理論。' },
  { id: 'darkMatterExtractor', name: 'ダークマター抽出装置', baseCost: 3000000000000, growth: 1.15, cps: 34000, desc: '未発見の質量成分を直接コーヒーへ変換。宇宙の大半を液化可能とされる。' },
  { id: 'bigbangRebrew', name: 'ビッグバン・リブリュー', baseCost: 10000000000000, growth: 1.15, cps: 52000, desc: '宇宙誕生の膨張エネルギーを再利用。時間の始まりから終わりまでを液化抽出する。' },
  { id: 'cosmoNet', name: '宇宙コーヒー網（Cosmic Brewnet）', baseCost: 30000000000000, growth: 1.15, cps: 80000, desc: '銀河団全体をフィルターに見立てた超構造物。観測可能宇宙を一杯のカップへと凝縮する。' },
];

const BASE_CPS = 1; // required: +1cc per second baseline
const BASE_CLICK = 1; // required: +1cc per click baseline
const MUG_CC = 250; // 1マグ=250cc（必要なら調整）

const el = {
  mug: document.getElementById("mug"),
  score: document.getElementById("score"),
  cps: document.getElementById("cps"),
  clickPower: document.getElementById("clickPower"),
  prices: {},
  owned: {},
  notice: document.getElementById("offlineNotice"),
  shop: document.querySelector(".shop"),
  reset: document.getElementById("reset"),
  clickSound: document.getElementById("clickSound"),
  shareBtn: document.getElementById('shareBtn'),
};

const fmt = new Intl.NumberFormat("ja-JP");

function priceOf(base, growth, owned) {
  // cost = base * growth^owned, rounded to int
  return Math.floor(base * Math.pow(growth, owned));
}

function clamp(n) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function nowSec() {
  return Date.now() / 1000;
}

function defaultFacilities() {
  const obj = {};
  for (const f of FACILITIES_DEF) obj[f.id] = 0;
  return obj;
}

function defaultBoosters() {
  const obj = {};
  for (const b of CLICK_BOOSTERS_DEF) obj[b.id] = 0;
  return obj;
}

function defaultState() {
  return {
    v: VERSION,
    coffee: 0,
    clickBoosters: 0, // legacy single booster
    boosters: defaultBoosters(),
    facilities: defaultFacilities(),
    lastTime: nowSec(),
  };
}

function save(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const obj = JSON.parse(raw);
    // migrate if needed
    const def = defaultState();
    const loaded = { ...def, ...obj };
    // Deep-merge facilities to ensure new keys are present
    loaded.facilities = { ...defaultFacilities(), ...(obj.facilities || def.facilities) };
    // Deep-merge boosters and migrate legacy
    loaded.boosters = { ...defaultBoosters(), ...(obj.boosters || def.boosters) };
    if (obj.clickBoosters && obj.clickBoosters > 0) {
      loaded.boosters.handTamping = (loaded.boosters.handTamping || 0) + obj.clickBoosters;
    }
    return loaded;
  } catch (e) {
    return defaultState();
  }
}

const state = load();

function totalFacilityCps() {
  let cps = 0;
  for (const f of FACILITIES_DEF) {
    cps += f.cps * (state.facilities[f.id] || 0);
  }
  return cps;
}

function totalCps() {
  return BASE_CPS + totalFacilityCps();
}

function clickPower() {
  let add = 0;
  for (const b of CLICK_BOOSTERS_DEF) {
    add += (state.boosters[b.id] || 0) * b.add;
  }
  return BASE_CLICK + add;
}

function addCoffee(amount) {
  state.coffee = clamp(state.coffee + amount);
}

function setNotice(text) {
  if (!text) {
    el.notice.hidden = true;
    el.notice.textContent = "";
    return;
  }
  el.notice.hidden = false;
  el.notice.textContent = text;
  // auto hide after 6 seconds
  clearTimeout(setNotice._t);
  setNotice._t = setTimeout(() => setNotice(""), 6000);
}

function updateUI() {
  el.score.textContent = `${fmt.format(Math.floor(state.coffee))} cc`;
  el.cps.textContent = `+${fmt.format(totalCps())} cc/s`;
  el.clickPower.textContent = `+${fmt.format(clickPower())}/クリック`;

  // Status panel
  const facilityCps = totalFacilityCps();
  const clickAdd = clickPower() - BASE_CLICK;
  const breakdown = `基本 ${fmt.format(BASE_CPS)} + 施設 ${fmt.format(facilityCps)} + クリック +${fmt.format(clickAdd)}/クリック`;
  const statTotal = document.getElementById('stat-total');
  const statCps = document.getElementById('stat-cps');
  const statCpsBr = document.getElementById('stat-cps-breakdown');
  const statClick = document.getElementById('stat-click');
  const statCups = document.getElementById('stat-cups');
  const statSea = document.getElementById('stat-sea');
  if (statTotal) statTotal.textContent = `${fmt.format(Math.floor(state.coffee))} cc`;
  if (statCps) statCps.textContent = `${fmt.format(totalCps())} cc/s`;
  if (statCpsBr) statCpsBr.textContent = breakdown;
  if (statClick) statClick.textContent = `+${fmt.format(clickPower())}/クリック`;
  if (statCups) statCups.textContent = `${fmt.format(Math.floor(state.coffee / MUG_CC))} 杯`;
  if (statSea) {
    const EARTH_SEA_CC = 1.332e24; // 地球の海水量 ≒1.332e9 km^3 → cc換算
    const perc = Math.min(100, (state.coffee / EARTH_SEA_CC) * 100);
    const percFmt = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 12 }).format(perc);
    statSea.textContent = `${percFmt}%`;
  }

  // Boosters
  for (const b of CLICK_BOOSTERS_DEF) {
    const owned = state.boosters[b.id] || 0;
    const p = priceOf(b.baseCost, b.growth, owned);
    const priceEl = document.getElementById(`price-${b.id}`);
    const ownedEl = document.getElementById(`owned-${b.id}`);
    if (priceEl) priceEl.textContent = `${fmt.format(p)} cc`;
    if (ownedEl) ownedEl.textContent = fmt.format(owned);
    const itemEl = document.getElementById(`item-${b.id}`);
    const btn = itemEl ? itemEl.querySelector('button.buy-btn') : null;
    const can = state.coffee >= p;
    if (btn) btn.disabled = !can;
    if (itemEl) itemEl.classList.toggle('can-buy', can);
  }

  for (const f of FACILITIES_DEF) {
    const p = priceOf(f.baseCost, f.growth, state.facilities[f.id] || 0);
    const priceEl = document.getElementById(`price-${f.id}`);
    const ownedEl = document.getElementById(`owned-${f.id}`);
    if (priceEl) priceEl.textContent = `${fmt.format(p)} cc`;
    if (ownedEl) ownedEl.textContent = fmt.format(state.facilities[f.id] || 0);
    const itemEl = document.getElementById(`item-${f.id}`);
    const btn = itemEl ? itemEl.querySelector('button.buy-btn') : null;
    const can = state.coffee >= p;
    if (btn) btn.disabled = !can;
    if (itemEl) itemEl.classList.toggle('can-buy', can);
  }
}

function handleClick() {
  addCoffee(clickPower());
  // play click sound
  try {
    if (el.clickSound) {
      el.clickSound.currentTime = 0;
      el.clickSound.play().catch(() => {});
    }
  } catch {}
  save(state);
  updateUI();
  // small ripple effect
  el.mug.classList.remove('pulse');
  void el.mug.offsetWidth; // reflow
  el.mug.classList.add('pulse');
}

function buyBooster(id) {
  const b = CLICK_BOOSTERS_DEF.find(x => x.id === id);
  if (!b) return;
  const owned = state.boosters[id] || 0;
  const cost = priceOf(b.baseCost, b.growth, owned);
  if (state.coffee >= cost) {
    addCoffee(-cost);
    state.boosters[id] = owned + 1;
    save(state);
    updateUI();
  }
}

function buyFacility(id) {
  const def = FACILITIES_DEF.find(f => f.id === id);
  if (!def) return;
  const owned = state.facilities[id] || 0;
  const cost = priceOf(def.baseCost, def.growth, owned);
  if (state.coffee >= cost) {
    addCoffee(-cost);
    state.facilities[id] = owned + 1;
    save(state);
    updateUI();
  }
}

// Bind events
el.mug.addEventListener('click', handleClick);
el.shop.addEventListener('click', (e) => {
  const btn = e.target.closest('button.buy-btn');
  if (!btn) return;
  const type = btn.getAttribute('data-type');
  const id = btn.getAttribute('data-id');
  if (type === 'booster') buyBooster(id);
  else if (type === 'facility') buyFacility(id);
});

el.reset.addEventListener('click', () => {
  if (confirm('セーブデータを消去しますか？')) {
    Object.assign(state, defaultState());
    save(state);
    updateUI();
    setNotice('セーブを消去しました。');
  }
});

// Offline progress on load
(function handleOffline() {
  const prev = state.lastTime || nowSec();
  const current = nowSec();
  const dt = Math.max(0, current - prev);
  // Use only passive CPS for offline gains (includes base 1 cc/s) — no clicks
  const gain = totalCps() * dt;
  if (dt > 2) {
    addCoffee(gain);
    setNotice(`オフライン中に ${fmt.format(Math.floor(gain))} cc 増えました（約 ${Math.floor(dt)} 秒）`);
  }
  state.lastTime = current;
  save(state);
})();

// Main loop — delta based
let last = nowSec();
function loop() {
  const t = nowSec();
  const dt = t - last;
  last = t;

  if (dt > 0) {
    const cps = totalCps();
    addCoffee(cps * dt);
  }

  updateUI();

  // persist occasionally
  if (!loop._acc) loop._acc = 0;
  loop._acc += dt;
  if (loop._acc > 3) {
    state.lastTime = t;
    save(state);
    loop._acc = 0;
  }

  requestAnimationFrame(loop);
}

// Fancy pulse animation class
const style = document.createElement('style');
style.textContent = `
.pulse { animation: p .12s ease; }
@keyframes p { from { transform: scale(0.985); } to { transform: scale(1.0); } }
`;
document.head.appendChild(style);

// Initial paint
renderShop();
updateUI();
requestAnimationFrame(loop);

// Persist on tab hide/close
function persistNow() {
  state.lastTime = nowSec();
  save(state);
}
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') persistNow();
});
window.addEventListener('beforeunload', persistNow);

// Share to X/Twitter
if (el.shareBtn) {
  el.shareBtn.addEventListener('click', () => {
    const cups = Math.floor(state.coffee / MUG_CC);
    const cc = Math.floor(state.coffee);
    const ccFmt = fmt.format(cc);
    const text = `私は${cups}杯分のコーヒー（${ccFmt}cc）を抽出しました ☕️ #CoffeAbyss https://coffee-abyss.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, 'tweet', 'width=560,height=420,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
  });
}

// Render facilities dynamically
function renderShop() {
  const list = document.getElementById('facilitiesList');
  if (!list) return;
  list.innerHTML = '';
  for (const f of FACILITIES_DEF) {
    const item = document.createElement('div');
    item.className = 'item';
    item.id = `item-${f.id}`;
    item.setAttribute('data-key', f.id);
    item.innerHTML = `
      <div class="meta">
        <div class="name">${f.name}</div>
        <div class="desc">+${fmt.format(f.cps)} cc/秒</div>
      </div>
      <div class="buy">
        <button class="buy-btn" data-action="buy" data-type="facility" data-id="${f.id}">購入</button>
        <div class="price" id="price-${f.id}">-</div>
        <div class="owned">所持: <span id="owned-${f.id}">0</span></div>
      </div>
      <div class="tooltip">${f.desc || ''}</div>
    `;
    list.appendChild(item);
  }

  const blist = document.getElementById('boostersList');
  if (blist) {
    blist.innerHTML = '';
    for (const b of CLICK_BOOSTERS_DEF) {
      const item = document.createElement('div');
      item.className = 'item';
      item.id = `item-${b.id}`;
      item.setAttribute('data-key', b.id);
      item.innerHTML = `
        <div class="meta">
          <div class="name">${b.name}</div>
          <div class="desc">クリック毎のccを +${fmt.format(b.add)}</div>
        </div>
        <div class="buy">
          <button class="buy-btn" data-action="buy" data-type="booster" data-id="${b.id}">購入</button>
          <div class="price" id="price-${b.id}">-</div>
          <div class="owned">所持: <span id="owned-${b.id}">0</span></div>
        </div>
        <div class="tooltip">${b.desc ? b.desc : `クリック強化：クリック毎 +${fmt.format(b.add)}cc。購入ごとに価格が上昇します。`}</div>
      `;
      blist.appendChild(item);
    }
  }
}
