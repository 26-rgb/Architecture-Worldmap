// ═══════════════════════════════════════════════════════
//  ATLAS — Accurate World Map  (TopoJSON + Canvas)
// ═══════════════════════════════════════════════════════

const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// ── Country metadata (ISO numeric → info) ────────────
const COUNTRY_INFO = {
  4:  {name:'アフガニスタン',flag:'🇦🇫',capital:'カブール',continent:'アジア',population:'4000万',area:'652,230 km²',currency:'アフガニ'},
  8:  {name:'アルバニア',flag:'🇦🇱',capital:'ティラナ',continent:'ヨーロッパ',population:'280万',area:'28,748 km²',currency:'レク'},
  12: {name:'アルジェリア',flag:'🇩🇿',capital:'アルジェ',continent:'アフリカ',population:'4500万',area:'2,381,741 km²',currency:'ディナール'},
  24: {name:'アンゴラ',flag:'🇦🇴',capital:'ルアンダ',continent:'アフリカ',population:'3400万',area:'1,246,700 km²',currency:'クワンザ'},
  32: {name:'アルゼンチン',flag:'🇦🇷',capital:'ブエノスアイレス',continent:'南アメリカ',population:'4600万',area:'2,780,400 km²',currency:'ペソ'},
  36: {name:'オーストラリア',flag:'🇦🇺',capital:'キャンベラ',continent:'オセアニア',population:'2600万',area:'7,741,220 km²',currency:'豪ドル'},
  40: {name:'オーストリア',flag:'🇦🇹',capital:'ウィーン',continent:'ヨーロッパ',population:'910万',area:'83,871 km²',currency:'ユーロ'},
  50: {name:'バングラデシュ',flag:'🇧🇩',capital:'ダッカ',continent:'アジア',population:'1億6700万',area:'147,570 km²',currency:'タカ'},
  56: {name:'ベルギー',flag:'🇧🇪',capital:'ブリュッセル',continent:'ヨーロッパ',population:'1160万',area:'30,528 km²',currency:'ユーロ'},
  64: {name:'ブータン',flag:'🇧🇹',capital:'ティンプー',continent:'アジア',population:'78万',area:'38,394 km²',currency:'ニュルタム'},
  68: {name:'ボリビア',flag:'🇧🇴',capital:'スクレ',continent:'南アメリカ',population:'1200万',area:'1,098,581 km²',currency:'ボリビアーノ'},
  76: {name:'ブラジル',flag:'🇧🇷',capital:'ブラジリア',continent:'南アメリカ',population:'2億1500万',area:'8,515,767 km²',currency:'レアル'},
  100:{name:'ブルガリア',flag:'🇧🇬',capital:'ソフィア',continent:'ヨーロッパ',population:'680万',area:'110,879 km²',currency:'レフ'},
  104:{name:'ミャンマー',flag:'🇲🇲',capital:'ネピドー',continent:'アジア',population:'5400万',area:'676,578 km²',currency:'チャット'},
  116:{name:'カンボジア',flag:'🇰🇭',capital:'プノンペン',continent:'アジア',population:'1700万',area:'181,035 km²',currency:'リエル'},
  120:{name:'カメルーン',flag:'🇨🇲',capital:'ヤウンデ',continent:'アフリカ',population:'2700万',area:'475,442 km²',currency:'CFAフラン'},
  124:{name:'カナダ',flag:'🇨🇦',capital:'オタワ',continent:'北アメリカ',population:'3800万',area:'9,984,670 km²',currency:'カナダドル'},
  152:{name:'チリ',flag:'🇨🇱',capital:'サンティアゴ',continent:'南アメリカ',population:'1900万',area:'756,102 km²',currency:'ペソ'},
  156:{name:'中国',flag:'🇨🇳',capital:'北京',continent:'アジア',population:'14億1200万',area:'9,596,960 km²',currency:'人民元'},
  170:{name:'コロンビア',flag:'🇨🇴',capital:'ボゴタ',continent:'南アメリカ',population:'5100万',area:'1,141,748 km²',currency:'ペソ'},
  180:{name:'コンゴ民主共和国',flag:'🇨🇩',capital:'キンシャサ',continent:'アフリカ',population:'9900万',area:'2,344,858 km²',currency:'コンゴフラン'},
  188:{name:'コスタリカ',flag:'🇨🇷',capital:'サンホセ',continent:'北アメリカ',population:'510万',area:'51,100 km²',currency:'コロン'},
  191:{name:'クロアチア',flag:'🇭🇷',capital:'ザグレブ',continent:'ヨーロッパ',population:'390万',area:'56,594 km²',currency:'ユーロ'},
  192:{name:'キューバ',flag:'🇨🇺',capital:'ハバナ',continent:'北アメリカ',population:'1100万',area:'109,884 km²',currency:'ペソ'},
  203:{name:'チェコ',flag:'🇨🇿',capital:'プラハ',continent:'ヨーロッパ',population:'1070万',area:'78,868 km²',currency:'コルナ'},
  208:{name:'デンマーク',flag:'🇩🇰',capital:'コペンハーゲン',continent:'ヨーロッパ',population:'590万',area:'42,924 km²',currency:'クローネ'},
  218:{name:'エクアドル',flag:'🇪🇨',capital:'キト',continent:'南アメリカ',population:'1800万',area:'283,561 km²',currency:'米ドル'},
  818:{name:'エジプト',flag:'🇪🇬',capital:'カイロ',continent:'アフリカ',population:'1億500万',area:'1,001,450 km²',currency:'ポンド'},
  231:{name:'エチオピア',flag:'🇪🇹',capital:'アディスアベバ',continent:'アフリカ',population:'1億2000万',area:'1,104,300 km²',currency:'ブル'},
  246:{name:'フィンランド',flag:'🇫🇮',capital:'ヘルシンキ',continent:'ヨーロッパ',population:'550万',area:'338,424 km²',currency:'ユーロ'},
  250:{name:'フランス',flag:'🇫🇷',capital:'パリ',continent:'ヨーロッパ',population:'6780万',area:'551,695 km²',currency:'ユーロ'},
  276:{name:'ドイツ',flag:'🇩🇪',capital:'ベルリン',continent:'ヨーロッパ',population:'8320万',area:'357,114 km²',currency:'ユーロ'},
  288:{name:'ガーナ',flag:'🇬🇭',capital:'アクラ',continent:'アフリカ',population:'3200万',area:'238,533 km²',currency:'セディ'},
  300:{name:'ギリシャ',flag:'🇬🇷',capital:'アテネ',continent:'ヨーロッパ',population:'1050万',area:'131,957 km²',currency:'ユーロ'},
  320:{name:'グアテマラ',flag:'🇬🇹',capital:'グアテマラシティ',continent:'北アメリカ',population:'1700万',area:'108,889 km²',currency:'ケツァル'},
  324:{name:'ギニア',flag:'🇬🇳',capital:'コナクリ',continent:'アフリカ',population:'1300万',area:'245,857 km²',currency:'フラン'},
  340:{name:'ホンジュラス',flag:'🇭🇳',capital:'テグシガルパ',continent:'北アメリカ',population:'1000万',area:'112,492 km²',currency:'レンピーラ'},
  348:{name:'ハンガリー',flag:'🇭🇺',capital:'ブダペスト',continent:'ヨーロッパ',population:'970万',area:'93,028 km²',currency:'フォリント'},
  356:{name:'インド',flag:'🇮🇳',capital:'ニューデリー',continent:'アジア',population:'14億2800万',area:'3,287,263 km²',currency:'ルピー'},
  360:{name:'インドネシア',flag:'🇮🇩',capital:'ジャカルタ',continent:'アジア',population:'2億7700万',area:'1,904,569 km²',currency:'ルピア'},
  364:{name:'イラン',flag:'🇮🇷',capital:'テヘラン',continent:'アジア',population:'8600万',area:'1,648,195 km²',currency:'リヤル'},
  368:{name:'イラク',flag:'🇮🇶',capital:'バグダッド',continent:'アジア',population:'4100万',area:'438,317 km²',currency:'ディナール'},
  372:{name:'アイルランド',flag:'🇮🇪',capital:'ダブリン',continent:'ヨーロッパ',population:'510万',area:'70,273 km²',currency:'ユーロ'},
  376:{name:'イスラエル',flag:'🇮🇱',capital:'エルサレム',continent:'アジア',population:'940万',area:'22,072 km²',currency:'シェケル'},
  380:{name:'イタリア',flag:'🇮🇹',capital:'ローマ',continent:'ヨーロッパ',population:'5970万',area:'301,340 km²',currency:'ユーロ'},
  388:{name:'ジャマイカ',flag:'🇯🇲',capital:'キングストン',continent:'北アメリカ',population:'300万',area:'10,991 km²',currency:'ドル'},
  392:{name:'日本',flag:'🇯🇵',capital:'東京',continent:'アジア',population:'1億2560万',area:'377,915 km²',currency:'円'},
  400:{name:'ヨルダン',flag:'🇯🇴',capital:'アンマン',continent:'アジア',population:'1020万',area:'89,342 km²',currency:'ディナール'},
  398:{name:'カザフスタン',flag:'🇰🇿',capital:'アスタナ',continent:'アジア',population:'1900万',area:'2,724,900 km²',currency:'テンゲ'},
  404:{name:'ケニア',flag:'🇰🇪',capital:'ナイロビ',continent:'アフリカ',population:'5400万',area:'580,367 km²',currency:'シリング'},
  408:{name:'北朝鮮',flag:'🇰🇵',capital:'平壌',continent:'アジア',population:'2600万',area:'120,538 km²',currency:'ウォン'},
  410:{name:'韓国',flag:'🇰🇷',capital:'ソウル',continent:'アジア',population:'5170万',area:'100,363 km²',currency:'ウォン'},
  418:{name:'ラオス',flag:'🇱🇦',capital:'ビエンチャン',continent:'アジア',population:'740万',area:'236,800 km²',currency:'キープ'},
  422:{name:'レバノン',flag:'🇱🇧',capital:'ベイルート',continent:'アジア',population:'540万',area:'10,452 km²',currency:'ポンド'},
  430:{name:'リベリア',flag:'🇱🇷',capital:'モンロビア',continent:'アフリカ',population:'530万',area:'111,369 km²',currency:'ドル'},
  434:{name:'リビア',flag:'🇱🇾',capital:'トリポリ',continent:'アフリカ',population:'700万',area:'1,759,541 km²',currency:'ディナール'},
  440:{name:'リトアニア',flag:'🇱🇹',capital:'ビリニュス',continent:'ヨーロッパ',population:'280万',area:'65,300 km²',currency:'ユーロ'},
  450:{name:'マダガスカル',flag:'🇲🇬',capital:'アンタナナリボ',continent:'アフリカ',population:'2700万',area:'587,041 km²',currency:'アリアリ'},
  484:{name:'メキシコ',flag:'🇲🇽',capital:'メキシコシティ',continent:'北アメリカ',population:'1億2800万',area:'1,964,375 km²',currency:'ペソ'},
  496:{name:'モンゴル',flag:'🇲🇳',capital:'ウランバートル',continent:'アジア',population:'340万',area:'1,564,116 km²',currency:'トゥグルク'},
  504:{name:'モロッコ',flag:'🇲🇦',capital:'ラバト',continent:'アフリカ',population:'3700万',area:'710,850 km²',currency:'ディルハム'},
  508:{name:'モザンビーク',flag:'🇲🇿',capital:'マプト',continent:'アフリカ',population:'3200万',area:'801,590 km²',currency:'メティカル'},
  516:{name:'ナミビア',flag:'🇳🇦',capital:'ウィントフック',continent:'アフリカ',population:'260万',area:'824,292 km²',currency:'ドル'},
  524:{name:'ネパール',flag:'🇳🇵',capital:'カトマンズ',continent:'アジア',population:'3000万',area:'147,181 km²',currency:'ルピー'},
  528:{name:'オランダ',flag:'🇳🇱',capital:'アムステルダム',continent:'ヨーロッパ',population:'1770万',area:'41,543 km²',currency:'ユーロ'},
  554:{name:'ニュージーランド',flag:'🇳🇿',capital:'ウェリントン',continent:'オセアニア',population:'510万',area:'270,467 km²',currency:'NZドル'},
  558:{name:'ニカラグア',flag:'🇳🇮',capital:'マナグア',continent:'北アメリカ',population:'660万',area:'130,373 km²',currency:'コルドバ'},
  562:{name:'ニジェール',flag:'🇳🇪',capital:'ニアメ',continent:'アフリカ',population:'2500万',area:'1,267,000 km²',currency:'CFAフラン'},
  566:{name:'ナイジェリア',flag:'🇳🇬',capital:'アブジャ',continent:'アフリカ',population:'2億1600万',area:'923,768 km²',currency:'ナイラ'},
  578:{name:'ノルウェー',flag:'🇳🇴',capital:'オスロ',continent:'ヨーロッパ',population:'540万',area:'385,207 km²',currency:'クローネ'},
  586:{name:'パキスタン',flag:'🇵🇰',capital:'イスラマバード',continent:'アジア',population:'2億3000万',area:'881,913 km²',currency:'ルピー'},
  591:{name:'パナマ',flag:'🇵🇦',capital:'パナマシティ',continent:'北アメリカ',population:'440万',area:'75,417 km²',currency:'バルボア'},
  598:{name:'パプアニューギニア',flag:'🇵🇬',capital:'ポートモレスビー',continent:'オセアニア',population:'1000万',area:'462,840 km²',currency:'キナ'},
  604:{name:'ペルー',flag:'🇵🇪',capital:'リマ',continent:'南アメリカ',population:'3300万',area:'1,285,216 km²',currency:'ソル'},
  608:{name:'フィリピン',flag:'🇵🇭',capital:'マニラ',continent:'アジア',population:'1億1400万',area:'300,000 km²',currency:'ペソ'},
  616:{name:'ポーランド',flag:'🇵🇱',capital:'ワルシャワ',continent:'ヨーロッパ',population:'3800万',area:'312,696 km²',currency:'ズウォティ'},
  620:{name:'ポルトガル',flag:'🇵🇹',capital:'リスボン',continent:'ヨーロッパ',population:'1020万',area:'92,212 km²',currency:'ユーロ'},
  630:{name:'プエルトリコ',flag:'🇵🇷',capital:'サンファン',continent:'北アメリカ',population:'320万',area:'9,104 km²',currency:'米ドル'},
  642:{name:'ルーマニア',flag:'🇷🇴',capital:'ブカレスト',continent:'ヨーロッパ',population:'1900万',area:'238,397 km²',currency:'レウ'},
  643:{name:'ロシア',flag:'🇷🇺',capital:'モスクワ',continent:'ヨーロッパ/アジア',population:'1億4400万',area:'17,098,242 km²',currency:'ルーブル'},
  682:{name:'サウジアラビア',flag:'🇸🇦',capital:'リヤド',continent:'アジア',population:'3580万',area:'2,149,690 km²',currency:'リヤル'},
  686:{name:'セネガル',flag:'🇸🇳',capital:'ダカール',continent:'アフリカ',population:'1700万',area:'196,722 km²',currency:'CFAフラン'},
  706:{name:'ソマリア',flag:'🇸🇴',capital:'モガディシュ',continent:'アフリカ',population:'1700万',area:'637,657 km²',currency:'シリング'},
  710:{name:'南アフリカ',flag:'🇿🇦',capital:'プレトリア',continent:'アフリカ',population:'6000万',area:'1,219,090 km²',currency:'ランド'},
  724:{name:'スペイン',flag:'🇪🇸',capital:'マドリード',continent:'ヨーロッパ',population:'4750万',area:'505,990 km²',currency:'ユーロ'},
  729:{name:'スーダン',flag:'🇸🇩',capital:'ハルツーム',continent:'アフリカ',population:'4500万',area:'1,861,484 km²',currency:'ポンド'},
  752:{name:'スウェーデン',flag:'🇸🇪',capital:'ストックホルム',continent:'ヨーロッパ',population:'1040万',area:'450,295 km²',currency:'クローナ'},
  756:{name:'スイス',flag:'🇨🇭',capital:'ベルン',continent:'ヨーロッパ',population:'870万',area:'41,285 km²',currency:'フラン'},
  760:{name:'シリア',flag:'🇸🇾',capital:'ダマスカス',continent:'アジア',population:'2100万',area:'185,180 km²',currency:'ポンド'},
  764:{name:'タイ',flag:'🇹🇭',capital:'バンコク',continent:'アジア',population:'7200万',area:'513,120 km²',currency:'バーツ'},
  800:{name:'ウガンダ',flag:'🇺🇬',capital:'カンパラ',continent:'アフリカ',population:'4800万',area:'241,038 km²',currency:'シリング'},
  804:{name:'ウクライナ',flag:'🇺🇦',capital:'キーウ',continent:'ヨーロッパ',population:'4300万',area:'603,550 km²',currency:'フリヴニャ'},
  784:{name:'アラブ首長国連邦',flag:'🇦🇪',capital:'アブダビ',continent:'アジア',population:'1000万',area:'83,600 km²',currency:'ディルハム'},
  826:{name:'イギリス',flag:'🇬🇧',capital:'ロンドン',continent:'ヨーロッパ',population:'6700万',area:'242,495 km²',currency:'ポンド'},
  840:{name:'アメリカ合衆国',flag:'🇺🇸',capital:'ワシントンD.C.',continent:'北アメリカ',population:'3億3560万',area:'9,833,517 km²',currency:'ドル'},
  858:{name:'ウルグアイ',flag:'🇺🇾',capital:'モンテビデオ',continent:'南アメリカ',population:'360万',area:'176,215 km²',currency:'ペソ'},
  860:{name:'ウズベキスタン',flag:'🇺🇿',capital:'タシケント',continent:'アジア',population:'3600万',area:'448,978 km²',currency:'スム'},
  862:{name:'ベネズエラ',flag:'🇻🇪',capital:'カラカス',continent:'南アメリカ',population:'2800万',area:'916,445 km²',currency:'ボリバル'},
  704:{name:'ベトナム',flag:'🇻🇳',capital:'ハノイ',continent:'アジア',population:'9700万',area:'331,212 km²',currency:'ドン'},
  887:{name:'イエメン',flag:'🇾🇪',capital:'サナア',continent:'アジア',population:'3300万',area:'527,968 km²',currency:'リヤル'},
  894:{name:'ザンビア',flag:'🇿🇲',capital:'ルサカ',continent:'アフリカ',population:'1900万',area:'752,612 km²',currency:'クワチャ'},
  716:{name:'ジンバブエ',flag:'🇿🇼',capital:'ハラレ',continent:'アフリカ',population:'1600万',area:'390,757 km²',currency:'米ドル'},
  792:{name:'トルコ',flag:'🇹🇷',capital:'アンカラ',continent:'アジア/ヨーロッパ',population:'8500万',area:'783,562 km²',currency:'リラ'},
  788:{name:'チュニジア',flag:'🇹🇳',capital:'チュニス',continent:'アフリカ',population:'1200万',area:'163,610 km²',currency:'ディナール'},
  218:{name:'エクアドル',flag:'🇪🇨',capital:'キト',continent:'南アメリカ',population:'1800万',area:'283,561 km²',currency:'米ドル'},
  266:{name:'ガボン',flag:'🇬🇦',capital:'リーブルビル',continent:'アフリカ',population:'230万',area:'267,668 km²',currency:'CFAフラン'},
  466:{name:'マリ',flag:'🇲🇱',capital:'バマコ',continent:'アフリカ',population:'2200万',area:'1,240,192 km²',currency:'CFAフラン'},
  478:{name:'モーリタニア',flag:'🇲🇷',capital:'ヌアクショット',continent:'アフリカ',population:'460万',area:'1,030,700 km²',currency:'ウギア'},
  760:{name:'シリア',flag:'🇸🇾',capital:'ダマスカス',continent:'アジア',population:'2100万',area:'185,180 km²',currency:'ポンド'},
  144:{name:'スリランカ',flag:'🇱🇰',capital:'スリジャヤワルダナプラコッテ',continent:'アジア',population:'2200万',area:'65,610 km²',currency:'ルピー'},
  214:{name:'ドミニカ共和国',flag:'🇩🇴',capital:'サントドミンゴ',continent:'北アメリカ',population:'1100万',area:'48,670 km²',currency:'ペソ'},
};

