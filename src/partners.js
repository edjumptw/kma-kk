/* 協辦協會：專屬網址（?org=代碼）顯示協辦單位、站內連結自動帶代碼、報名表「推薦單位」下拉選單自動帶入 */
(function(){
  var P = (window.PARTNERS && window.PARTNERS.list || []).filter(function(p){ return p.active; });
  var byCode = {}; P.forEach(function(p){ byCode[p.code] = p; });
  var q = new URLSearchParams(location.search);
  var code = q.get('org') || '';
  try {
    if(code && byCode[code]) sessionStorage.setItem('tma_org', code);
    else if(!code) code = sessionStorage.getItem('tma_org') || '';
  } catch(e){}
  var org = byCode[code] || null;

  // 下拉選單（課程報名表與分享會報名表）
  Array.prototype.forEach.call(document.querySelectorAll('.partner-field'), function(box){
    var sel = box.querySelector('select'), hid = box.querySelector('input[type="hidden"]'),
        otherWrap = box.querySelector('.partner-other'), other = otherWrap && otherWrap.querySelector('input');
    if(!P.length){ box.classList.add('hidden'); return; }
    P.forEach(function(p){ var o = document.createElement('option'); o.value = p.name; o.textContent = p.name; sel.insertBefore(o, sel.lastElementChild); });
    if(org) sel.value = org.name;
    var form = box.closest('form');
    var sync = function(){
      var v = sel.value;
      if(otherWrap) otherWrap.classList.toggle('hidden', v !== '其他');
      hid.value = v === '其他' ? ('其他' + (other && other.value.trim() ? '：' + other.value.trim() : '')) : v;
      // 試算表尚未更新欄位前的備援：來源欄沒有值時，記在 utm_source
      var u = form && form.querySelector('input[name="utm_source"]');
      if(u && !q.get('utm_source')) u.value = hid.value ? '推薦單位-' + hid.value : '';
    };
    sel.addEventListener('change', sync); if(other) other.addEventListener('input', sync); sync();
  });

  if(!org) return;
  // 頁面上方顯示協辦單位
  var nav = document.querySelector('.nav');
  if(nav){
    var bar = document.createElement('div');
    bar.className = 'partner-bar';
    bar.innerHTML = '<div class="wrap">協辦單位｜<b></b></div>';
    bar.querySelector('b').textContent = org.name;
    nav.parentNode.insertBefore(bar, nav.nextSibling);
  }
  // 站內連結自動帶協會代碼，學員換頁後仍記得從哪個協會進來
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function(a){
    var h = a.getAttribute('href');
    if(!h || /^(#|https?:|mailto:|tel:|javascript:)/i.test(h) || /[?&]org=/.test(h)) return;
    var hash = '', i = h.indexOf('#'); if(i >= 0){ hash = h.slice(i); h = h.slice(0, i); }
    a.setAttribute('href', h + (h.indexOf('?') >= 0 ? '&' : '?') + 'org=' + encodeURIComponent(org.code) + hash);
  });
})();
