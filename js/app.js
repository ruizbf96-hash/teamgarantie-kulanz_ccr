'use strict';

var SITES     = ['Audi Hœnheim','Audi Obernai','SEAT Hœnheim','SEAT Illkirch','SKODA Hœnheim','SKODA Obernai','VW Bischheim','VW Illkirch','VW Obernai'];
var KVPS_MAP  = {'Audi Hœnheim':'02155','Audi Obernai':'02486','SEAT Hœnheim':'63930','SEAT Illkirch':'02153','SKODA Hœnheim':'02376','SKODA Obernai':'02485','VW Bischheim':'02154','VW Illkirch':'02153','VW Obernai':'02485'};
var MOT_DE_PASSE = 'Garantie2026';
var WEB3_KEY     = '7bf5b927-e39f-4fc1-9f60-642e4741e445';

// ═══════════════════════════════════════════════════════════
// VÉRIFICATIONS KULANZ PAR MARQUE
// ═══════════════════════════════════════════════════════════
var SITE_BRAND = {
  'Audi Hœnheim': 'Audi',
  'Audi Obernai':      'Audi',
  'SEAT Hœnheim': 'SEAT',
  'SEAT Illkirch':     'SEAT',
  'SKODA Hœnheim':'SKODA',
  'SKODA Obernai':     'SKODA',
  'VW Bischheim':      'VW',
  'VW Illkirch':       'VW',
  'VW Obernai':        'VW'
};

var KULANZ_BY_BRAND = {
  'VW': [
    {name:'tpi',             label:"Y a-t-il une TPI ?",                                              nok:null, info:"TPI manquante"},
    {name:'opteven',         label:"Garantie OPTEVEN visible dans ELSA ?",                            nok:null},
    {name:'tuning',          label:"Code tuning dans SAGA ?",                                         nok:'OUI', info:"Code tuning détecté → NOK"},
    {name:'piece_usure',     label:"La pièce concernée est une pièce d'usure ?",       nok:'OUI', info:"Pièce d'usure non couverte"},
    {name:'piece_entretien', label:"La pièce concernée est liée à l'entretien ?", nok:null},
    {name:'preconisations',  label:"Les préconisations constructeur pour les entretiens sont toutes respectées ?", nok:'NON', info:"Préconisations non respectées"},
    {name:'dernier_entretien',label:"Le dernier entretien est-il présent ?",                     nok:'NON', info:"Dernier entretien manquant"},
    {name:'vendu_client',    label:"Si non, est-il vendu au client et réalisé en même temps que la réparation ?", nok:null},
    {name:'lien_entretien',  label:"Un lien peut être établi entre la cause du dommage et l'entretien ?", nok:'OUI', info:"Lien dommage/entretien détecté"}
  ],
  'Audi': [
    {name:'tpi',             label:"Y a-t-il une TPI ?",                                              nok:null, info:"TPI manquante"},
    {name:'opteven',         label:"Garantie OPTEVEN visible dans ELSA ?",                            nok:null},
    {name:'tuning',          label:"Code tuning dans SAGA ?",                                         nok:'OUI', info:"Code tuning détecté → NOK"},
    {name:'piece_usure',     label:"La pièce concernée est une pièce d'usure ?",       nok:'OUI', info:"Pièce d'usure non couverte"},
    {name:'piece_entretien', label:"La pièce concernée est liée à l'entretien ?", nok:null},
    {name:'preconisations',  label:"Les préconisations constructeur pour les entretiens sont toutes respectées ?", nok:'NON', info:"Préconisations non respectées"},
    {name:'dernier_entretien_audi',label:"Le dernier entretien a été fait chez Audi ?",    nok:'NON', info:"Entretien non réalisé chez Audi"},
    {name:'vendu_client',    label:"Si non, est-il vendu au client et réalisé en même temps que la réparation ?", nok:null},
    {name:'lien_entretien',  label:"Un lien peut être établi entre la cause du dommage et l'entretien ?", nok:'OUI', info:"Lien dommage/entretien détecté"}
  ],
  'SEAT': KULANZ_BY_BRAND['VW'],
  'SKODA': [
    {name:'tpi',             label:"Y a-t-il une TPI ?",                                              nok:null, info:"TPI manquante"},
    {name:'opteven',         label:"Garantie OPTEVEN visible dans ELSA ?",                            nok:null},
    {name:'tuning',          label:"Code tuning dans SAGA ?",                                         nok:'OUI', info:"Code tuning détecté → NOK"},
    {name:'piece_usure',     label:"La pièce concernée est une pièce d'usure ?",       nok:'OUI', info:"Pièce d'usure non couverte"},
    {name:'piece_entretien', label:"La pièce concernée est liée à l'entretien ?", nok:null},
    {name:'preconisations',  label:"Tous les entretiens ont été réalisés en respectant les préconisations du constructeur (Km/durée) ? (Aucun entretien n'est à faire)", nok:'NON', info:"Préconisations non respectées"},
    {name:'entretien_moment',label:"Un entretien est-il à faire au moment de la réparation ? (Échéance non dépassée)", nok:null, has_nc:true},
    {name:'vendu_client',    label:"Si oui, est-il vendu au client et réalisé en même temps que la réparation ?", nok:null},
    {name:'justificatifs',   label:"Disposez-vous des justificatifs des 2 derniers entretiens ? (Hors entretien fait au moment de la réparation)", nok:'NON', info:"Justificatifs manquants"},
    {name:'justif_preco',    label:"Si oui, ont-ils été réalisés en respectant les préconisations constructeur ?", nok:'NON', info:"Préconisations non respectées sur les 2 derniers entretiens"},
    {name:'lien_entretien',  label:"Un lien peut être établi entre la cause du dommage et l'entretien ?", nok:'OUI', info:"Lien dommage/entretien détecté"}
  ]
};


// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// ÉTAT GLOBAL
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
var G = {
  role: '',        // 'usager' | 'team'
  site: '',        // site usager
  demandes: [],
  activeId: null,  // demande en cours de validation
  kulanzData: {}, // copie kulanz pour CCR
  fbListening: false,
  demandeType: 'K' // K = Kulanz, C = CCR
};

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// FIREBASE — init différée dans try/catch
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
var db = null;
var demandesRef = null;

function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase non chargé');
    return;
  }
  try {
    var cfg = {
      apiKey:"AIzaSyDPsep7yTE-UAjGGSioZfVAozGEo_lSmSQ",
      authDomain:"demande-kulanzccr.firebaseapp.com",
      databaseURL:"https://demande-kulanzccr-default-rtdb.europe-west1.firebasedatabase.app",
      projectId:"demande-kulanzccr",
      storageBucket:"demande-kulanzccr.firebasestorage.app",
      messagingSenderId:"128572691256",
      appId:"1:128572691256:web:43cd3e057b5287199967cd"
    };
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    db = firebase.database();
    demandesRef = db.ref('demandes');
    db.ref('.info/connected').on('value', function(snap) {
      var dot = ge('db-dot');
      if (dot) dot.style.background = snap.val() ? '#27ae60' : '#e74c3c';
    });
    return true;
  } catch(e) {
    console.error('Firebase init failed:', e);
    toast('⚠ Mode hors ligne — Firebase indisponible');
    return false;
  }
}