// ── State ────────────────────────────────────────────
let st = {
  offsetX: 0, offsetY: 0,
  scale: 1,
  drag: false, dragX: 0, dragY: 0, dragOX: 0, dragOY: 0,
  moved: false,
  hovered: null,      // 国hover
  selected: null,     // 国selected
  hoveredBldg: null,  // 建築物hover index
  selectedBldg: null, // 建築物selected index
  theme: 'dark',
  geoFeatures: [],
  buildings: [],      // CSVから読み込んだ建築物データ
  stars: [],
  paths: new Map(),    // Path2Dキャッシュ (id -> Path2D)
  pathCacheKey: '',    // キャッシュ有効キー
};

// ── Resize ───────────────────────────────────────────
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  st.paths.clear();
  st.pathCacheKey = '';
  generateStars();
  render();
}
window.addEventListener('resize', resize);

// ── Stars ────────────────────────────────────────────
function generateStars() {
  st.stars = Array.from({length:180}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.1 + 0.2,
    a: Math.random() * 0.6 + 0.1,
  }));
}

// ── Projection: Mercator (-180°〜+200° 表示) ─────────
// 地図のX軸は -180°〜+200° の380°分を画面幅にマッピング
const MAP_LNG_MIN = -180;
const MAP_LNG_MAX = 200;
const MAP_LNG_RANGE = MAP_LNG_MAX - MAP_LNG_MIN; // 380

