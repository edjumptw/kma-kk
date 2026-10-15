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

  // 頁尾列出全部協辦單位
  Array.prototype.forEach.call(document.querySelectorAll('.foot-partners'), function(el){
    if(!P.length) return;
    el.innerHTML = '<b>協辦單位</b><span></span>';
    el.querySelector('span').textContent = P.map(function(p){ return p.name; }).join('、');
    el.classList.remove('hidden');
  });

  if(!org) return;
  // 最上方導覽列：協辦單位放前面當主角，主辦協會放後面
  document.body.classList.add('has-partner');
  if(document.querySelector('.mbar')) document.body.classList.add('has-mbar');
  var brand = document.querySelector('.nav .brand');
  if(brand){
    brand.classList.add('with-partner');
    var host = brand.querySelector('span:last-child b');
    if(host) host.innerHTML = '社團法人<br class="m-br">高雄市行銷人協會';
    var pb = document.createElement('span'); pb.className = 'pb-partner';
    pb.innerHTML = '<small>協辦單位</small><b></b>'; pb.querySelector('b').textContent = org.name;
    var x = document.createElement('span'); x.className = 'pb-x'; x.textContent = '×';
    brand.insertBefore(x, brand.firstChild); brand.insertBefore(pb, brand.firstChild);
  }
  // 首屏標題上方：協辦單位會員專屬
  var h1 = document.querySelector('.hero h1');
  if(h1){
    var hp = document.createElement('p'); hp.className = 'hero-partner';
    hp.innerHTML = '<span>協辦單位</span><b></b><em>會員一律早鳥價</em>';
    hp.querySelector('b').textContent = org.name;
    h1.parentNode.insertBefore(hp, h1);
  }
  document.title = org.name + ' × ' + document.title;
  // 站內連結自動帶協會代碼，學員換頁後仍記得從哪個協會進來
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function(a){
    var h = a.getAttribute('href');
    if(!h || /^(#|https?:|mailto:|tel:|javascript:)/i.test(h) || /[?&]org=/.test(h)) return;
    var hash = '', i = h.indexOf('#'); if(i >= 0){ hash = h.slice(i); h = h.slice(0, i); }
    a.setAttribute('href', h + (h.indexOf('?') >= 0 ? '&' : '?') + 'org=' + encodeURIComponent(org.code) + hash);
  });
})();