function startListener() {
  if (G.fbListening || !demandesRef || !db) return;
  G.fbListening = true;
  demandesRef.on('value', function(snap) {
    G.demandes = [];
    snap.forEach(function(c) { G.demandes.push(c.val()); });
    G.demandes.sort(function(a,b) { return String(b.id) > String(a.id) ? 1 : -1; });
    try { localStorage.setItem('gea_demandes', JSON.stringify(G.demandes)); } catch(e) {}
    renderHisto();
    if (G.role === 'team') renderDash();
  }, function(err) {
    console.warn('Firebase offline:', err);
    try {
      var s = localStorage.getItem('gea_demandes');
      G.demandes = s ? JSON.parse(s) : [];
    } catch(e) { G.demandes = []; }
    renderHisto();
  });
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// UTILITAIRES
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function ge(id) { return document.getElementById(id); }


function ouvrirOutlookCCR() {
  var ml = window._lastMailto || '';
  if (!ml) { toast('⚠ Aucun mail préparé.'); return; }
  try {
    var _a = document.createElement('a');
    _a.href = ml;
    _a.style.display = 'none';
    document.body.appendChild(_a);
    _a.click();
    setTimeout(function(){ document.body.removeChild(_a); }, 500);
  } catch(e) {
    window.location.href = ml;
  }
}

function copierObjetMail() {
  var subj = window._ccrSubject || '';
  try {
    var t = document.createElement('textarea');
    t.value = subj;
    t.style.position = 'fixed';
    t.style.opacity  = '0';
    document.body.appendChild(t);
    t.focus(); t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    toast('✔ Objet copié !');
  } catch(e) { alert('Objet : ' + subj); }
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function decodeLabel(s) {
  return String(s||'').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
}
function gv(name) {
  var el = document.querySelector('#mainForm [name="'+name+'"]');
  return el ? el.value.trim() : '';
}
function sv(name, val) {
  var el = document.querySelector('#mainForm [name="'+name+'"]');
  if (el && val !== undefined) el.value = val;
}
function gr(name) {
  var el = document.querySelector('#mainForm [name="'+name+'"]:checked');
  return el ? el.value : '';
}
function toast(msg) {
  var t = ge('toast');
  if (!t) { console.log('[toast]', msg); return; }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { if(ge('toast')) ge('toast').classList.remove('show'); }, 3200);
}
function isValidVIN(v) {
  if (!v || v.length !== 17) return false;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(v)) return false;
  if (/^(.)\1{16}$/.test(v)) return false;
  return true;
}
function vinHint(v) {
  if (!v) return '0 / 17 caractères';
  if (/[IOQ]/i.test(v)) return v.length+' / 17 — ⚠ I, O, Q interdits';
  if (v.length < 17) return v.length+' / 17 — incomplet';
  if (isValidVIN(v)) return '✔ Châssis valide';
  return '⚠ Format invalide';
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// LOGIN
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function showStep2() {
  ge('lp-step1').style.display = 'none';
  ge('lp-step2').style.display = 'block';
}
function showStep1() {
  ge('lp-step2').style.display = 'none';
  ge('lp-step1').style.display = 'block';
}
function openPwdModal() {
  ge('pwd-modal').classList.add('open');
  setTimeout(function() { ge('pwd-input').focus(); }, 100);
}
function closePwdModal() {
  ge('pwd-modal').classList.remove('open');
  ge('pwd-input').value = '';
  ge('pwd-error').style.display = 'none';
}
function submitPwd() {
  if (ge('pwd-input').value !== MOT_DE_PASSE) {
    ge('pwd-error').style.display = 'block';
    ge('pwd-input').focus();
    return;
  }
  closePwdModal();
  G.role = 'team';
  G.site = '';
  ouvrirApp();
}
function loginUsager(site) {
  G.role = 'usager';
  G.site = site;
  ouvrirApp();
}

function ouvrirApp() {
  ge('login-page').classList.add('hidden');
  ge('h-user').style.display = 'flex';
  ge('tab-histo').style.display = 'block';

  if (G.role === 'team') {
    ge('h-role').textContent = '🔐 TeamGarantie';
    ge('site-bar').style.display = 'none';
    ge('dash-wrap').classList.add('on');
    ge('h-site-name').textContent = 'Tous les sites';
    renderKulanzForm('VW Bischheim'); // défaut VW pour TeamGarantie
  } else {
    ge('h-role').textContent = '👤 ' + G.site;
    ge('site-bar').style.display = 'none';
    ge('h-site-name').textContent = G.site;
    ge('f-site').value = G.site;
    ge('site-display').value = G.site;
    renderKulanzForm(G.site);
    ge('site-field').style.display = 'flex';
    var kvpsEl = ge('kvps');
    if (kvpsEl) { kvpsEl.value = KVPS_MAP[G.site] || ''; kvpsEl.readOnly = true; }
    // Aussi remplir via le champ name= (compatibilité)
    var kvpsName = document.querySelector('[name="kvps"]');
    if (kvpsName) { kvpsName.value = KVPS_MAP[G.site] || ''; kvpsName.readOnly = true; }
    [].forEach.call(document.querySelectorAll('.s-btn'), function(b) {
      b.classList.toggle('active', b.textContent.trim() === G.site);
    });
  }

  enableAllDropdowns();
  initFirebase();
  startListener();
  restoreDraft();
}

function deconnecter() {
  G.role = ''; G.site = ''; G.fbListening = false;
  ge('login-page').classList.remove('hidden');
  ge('lp-step1').style.display = 'block';
  ge('lp-step2').style.display = 'none';
  ge('h-user').style.display = 'none';
  ge('tab-histo').style.display = 'none';
  ge('dash-wrap').classList.remove('on');
  ge('h-alert').classList.remove('on');
  ge('site-bar').style.display = 'none';
  ge('site-field').style.display = 'none';
  ge('type-bar').style.display = 'flex';
  ge('kvps').readOnly = false;
  [].forEach.call(document.querySelectorAll('.s-btn'), function(b) { b.classList.remove('active'); });
  ge('f-site').value = '';
  ge('h-site-name').textContent = '—';
  ssReset('dom'); ssReset('ava');
  showPage('form', ge('tab-form'));
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// NAVIGATION
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function showPage(page, tabEl) {
  [].forEach.call(document.querySelectorAll('.page'), function(p) { p.classList.remove('active'); });
  [].forEach.call(document.querySelectorAll('.nav-tab'), function(t) { t.classList.remove('active'); });
  ge('page-'+page).classList.add('active');
  if (tabEl) tabEl.classList.add('active');
  ge('type-bar').style.display = (page === 'form') ? 'flex' : 'none';
  if (page === 'histo') renderHisto();
}

function selectSite(btn, name) {
  [].forEach.call(document.querySelectorAll('.s-btn'), function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var fsite = ge('f-site'); if(fsite) fsite.value = name;
  var hn = ge('h-site-name'); if(hn) hn.textContent = name || 'Tous les sites';
  // Remplir KVPS si usager (readOnly = usager, writable = team)
  var kvpsEl2 = ge('kvps');
  if (kvpsEl2 && !kvpsEl2.readOnly) kvpsEl2.value = KVPS_MAP[name] || '';
  renderKulanzForm(name);
}

function setType(t) {
  G.demandeType = t;
  var isK = (t === 'K');
  if (!isK) saveKulanz();
  else {
    // Reset champs CCR
    [].forEach.call(document.querySelectorAll('[name="pieces[]"]'), function(cb) { cb.checked = false; });
    [].forEach.call(document.querySelectorAll('[name="kulanz_done"],[name="cig"]'), function(r) { r.checked = false; });
    var ct = ge('cig-taux'); if (ct) { ct.value = ''; ct.disabled = true; }
  }
  ge('btn-k').classList.toggle('active', isK);
  // Afficher/cacher la case engagement CCR
  var engWrap = ge('ccr-engagement-wrap');
  if (engWrap) engWrap.style.display = !isK ? 'block' : 'none';
  // Réinitialiser la case si on change de type
  var chkE = ge('chk-engagement');
  if (chkE && isK) chkE.checked = false;
  if (isK) {
    var curSite = ge('f-site') ? ge('f-site').value : '';
    if (curSite) renderKulanzForm(curSite);
    setTimeout(checkKulanzNok, 50);
  }
  ge('btn-c').classList.toggle('active', !isK);
  ge('f-type').value = isK ? 'Kulanz' : 'CCR';
  [].forEach.call(document.querySelectorAll('.k-section'), function(el) { el.style.display = isK ? 'block' : 'none'; });
  [].forEach.call(document.querySelectorAll('.c-section'), function(el) { el.style.display = !isK ? 'block' : 'none'; });
  ge('comm-num').textContent = isK ? '4' : '6';
  ge('btn-copy-kulanz').style.display = isK ? 'flex' : 'none';
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// SEARCHABLE SELECT
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
var ssState = { dom: null, ava: null, desig: null, rub: null };

function ssData(key) {
  if (key === 'ava') return CODES_AVA;
  var cat    = ge('dom-cat')   ? ge('dom-cat').value   : '';
  var rubVal = ge('rub-val')   ? ge('rub-val').value   : '';
  var desigV = ge('desig-val') ? ge('desig-val').value : '';

  if (key === 'rub') {
    // Filtrer par catégorie si définie, sinon toutes les rubriques
    var rubs = (cat && CAT_RUBS[cat]) ? CAT_RUBS[cat] : Object.keys(RUB_LABELS);
    return rubs.map(function(r){ return {code:r, label:r}; });
  }

  if (key === 'desig') {
    var labels = [];
    if (rubVal && RUB_LABELS[rubVal]) {
      // Rubrique sélectionnée → ses désignations
      labels = RUB_LABELS[rubVal];
    } else if (cat && CAT_RUBS[cat]) {
      // Catégorie sélectionnée → toutes désignations de ses rubriques
      var seen = {};
      CAT_RUBS[cat].forEach(function(rub) {
        (RUB_LABELS[rub] || []).forEach(function(l) {
          if (!seen[l]) { seen[l] = true; labels.push(l); }
        });
      });
    } else {
      // Aucun filtre → toutes les désignations
      var seen2 = {};
      Object.keys(RUB_LABELS).forEach(function(rub) {
        (RUB_LABELS[rub] || []).forEach(function(l) {
          if (!seen2[l]) { seen2[l] = true; labels.push(l); }
        });
      });
    }
    return labels.map(function(l){ return {code:l, label:l}; });
  }

  if (key === 'dom') {
    // Codes filtrés selon rub + desig disponibles
    if (rubVal && desigV) {
      var k = rubVal + '|||' + desigV;
      var codes = RUB_LABEL_CODES[k] || [];
      // Fallback si la clé exacte n'existe pas
      if (!codes.length) {
        Object.keys(RUB_LABEL_CODES).forEach(function(k2) {
          if (k2.split('|||')[1] === desigV) codes = codes.concat(RUB_LABEL_CODES[k2]);
        });
      }
      return codes.filter(function(c,i){return codes.indexOf(c)===i;})
                  .map(function(c){ return {code:c, label:desigV}; });
    }
    if (desigV) {
      var found = [];
      Object.keys(RUB_LABEL_CODES).forEach(function(k3) {
        if (k3.split('|||')[1] === desigV) found = found.concat(RUB_LABEL_CODES[k3]);
      });
      return found.filter(function(c,i){return found.indexOf(c)===i;})
                  .map(function(c){ return {code:c, label:desigV}; });
    }
    // Scope: par rubrique active, catégorie active, ou tout
    var scope = rubVal ? [rubVal]
              : (cat && CAT_RUBS[cat] ? CAT_RUBS[cat] : Object.keys(RUB_LABELS));
    var all = []; var seenC = {};
    scope.forEach(function(rub) {
      Object.keys(RUB_LABEL_CODES).forEach(function(k4) {
        if (k4.split('|||')[0] === rub) {
          var lbl = k4.split('|||')[1];
          RUB_LABEL_CODES[k4].forEach(function(c) {
            if (!seenC[c]) { seenC[c] = true; all.push({code:c, label:lbl}); }
          });
        }
      });
    });
    all.sort(function(a,b){ return parseInt(a.code) - parseInt(b.code); });
    return all;
  }
  return [];
}



function ssClear(key) {
  ssState[key] = null;
  var valEl = ge(key + '-val');
  if (valEl) { valEl.value = ''; if (valEl.dataset) valEl.dataset.manual = ''; }
  var lblEl = ge(key + '-lbl'); if (lblEl) lblEl.value = '';
  var btn   = ge('ss-' + key + '-btn'); if (btn) btn.classList.remove('filled');
  var hint  = ge('ss-' + key + '-hint'); if (hint){ hint.textContent=''; hint.className='hint'; }
  var txt   = ge('ss-' + key + '-txt');
  var ph = {
    rub:   'Rechercher une rubrique…',
    desig: 'Rechercher une désignation…',
    dom:   'Rechercher par code ou libéllé…',
    ava:   'Sélectionner un code avarie…'
  };
  if (txt) txt.textContent = ph[key] || 'Sélectionner…';
  // Propager le reset vers le bas
  if (key === 'rub') {
    var rv = ge('rub-val'); if (rv) rv.value = '';
    resetBelow('rub');
  } else if (key === 'desig') {
    resetBelow('desig');
  }
  ssClose();
  saveDraft();
}


function ssReset(key) {
  ssClear(key);
}
function ssResetDesig() {
  ssState['desig'] = null;
  var dv = ge('desig-val'); if(dv){dv.value='';dv.dataset.manual='';}
  var dBtn=ge('ss-desig-btn'); if(dBtn){dBtn.classList.remove('filled');
    var t=dBtn.querySelector('.ss-txt');
    if(t)t.textContent='🔍 Rechercher une désignation…';}
  var dHint=ge('ss-desig-hint'); if(dHint){dHint.textContent='';dHint.className='hint';}
  ssReset('dom');
  var domBtn=ge('ss-dom-btn'); if(domBtn){domBtn.classList.remove('filled');
    var t2=domBtn.querySelector('.ss-txt');
    if(t2)t2.textContent='🔍 Rechercher par code ou libéllé…';}
}

function ssSet(key, code, label) {
  if (!code) return;
  ssPick(key, code, label||'');
}

function ssToggle(key) {
  var drop = ge('ss-' + key + '-drop');
  var btn  = ge('ss-' + key + '-btn');
  if (!drop || !btn) return;
  var isOpen = drop.classList.contains('open');
  ssClose();
  if (!isOpen) {
    drop.classList.add('open');
    btn.classList.add('open');
    var inp = ge('ss-' + key + '-inp');
    ssRender(key, inp ? inp.value : '');
    if (inp) inp.focus();
  }
}


function ssClose() {
  ['dom','ava','desig','rub'].forEach(function(k) {
    var d = ge('ss-'+k+'-drop');
    var b = ge('ss-'+k+'-btn');
    if (d) d.classList.remove('open');
    if (b) b.classList.remove('open');
  });
}

function ssPickFromEl(el) {
  var code  = el.getAttribute('data-code');
  var label = el.getAttribute('data-label');
  var key   = el.getAttribute('data-key');
  if (code && key) ssPick(key, code, label || '');
}

function ssRenderSoft(key) {
  var drop = ge('ss-'+key+'-drop');
  if (drop && drop.classList.contains('open')) {
    var inp = ge('ss-'+key+'-inp');
    ssRender(key, inp ? inp.value : '');
  }
}

function ssRender(key, query) {
  var items = ssData(key);
  var q = (query || '').toLowerCase().trim();
  var filtered;
  if (!q) {
    filtered = items;
  } else if (key === 'dom' || key === 'ava') {
    // Code: commence par | label: contient
    filtered = items.filter(function(it) {
      return it.code.toLowerCase().indexOf(q) !== -1
          || it.label.toLowerCase().indexOf(q) !== -1;
    });
  } else {
    filtered = items.filter(function(it) {
      return it.label.toLowerCase().indexOf(q) !== -1;
    });
  }
  var shown = filtered.slice(0, 200);
  var cnt = ge('ss-' + key + '-cnt');
  if (cnt) cnt.textContent = filtered.length + ' résultat' + (filtered.length !== 1 ? 's' : '')
    + (filtered.length > 200 ? ' — 200 affichés' : '');
  var opts = ge('ss-' + key + '-opts');
  if (!opts) return;
  if (!shown.length) { opts.innerHTML = '<div class="ss-empty">Aucun résultat</div>'; return; }
  var cur = ssState[key] ? ssState[key].code : '';
  opts.innerHTML = shown.map(function(it) {
    var sel = (it.code === cur) ? ' sel' : '';
    var display;
    if (key === 'dom') {
      display = '<span class="ss-code" style="font-size:13px;font-weight:700">' + esc(it.code) + '</span>'
              + '<span class="ss-lbl" style="color:#888;font-size:11px;margin-left:8px">' + esc(it.label) + '</span>';
    } else if (key === 'ava') {
      display = '<span class="ss-code">' + esc(it.code) + '</span>'
              + '<span class="ss-lbl">' + esc(it.label) + '</span>';
    } else {
      display = '<span class="ss-lbl">' + esc(it.label) + '</span>';
    }
    return '<div class="ss-opt' + sel + '" data-code="' + esc(it.code)
         + '" data-label="' + esc(it.label) + '" data-key="' + key
         + '" onclick="ssPickFromEl(this)">' + display + '</div>';
  }).join('');
}

function ssPick(key, code, label) {
  var cleanLabel = decodeLabel(label);
  ssState[key] = { code: code, label: cleanLabel };
  var valEl = ge(key + '-val'); if (valEl) valEl.value = code;
  var lblEl = ge(key + '-lbl'); if (lblEl) lblEl.value = cleanLabel;
  var txt  = ge('ss-' + key + '-txt');
  var btn  = ge('ss-' + key + '-btn');
  if (btn) btn.classList.add('filled');
  var hint = ge('ss-' + key + '-hint');

  if (key === 'rub') {
    if (txt)  txt.textContent  = cleanLabel;
    if (hint) { hint.textContent = '✔ ' + cleanLabel; hint.className = 'hint ok'; }
    // Stocker dans rub-val AVANT le reset
    var rv = ge('rub-val'); if (rv) rv.value = cleanLabel;
    // Reset desig + dom (pas rub lui-même)
    resetBelow('rub');

  } else if (key === 'desig') {
    if (txt)  txt.textContent  = cleanLabel;
    if (hint) { hint.textContent = '✔ ' + cleanLabel; hint.className = 'hint ok'; }
    var dv = ge('desig-val'); if (dv) dv.value = cleanLabel;
    // Reset dom seulement
    resetBelow('desig');
    // Chercher les codes pour cette désignation
    var rubVal = ge('rub-val') ? ge('rub-val').value : '';
    var k      = rubVal + '|||' + cleanLabel;
    var codes  = RUB_LABEL_CODES[k] || [];
    if (!codes.length) {
      Object.keys(RUB_LABEL_CODES).forEach(function(k2) {
        if (k2.split('|||')[1] === cleanLabel) codes = codes.concat(RUB_LABEL_CODES[k2]);
      });
      codes = codes.filter(function(c, i){ return codes.indexOf(c) === i; });
    }
    var domBtn = ge('ss-dom-btn');
    if (domBtn) {
      domBtn.classList.remove('filled');
      var dt = domBtn.querySelector('.ss-txt');
      if (dt) dt.textContent = codes.length === 1
        ? codes[0]
        : '❖ ' + codes.length + ' code(s) disponible(s)';
    }
    // Auto-sélectionner si 1 seul code
    if (codes.length === 1) {
      setTimeout(function(){ ssPick('dom', codes[0], cleanLabel); }, 50);
    }

  } else if (key === 'dom') {
    if (txt)  txt.textContent = code;
    if (hint) { hint.textContent = '✔ ' + code; hint.className = 'hint ok'; }
    fillCascadeFromCode(code, cleanLabel);

  } else if (key === 'ava') {
    if (txt)  txt.textContent = code + ' — ' + cleanLabel;
    if (hint) { hint.textContent = '✔ ' + cleanLabel; hint.className = 'hint ok'; }

  } else {
    if (txt)  txt.textContent = code + ' — ' + cleanLabel;
    if (hint) { hint.textContent = '✔ ' + cleanLabel; hint.className = 'hint ok'; }
  }
  ssClose();
  saveDraft();
}

function fillCascadeFromCode(code, desigLabel) {
  // Trouver rubrique + catégorie depuis le code
  var foundRub = '', foundDesig = desigLabel || '', foundCat = '';
  Object.keys(RUB_LABEL_CODES).forEach(function(k) {
    if (!foundRub && RUB_LABEL_CODES[k].indexOf(code) !== -1) {
      var parts  = k.split('|||');
      foundRub   = parts[0];
      foundDesig = desigLabel || parts[1];
    }
  });
  if (foundRub) {
    Object.keys(CAT_RUBS).forEach(function(cat) {
      if (!foundCat && CAT_RUBS[cat].indexOf(foundRub) !== -1) foundCat = cat;
    });
  }
  var curCat = ge('dom-cat') ? ge('dom-cat').value : '';

  // Remplir désignation si vide ou différente
  var dv = ge('desig-val');
  if (dv && foundDesig) {
    dv.value = foundDesig;
    ssState['desig'] = { code: foundDesig, label: foundDesig };
    var db = ge('ss-desig-btn');
    if (db) {
      db.classList.add('filled');
      var dt = db.querySelector('.ss-txt'); if (dt) dt.textContent = foundDesig;
    }
    var dh = ge('ss-desig-hint');
    if (dh) { dh.textContent = '✔ ' + foundDesig; dh.className = 'hint ok'; }
  }
  // Remplir rubrique si vide
  var rv = ge('rub-val');
  if (rv && foundRub && !rv.value) {
    rv.value = foundRub;
    ssState['rub'] = { code: foundRub, label: foundRub };
    var rb = ge('ss-rub-btn');
    if (rb) {
      rb.classList.add('filled');
      var rt = rb.querySelector('.ss-txt'); if (rt) rt.textContent = foundRub;
    }
    var rh = ge('ss-rub-hint');
    if (rh) { rh.textContent = '✔ ' + foundRub; rh.className = 'hint ok'; }
  }
  // Remplir catégorie si vide
  if (foundCat && !curCat) {
    var ci = ge('dom-cat'); if (ci) ci.value = foundCat;
    [].forEach.call(document.querySelectorAll('.cat-btn'), function(b) {
      b.classList.toggle('active', b.getAttribute('data-cat') === foundCat);
    });
    var ch = ge('cat-hint');
    if (ch) { ch.textContent = '✔ ' + foundCat; ch.className = 'hint ok'; }
  }
}


function ssFilter(key, q) { ssRender(key, q); }

// Fermer sur clic extérieur
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'vider-modal') closeViderModal();
  if (!e.target.closest('.ss-wrap')) ssClose();
  if (!e.target.closest('.ac-wrap')) {
    var ac = ge('chassis-ac');
    if (ac) ac.classList.remove('open');
  }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { ssClose(); closeSP(); closeViderModal(); }
});

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// AUTOCOMPLETE CHÂSSIS
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function onChassis(input) {
  var v = input.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase().slice(0,17);
  input.value = v;
  var hint = ge('chassis-hint');
  if (hint) { hint.textContent = vinHint(v); hint.className = 'hint' + (isValidVIN(v) ? ' ok' : v.length ? ' err' : ''); }
  input.className = isValidVIN(v) ? 'ok' : v.length ? 'invalid' : '';
  // Autocomplete depuis historique
  var ac = ge('chassis-ac');
  if (!ac || v.length < 5) { if(ac) ac.classList.remove('open'); return; }
  var seen = {};
  var matches = G.demandes.filter(function(d) {
    if (d.chassis && d.chassis.indexOf(v)===0 && !seen[d.chassis]) { seen[d.chassis]=true; return true; }
    return false;
  }).slice(0,5);
  if (!matches.length) { ac.classList.remove('open'); return; }
  ac.innerHTML = matches.map(function(d) {
    return '<div class="ac-item" data-vin="'+esc(d.chassis)+'" onclick="acPick(this)">'+
      '<div class="ac-vin">'+esc(d.chassis)+'</div>'+
      '<div class="ac-det">'+esc(d.site)+' — OR '+esc(d.or||'')+'</div></div>';
  }).join('');
  ac.classList.add('open');
}

function acPick(el) {
  var vin = el.getAttribute('data-vin');
  var d = G.demandes.find(function(x) { return x.chassis === vin; });
  var acEl = ge('chassis-ac'); if(acEl) acEl.classList.remove('open');
  if (!d) return;
  ge('chassis').value = vin;
  var hint = ge('chassis-hint');
  if (hint) { hint.textContent = '✔ Châssis valide'; hint.className = 'hint ok'; }
  ge('chassis').className = 'ok';
  if (d.kilometrage) sv('kilometrage', d.kilometrage);
  if (d.date_or)     sv('date_or', d.date_or);
  if (d.technicien)  sv('technicien', d.technicien);
  if (d.email_usager) sv('email_usager', d.email_usager);
  if (d.kvps && !ge('kvps').readOnly) sv('kvps', d.kvps);
  if (d.site && G.role === 'team') {
    ge('f-site').value = d.site;
    ge('h-site-name').textContent = d.site;
    [].forEach.call(document.querySelectorAll('.s-btn'), function(b) { b.classList.toggle('active', b.textContent.trim()===d.site); });
  }
  toast('✔ Véhicule reconnu — informations pré-remplies');
}

function onOR(input) {
  var v = input.value.replace(/\D/g,'').slice(0,6);
  input.value = v;
  var hint = ge('or-hint');
  if (hint) { hint.textContent = v.length+' / 6 chiffres'; hint.className = 'hint'+(v.length===6?' ok':v.length?' err':''); }
  input.className = v.length===6 ? 'ok' : v.length ? 'invalid' : '';
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// KULANZ SAVE / COPY
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function saveKulanz() {
  G.kulanzData = {
    site:        ge('f-site') ? ge('f-site').value : '',
    chassis:     gv('chassis'),      kilometrage: gv('kilometrage'),
    or_number:   gv('or_number'),    date_or:     gv('date_or'),
    kvps:        gv('kvps'),         technicien:  gv('technicien'),
    email_usager:gv('email_usager'), plainte_client:gv('plainte_client'),
    emplacement: gv('emplacement'),  ref_piece:   gv('ref_piece'),
    dom_cat:     ge('dom-cat')  ? ge('dom-cat').value  : '',
    dom_rub:     ge('rub-val')  ? ge('rub-val').value  : '',
    desig_piece: ge('desig-val')? ge('desig-val').value: '',
    dom_code:    ge('dom-val')  ? ge('dom-val').value  : '',
    dom_lbl:     ge('dom-lbl')  ? ge('dom-lbl').value  : '',
    ava_code:    ge('ava-val')  ? ge('ava-val').value  : '',
    ava_lbl:     ge('ava-lbl')  ? ge('ava-lbl').value  : ''
  };
}

function copyKulanz() {
  var k = G.kulanzData;
  if (!k.chassis && !k.or_number) { alert('⚠ Aucune donnée Kulanz trouvée.'); return; }
  ['chassis','kilometrage','or_number','date_or','kvps','technicien','email_usager',
   'plainte_client','emplacement','ref_piece'].forEach(function(n) { if(k[n]) sv(n,k[n]); });
  if (k.site) {
    ge('f-site').value = k.site;
    ge('h-site-name').textContent = k.site;
    [].forEach.call(document.querySelectorAll('.s-btn'), function(b) { b.classList.toggle('active', b.textContent.trim()===k.site); });
  }
  // Restaurer la cascade
  if (k.dom_cat) {
    var ci=ge('dom-cat'); if(ci)ci.value=k.dom_cat;
    var catBtn=document.querySelector('.cat-btn[data-cat="'+k.dom_cat+'"]');
    if(catBtn)catBtn.classList.add('active');
    var ch=ge('cat-hint'); if(ch){ch.textContent='✔ '+k.dom_cat;ch.className='hint ok';}
  }
  if (k.dom_rub) {
    var rv=ge('rub-val'); if(rv)rv.value=k.dom_rub;
    ssState['rub']={code:k.dom_rub,label:k.dom_rub};
    var rb=ge('ss-rub-btn'); if(rb){rb.classList.add('filled');
      var rt=rb.querySelector('.ss-txt');if(rt)rt.textContent=k.dom_rub;}
  }
  if (k.desig_piece) {
    var dv=ge('desig-val'); if(dv)dv.value=k.desig_piece;
    ssState['desig']={code:k.desig_piece,label:k.desig_piece};
    var db=ge('ss-desig-btn'); if(db){db.classList.add('filled');
      var dt=db.querySelector('.ss-txt');if(dt)dt.textContent=k.desig_piece;}
  }
  if (k.dom_code) {
    ssSet('dom', k.dom_code, k.dom_lbl);

  }
  ssSet('ava', k.ava_code, k.ava_lbl);
  if (k.chassis) {
    var h = ge('chassis-hint');
    if (h) { h.textContent = vinHint(k.chassis); h.className = 'hint'+(isValidVIN(k.chassis)?' ok':' err'); }
    ge('chassis').className = isValidVIN(k.chassis) ? 'ok' : 'invalid';
  }
  // Re-rendre le formulaire KULANZ pour le site copié
  if (k.site) renderKulanzForm(k.site);
  setType('C'); // Passer en CCR
  toast('✔ Données Kulanz copiées en CCR !');
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// BROUILLON
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
var draftTimer = null;

function saveDraft() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(function() {
    var b = {
      site: ge('f-site').value, type: ge('f-type').value,
      chassis: gv('chassis'), kilometrage: gv('kilometrage'),
      or_number: gv('or_number'), date_or: gv('date_or'), kvps: gv('kvps'),
      technicien: gv('technicien'), email_usager: gv('email_usager'),
      plainte_client: gv('plainte_client'),
      emplacement: gv('emplacement'), ref_piece: gv('ref_piece'),
      desig_piece: (ge('desig-val')?ge('desig-val').value:''), commentaires: gv('commentaires'),
      dom_cat: ge('dom-cat') ? ge('dom-cat').value : '',
      dom_rub: ge('rub-val') ? ge('rub-val').value : '',
      dom_code: ge('dom-val') ? ge('dom-val').value : '',
      dom_lbl: ge('dom-lbl') ? ge('dom-lbl').value : '',
      ava_code: ge('ava-val') ? ge('ava-val').value : '',
      ava_lbl: ge('ava-lbl') ? ge('ava-lbl').value : ''
    };
    var _s=ge('f-site')?ge('f-site').value:'';
    var _q=(typeof KULANZ_BY_BRAND!=='undefined'&&typeof SITE_BRAND!=='undefined')
      ?(KULANZ_BY_BRAND[SITE_BRAND[_s]||'VW']||[]):[];
    _q.forEach(function(q){b['k_'+q.name]=gr(q.name)||'';});
    b.num_tpi=gv('num_tpi')||'';
    try { var _draftKey = 'gea_draft_' + (_s || 'default');
      localStorage.setItem(_draftKey, JSON.stringify(b));
      localStorage.setItem('gea_draft_last', _draftKey); } catch(e) {}
  }, 700);
}

function restoreDraft() {
  try {
    var _lastKey = localStorage.getItem('gea_draft_last') || 'gea_draft';
    var s = localStorage.getItem(_lastKey);
    if (!s) return;
    var b = JSON.parse(s);
    if (!b.chassis && !b.or_number) return;
    if (!confirm('📋 Un brouillon non envoyé a été trouvé. Restaurer ?')) {
      (function(){ try{ var _lk=localStorage.getItem('gea_draft_last')||'gea_draft';localStorage.removeItem(_lk);localStorage.removeItem('gea_draft_last'); }catch(e){} })(); return;
    }
    // Restaurer le site uniquement si valide
    if (b.site && SITES.indexOf(b.site) !== -1 && G.role === 'team') {
      ge('f-site').value = b.site;
      ge('h-site-name').textContent = b.site;
      [].forEach.call(document.querySelectorAll('.s-btn'), function(btn) { btn.classList.toggle('active', btn.textContent.trim()===b.site); });
    }
    ['chassis','kilometrage','or_number','kvps','technicien','email_usager',
     'plainte_client','emplacement','ref_piece','commentaires'].forEach(function(n) {
      if (b[n]) sv(n, b[n]);
    });
    if (b.date_or && /^\d{4}-\d{2}-\d{2}$/.test(b.date_or)) sv('date_or', b.date_or);
    if (b.dom_cat) {
      var ci=ge('dom-cat'); if(ci)ci.value=b.dom_cat;
      var cb=document.querySelector('.cat-btn[data-cat="'+b.dom_cat+'"]');
      if(cb)cb.classList.add('active');
      var ch=ge('cat-hint'); if(ch){ch.textContent='✔ '+b.dom_cat;ch.className='hint ok';}
    }
    if (b.dom_rub) {
      var rv=ge('rub-val'); if(rv)rv.value=b.dom_rub;
      ssState['rub']={code:b.dom_rub,label:b.dom_rub};
      var rb=ge('ss-rub-btn'); if(rb){rb.classList.add('filled');
        var rt=rb.querySelector('.ss-txt');if(rt)rt.textContent=b.dom_rub;}
    }
    if (b.desig_piece) {
      var dv=ge('desig-val'); if(dv)dv.value=b.desig_piece;
      ssState['desig']={code:b.desig_piece,label:b.desig_piece};
      var db=ge('ss-desig-btn'); if(db){db.classList.add('filled');
        var dbt=db.querySelector('.ss-txt');if(dbt)dbt.textContent=b.desig_piece;}
    }
    if (b.dom_code) {
      var dv2=ge('dom-val'); if(dv2)dv2.value=b.dom_code;
      ssState['dom']={code:b.dom_code,label:b.dom_lbl||b.dom_code};
      var dm=ge('ss-dom-btn'); if(dm){dm.classList.add('filled');
        var dmt=dm.querySelector('.ss-txt');if(dmt)dmt.textContent=b.dom_code;}
    }
    // Re-rendre le formulaire KULANZ pour le bon site avant de restaurer
    var draftSite = (b.site && SITES.indexOf(b.site) !== -1) ? b.site : (ge('f-site')?ge('f-site').value:'');
    if (draftSite) renderKulanzForm(draftSite);
    ssSet('ava', b.ava_code, b.ava_lbl);
    if (b.type === 'CCR') setType('C');
    if (b.chassis) onChassis(ge('chassis'));
    // Restaurer les réponses KULANZ
    if (qs) {
      var brandQs = typeof KULANZ_BY_BRAND!=='undefined'?KULANZ_BY_BRAND[SITE_BRAND[draftSite]||'VW']||[]:[];
      brandQs.forEach(function(q){
        var val = b['k_'+q.name];
        if (val) {
          var radios = document.querySelectorAll('[name="'+q.name+'"]');
          [].forEach.call(radios, function(r){ r.checked = (r.value===val); });
        }
      });
      if (b.num_tpi) { sv('num_tpi', b.num_tpi); toggleTpiField(true); }
    }
    checkKulanzNok();
    toast('✔ Brouillon restauré !');
  } catch(e) { console.warn('Draft restore error:', e); }
}

document.addEventListener('input',  function(e) {
  if (!e.target.closest('#mainForm')) return;
  saveDraft();
  // Si l'usager modifie manuellement la désignation pièce, désactiver l'auto-fill
});
document.addEventListener('change', function(e) {
  if (!e.target.closest('#mainForm')) return;
  saveDraft();
  if (e.target.name === 'tpi')  toggleTpiField(e.target.value === 'OUI');
  if (e.target.name === 'cig')  { var ct=ge('cig-taux'); ct.disabled=e.target.value!=='superieur'; if(!ct.disabled) ct.focus(); }
  // Déclencher checkKulanzNok sur tout radio dans la section KULANZ
  var kzone = ge('kulanz-questions');
  if (kzone && kzone.contains(e.target)) checkKulanzNok();
});

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// COLLECTE DES DONNÉES
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function collectData() {
  var site    = ge('f-site') ? ge('f-site').value : '';
  var type    = ge('f-type') ? ge('f-type').value || 'Kulanz' : 'Kulanz';
  var domCode = ge('dom-val') ? ge('dom-val').value : '';
  var domLbl  = ge('dom-lbl') ? ge('dom-lbl').value : '';
  var avaCode = ge('ava-val') ? ge('ava-val').value : '';
  var avaLbl  = ge('ava-lbl') ? ge('ava-lbl').value : '';
  var domFull = domCode ? domCode + (domLbl ? ' — '+domLbl : '') : '';
  var avaFull = avaCode ? avaCode + (avaLbl ? ' — '+avaLbl : '') : '';
  var fields = [
    { l:'N° OR',            v:gv('or_number') },
    { l:'Date OR',          v:gv('date_or') },
    { l:'KVPS',             v:gv('kvps') },
    { l:'Nom du demandeur', v:gv('technicien') },
    { l:'E-mail',           v:gv('email_usager') },
    { l:'Châssis',          v:gv('chassis') },
    { l:'Kilométrage',      v:gv('kilometrage') ? gv('kilometrage')+' km' : '' },
    { l:'Plainte client',   v:gv('plainte_client') },
    { l:'Catégorie',        v:(ge('dom-cat')?ge('dom-cat').value:'') },
    { l:'Rubrique',         v:(ge('rub-val')?ge('rub-val').value:'') },
    { l:'Désignation pièce', v:(ge('desig-val')?ge('desig-val').value:'') },
    { l:'Code dommage',     v:domFull },
    { l:'Code avarie',      v:avaFull },
    { l:'Emplacement',      v:gv('emplacement') },
    { l:'Référence pièce',  v:gv('ref_piece') },
  ];
  if (type === 'Kulanz') {
    var brand2 = SITE_BRAND[site] || 'VW';
    var brandQs = KULANZ_BY_BRAND[brand2] || KULANZ_BY_BRAND['VW'];
    var kFields = [{ l:'N° TPI', v:gv('num_tpi') }];
    brandQs.forEach(function(q) {
      kFields.push({ l:q.label, v:gr(q.name) });
    });
    fields = fields.concat(kFields);
  } else {
    var pcs = []; [].forEach.call(document.querySelectorAll('[name="pieces[]"]:checked'), function(el){ pcs.push(el.value); });
    fields = fields.concat([
      { l:'KULANZ effectuée', v:gr('kulanz_done') },
      { l:'CIG',              v:gr('cig') },
      { l:'Taux CIG',         v:gv('cig_taux') },
      { l:'Pièces jointes',   v:pcs.join(' | ') },
    ]);
  }
  fields.push({ l:'Commentaires', v:gv('commentaires') });
  return { site:site, type:type, fields:fields, domFull:domFull };
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// ENVOYER
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function buildDemande(d, email, type) {
  var _key = (demandesRef && demandesRef.push) ? (demandesRef.push().key || null) : null;
  return {
    id:               _key || (Date.now()+'_'+Math.random().toString(36).slice(2,9)),
    site:             d.site,
    type:             type || d.type || 'Kulanz',
    or:               gv('or_number'),
    chassis:          gv('chassis'),
    code_dommage:     d.domFull || '',
    desig_piece:      ge('desig-val') ? ge('desig-val').value : '',
    rubrique:         ge('rub-val')   ? ge('rub-val').value   : '',
    categorie:        ge('dom-cat')   ? ge('dom-cat').value   : '',
    code_avarie:      d.avaFull || '',
    plainte:          gv('plainte_client'),
    kilometrage:      gv('kilometrage'),
    date_or:          gv('date_or'),
    kvps:             gv('kvps'),
    email_usager:     email,
    technicien:       gv('technicien'),
    date:             new Date().toLocaleDateString('fr-FR'),
    statut:           'En attente',
    commentaire_team: '',
    commerce:         null
  };
}

function envoyerFormulaire() {
  var site  = ge('f-site') ? ge('f-site').value : '';
  var type  = (ge('f-type') && ge('f-type').value) ? ge('f-type').value : 'Kulanz';
  var isCCR = (type === 'CCR');

  if (!site) { alert('\u26a0 Veuillez s\u00e9lectionner un site.'); return; }
  if (!isValidVIN(gv('chassis'))) { alert('\u26a0 Ch\u00e2ssis invalide (17 caract\u00e8res, pas I/O/Q).'); return; }
  if (!/^\d{6}$/.test(gv('or_number'))) { alert('\u26a0 N\u00b0 OR\u00a0: 6 chiffres requis.'); return; }
  if (!gv('plainte_client')) { alert('\u26a0 Plainte client obligatoire.'); return; }
  if (!ge('desig-val') || !ge('desig-val').value) { alert('\u26a0 Veuillez s\u00e9lectionner une d\u00e9signation pi\u00e8ce.'); return; }
  if (!ge('dom-val') || !ge('dom-val').value) { alert('\u26a0 Veuillez s\u00e9lectionner un code dommage.'); return; }
  if (!ge('ava-val') || !ge('ava-val').value) { alert('\u26a0 Veuillez s\u00e9lectionner un code avarie.'); return; }
  if (!gv('technicien')) { alert('\u26a0 Le nom du demandeur est obligatoire.'); return; }
  var email = gv('email_usager');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { alert('\u26a0 E-mail invalide.'); return; }
  if (isCCR) {
    var chkE = ge('chk-engagement');
    if (!chkE || !chkE.checked) {
      alert('\u26a0 Veuillez cocher la case d\u2019engagement avant d\u2019envoyer.');
      if (chkE) chkE.focus();
      return;
    }
  }

  var btn = ge('btn-envoyer');
  if (!btn || btn.disabled) return;
  var confirmMsg = isCCR
    ? "\u26a0\ufe0f AVANT D'ENVOYER \u2014 Demande CCR\n\n"
      + "Site : "+site+"\nN\u00b0 OR : "+gv('or_number')+"\nCh\u00e2ssis : "+gv('chassis')+"\n\n"
      + "\u25b6 \u00c9TAPES OBLIGATOIRES :\n"
      + "  1. Cliquez OK \u2192 le PDF se g\u00e9n\u00e8re automatiquement\n"
      + "  2. Sauvegardez le PDF sur votre poste\n"
      + "  3. Outlook va s'ouvrir avec l'objet pr\u00e9-rempli\n"
      + "  4. Joignez le PDF + tous les documents justificatifs\n"
      + "  5. Envoyez depuis Outlook\n\n"
      + "Confirmer et g\u00e9n\u00e9rer le PDF ?"
    : "Confirmer l'envoi ?\n\nSite\u00a0: "+site+"\nN\u00b0 OR\u00a0: "+gv('or_number')+"\nCh\u00e2ssis\u00a0: "+gv('chassis');
  if (!confirm(confirmMsg)) return;

  var d = collectData();

  if (isCCR) {
    btn.disabled = true; btn.textContent = 'Pr\u00e9paration\u2026';
    try { genererPDF(); } catch(e) { console.warn('PDF:', e); }
    var corps = '\u2550'.repeat(40)+'\nDEMANDE CCR \u2014 '+site+'\n'+'\u2550'.repeat(40)+'\n\n';
    d.fields.filter(function(f){ return f.v; }).forEach(function(f){ corps += f.l+' : '+f.v+'\n'; });
    corps += '\n'+'\u2500'.repeat(40)+'\n\u2500'.repeat(40)+'\n\u26a0 ÉTAPES REQUISES :\n'+'  1. Téléchargez le PDF généré automatiquement (bouton ci-dessus).\n'+'  2. Joignez le formulaire \'Demande CCR\' (PDF) au mail Outlook.\n'+'  3. Joignez les documents justificatifs (factures, photos, plan entretien...).\n'+'  4. Envoyez depuis Outlook.\n'+'\nTeam Garantie GEA – VW';
    var kvps2   = gv('kvps') || site;
    var subject = 'Demande CCR - '+kvps2+' - '+site+' - '+gv('chassis')+' - '+gv('technicien');
    var corpsLimite = corps.length > 1800
      ? corps.substring(0, 1800) + '\n\n[...] CORPS TRONQUÉ — Joindre le PDF pour les détails complets.'
      : corps;
    var mailto  = 'mailto:teamgarantie@geauto.fr'
                + '?subject=' + encodeURIComponent(subject)
                + '&body='    + encodeURIComponent(corpsLimite);
    // Ouvrir Outlook — méthode universelle Chrome/Firefox/Edge
    // createElement + click = jamais bloqué car c'est un geste utilisateur direct
    try {
      var _a = document.createElement('a');
      _a.href = mailto;
      _a.style.display = 'none';
      document.body.appendChild(_a);
      _a.click();
      setTimeout(function(){ document.body.removeChild(_a); }, 500);
    } catch(e) {
      // Fallback si createElement échoue
      window.location.href = mailto;
    }
    var newD = {
      id: (demandesRef.push().key || (Date.now()+'_'+Math.random().toString(36).slice(2,9))),
      date: new Date().toLocaleDateString('fr-FR'),
      site: d.site, type: 'CCR',
      or: gv('or_number'), chassis: gv('chassis'), code_dommage: d.domFull,
      desig_piece: ge('desig-val')?ge('desig-val').value:'',
      rubrique: ge('rub-val')?ge('rub-val').value:'',
      categorie: ge('dom-cat')?ge('dom-cat').value:'',
      email_usager: email, technicien: gv('technicien'),
      kilometrage: gv('kilometrage'), date_or: gv('date_or'), kvps: gv('kvps'),
      statut: 'En attente', commentaire_team: '', commerce: null
    };
    if (demandesRef) demandesRef.child('d'+newD.id.replace(/[^a-zA-Z0-9]/g,'')).set(newD).catch(function(e){console.warn('Firebase CCR:',e);});
    else G.demandes.unshift(newD);
    try { (function(){ try{ var _lk=localStorage.getItem('gea_draft_last')||'gea_draft';localStorage.removeItem(_lk);localStorage.removeItem('gea_draft_last'); }catch(e){} })(); } catch(e) {}
    var _ml2  = window._lastMailto  || '';
    var _sbj2 = window._lastSubject || '';
    window._ccrSubject = _sbj2;
    ge('success-details').innerHTML =
      '<strong>Site\u00a0:</strong> '+esc(newD.site)
      +'&nbsp;&nbsp;<strong>N\u00b0 OR\u00a0:</strong> '+esc(newD.or)
      +'&nbsp;&nbsp;<strong>Ch\u00e2ssis\u00a0:</strong> '+esc(newD.chassis)
      +'<div style="background:#fff8e1;border:2px solid #f39c12;border-radius:8px;padding:14px;margin-top:10px">'
      +'<div style="font-weight:700;color:#c0392b;margin-bottom:10px">\u26a0\ufe0f ACTIONS OBLIGATOIRES :</div>'
      +'\u2705 <strong>1.</strong> PDF g\u00e9n\u00e9r\u00e9 \u2014 sauvegardez-le<br><br>'
      +'\u2709\ufe0f <strong>2.</strong> '
      +'<button type="button" onclick="ouvrirOutlookCCR()" '
      +'style="background:#0078d4;color:#fff;border:none;border-radius:6px;'
      +'padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer">'
      +'\ud83d\udce7 Ouvrir Outlook</button>'
      +'<br><span style="font-size:11px;color:#888;margin-top:4px;display:block">'
      +'Si le bouton ne fonctionne pas \u2192 Outlook n\'est pas configur\u00e9 comme client mail par d\u00e9faut.</span>'
      +'<details style="margin-top:6px;font-size:11px">'
      +'<summary style="cursor:pointer;color:#0078d4;font-weight:700">'
      +'\u2699\ufe0f Configurer Outlook comme client par d\u00e9faut</summary>'
      +'<div style="background:#f0f4ff;border:1px solid #c7d3f7;border-radius:4px;padding:10px;margin-top:6px">'
      +'<strong>M\u00e9thode 1 \u2014 Param\u00e8tres Windows :</strong><br>'
      +'1. D\u00e9marrer \u2192 <strong>Param\u00e8tres</strong><br>'
      +'2. <strong>Applications</strong> \u2192 <strong>Applications par d\u00e9faut</strong><br>'
      +'3. Chercher <strong>\'E-mail\'</strong> \u2192 s\u00e9lectionner <strong>Microsoft Outlook</strong><br>'
      +'4. Cliquer <strong>D\u00e9finir par d\u00e9faut</strong><br><br>'
      +'<strong>M\u00e9thode 2 \u2014 Depuis Outlook :</strong><br>'
      +'1. Ouvrir <strong>Outlook</strong><br>'
      +'2. <strong>Fichier</strong> \u2192 <strong>Options</strong> \u2192 onglet <strong>G\u00e9n\u00e9ral</strong><br>'
      +'3. Section <strong>Options de d\u00e9marrage</strong><br>'
      +'4. Cocher <strong>\'D\u00e9finir Outlook comme programme par d\u00e9faut pour l\'e-mail\'</strong><br>'
      +'5. Cliquer <strong>OK</strong>'
      +'</div></details>'
      +'<br><br><div style="background:#f5f5f5;border:1px solid #ccc;border-radius:4px;padding:8px;font-size:11px">'
      +'<strong>\u00c0 :</strong> teamgarantie@geauto.fr<br>'
      +'<strong>Objet :</strong> '+esc(_sbj2)
      +'<button type="button" onclick="copierObjetMail()" style="margin-left:8px;padding:3px 10px;font-size:11px;background:#ddd;border:1px solid #bbb;border-radius:3px;cursor:pointer">\ud83d\udccb Copier</button></div>'
      +'<br>\ud83d\udcce <strong>3.</strong> Joindre le <strong>PDF</strong> + documents justificatifs'
      +'<br>\ud83d\udce4 <strong>4.</strong> Envoyer depuis Outlook</div>';
    ge('success-overlay').classList.add('open');
    setTimeout(function(){
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Envoyer la demande';
    }, 2000);
    return;
  }

  btn.disabled = true; btn.textContent = 'Envoi en cours\u2026';
  var msg = '\u2550'.repeat(40)+'\nDEMANDE '+d.type.toUpperCase()+' \u2014 '+d.site+'\n'+'\u2550'.repeat(40)+'\n\n';
  d.fields.filter(function(f){ return f.v; }).forEach(function(f){ msg += f.l+' : '+f.v+'\n'; });
  msg += '\n'+'\u2500'.repeat(40)+'\nTeam Garantie GEA \u2013 VW';
  fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      access_key: WEB3_KEY,
      subject: '['+d.type+'] Nouvelle demande \u2013 '+d.site+' \u2013 OR '+gv('or_number'),
      message: msg, from_name: gv('technicien')||d.site, replyto: email
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(res){
    if (!res.success) throw new Error('web3forms error');
    var newD2 = {
      id: (demandesRef.push().key || (Date.now()+'_'+Math.random().toString(36).slice(2,9))),
      date: new Date().toLocaleDateString('fr-FR'),
      site: d.site, type: d.type, or: gv('or_number'), chassis: gv('chassis'),
      code_dommage: d.domFull,
      desig_piece: ge('desig-val')?ge('desig-val').value:'',
      rubrique: ge('rub-val')?ge('rub-val').value:'',
      categorie: ge('dom-cat')?ge('dom-cat').value:'',
      email_usager: email, technicien: gv('technicien'),
      kilometrage: gv('kilometrage'), date_or: gv('date_or'), kvps: gv('kvps'),
      statut: 'En attente', commentaire_team: '', commerce: null
    };
    if (demandesRef) return demandesRef.child('d'+newD2.id.replace(/[^a-zA-Z0-9]/g,'')).set(newD2).then(function(){ return newD2; });
    G.demandes.unshift(newD2); return newD2;
  })
  .then(function(newD2){
    try { (function(){ try{ var _lk=localStorage.getItem('gea_draft_last')||'gea_draft';localStorage.removeItem(_lk);localStorage.removeItem('gea_draft_last'); }catch(e){} })(); } catch(e) {}
    ge('success-details').innerHTML =
      '<strong>Site\u00a0:</strong> '+esc(newD2.site)+'<br>'+
      '<strong>Type\u00a0:</strong> '+esc(newD2.type)+'<br>'+
      '<strong>N\u00b0 OR\u00a0:</strong> '+esc(newD2.or)+'<br>'+
      '<strong>Ch\u00e2ssis\u00a0:</strong> '+esc(newD2.chassis)+'<br>'+
      '<strong>E-mail\u00a0:</strong> '+esc(newD2.email_usager);
    ge('success-overlay').classList.add('open');
  })
  .catch(function(err){ console.error(err); toast('\u274c Erreur \u2013 r\u00e9essayez.'); })
  .finally(function(){
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg> Envoyer la demande';
  });
}

function nouvelleDemande() {
  ge('success-overlay').classList.remove('open');
  ge('mainForm').reset();
  ge('f-type').value = 'Kulanz';
  ssReset('dom'); ssReset('ava');
  var ch = ge('chassis-hint'); if(ch) { ch.textContent='0 / 17 caractères'; ch.className='hint'; }
  var oh = ge('or-hint'); if(oh) { oh.textContent='0 / 6 chiffres'; oh.className='hint'; }
  ge('chassis').className = '';
  ge('or-num').className  = '';
  setType('K');
  resetCat();
  var _dci=ge('dom-cat'); if(_dci) _dci.value='';
  var kz=ge('kulanz-questions'); if(kz){[].forEach.call(kz.querySelectorAll('input[type=radio]'),function(r){r.checked=false;});}
  toggleTpiField(false);
  var _ce=ge('chk-engagement'); if(_ce) _ce.checked=false;
  var _cew=ge('ccr-engagement-wrap'); if(_cew) _cew.style.display='none';
  var vw=ge('vendu-wrapper'); if(vw)vw.style.display='none';
  var va=ge('vendu-alert'); if(va){va.style.display='none';va.innerHTML='';}
  var kna=ge('kulanz-nok-alert'); if(kna){kna.classList.remove('show');kna.innerHTML='';}  
  if(ge('desig-val')){ge('desig-val').value='';ge('desig-val').dataset.manual='';}
  if(ge('rub-val'))ge('rub-val').value='';
  // Réinitialiser cascade via resetBelow
  resetBelow('cat');
  enableAllDropdowns();
  if (G.role === 'usager') {
    ge('f-site').value = G.site;
    ge('kvps').value = KVPS_MAP[G.site]||'';
    ge('kvps').readOnly = true;
    ge('site-display').value = G.site;
  } else {
    [].forEach.call(document.querySelectorAll('.s-btn'), function(b) { b.classList.remove('active'); });
    ge('f-site').value = '';
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// PDF
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function genererPDF() {
  var site = ge('f-site').value;
  if (!site) { alert('⚠ Veuillez sélectionner un site.'); return; }
  if (!/^\d{6}$/.test(gv('or_number'))) { alert('⚠ N° OR requis (6 chiffres).'); return; }
  if (!window.jspdf) { alert('⚠ Bibliothèque PDF non chargée.'); return; }
  var btn = ge('btn-pdf');
  if (!btn || btn.disabled) return;
  btn.disabled = true; btn.textContent = 'Génération…';
  try {
    var d = collectData();
    var orNum = gv('or_number');
    var kvps  = gv('kvps');
    var now   = new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'});
    var title = '['+d.type.toUpperCase()+'] '+d.site+(kvps?' — '+kvps:'')+(ge('dom-val').value?' — '+ge('dom-val').value:'');
    var fname = title.replace(/[^a-zA-Z0-9_\-.[\]]/g,'_')+'_OR'+orNum+'.pdf';
    var doc = new window.jspdf.jsPDF({unit:'mm',format:'a4'});
    var W=210, ml=14, uw=W-ml*2, y=14;
    doc.setFillColor(26,26,46); doc.rect(ml,y,uw,17,'F');
    doc.setTextColor(212,174,82); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text(doc.splitTextToSize(title,uw-6),ml+3,y+6);
    doc.setTextColor(180,180,180); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
    doc.text('OR: '+orNum+'  |  '+now+'  |  teamgarantie@geauto.fr',ml+3,y+14);
    y += 22;
    doc.setFillColor(240,237,232); doc.rect(ml,y,uw,7,'F');
    doc.setTextColor(26,26,46); doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text('Détails de la demande',ml+3,y+5); y+=9;
    var cL=70, cV=uw-cL;
    d.fields.filter(function(f){return f.v&&f.v.trim();}).forEach(function(f,i) {
      var lines = doc.splitTextToSize(f.v, cV-4);
      var rh = Math.max(7, lines.length*5+2);
      if(y+rh>282){doc.addPage();y=14;}
      doc.setFillColor(i%2===0?255:247, i%2===0?255:246, i%2===0?255:242);
      doc.rect(ml,y,uw,rh,'F');
      doc.setDrawColor(221,221,221); doc.rect(ml,y,cL,rh,'S'); doc.rect(ml+cL,y,cV,rh,'S');
      doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80); doc.setFontSize(8.5);
      doc.text(f.l,ml+3,y+5);
      doc.setFont('helvetica','normal'); doc.setTextColor(26,26,46); doc.setFontSize(9);
      doc.text(lines,ml+cL+3,y+5); y+=rh;
    });
    y+=5; doc.setDrawColor(200,200,200); doc.line(ml,y,ml+uw,y);
    doc.setFontSize(7); doc.setTextColor(160,160,160);
    doc.text('Team Garantie GEA – VW — '+now, W/2, y+4, {align:'center'});
    doc.save(fname);
    toast('✔ PDF enregistré : '+fname);
  } catch(e) {
    toast('❌ Erreur PDF : '+e.message); console.error(e);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Enregistrer en PDF';
  }
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// HISTORIQUE
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function renderHisto() {
  // filtre site via G.site (TeamGarantie: via f-site, usager: son site)
  var fS  = G.role==='usager' ? G.site : ge('f-site').value;
  var fT  = ge('f-type-sel')  ? ge('f-type-sel').value  : '';
  var fSt = ge('f-stat-sel')  ? ge('f-stat-sel').value  : '';

  var scope = fS
    ? G.demandes.filter(function(d) { return d.site===fS; })
    : G.demandes;

  var el = function(id,val) { var e=ge(id); if(e) e.textContent=val; };
  el('s-total', scope.length);
  el('s-wait',  scope.filter(function(d){return d.statut==='En attente';}).length);
  el('s-ok',    scope.filter(function(d){return d.statut==='Validée';}).length);
  el('s-no',    scope.filter(function(d){return d.statut==='Refusée';}).length);

  var filtered = G.demandes.filter(function(d) {
    return (!fS||d.site===fS) && (!fT||d.type===fT) && (!fSt||d.statut===fSt);
  });

  var tbody = ge('histo-body');
  var empty = ge('histo-empty');
  if (!tbody) return;
  if (!filtered.length) { tbody.innerHTML=''; if(empty) empty.style.display='block'; return; }
  if (empty) empty.style.display='none';

  var BADGE = {
    'En attente':'b-wait','Validée':'b-ok','Refusée':'b-no','Complément requis':'b-comp'
  };
  var ICON = {'En attente':'🟡','Validée':'✅','Refusée':'❌','Complément requis':'🔄'};

  tbody.innerHTML = filtered.map(function(d) {
    var bc   = BADGE[d.statut] || 'b-wait';
    var ic   = ICON[d.statut]  || '🟡';
    var pec  = '—';
    if (d.statut==='Validée' && d.commerce) {
      var c=d.commerce, pts=[];
      if(c.mo_de)  pts.push('<span>MO: '+esc(c.mo_de)+'%</span>');
      if(c.pi_de)  pts.push('<span>Pièces: '+esc(c.pi_de)+'%</span>');
      if(c.moe_de) pts.push('<span>MO ext.: '+esc(c.moe_de)+'%</span>');
      if(c.pe_de)  pts.push('<span>Pièces ext.: '+esc(c.pe_de)+'%</span>');
      if(pts.length) pec='<div style="font-size:11px;line-height:1.7">'+pts.join('')+'</div>';
    }
    var action = G.role==='team'
      ? '<button class="btn-val" data-id="'+esc(String(d.id))+'" onclick="openSPFromBtn(this)">Valider</button>'
      : '—';
    return '<tr>'+
      '<td>'+esc(d.date||'')+'</td>'+
      '<td style="font-weight:500">'+esc(d.site||'')+'</td>'+
      '<td><span style="font-size:11px;font-weight:600;color:var(--gold)">'+esc(d.type||'')+'</span></td>'+
      '<td style="font-family:monospace">'+esc(d.or||'')+'</td>'+
      '<td style="font-family:monospace;font-size:11px">'+esc(d.chassis||'')+'</td>'+
      '<td style="font-size:11px">'+esc(d.code_dommage||'')+'</td>'+
      '<td><span class="badge '+bc+'">'+ic+' '+esc(d.statut||'')+'</span></td>'+
      '<td>'+pec+'</td>'+
      '<td style="font-size:11px;color:#666;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+esc(d.commentaire_team||'')+'">'+esc(d.commentaire_team||'—')+'</td>'+
      '<td>'+action+'</td>'+
    '</tr>';
  }).join('');
}

function viderHistorique() {
  // Ouvrir le modal en 2 étapes
  var m = ge('vider-modal');
  if (!m) return;
  // Reset à l'étape 1
  var s1 = ge('vm-step1'); if(s1) { s1.classList.add('active'); }
  var s2 = ge('vm-step2'); if(s2) { s2.classList.remove('active'); }
  var pe = ge('vider-pwd-err'); if(pe) pe.style.display = 'none';
  var pi = ge('vider-pwd'); if(pi) pi.value = '';
  var ob = ge('vider-ok-btn'); if(ob) ob.disabled = false;
  m.classList.add('open');
}

function closeViderModal() {
  var m = ge('vider-modal'); if(m) m.classList.remove('open');
  var pi = ge('vider-pwd'); if(pi) pi.value = '';
  var pe = ge('vider-pwd-err'); if(pe) pe.style.display = 'none';
  var ob = ge('vider-ok-btn'); if(ob) ob.disabled = false;
}

function viderStep2() {
  // Passer à l'étape mot de passe
  var s1 = ge('vm-step1'); if(s1) s1.classList.remove('active');
  var s2 = ge('vm-step2'); if(s2) s2.classList.add('active');
  setTimeout(function() { var pi = ge('vider-pwd'); if(pi) pi.focus(); }, 100);
}

function viderConfirm() {
  var ob = ge('vider-ok-btn');
  if (ob && ob.disabled) return;
  var pi = ge('vider-pwd');
  if (!pi || pi.value !== MOT_DE_PASSE) {
    var pe = ge('vider-pwd-err'); if(pe) pe.style.display = 'block';
    if(pi) pi.focus();
    return;
  }
  if(ob) ob.disabled = true;
  var pe = ge('vider-pwd-err'); if(pe) pe.style.display = 'none';
  if (demandesRef) {
    demandesRef.remove()
      .then(function() {
        G.demandes = [];
        closeViderModal();
        renderHisto();
        renderDash();
        toast('🗑 Historique supprimé définitivement.');
      })
      .catch(function() {
        closeViderModal();
        toast('❌ Erreur lors de la suppression.');
      });
  } else {
    G.demandes = [];
    closeViderModal();
    renderHisto();
    toast('🗑 Historique local supprimé.');
  }
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// DASHBOARD TEAM
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function renderDash() {
  var grid = ge('dash-grid');
  if (!grid || G.role !== 'team') return;
  if (!G.demandes) G.demandes = [];
  var totalWait = 0;
  var html = '';
  var curFilter = ge('f-site').value || '';
  SITES.forEach(function(site) {
    var sd    = G.demandes.filter(function(d) { return d.site===site; });
    var total = sd.length;
    var wait  = sd.filter(function(d) { return d.statut==='En attente'; }).length;
    var valid = sd.filter(function(d) { return d.statut==='Validée'; }).length;
    totalWait += wait;
    var cls = 'd-card' + (wait>0?' pending':'') + (curFilter===site?' sel':'');
    // Utiliser data-site pour éviter les problèmes de quotes
    html += '<div class="'+cls+'" data-site="'+esc(site)+'" onclick="dashClick(this)">'+
      '<div class="d-name">'+esc(site)+'</div>'+
      '<div class="d-nums">'+
        '<div class="d-num"><span class="d-val dv-total">'+total+'</span><span class="d-lbl">Total</span></div>'+
        '<div class="d-num"><span class="d-val dv-wait">'+wait+'</span><span class="d-lbl">Attente</span></div>'+
        '<div class="d-num"><span class="d-val dv-ok">'+valid+'</span><span class="d-lbl">Validées</span></div>'+
      '</div>'+
      '<div class="d-dot'+(wait>0?' w':total>0?' ok':'')+'"></div>'+
    '</div>';
  });
  grid.innerHTML = html;
  var alert = ge('h-alert');
  var atxt  = ge('h-alert-txt');
  if (alert) {
    if (totalWait > 0) {
      alert.classList.add('on');
      if (atxt) atxt.textContent = totalWait+' demande'+(totalWait>1?'s':'')+' en attente';
    } else {
      alert.classList.remove('on');
    }
  }
}

function dashClick(el) {
  var site = el.getAttribute('data-site');
  // Toggle: si déjà sélectionné, déselectionner
  var curSite = ge('f-site').value;
  var newSite = (curSite === site) ? '' : site;
  // Mettre à jour site actif (pour TeamGarantie, G.site reste '')
  ge('f-site').value = newSite;
  ge('h-site-name').textContent = newSite || 'Tous les sites';
  // Synchroniser site-bar boutons
  [].forEach.call(document.querySelectorAll('.s-btn'), function(b) {
    b.classList.toggle('active', b.textContent.trim() === newSite);
  });
  // Basculer sur l'historique
  [].forEach.call(document.querySelectorAll('.page'), function(p) { p.classList.remove('active'); });
  [].forEach.call(document.querySelectorAll('.nav-tab'), function(t) { t.classList.remove('active'); });
  ge('page-histo').classList.add('active');
  ge('tab-histo').classList.add('active');
  ge('type-bar').style.display = 'none';
  renderHisto();
  renderDash();
}

// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
// PANNEAU VALIDATION
// \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
function openSPFromBtn(btn) {
  var id = btn.getAttribute('data-id');
  openSP(id);
}

function openSP(id) {
  G.activeId = id;
  var d = G.demandes.find(function(x) { return x.id == id; });
  if (!d) return;
  var setText = function(elId, val) { var e=ge(elId); if(e) e.textContent=val||'—'; };
  setText('sp-sub',     d.type+' — OR '+d.or+' — '+d.date);
  setText('sp-site',    d.site);
  setText('sp-type',    d.type);
  setText('sp-or',      d.or);
  setText('sp-chassis', d.chassis);
  setText('sp-dom',     d.code_dommage);
  setText('sp-date',    d.date);
  var stat = ge('sp-statut');
  if (stat) stat.value = d.statut || 'En attente';
  var cmt = ge('sp-comment');
  if (cmt) cmt.value = d.commentaire_team || '';
  var pwd = ge('sp-pwd');
  if (pwd) pwd.value = '';
  var err = ge('sp-pwd-err');
  if (err) err.style.display = 'none';
  var c = d.commerce || {};
  ['mo','pi','moe','pe'].forEach(function(k) {
    var el = ge('c-'+k); if (el) el.value = c[k+'_de'] || '';
  });
  var ext = ge('c-type-ext');
  if (ext) ext.value = c.type_ext || '';
  var okBtn = ge('sp-ok-btn');
  if (okBtn) okBtn.disabled = false;
  onStatutChange();
  var spOv = ge('sp-overlay'); if(spOv) spOv.classList.add('open');
  var spPn = ge('side-panel'); if(spPn) spPn.classList.add('open');
  setTimeout(function() { var p=ge('sp-pwd'); if(p) p.focus(); }, 350);
}

function closeSP() {
  var spOv2 = ge('sp-overlay'); if(spOv2) spOv2.classList.remove('open');
  var spPn2 = ge('side-panel'); if(spPn2) spPn2.classList.remove('open');
  G.activeId = null;
  var okBtn = ge('sp-ok-btn'); if (okBtn) okBtn.disabled = false;
}

function onStatutChange() {
  var s = ge('sp-statut');
  var c = ge('sp-commerce');
  if (s && c) c.style.display = s.value==='Validée' ? 'block' : 'none';
}

function validerSP() {
  var okBtn = ge('sp-ok-btn');
  if (okBtn && okBtn.disabled) return;
  var pwd = ge('sp-pwd').value;
  if (pwd !== MOT_DE_PASSE) {
    ge('sp-pwd-err').style.display = 'block';
    ge('sp-pwd').focus();
    return;
  }
  ge('sp-pwd-err').style.display = 'none';
  if (okBtn) okBtn.disabled = true;

  var statut     = ge('sp-statut').value;
  var commentaire = ge('sp-comment').value.trim();
  var commerce = {
    mo_de:  ge('c-mo')  ? ge('c-mo').value  : '',
    pi_de:  ge('c-pi')  ? ge('c-pi').value  : '',
    moe_de: ge('c-moe') ? ge('c-moe').value : '',
    pe_de:  ge('c-pe')  ? ge('c-pe').value  : '',
    type_ext: ge('c-type-ext') ? ge('c-type-ext').value.trim() : ''
  };

  var d = G.demandes.find(function(x) { return x.id == G.activeId; });
  if (!d) { closeSP(); return; }

  var update = {
    statut: statut,
    commentaire_team: commentaire,
    commerce: statut==='Validée' ? commerce : (d.commerce||null)
  };

  var doSave = function() {
    if (demandesRef) {
      var key = 'd'+String(d.id).replace(/[^a-zA-Z0-9]/g,'');
      return demandesRef.child(key).update(update).catch(function(e){console.warn('Firebase update:',e);});
    } else {
      var idx = G.demandes.findIndex(function(x) { return x.id == G.activeId; });
      if (idx !== -1) Object.assign(G.demandes[idx], update);
      return Promise.resolve();
    }
  };

  doSave()
    .then(function() {
      closeSP(); renderHisto(); renderDash();
      toast('✔ Statut mis à jour : '+statut);
      // E-mail seulement si pas "En attente"
      if (d.email_usager && statut !== 'En attente') {
        sendStatusMail(d, statut, commentaire, commerce);
      }
    })
    .catch(function(err) {
      console.error(err);
      toast('❌ Erreur Firebase.');
      if (okBtn) okBtn.disabled = false;
    });
}

function sendStatusMail(d, statut, commentaire, commerce) {
  var icons = {'Validée':'✅','Refusée':'❌','Complément requis':'🔄','En attente':'🟡'};
  var ic = icons[statut] || '🔔';
  var sep = Array(41).join('-');
  var pecMsg = '';
  if (statut==='Validée' && commerce) {
    pecMsg = '\n\nPrise en charge accordée :\n';
    if(commerce.mo_de)  pecMsg += '- Main d oeuvre : '+commerce.mo_de+'%\n';
    if(commerce.pi_de)  pecMsg += '- Pieces        : '+commerce.pi_de+'%\n';
    if(commerce.moe_de) pecMsg += '- MO ext.       : '+commerce.moe_de+'%\n';
    if(commerce.pe_de)  pecMsg += '- Pieces ext.   : '+commerce.pe_de+'%\n';
    if(commerce.type_ext) pecMsg += '- Type ext.     : '+commerce.type_ext+'\n';
  }
  var body = 'Bonjour'+(d.technicien?' '+d.technicien:'')+',\n\n'
    +'Votre demande '+d.type+' a ete traitee.\n\n'
    +sep+'\nStatut : '+ic+' '+statut
    +'\nSite : '+d.site
    +'\nN OR : '+d.or
    +'\nChassis : '+d.chassis
    +(commentaire?'\nCommentaire : '+commentaire:'')
    +pecMsg+'\n'+sep+'\n\n'
    +(statut==='Validée'?'Vous pouvez proceder a la saisie dans SAGA/2.\n'
     :statut==='Refusée'?'Veuillez contacter la TeamGarantie.\n'
     :'Un complement de dossier est necessaire.\n')
    +'\nCordialement,\nTeam Garantie GEA - VW';
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      access_key: WEB3_KEY,
      subject: ic+' Demande '+d.type+' '+statut+' - OR '+d.or,
      message: body,
      from_name: 'Team Garantie GEA - VW',
      replyto: 'teamgarantie@geauto.fr'
    })
  })
  .then(function() { toast('Email envoye.'); })
  .catch(function() { toast('Statut OK mais email non envoye.'); });
}




// ═══════════════════════════════════════════════════════════
// SÉLECTION CATÉGORIE DOMMAGE
// ═══════════════════════════════════════════════════════════

function resetCascadeBelow(from) { resetBelow(from); }
function resetBelow(from) {
  // from: 'cat' -> efface rub+desig+dom
  //       'rub' -> efface desig+dom (PAS rub)
  //       'desig' -> efface dom seulement
  var levels = ['rub', 'desig', 'dom'];
  var start  = (from === 'cat') ? 0
             : (from === 'rub') ? 1
             : (from === 'desig') ? 2
             : 0;
  var ph = {
    rub:   'Rechercher une rubrique…',
    desig: 'Rechercher une désignation…',
    dom:   'Rechercher par code ou libéllé…'
  };
  for (var i = start; i < levels.length; i++) {
    var k = levels[i];
    ssState[k] = null;
    var valEl = ge(k + '-val');
    if (valEl) { valEl.value = ''; if (valEl.dataset) valEl.dataset.manual = ''; }
    var btnEl = ge('ss-' + k + '-btn');
    if (btnEl) {
      btnEl.classList.remove('filled');
      var t = btnEl.querySelector('.ss-txt');
      if (t) t.textContent = ph[k] || 'Sélectionner…';
    }
    var hEl = ge('ss-' + k + '-hint');
    if (hEl) { hEl.textContent = ''; hEl.className = 'hint'; }
  }
  // Effacer rub-val seulement si on repart de cat
  if (from === 'cat') {
    var rv = ge('rub-val'); if (rv) rv.value = '';
  }
}

function selectCat(btn) {
  [].forEach.call(document.querySelectorAll('.cat-btn'), function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var cat = btn ? btn.getAttribute('data-cat') : '';
  var ci = ge('dom-cat'); if (ci) ci.value = cat;
  var mr = ge('cat-manual-row'); if (mr) mr.classList.remove('show');
  var hint = ge('cat-hint');
  if (hint) { hint.textContent = '✔ ' + cat; hint.className = 'hint ok'; }
  // Reset toute la cascade sous catégorie
  resetBelow('cat');
  toast('✔ ' + cat);
}


function selectCatManual() {
  document.querySelectorAll('.cat-btn:not(.manual)').forEach(function(b){b.classList.remove('active');});
  var mr=ge('cat-manual-row'); if(mr)mr.classList.add('show');
  var mi=ge('cat-manual-inp'); if(mi){mi.value='';mi.focus();}
  var ci=ge('dom-cat'); if(ci)ci.value='';
  // Reset cascade et activer rubrique (liste complète sans filtre)
  ssState['rub']=null; var rv=ge('rub-val'); if(rv)rv.value='';
  ssResetDesig();
  var rubBtn=ge('ss-rub-btn');
  if(rubBtn){
    rubBtn.disabled=false; rubBtn.classList.remove('filled');
    var t=rubBtn.querySelector('.ss-txt');
    if(t)t.textContent='🔍 Sélectionner une rubrique…';
  }
  ssRender('rub','');
}

function catManualConfirm() {
  var mi = ge('cat-manual-inp');
  if(!mi || !mi.value.trim()){ toast('Saisissez une catégorie.'); return; }
  var cat = mi.value.trim();
  var ci = ge('dom-cat'); if(ci) ci.value = cat;
  var hint = ge('cat-hint');
  if(hint){ hint.textContent = '✔ Catégorie libre: '+cat; hint.className = 'hint ok'; }
  var mr = ge('cat-manual-row'); if(mr) mr.classList.remove('show');
  [].forEach.call(document.querySelectorAll('.cat-btn'), function(b){ b.classList.remove('active'); });
  var manBtn = document.querySelector('.cat-btn.manual'); if(manBtn) manBtn.classList.add('active');
  resetCascadeBelow('cat');
  toast('✔ Catégorie "'+cat+'" définie');
}



function resetCat() {
  [].forEach.call(document.querySelectorAll('.cat-btn'), function(b){ b.classList.remove('active'); });
  var ci = ge('dom-cat'); if(ci) ci.value = '';
  var mr = ge('cat-manual-row'); if(mr) mr.classList.remove('show');
  var hint = ge('cat-hint'); if(hint){ hint.textContent=''; hint.className='hint'; }
  resetCascadeBelow('cat');
}



// ═══════════════════════════════════════════════════════════
// SAISIE MANUELLE CODES DOM/AVA
// ═══════════════════════════════════════════════════════════
function ssManualInput(key, val) {
  var btn = ge('ss-'+key+'-btn');
  if (btn) btn.classList.toggle('filled', val.trim().length > 0);
}


function ssManualConfirmDesig() {
  var inp = ge('ss-desig-manual');
  if (!inp || !inp.value.trim()) { toast('Saisissez une désignation.'); return; }
  var raw = inp.value.trim();
  var rubVal = ge('rub-val') ? ge('rub-val').value : '';
  var k = rubVal + '|||' + raw;
  var codes = RUB_LABEL_CODES[k] || [];
  if (!codes.length) {
    // Chercher dans toutes les rubriques
    Object.keys(RUB_LABEL_CODES).forEach(function(k2){
      if(k2.split('|||')[1].toLowerCase()===raw.toLowerCase()) codes=codes.concat(RUB_LABEL_CODES[k2]);
    });
  }
  var dv=ge('desig-val'); if(dv){dv.value=raw;dv.dataset.manual='true';}
  ssState['desig']={code:raw,label:raw};
  var btn=ge('ss-desig-btn');
  if(btn){btn.classList.add('filled');var t=btn.querySelector('.ss-txt');if(t)t.textContent=raw;}
  var hint=ge('ss-desig-hint'); if(hint){hint.textContent='✔ '+raw;hint.className='hint ok';}
  var domBtn=ge('ss-dom-btn');
  if(domBtn){domBtn.disabled=false;
    var t2=domBtn.querySelector('.ss-txt');
    if(t2)t2.textContent=codes.length===1?codes[0]:'🔍 '+codes.length+' code(s)…';}
  ssReset('dom'); ssRender('dom','');
  if(codes.length===1){setTimeout(function(){ssPick('dom',codes[0],raw);},50);}
  inp.value=''; ssClose(); saveDraft();
  toast('✔ "'+raw+'" — '+codes.length+' code(s).');
}

function ssManualConfirmRub() {
  var inp = ge('ss-rub-manual');
  if (!inp || !inp.value.trim()) { toast('Saisissez une rubrique.'); return; }
  var raw = inp.value.trim();
  var rv = ge('rub-val'); if(rv) rv.value = raw;
  ssState['rub'] = {code:raw, label:raw};
  var btn=ge('ss-rub-btn');
  if(btn){btn.classList.add('filled');var t=btn.querySelector('.ss-txt');if(t)t.textContent=raw;}
  var hint=ge('ss-rub-hint'); if(hint){hint.textContent='✔ '+raw;hint.className='hint ok';}
  var dBtn=ge('ss-desig-btn');
  if(dBtn){dBtn.disabled=false;var t2=dBtn.querySelector('.ss-txt');
    if(t2)t2.textContent='🔍 Sélectionner une désignation…';}
  ssResetDesig();
  ssState['desig']=null; ssRender('desig','');
  inp.value=''; ssClose(); saveDraft();
  toast('✔ Rubrique "'+raw+'" définie.');
}
function ssManualConfirm(key) {
  var inp = ge('ss-'+key+'-manual');
  if (!inp) return;
  var raw = inp.value.trim();
  if (!raw) { toast('Saisissez un code.'); return; }
  // Valider: au moins 1 char, commence par lettre ou chiffre
  if (!/^[A-Za-z0-9].{0,19}$/.test(raw)) {
    toast('Code invalide — commencez par une lettre ou un chiffre.');
    return;
  }
  // Chercher un libellé dans la liste si code connu
  var items = ssData(key);
  var found = items.find(function(it) {
    return it.code.toLowerCase() === raw.toLowerCase();
  });
  var label = found ? found.label : '(saisie manuelle)';
  ssPick(key, raw.toUpperCase(), label);
  inp.value = '';
  toast('✔ Code ' + raw.toUpperCase() + ' enregistré.');
}


// ═══════════════════════════════════════════════════════════
// FORMULAIRE KULANZ DYNAMIQUE
// ═══════════════════════════════════════════════════════════

function toggleTpiField(show) {
  var f = ge('tpi-num-field'); if(f) f.style.display = show ? 'flex' : 'none';
}



function toggleVenduClient(val) {
  var w = ge('vendu-wrapper');
  if (!w) return;
  if (val === 'NON') {
    w.style.display = 'block';
  } else {
    w.style.display = 'none';
    // Reset les radios vendu_client
    var radios = document.querySelectorAll('[name="vendu_client"]');
    radios.forEach(function(r){ r.checked = false; });
    hideVenduAlert();
  }
}

function showVenduAlert() {
  var el = ge('vendu-alert');
  if (!el) return;
  var site  = ge('f-site') ? ge('f-site').value : '';
  var brand = SITE_BRAND[site] || 'VW';
  var brandKey = brand.toLowerCase();
  if (brandKey.indexOf('skoda') >= 0)      brandKey = 'skoda';
  else if (brandKey.indexOf('audi') >= 0)  brandKey = 'audi';
  else if (brandKey.indexOf('seat') >= 0)  brandKey = 'seat';
  else                                      brandKey = 'vw';

  var msgs = {
    vw:    "Le dernier entretien doit être vendu au client ET réalisé en même temps que la réparation pour maintenir l'éligibilité Kulanz VW.",
    audi:  "Le dernier entretien doit être vendu au client ET réalisé en même temps que la réparation. Il devra être réalisé chez Audi pour bénéficier des participations commerciales constructeur.",
    seat:  "Le dernier entretien doit être vendu au client ET réalisé en même temps que la réparation. Il devra être réalisé chez SEAT ou CUPRA pour bénéficier des participations commerciales.",
    skoda: "Le dernier entretien doit être vendu au client ET réalisé en même temps que la réparation selon les préconisations constructeur Skoda."
  };
  var msg = msgs[brandKey] || msgs.vw;

  el.style.display = 'block';
  el.innerHTML = '<div class="info-box" style="background:rgba(192,57,43,.07);border-color:rgba(192,57,43,.3);color:#8b1a1a;margin-top:4px">'
    + '⚠️ <strong>Attention</strong> — ' + msg
    + '</div>';
}

function hideVenduAlert() {
  var el = ge('vendu-alert');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
}


function enableAllDropdowns() {
  // Activer rubrique (liste complète)
  var rubBtn = ge('ss-rub-btn');
  if (rubBtn) {
    rubBtn.disabled = false;
    var rt = rubBtn.querySelector('.ss-txt');
    if (rt) rt.textContent = '🔍 Rechercher une rubrique…';
  }
  // Activer désignation (liste complète)
  var desigBtn = ge('ss-desig-btn');
  if (desigBtn) {
    desigBtn.disabled = false;
    var dt = desigBtn.querySelector('.ss-txt');
    if (dt) dt.textContent = '🔍 Rechercher une désignation…';
  }
  // Activer code dommage (liste complète)
  var domBtn = ge('ss-dom-btn');
  if (domBtn) {
    domBtn.disabled = false;
    var dmt = domBtn.querySelector('.ss-txt');
    if (dmt) dmt.textContent = '🔍 Rechercher par code ou libellé…';
  }
}

function renderKulanzForm(site) {
  var zone = ge('kulanz-questions');
  if (!zone) return;

  var brand = SITE_BRAND[site] || 'VW';
  var questions = KULANZ_BY_BRAND[brand] || KULANZ_BY_BRAND['VW'];

  var title = ge('kulanz-title');
  if (title) title.textContent = 'V\u00e9rifications KULANZ \u2014 ' + brand;

  var html = '';
  questions.forEach(function(q, idx) {

    // ── TPI ──
    if (q.name === 'tpi') {
      html += '<div class="field" style="margin-bottom:12px">'
        + '<label>' + q.label + '</label>'
        + '<div class="radio-g" style="gap:16px;margin-top:6px">'
        + '<label class="r-item"><input type="radio" name="tpi" value="OUI" onchange="checkKulanzNok();toggleTpiField(true)"> Oui</label>'
        + '<label class="r-item"><input type="radio" name="tpi" value="NON" onchange="checkKulanzNok();toggleTpiField(false)"> Non</label>'
        + '</div>'
        + '</div>'
        + '<div id="tpi-num-field" class="field" style="display:none;margin-top:8px">'
        + '<label>Num\u00e9ro de TPI</label>'
        + '<input type="text" name="num_tpi" placeholder="TPI-2025-0042">'
        + '</div>'
        + '<div class="divider"></div>';
      return;
    }

    // ── vendu_client : conditionnel selon la question pr\u00e9c\u00e9dente ──
    if (q.name === 'vendu_client') {
      // Trouver la question pr\u00e9c\u00e9dente (dernier_entretien ou dernier_entretien_audi ou entretien_moment)
      var prevQ = questions[idx - 1];
      var prevName = prevQ ? prevQ.name : '';
      var triggerId = 'vendu-wrapper';
      html += '<div id="' + triggerId + '" style="display:none">'
        + '<div class="field">'
        + '<label>' + q.label + '</label>'
        + '<div class="radio-g" style="gap:16px;margin-top:6px">'
        + '<label class="r-item"><input type="radio" name="vendu_client" value="OUI" onchange="checkKulanzNok();hideVenduAlert()"> Oui</label>'
        + '<label class="r-item"><input type="radio" name="vendu_client" value="NON" onchange="checkKulanzNok();showVenduAlert()"> Non</label>'
        + '</div>'
        + '</div>'
        + '<div id="vendu-alert" style="display:none"></div>'
        + '</div>';
      return;
    }

    var divider = '';
    var nokOui = q.nok === 'OUI' ? ' <small style="color:var(--red)">\u2192 NOK</small>' : '';
    var nokNon = q.nok === 'NON' ? ' <small style="color:var(--red)">\u2192 NOK</small>' : '';

    // Questions dernier_entretien* : d\u00e9clenchent l'affichage de vendu_client si NON
    var isDernierEntretien = (q.name === 'dernier_entretien' || q.name === 'dernier_entretien_audi' || q.name === 'entretien_moment');
    var onchangeExtra = isDernierEntretien ? ';toggleVenduClient(this.value)' : '';
    var triggerNok = q.nok ? ' onchange="checkKulanzNok()' + onchangeExtra + '"' : (isDernierEntretien ? ' onchange="toggleVenduClient(this.value)"' : '');

    if (q.has_nc) {
      html += '<div class="field" style="margin-bottom:12px">'
        + '<label>' + q.label + '</label>'
        + '<div class="radio-g" style="gap:16px;margin-top:6px">'
        + '<label class="r-item"><input type="radio" name="' + q.name + '" value="OUI"' + triggerNok + '> Oui' + nokOui + '</label>'
        + '<label class="r-item"><input type="radio" name="' + q.name + '" value="NON"' + triggerNok + '> Non' + nokNon + '</label>'
        + '<label class="r-item"><input type="radio" name="' + q.name + '" value="NC" onchange="checkKulanzNok()"> Non concerné</label>'
        + '</div>'
        + '</div>'
        + divider;
    } else {
      html += '<div class="field" style="margin-bottom:12px">'
        + '<label>' + q.label + '</label>'
        + '<div class="radio-g" style="gap:16px;margin-top:6px">'
        + '<label class="r-item"><input type="radio" name="' + q.name + '" value="OUI"' + triggerNok + '> Oui' + nokOui + '</label>'
        + '<label class="r-item"><input type="radio" name="' + q.name + '" value="NON"' + triggerNok + '> Non' + nokNon + '</label>'
        + '</div>'
        + '</div>'
        + divider;
    }
  });

  zone.innerHTML = html;

  var alertZone = ge('kulanz-nok-alert');
  if (alertZone) { alertZone.classList.remove('show'); alertZone.innerHTML = ''; }
}




// ═══════════════════════════════════════════════════════════
// KULANZ NOK — alerte + règles par marque
// ═══════════════════════════════════════════════════════════

var BRAND_TEXTS = {
  audi: {
    title: 'Règles Audi',
    text: 'Le dernier entretien doit avoir été réalisé chez Audi. S\'il est dû au moment de la réclamation, il devra être réalisé chez Audi pour pouvoir bénéficier des participations commerciales du constructeur.'
  },
  vw: {
    title: 'Règles VW VP / VW Véhicules Utilitaires',
    text: 'Le dernier entretien doit avoir été réalisé selon les préconisations constructeur. S\'il est dû au moment de la réclamation, il devra être réalisé chez VW ou VW VUL pour bénéficier des participations commerciales.'
  },
  skoda: {
    title: 'Règles Skoda',
    text: 'Le dernier entretien doit avoir été réalisé selon les préconisations constructeur. Il est nécessaire de fournir l\'avant-dernier entretien pour vérifier le respect des échéances (max 30 000 km / max 24 mois). En cas d\'entretien "à faire" au moment de la réclamation, les deux entretiens précédents devront être fournis.<br><br><strong>Simplification Skoda (oct. 2024) :</strong> En cas d\'utilisation admise du CIG, le Kulanz devient possible dès lors qu\'il est combiné avec un CIG dans une même participation commerciale.'
  },
  seat: {
    title: 'Règles SEAT / CUPRA',
    text: 'Le dernier entretien doit avoir été réalisé selon les préconisations constructeur. S\'il est dû au moment de la réclamation, il devra être réalisé chez SEAT ou CUPRA pour bénéficier des participations commerciales du constructeur.'
  }
};

function checkKulanzNok() {
  var zone = ge('kulanz-nok-alert');
  if (!zone) return;

  var site   = ge('f-site') ? ge('f-site').value : '';
  var brand  = SITE_BRAND[site] || 'VW';
  var questions = KULANZ_BY_BRAND[brand] || KULANZ_BY_BRAND['VW'];

  // Collecter les réponses et détecter les NOK
  var reasons = [];
  questions.forEach(function(q) {
    if (!q.nok) return;
    var val = gr(q.name);
    if (q.nok && val === q.nok && val !== 'NC') {
      reasons.push(q.info || q.label);
    }
  });

  if (!reasons.length) {
    zone.classList.remove('show');
    zone.innerHTML = '';
    return;
  }

  // Règles par marque (textes popup)
  var brandKey = brand.toLowerCase();
  if (brandKey.indexOf('skoda') >= 0) brandKey = 'skoda';
  else if (brandKey.indexOf('audi') >= 0) brandKey = 'audi';
  else if (brandKey.indexOf('seat') >= 0) brandKey = 'seat';
  else brandKey = 'vw';

  var reasonsHtml = reasons.map(function(r) { return '<p>' + esc(r) + '</p>'; }).join('');
  var brandHtml = '';
  if (BRAND_TEXTS && BRAND_TEXTS[brandKey]) {
    var b = BRAND_TEXTS[brandKey];
    brandHtml = '<div class="knok-brand">'
      + '<div class="knok-brand-title">' + b.title + '</div>'
      + '<div class="knok-brand-txt">' + b.text + '</div>'
      + '</div>';
  }

  zone.innerHTML = '<div class="knok-box">'
    + '<div class="knok-title">⚠ Kulanz non applicable dans l\'état actuel</div>'
    + '<div class="knok-body">'
    + '<p>L\'application des participations commerciales nécessite le contrôle de tous les services et entretiens conformément aux préconisations du constructeur.</p>'
    + '<p>Une participation commerciale peut être accordée avec un historique de service incomplet s\'il n\'y a pas de lien de causalité possible entre la réclamation client et le service manquant ou réalisé en retard.</p>'
    + '<p><mark>Si un entretien est <strong>"à faire"</strong> au moment de la réclamation</mark>, la participation commerciale ne peut être proposée qu\'après l\'achèvement préalable de l\'entretien.</p>'
    + '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(230,126,34,.3)">'
    + '<strong style="font-size:11px;color:#c0392b">Motif(s) de non-éligibilité :</strong>'
    + '<div style="margin-top:6px">' + reasonsHtml + '</div>'
    + '</div>'
    + brandHtml
    + '</div></div>';

  zone.classList.add('show');
}