function project(lng, lat) {
  const W = canvas.width, H = canvas.height;
  // X: -180°が左端、+200°が右端になるようスケール
  const base = Math.min(W, H) * 0.78;
  const totalW = base * (MAP_LNG_RANGE / 360); // 380/360 倍の幅
  // 中心経度 = (200 + (-180)) / 2 = 10°
  const centerLng = (MAP_LNG_MIN + MAP_LNG_MAX) / 2;
  const cx = W / 2 + st.offsetX;
  const cy = H / 2 + st.offsetY;
  const x = cx + ((lng - centerLng) / (MAP_LNG_RANGE / 2)) * (totalW / 2) * st.scale;
  const latr = Math.max(-1.484, Math.min(1.484, lat * Math.PI / 180));
  const merc = Math.log(Math.tan(Math.PI / 4 + latr / 2));
  const y = cy - merc * (base / (Math.PI * 2)) * st.scale * 1.5;
  return [x, y];
}

function unproject(x, y) {
  const W = canvas.width, H = canvas.height;
  const base = Math.min(W, H) * 0.78;
  const totalW = base * (MAP_LNG_RANGE / 360);
  const centerLng = (MAP_LNG_MIN + MAP_LNG_MAX) / 2;
  const cx = W / 2 + st.offsetX;
  const cy = H / 2 + st.offsetY;
  const lng = centerLng + ((x - cx) / ((totalW / 2) * st.scale)) * (MAP_LNG_RANGE / 2);
  const merc = -(y - cy) / ((base / (Math.PI * 2)) * st.scale * 1.5);
  const latr = 2 * Math.atan(Math.exp(merc)) - Math.PI / 2;
  return [lng, latr * 180 / Math.PI];
}

