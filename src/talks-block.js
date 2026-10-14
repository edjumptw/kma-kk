/* 課程頁與首頁的「免費線上分享會」區塊：依 window.TALKS 產生，已結束的場次自動隱藏 */
(function(){
  var T = window.TALKS || {}, box = document.getElementById('talk-list');
  if(!box) return;
  var only = box.getAttribute('data-course') || 'all';
  var base = box.getAttribute('data-base') || '';
  var now = new Date();
  var q = new URLSearchParams(location.search), keep = '';
  ['ref','refc','utm_source','utm_medium','utm_campaign'].forEach(function(k){ if(q.get(k)) keep += '&'+k+'='+encodeURIComponent(q.get(k)); });
  var list = (T.sessions||[]).filter(function(s){
    return (only==='all' || s.course===only) && new Date(s.end) >= now;
  });
  var sec = box.closest('section');
  if(!list.length){ if(sec) sec.classList.add('hidden'); return; }
  list.forEach(function(s){
    var c = (T.courses||{})[s.course] || {};
    var a = document.createElement('a');
    a.className = 'talk';
    a.href = base + 'talks/?s=' + s.id + keep + '#signup';
    a.innerHTML = '<div><b>'+s.date+'　'+s.time+'</b>'+
      '<span>'+(only==='all' ? c.name+'｜' : '')+'線上分享會（Zoom）'+(s.tag ? '｜'+s.tag : '')+'</span></div>'+
      '<span class="flag">免費報名</span>';
    box.appendChild(a);
  });
  var more = document.getElementById('talk-more');
  if(more) more.href = base + 'talks/' + (only==='all' ? '' : '?c='+only) + (keep ? (only==='all' ? '?' : '&') + keep.slice(1) : '') + '#signup';
})();