// ── フィーチャーのジオグラフィBBox（経度緯度ベース）を計算 ──
function computeGeoBBox(geometry) {
  let minLng=Infinity, maxLng=-Infinity, minLat=Infinity, maxLat=-Infinity;
  function scanRing(coords) {
    let prevLng = coords[0][0];
    for (const [rawLng, lat] of coords) {
      let lng = rawLng;
      while (lng - prevLng >  180) lng -= 360;
      while (lng - prevLng < -180) lng += 360;
      prevLng = lng;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  if (geometry.type === 'Polygon') geometry.coordinates.forEach(scanRing);
  else if (geometry.type === 'MultiPolygon') geometry.coordinates.forEach(p => p.forEach(scanRing));
  // 表示範囲にシフト補正
  while (maxLng < MAP_LNG_MIN) { minLng += 360; maxLng += 360; }
  while (minLng > MAP_LNG_MAX) { minLng -= 360; maxLng -= 360; }
  return { minLng, maxLng, minLat, maxLat };
}

// ── 画面Viewport（ピクセル）とfeatureのgeoBBoxが交差するか ──
function isFeatureVisible(f) {
  if (!f.geoBBox) return true; // BBoxなし → 常に描画
  const W = canvas.width, H = canvas.height;
  const margin = 60;
  const { minLng, maxLng, minLat, maxLat } = f.geoBBox;
  const [x0, y0] = project(minLng, maxLat); // 左上
  const [x1, y1] = project(maxLng, minLat); // 右下
  return x1+margin > 0 && x0-margin < W && y1+margin > 0 && y0-margin < H;
}

// ── Path2Dキャッシュ付き取得（transform変化で自動一括無効化）──
function getPath(f) {
  // scale/offset が変わったら全キャッシュクリア
  const key = `${st.scale.toFixed(6)},${st.offsetX.toFixed(2)},${st.offsetY.toFixed(2)}`;
  if (key !== st.pathCacheKey) {
    st.paths.clear();
    st.pathCacheKey = key;
  }
  if (!st.paths.has(f.id)) {
    st.paths.set(f.id, buildPathAll(f.geometry));
  }
  return st.paths.get(f.id);
}

// ── Build Path2D for a GeoJSON geometry ──────────────
// 経度を連続空間に正規化して1枚だけ描画。
// -180°〜+200°の範囲に収まるよう、各リングの代表経度を基準にオフセットを選ぶ。
function buildPathAll(geometry) {
  const path = new Path2D();

  function ring(coords) {
    if (!coords.length) return;

    // 1) 隣接点間の経度差が±180°以内になるよう連続化
    const norm = [];
    let prevLng = coords[0][0];
    for (const [rawLng, lat] of coords) {
      let lng = rawLng;
      while (lng - prevLng >  180) lng -= 360;
      while (lng - prevLng < -180) lng += 360;
      norm.push([lng, lat]);
      prevLng = lng;
    }

    // 2) リングの平均経度を求め、表示範囲 (-180〜+200) の中心(10°)に
    //    最も近くなるようにリング全体を±360°シフト
    const avgLng = norm.reduce((s, p) => s + p[0], 0) / norm.length;
    let shift = 0;
    if (avgLng < MAP_LNG_MIN) shift = 360;
    else if (avgLng > MAP_LNG_MAX) shift = -360;

    // 3) 描画
    const pts = norm.map(([lng, lat]) => project(lng + shift, lat));
    path.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
    path.closePath();
  }

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(ring);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach(poly => poly.forEach(ring));
  }
  return path;
}

// ── Render ───────────────────────────────────────────
let _rafPending = false;
function render() {
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(_doRender);
}
function _doRender() {
  _rafPending = false;
  const W = canvas.width, H = canvas.height;
  const dark = st.theme === 'dark';
  ctx.clearRect(0, 0, W, H);

  // Ocean
  const og = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.8);
  if (dark) { og.addColorStop(0,'#0d1e38'); og.addColorStop(1,'#070d1c'); }
  else { og.addColorStop(0,'#c2d8f4'); og.addColorStop(1,'#aac4e8'); }
  ctx.fillStyle = og;
  ctx.fillRect(0, 0, W, H);

  // Stars (dark, low zoom)
  if (dark && st.scale < 2.5) {
    const a = Math.max(0, 1 - st.scale * 0.6);
    st.stars.forEach(s => {
      ctx.globalAlpha = s.a * a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // Grid
  drawGrid(dark);

  // Countries — viewport culling + Path2Dキャッシュ
  for (const f of st.geoFeatures) {
    if (!isFeatureVisible(f)) continue;
    drawFeature(f, dark);
  }

  // 都市マーカー非表示

  // 建築物マーカー描画
  drawBuildings(dark);

  updateScaleBar();
}  // end _doRender

function drawGrid(dark) {
  ctx.save();
  ctx.strokeStyle = dark ? 'rgba(59,130,246,0.06)' : 'rgba(37,99,235,0.07)';
  ctx.lineWidth = 0.5;
  // 経線 -180°〜+200° を30°ごと
  for (let lng = -180; lng <= 200; lng += 30) {
    ctx.beginPath();
    for (let lat = -80; lat <= 80; lat += 4) {
      const [x,y] = project(lng, lat);
      lat === -80 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // 緯線 -60°〜+60° を30°ごと（-180°〜+200°の範囲）
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    for (let lng = -180; lng <= 200; lng += 4) {
      const [x,y] = project(lng, lat);
      lng === -180 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // 赤道
  ctx.strokeStyle = dark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.22)';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([6,5]);
  ctx.beginPath();
  for (let lng = -180; lng <= 200; lng += 4) {
    const [x,y] = project(lng, 0);
    lng === -180 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawFeature(f, dark) {
  const id = f.id;
  const hov = st.hovered === id;
  const sel = st.selected === id;

  const path = getPath(f);

  ctx.save();
  if (sel) {
    ctx.fillStyle = dark ? 'rgba(59,130,246,0.52)' : 'rgba(37,99,235,0.4)';
    ctx.shadowColor = dark ? 'rgba(59,130,246,0.7)' : 'rgba(37,99,235,0.5)';
    ctx.shadowBlur = 14;
  } else if (hov) {
    ctx.fillStyle = dark ? '#2a4a70' : '#9ab8d8';
  } else {
    ctx.fillStyle = dark ? '#1c3050' : '#b8cce4';
  }
  ctx.fill(path);

  ctx.shadowBlur = 0;
  ctx.strokeStyle = sel
    ? (dark ? 'rgba(96,165,250,0.9)' : 'rgba(37,99,235,0.9)')
    : (dark ? 'rgba(80,130,200,0.45)' : 'rgba(100,150,210,0.6)');
  ctx.lineWidth = sel ? 1.4 : 0.6;
  ctx.stroke(path);
  ctx.restore();

  // Label at high zoom
  if (st.scale > 3 && f.centroid) {
    const info = COUNTRY_INFO[id];
    const label = info ? info.name : '';
    if (!label) return;
    const [x, y] = project(f.centroid[0], f.centroid[1]);
    if (x < -50 || x > canvas.width+50 || y < -20 || y > canvas.height+20) return;
    ctx.save();
    const fs = Math.min(13, st.scale * 2.8);
    ctx.font = `600 ${fs}px Syne`;
    ctx.fillStyle = dark ? 'rgba(220,235,255,0.85)' : 'rgba(20,40,80,0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // shadow for readability
    ctx.shadowColor = dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(label, x, y);
    ctx.restore();
  }
}

// ── Cities ───────────────────────────────────────────
const CITIES = [
  {name:'東京',lat:35.68,lng:139.69},{name:'ニューヨーク',lat:40.71,lng:-74.01},
  {name:'ロンドン',lat:51.51,lng:-0.13},{name:'パリ',lat:48.85,lng:2.35},
  {name:'北京',lat:39.91,lng:116.39},{name:'上海',lat:31.23,lng:121.47},
  {name:'シドニー',lat:-33.87,lng:151.21},{name:'ドバイ',lat:25.2,lng:55.27},
  {name:'サンパウロ',lat:-23.55,lng:-46.63},{name:'ムンバイ',lat:19.08,lng:72.88},
  {name:'ラゴス',lat:6.52,lng:3.38},{name:'モスクワ',lat:55.75,lng:37.62},
  {name:'ソウル',lat:37.57,lng:126.98},{name:'カイロ',lat:30.06,lng:31.25},
  {name:'メキシコシティ',lat:19.43,lng:-99.13},{name:'バンコク',lat:13.76,lng:100.50},
  {name:'ジャカルタ',lat:-6.21,lng:106.85},{name:'ベルリン',lat:52.52,lng:13.40},
  {name:'シカゴ',lat:41.88,lng:-87.63},{name:'ロサンゼルス',lat:34.05,lng:-118.24},
];

function drawCities(dark) {
  CITIES.forEach(c => {
    const [x,y] = project(c.lng, c.lat);
    const W = canvas.width, H = canvas.height;
    if (x<-10||x>W+10||y<-10||y>H+10) return;
    const r = Math.min(4.5, 1.5 + st.scale * 0.5);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r+2.5, 0, Math.PI*2);
    ctx.strokeStyle = dark ? 'rgba(96,165,250,0.3)' : 'rgba(37,99,235,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = dark ? '#60a5fa' : '#2563eb';
    ctx.shadowColor = dark ? 'rgba(96,165,250,0.8)' : 'rgba(37,99,235,0.5)';
    ctx.shadowBlur = 7;
    ctx.fill();
    if (st.scale > 3.5) {
      ctx.shadowBlur = 0;
      ctx.font = `bold ${Math.min(11, st.scale*2.5)}px Syne`;
      ctx.fillStyle = dark ? 'rgba(220,235,255,0.9)' : 'rgba(20,40,80,0.9)';
      ctx.shadowColor = dark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 3;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.name, x+r+4, y);
    }
    ctx.restore();
  });
}

// ── 建築物マーカー描画 ───────────────────────────────
const MARKER_R = 7; // ヒットテスト用半径（px、スケール前）

function drawBuildings(dark) {
  st.buildings.forEach((b, i) => {
    const [x, y] = project(b.lng, b.lat);
    const W = canvas.width, H = canvas.height;
    if (x < -20 || x > W+20 || y < -20 || y > H+20) return;

    const hov = st.hoveredBldg === i;
    const sel = st.selectedBldg === i;

    ctx.save();

    // 外側リング（選択・ホバー時）
    if (sel || hov) {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI*2);
      ctx.strokeStyle = sel
        ? (dark ? 'rgba(251,191,36,0.7)' : 'rgba(217,119,6,0.7)')
        : (dark ? 'rgba(251,191,36,0.35)' : 'rgba(217,119,6,0.35)');
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // ピン本体（ダイヤ形）
    const s = sel ? 9 : (hov ? 8 : 6);
    ctx.beginPath();
    ctx.moveTo(x,     y - s);   // 上
    ctx.lineTo(x + s, y);       // 右
    ctx.lineTo(x,     y + s);   // 下
    ctx.lineTo(x - s, y);       // 左
    ctx.closePath();

    const pinColor = sel
      ? (dark ? '#fbbf24' : '#d97706')
      : (hov ? (dark ? '#fcd34d' : '#f59e0b') : (dark ? '#f59e0b' : '#b45309'));
    ctx.fillStyle = pinColor;
    ctx.shadowColor = dark ? 'rgba(251,191,36,0.7)' : 'rgba(217,119,6,0.5)';
    ctx.shadowBlur = sel ? 14 : (hov ? 8 : 4);
    ctx.fill();

    // 中心点
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI*2);
    ctx.fillStyle = dark ? '#1c1a10' : '#fff';
    ctx.fill();

    // ラベル（高ズーム時）
    if (st.scale > 5) {
      ctx.font = `600 ${Math.min(11, st.scale * 1.5)}px Syne`;
      ctx.fillStyle = dark ? 'rgba(253,230,138,0.95)' : 'rgba(120,60,0,0.95)';
      ctx.shadowColor = dark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 3;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.name, x + s + 5, y);
    }

    ctx.restore();
  });
}

// ── 建築物ヒットテスト ───────────────────────────────
function hitTestBuilding(mx, my) {
  // 逆順（上に描いたものを優先）
  for (let i = st.buildings.length - 1; i >= 0; i--) {
    const b = st.buildings[i];
    const [x, y] = project(b.lng, b.lat);
    const dist = Math.hypot(mx - x, my - y);
    if (dist <= MARKER_R + 4) return i;
  }
  return null;
}
function updateScaleBar() {
  const base = Math.min(canvas.width, canvas.height) * 0.78;
  const totalW = base * (MAP_LNG_RANGE / 360);
  const degPerPx = MAP_LNG_RANGE / (totalW * st.scale);
  const kmPerPx = degPerPx * 111.32;
  const targets = [20000,10000,5000,2000,1000,500,200,100,50,20,10,5];
  const target = targets.find(k => k/kmPerPx < 200) || 5;
  const px = target / kmPerPx;
  document.getElementById('scalebar-line').style.width = Math.round(px)+'px';
  document.getElementById('scalebar-label').textContent = target>=1000 ? `${target/1000}千km` : `${target}km`;
}

// ── Hit test ─────────────────────────────────────────
function hitTest(mx, my) {
  for (const f of st.geoFeatures) {
    if (!isFeatureVisible(f)) continue;
    const path = getPath(f);
    if (ctx.isPointInPath(path, mx, my)) return f.id;
  }
  return null;
}

// ── Mouse / Touch ────────────────────────────────────
canvas.addEventListener('mousedown', e => {
  st.drag = true; st.moved = false;
  st.dragX = e.clientX; st.dragY = e.clientY;
  st.dragOX = st.offsetX; st.dragOY = st.offsetY;
  document.body.classList.add('drag');
});

canvas.addEventListener('mousemove', e => {
  if (st.drag) {
    const dx = e.clientX - st.dragX, dy = e.clientY - st.dragY;
    if (Math.abs(dx)+Math.abs(dy) > 3) st.moved = true;
    st.offsetX = st.dragOX + dx;
    st.offsetY = st.dragOY + dy;
    render();
    return;
  }

  // 建築物マーカーを優先してhover判定
  const bi = hitTestBuilding(e.clientX, e.clientY);
  if (bi !== st.hoveredBldg) { st.hoveredBldg = bi; render(); }

  if (bi !== null) {
    showTip(st.buildings[bi].name, e.clientX, e.clientY);
    canvas.style.cursor = 'pointer';
  } else {
    // 国hover
    const id = hitTest(e.clientX, e.clientY);
    if (id !== st.hovered) { st.hovered = id; render(); }
    hideTip();
    canvas.style.cursor = id ? 'pointer' : 'grab';
  }

  const [lng,lat] = unproject(e.clientX, e.clientY);
  document.getElementById('coords-display').textContent =
    `Lat: ${lat.toFixed(2)}°  Lng: ${lng.toFixed(2)}°`;
});

canvas.addEventListener('mouseup', e => {
  document.body.classList.remove('drag');
  if (!st.moved) {
    // 建築物クリック優先
    const bi = hitTestBuilding(e.clientX, e.clientY);
    if (bi !== null) {
      st.selectedBldg = bi;
      showBldgPanel(bi);
    } else {
      // 国クリック（パネルは出さず選択のみ）
      const id = hitTest(e.clientX, e.clientY);
      st.selected = id || null;
      // 建築パネルは閉じない（ユーザーが明示的に閉じるまで残す）
    }
    render();
  }
  st.drag = false; st.moved = false;
});

canvas.addEventListener('mouseleave', () => { hideTip(); });

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  zoomAt(e.deltaY < 0 ? 1.14 : 0.88, e.clientX, e.clientY);
}, { passive: false });

// Touch
// ピンチ状態を独立管理
let pinch = null; // { dist, cx, cy }

function getTouchCanvasPos(touch) {
  const r = canvas.getBoundingClientRect();
  const scaleX = canvas.width / r.width;
  const scaleY = canvas.height / r.height;
  return {
    x: (touch.clientX - r.left) * scaleX,
    y: (touch.clientY - r.top) * scaleY
  };
}

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length >= 2) {
    // 2本指ピンチ開始：現在の中心点と距離を記録
    const p0 = getTouchCanvasPos(e.touches[0]);
    const p1 = getTouchCanvasPos(e.touches[1]);
    pinch = {
      dist: Math.hypot(p0.x-p1.x, p0.y-p1.y),
      cx: (p0.x+p1.x)/2,
      cy: (p0.y+p1.y)/2,
    };
    st.drag = false;
  } else {
    pinch = null;
    st.drag=true; st.moved=false;
    const p = getTouchCanvasPos(e.touches[0]);
    st.dragX=p.x; st.dragY=p.y;
    st.dragOX=st.offsetX; st.dragOY=st.offsetY;
  }
},{passive:false});

canvas.addEventListener('touchmove', e=>{
  e.preventDefault();
  if (e.touches.length >= 2 && pinch) {
    const p0 = getTouchCanvasPos(e.touches[0]);
    const p1 = getTouchCanvasPos(e.touches[1]);
    const newDist = Math.hypot(p0.x-p1.x, p0.y-p1.y);
    const newCx = (p0.x+p1.x)/2;
    const newCy = (p0.y+p1.y)/2;

    // スケール変化を旧ピンチ中心に対して適用
    if (pinch.dist > 0) {
      const f = newDist / pinch.dist;
      const prev = st.scale;
      st.scale = Math.max(0.4, Math.min(30000, st.scale * f));
      const r = st.scale / prev;
      st.offsetX = pinch.cx - canvas.width/2 + (st.offsetX - (pinch.cx - canvas.width/2)) * r;
      st.offsetY = pinch.cy - canvas.height/2 + (st.offsetY - (pinch.cy - canvas.height/2)) * r;
    }

    // 中心点の移動分をパンに反映
    st.offsetX += newCx - pinch.cx;
    st.offsetY += newCy - pinch.cy;

    // 次フレーム用に更新
    pinch.dist = newDist;
    pinch.cx = newCx;
    pinch.cy = newCy;

    document.getElementById('zoom-level').textContent = st.scale >= 10
      ? st.scale.toFixed(0)+'x'
      : st.scale.toFixed(1)+'x';
    maybeChangeResolution();
    render();
  } else if (e.touches.length === 1 && st.drag) {
    st.moved=true;
    const p = getTouchCanvasPos(e.touches[0]);
    st.offsetX=st.dragOX+p.x-st.dragX;
    st.offsetY=st.dragOY+p.y-st.dragY;
    render();
  }
},{passive:false});

canvas.addEventListener('touchend', e => {
  if (e.touches.length < 2) pinch = null;
  if (e.touches.length === 0) st.drag = false;
},{passive:true});

// ── Zoom ─────────────────────────────────────────────
function zoomAt(f, cx, cy) {
  const prev = st.scale;
  st.scale = Math.max(0.4, Math.min(30000, st.scale * f));
  const r = st.scale / prev;
  st.offsetX = cx - canvas.width/2 + (st.offsetX-(cx-canvas.width/2))*r;
  st.offsetY = cy - canvas.height/2 + (st.offsetY-(cy-canvas.height/2))*r;
  document.getElementById('zoom-level').textContent = st.scale >= 10
    ? st.scale.toFixed(0)+'x'
    : st.scale.toFixed(1)+'x';
  // 解像度を必要に応じて切り替え（アップ・ダウン両対応）
  maybeChangeResolution();
  render();
}

function animateTo(targetScale, lng, lat, dur=750) {
  const s0=st.scale, ox0=st.offsetX, oy0=st.offsetY;
  const base = Math.min(canvas.width,canvas.height)*0.78;
  const latr = Math.max(-1.484, Math.min(1.484, lat*Math.PI/180));
  const merc = Math.log(Math.tan(Math.PI/4+latr/2));
  const oxT = -(lng/180)*(base/2)*targetScale;
  const oyT = merc*(base/(Math.PI*2))*targetScale*1.5;
  const t0 = performance.now();
  function step(now) {
    const t = Math.min((now-t0)/dur,1);
    const e = t<.5?2*t*t:-1+(4-2*t)*t;
    st.scale = s0+(targetScale-s0)*e;
    st.offsetX = ox0+(oxT-ox0)*e;
    st.offsetY = oy0+(oyT-oy0)*e;
    document.getElementById('zoom-level').textContent = st.scale >= 10
      ? st.scale.toFixed(0)+'x'
      : st.scale.toFixed(1)+'x';
    _doRender();
    if (t<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function getCentroid(f) {
  if (!f) return [0,0];
  if (f.centroid) return f.centroid;
  return [0,0];
}

// ── Tooltip ──────────────────────────────────────────
const tip = document.getElementById('tooltip');
function showTip(text,x,y) {
  tip.textContent=text;
  tip.style.left=(x+14)+'px';
  tip.style.top=(y-8)+'px';
  tip.classList.add('on');
}
function hideTip() { tip.classList.remove('on'); }

// ── 建築物情報パネル ──────────────────────────────────
function showBldgPanel(i) {
  const b = st.buildings[i];
  document.getElementById('bldg-no').textContent = `No. ${b.no}`;
  document.getElementById('bldg-name').textContent = b.name;
  document.getElementById('bldg-usage').textContent = b.usage || '—';
  document.getElementById('bldg-year').textContent = b.year || '—';
  document.getElementById('bldg-designer').textContent = b.designer || '—';
  document.getElementById('bldg-place').textContent = b.place || '—';
  document.getElementById('bldg-coords').textContent =
    `${b.lat.toFixed(5)}°N  ${b.lng.toFixed(5)}°E`;
  const img = document.getElementById('bldg-image');
  const wrap = document.getElementById('bldg-image-wrap');
  if (b.image) {
    img.src = b.image;
    img.alt = b.name;
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
    img.src = '';
  }
  document.getElementById('bldg-panel').classList.remove('hidden');
}
function hideBldgPanel() {
  document.getElementById('bldg-panel').classList.add('hidden');
  st.selectedBldg = null;
}
document.getElementById('bldg-close').addEventListener('click', () => {
  hideBldgPanel(); render();
});

// ── Controls ─────────────────────────────────────────
document.getElementById('btn-zoom-in').addEventListener('click',()=>zoomAt(1.3,canvas.width/2,canvas.height/2));
document.getElementById('btn-zoom-out').addEventListener('click',()=>zoomAt(0.77,canvas.width/2,canvas.height/2));
document.getElementById('btn-reset').addEventListener('click',()=>{
  animateTo(1,0,20);
  setTimeout(()=>{st.offsetX=0;st.offsetY=0;render();},800);
});
document.getElementById('btn-theme-dark').addEventListener('click',()=>{
  st.theme='dark'; document.documentElement.removeAttribute('data-theme');
  document.getElementById('btn-theme-dark').classList.add('active');
  document.getElementById('btn-theme-light').classList.remove('active');
  render();
});
document.getElementById('btn-theme-light').addEventListener('click',()=>{
  st.theme='light'; document.documentElement.setAttribute('data-theme','light');
  document.getElementById('btn-theme-light').classList.add('active');
  document.getElementById('btn-theme-dark').classList.remove('active');
  render();
});

// ── 建築物検索 ───────────────────────────────────────
const sinput = document.getElementById('search-input');
const sresults = document.getElementById('search-results');

sinput.addEventListener('input', () => {
  const q = sinput.value.trim().toLowerCase();
  if (!q) { sresults.classList.remove('open'); return; }
  const matches = st.buildings.filter(b =>
    b.name.toLowerCase().includes(q) ||
    (b.designer && b.designer.toLowerCase().includes(q)) ||
    (b.place && b.place.toLowerCase().includes(q)) ||
    (b.usage && b.usage.toLowerCase().includes(q))
  ).slice(0, 6);
  if (!matches.length) { sresults.classList.remove('open'); return; }
  sresults.innerHTML = matches.map(b => `
    <div class="sri" data-idx="${b._idx}">
      <span class="sri-flag">🏛</span>
      <div>
        <div class="sri-name">${b.name}</div>
        <div class="sri-sub">${b.place || ''} ${b.year ? '· '+b.year : ''}</div>
      </div>
    </div>`).join('');
  sresults.classList.add('open');
  sresults.querySelectorAll('.sri').forEach(el => {
    el.addEventListener('click', () => {
      const idx = +el.dataset.idx;
      st.selectedBldg = idx;
      showBldgPanel(idx);
      const b = st.buildings[idx];
      animateTo(Math.max(st.scale, 12), b.lng, b.lat);
      render();
      sresults.classList.remove('open');
      sinput.value = '';
    });
  });
});
sinput.addEventListener('blur', () => setTimeout(() => sresults.classList.remove('open'), 200));
sinput.addEventListener('focus', () => sinput.value && sresults.classList.add('open'));

document.addEventListener('keydown',e=>{
  if (e.key==='Escape'){
    st.selectedBldg=null; hideBldgPanel();
    sresults.classList.remove('open'); render();
  }
  if ((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();sinput.focus();}
  if (e.key==='+'||e.key==='=') zoomAt(1.2,canvas.width/2,canvas.height/2);
  if (e.key==='-') zoomAt(0.83,canvas.width/2,canvas.height/2);
});

// ── Compute polygon centroid ─────────────────────────
function computeCentroid(geometry) {
  let lngSum=0, latSum=0, count=0;
  function processRing(coords) {
    for (const [lng,lat] of coords) { lngSum+=lng; latSum+=lat; count++; }
  }
  if (geometry.type==='Polygon') geometry.coordinates.forEach(processRing);
  else if (geometry.type==='MultiPolygon') geometry.coordinates.forEach(p=>p.forEach(processRing));
  return count ? [lngSum/count, latSum/count] : [0,0];
}

// ── 段階的解像度切り替え ──────────────────────────────
//  段階  データ      間引きstep  切替ズーム
//   0    110m        —          ×1〜
//   1    10m         16         ×4〜
//   2    10m          8         ×10〜
//   3    10m          4         ×25〜
//   4    10m          2         ×60〜
//   5    10m          1(フル)   ×150〜

const RES_LEVELS = [
  { threshold:    0, step:  0 },  // 0: 110m (×1〜5)
  { threshold:    6, step: 16 },  // 1: 10m/16 (×6〜14)
  { threshold:   15, step:  8 },  // 2: 10m/8  (×15〜39)
  { threshold:   40, step:  4 },  // 3: 10m/4  (×40〜99)
  { threshold:  100, step:  2 },  // 4: 10m/2  (×100〜249)
  { threshold:  250, step:  1 },  // 5: 10mフル(×250〜30000)
];

let resLevel = 0;
let resLoading = false;
let hiRawTopo = null;
let loRawTopo = null;

function simplifyCoords(coords, step) {
  const out = [];
  for (let i = 0; i < coords.length; i++) {
    if (i === 0 || i === coords.length - 1 || i % step === 0) out.push(coords[i]);
  }
  return out;
}
function simplifyGeometry(geometry, step) {
  if (step <= 1) return geometry; // step=1はそのまま
  if (geometry.type === 'Polygon') {
    return { type: 'Polygon', coordinates: geometry.coordinates.map(r => simplifyCoords(r, step)) };
  } else if (geometry.type === 'MultiPolygon') {
    return { type: 'MultiPolygon', coordinates: geometry.coordinates.map(p => p.map(r => simplifyCoords(r, step))) };
  }
  return geometry;
}

function visibleIds() {
  const W = canvas.width, H = canvas.height;
  const ids = new Set();
  for (const f of st.geoFeatures) {
    if (!f.centroid) continue;
    const [x, y] = project(f.centroid[0], f.centroid[1]);
    if (x > -W && x < W*2 && y > -H && y < H*2) ids.add(f.id);
  }
  return ids;
}

function applyFeaturesGradually(newFeatureMap, targetLevel) {
  const ids = [...newFeatureMap.keys()];
  let idx = 0;

  function processChunk(deadline) {
    while (idx < ids.length) {
      if (deadline && deadline.timeRemaining && deadline.timeRemaining() < 3) break;
      const id = ids[idx++];
      const fi = st.geoFeatures.findIndex(f => f.id === id);
      if (fi !== -1) { st.geoFeatures[fi] = newFeatureMap.get(id); st.paths.delete(id); }
    }
    render();
    if (idx < ids.length) {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(processChunk, { timeout: 200 });
      } else {
        setTimeout(() => processChunk(null), 32);
      }
    } else {
      resLevel = targetLevel;
      resLoading = false;
      // 切り替え後さらに必要な段階があれば続けてアップ/ダウン
      setTimeout(maybeChangeResolution, 100);
    }
  }

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(processChunk, { timeout: 200 });
  } else {
    setTimeout(() => processChunk(null), 32);
  }
}

function neededResLevel() {
  let level = 0;
  for (let i = RES_LEVELS.length - 1; i >= 0; i--) {
    if (st.scale >= RES_LEVELS[i].threshold) { level = i; break; }
  }
  return level;
}

function maybeChangeResolution() {
  const needed = neededResLevel();
  if (needed === resLevel || resLoading) return;

  resLoading = true;

  if (needed > resLevel) {
    // アップグレード: 10mデータを使う
    if (hiRawTopo) { applyResLevel(hiRawTopo, needed); return; }
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json')
      .then(r => r.json())
      .then(topo => { hiRawTopo = topo; applyResLevel(topo, needed); })
      .catch(() => { resLoading = false; });
  } else {
    // ダウングレード
    if (needed === 0) {
      // 段階0: 110mへ戻す
      if (loRawTopo) { applyResLevel(loRawTopo, 0); return; }
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(topo => { loRawTopo = topo; applyResLevel(topo, 0); })
        .catch(() => { resLoading = false; });
    } else {
      // 段階1〜4: 10mを間引いて生成
      if (hiRawTopo) { applyResLevel(hiRawTopo, needed); }
      else { resLoading = false; }
    }
  }
}

// 指定段階のジオメトリを画面内優先・idle順次で適用
function applyResLevel(topo, targetLevel) {
  const geojson = topojson.feature(topo, topo.objects.countries);
  const step = RES_LEVELS[targetLevel].step;
  const visIds = visibleIds();
  const priorityMap = new Map();
  const restMap = new Map();

  for (const f of geojson.features) {
    const id = +f.id;
    const geo = (step <= 1) ? f.geometry : simplifyGeometry(f.geometry, step);
    const entry = { id, geometry: geo, centroid: computeCentroid(geo), geoBBox: computeGeoBBox(geo) };
    if (visIds.has(id)) priorityMap.set(id, entry);
    else restMap.set(id, entry);
  }

  // 画面内を即時適用（キャッシュも個別削除）
  for (const [id, entry] of priorityMap) {
    const fi = st.geoFeatures.findIndex(f => f.id === id);
    if (fi !== -1) { st.geoFeatures[fi] = entry; st.paths.delete(id); }
  }
  render();

  if (restMap.size > 0) {
    applyFeaturesGradually(restMap, targetLevel);
  } else {
    resLevel = targetLevel;
    resLoading = false;
    setTimeout(maybeChangeResolution, 100);
  }
}

// ── CSV読み込み（建築物データ）───────────────────────
async function loadCSV() {
  let text;
  try {
    const res = await fetch('data.csv');
    if (!res.ok) {
      console.warn('data.csv fetch failed:', res.status, '— 左下のボタンから手動で読み込んでください');
      return;
    }
    text = await res.text();
  } catch(e) {
    console.warn('data.csv fetch error（file://環境では左下ボタンを使用）:', e.message);
    return;
  }
  parseCSVText(text);
}

// CSVパーサー（タブ・コンマ両対応、ダブルクォート対応）
function parseCSVLine(line) {
  // タブが含まれていればタブ区切り、なければコンマ区切り
  const delimiter = line.includes('\t') ? '\t' : ',';
  const result = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === delimiter && !inQ) {
      result.push(cur.trim()); cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

// ── Load TopoJSON ────────────────────────────────────
async function loadMap() {
  const URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  let topo;
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error('fetch failed');
    topo = await res.json();
  } catch(e) {
    document.querySelector('.load-text').textContent = 'データ読み込み失敗。オンライン環境で開いてください。';
    return;
  }

  // Convert TopoJSON → GeoJSON features
  loRawTopo = topo; // ダウングレード用にキャッシュ
  const geojson = topojson.feature(topo, topo.objects.countries);
  st.geoFeatures = geojson.features.map(f => ({
    id: +f.id,
    geometry: f.geometry,
    centroid: computeCentroid(f.geometry),
  }));

  // Hide loader
  const loader = document.getElementById('loading');
  loader.classList.add('done');

  // Init canvas
  resize();

  // Intro zoom animation
  const ts = st.scale = 0.5;
  const t0 = performance.now();
  function intro(now) {
    const t = Math.min((now-t0)/1100,1);
    const e = 1-Math.pow(1-t,3);
    st.scale = 0.5 + (1-0.5)*e;
    _doRender();
    if (t<1) requestAnimationFrame(intro);
  }
  requestAnimationFrame(intro);
}

loadMap();
loadCSV();

// ── ファイル選択からのCSV読み込み（file://環境用）───
document.getElementById('csv-file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    parseCSVText(ev.target.result);
  };
  reader.readAsText(file, 'UTF-8');
});

function parseCSVText(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  console.log(`CSV読込: ${lines.length} 行（ヘッダー含む）`);
  const buildings = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = parseCSVLine(line);
    const latLngRaw = (cols[6] || '').replace(/"/g, '').trim();
    const parts = latLngRaw.split(',').map(s => parseFloat(s.trim()));
    const lat = parts[0], lng = parts[1];
    if (!cols[1] || isNaN(lat) || isNaN(lng)) continue;
    buildings.push({
      _idx: buildings.length,
      no: (cols[0]||'').trim(), name: (cols[1]||'').trim(),
      usage: (cols[2]||'').trim(), year: (cols[3]||'').trim(),
      designer: (cols[4]||'').trim(), place: (cols[5]||'').trim(),
      lat, lng, image: (cols[7]||'').trim(),
    });
  }
  console.log(`建築物: ${buildings.length} 件`);
  st.buildings = buildings;
  // ラベル更新
  document.getElementById('csv-label').childNodes[1].textContent = ` ${buildings.length}件読込済`;
  render();
}
