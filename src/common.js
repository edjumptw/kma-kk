(function(){
  var C = window.COURSE || {};
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* ---- 場次：銷售區塊與表單選項由同一份設定產生 ---- */
  // 規則：end（結束日 YYYY-MM-DD）已過的場次自動隱藏；tbd:true 代表日期確認中、先登記
  var list = $('#session-list'), opts = $('#session-opts');
  var today = new Date(); today.setHours(0,0,0,0);
  var strip = function(h){return String(h||'').replace(/<[^>]+>/g,'')};

  /* ---- 價格規則：開課前 4 週以上＝早鳥價；3 週以上＝晚鳥價；其餘＝一般價（定價）
         協會及協辦單位會員一律早鳥價；團體報名一律晚鳥價 ---- */
  var P = C.price || {};
  var TN = {early:'早鳥價', late:'晚鳥價', regular:'一般價（定價）'};
  var DAY = 864e5;
  var startOf = function(s){ return s.start ? new Date(s.start+'T00:00:00') : null; };
  // 場次可用 earlyUntil／lateUntil 指定早鳥、晚鳥最後一天（含當天）；沒填才用 4 週／3 週規則
  var dayOf = function(v){ return v ? new Date(v+'T00:00:00') : null; };
  var tierOf = function(s){
    if(s.earlyUntil || s.lateUntil){
      var e=dayOf(s.earlyUntil), l=dayOf(s.lateUntil);
      if(e && today<=e) return 'early';
      if(l && today<=l) return 'late';
      return 'regular';
    }
    var st=startOf(s); if(!st) return 'regular';
    var days=Math.round((st-today)/DAY);
    return days>=28?'early':(days>=21?'late':'regular');
  };
  var money = function(t){ return P[t] ? 'NT$'+Number(P[t]).toLocaleString('en-US') : '<em class="ph">【'+TN[t]+'金額待確認】</em>'; };
  var md = function(d){ return (d.getMonth()+1)+'/'+d.getDate(); };
  var deadlineText = function(s,t){
    if(t==='early' && s.earlyUntil) return '早鳥價報名至 '+md(dayOf(s.earlyUntil))+' 23:59';
    if(t==='late' && s.lateUntil) return '晚鳥價報名至 '+md(dayOf(s.lateUntil))+' 23:59';
    var st=startOf(s); if(!st) return '';
    if(t==='early') return '早鳥價報名至 '+md(new Date(st-28*DAY));
    if(t==='late') return '晚鳥價報名至 '+md(new Date(st-21*DAY));
    return '';
  };
  if($('#tp-early')) $('#tp-early').innerHTML = money('early');
  if($('#tp-late')) $('#tp-late').innerHTML = money('late');
  var live = (C.sessions||[]).filter(function(s){ return !s.end || new Date(s.end+'T23:59:59') >= today; });
  var regions = [];
  live.forEach(function(s){ if(regions.indexOf(s.region)<0) regions.push(s.region); });
  regions.forEach(function(r){
    var items = live.filter(function(s){return s.region===r});
    var ks = /高雄/.test(r);
    if(list){
      var g=document.createElement('div'); g.className='sgroup';
      g.innerHTML='<h4>'+r+(items[0].note?' <small>'+items[0].note+'</small>':'')+'</h4>';
      items.forEach(function(s){
        var d=document.createElement('div');
        d.className='session'+(ks?' ks':'')+(s.tbd?' tbd':'');
        var t=tierOf(s), dl=deadlineText(s,t);
        var priceLine = s.tbd ? '' : '<span class="now">目前報名：<b>'+TN[t]+' '+money(t)+'</b>'+(dl?'｜'+dl:'')+'</span>';
        d.innerHTML='<div><b>'+s.date+'</b><span>'+s.time+'<br>'+s.place+'</span>'+priceLine+'</div><span class="flag">'+(s.tbd?'先登記':(ks?'高雄場':'報名中'))+'</span>';
        g.appendChild(d);
      });
      list.appendChild(g);
    }
    if(opts){
      var t=document.createElement('div'); t.className='opt-group-title'; t.textContent=r; opts.appendChild(t);
      items.forEach(function(s){
        var l=document.createElement('label'); l.className='opt';
        var val=r+'｜'+strip(s.date)+'｜'+strip(s.place)+(s.tbd?'｜先登記':'');
        l.innerHTML='<input type="radio" name="session" value="'+val.replace(/"/g,'&quot;')+'" data-tbd="'+(s.tbd?1:0)+'" data-idx="'+live.indexOf(s)+'" required><span><b>'+s.date+'</b><br><small class="addr">'+s.time+'｜'+s.place+'</small></span>';
        opts.appendChild(l);
      });
    }
  });

  /* ---- 表單互動 ---- */
  var form = $('#signup-form');
  if(form){
    var inv = function(){
      var v=(form.querySelector('input[name="invoiceType"]:checked')||{}).value;
      $('#inv-company').classList.toggle('hidden', v!=='三聯式（公司）');
      $$('#inv-company input').forEach(function(x){x.required = (v==='三聯式（公司）')});
    };
    $$('input[name="invoiceType"]',form).forEach(function(r){r.addEventListener('change',inv)}); inv();
    var diet = function(){
      var v=(form.querySelector('input[name="diet"]:checked')||{}).value;
      $('#diet-other').classList.toggle('hidden', v!=='其他');
    };
    $$('input[name="diet"]',form).forEach(function(r){r.addEventListener('change',diet)}); diet();

    // 報名方案與適用價格：依「身分」＋「報名當天距開課週數」自動計算，顯示在方案下方與送出按鈕前
    var nt = function(n){ return 'NT$'+Number(n).toLocaleString('en-US'); };
    var applied = function(){
      var sEl=form.querySelector('input[name="session"]:checked');
      var plan=(form.querySelector('input[name="plan"]:checked')||{}).value||'個人報名';
      if(!sEl) return null;
      var s=live[+sEl.getAttribute('data-idx')];
      var dateTier=tierOf(s), t, reason;
      if(plan==='協會會員'){ t='early'; reason='協會及協辦單位會員不論何時報名，一律早鳥價（會員資格由協會核對）'; }
      else if(plan==='團體報名'){
        if(dateTier==='early'){ t='early'; reason='目前仍在早鳥期，團體報名同樣適用早鳥價'+(deadlineText(s,'early')?'（'+deadlineText(s,'early')+'）':'')+'，金額為每人費用'; }
        else { t='late'; reason='團體報名（2 人以上）不論何時報名，至少享晚鳥價，金額為每人費用'; }
      }
      else {
        t=dateTier;
        var dl=deadlineText(s,t);
        var fixed = s.earlyUntil || s.lateUntil;
        reason = t==='early' ? (fixed?'目前為早鳥報名期間，適用早鳥價':'開課前 4 週以上報名，適用早鳥價')+(dl?'（'+dl+'）':'')
               : t==='late' ? (fixed?'目前為晚鳥報名期間，適用晚鳥價':'開課前 3 週以上報名，適用晚鳥價')+(dl?'（'+dl+'）':'')
               : (fixed?'早鳥、晚鳥報名期間已結束，適用一般價（定價）':'距開課已不到 3 週，適用一般價（定價）');
      }
      var amt=P[t]||null, save=(amt&&P.regular)?P.regular-amt:0;
      return {tier:t, plan:plan, session:strip(s.date)+'｜'+strip(s.place), amount:amt, save:save, reason:reason,
              text:TN[t]+' '+(amt?nt(amt):'金額待確認'), html:TN[t]+' '+money(t)};
    };
    var priceUpd = function(){
      var plan=(form.querySelector('input[name="plan"]:checked')||{}).value;
      var g=$('#group-field'); if(g){ g.classList.toggle('hidden', plan!=='團體報名'); $('#f-group').required = (plan==='團體報名'); }
      var a=applied(), box=$('#price-summary'), card=$('#order-summary'), btn=$('#submit-btn');
      if(box){ box.innerHTML = a ? '依目前選擇，你的報名費用是 <b>'+a.html+'</b>'+(a.save>0?'，比定價省 '+nt(a.save):'')+'<br><small>'+a.reason+'</small>' : '請先選擇場次，系統會自動計算你的報名費用。'; }
      if(card){
        if(!a){ card.innerHTML='<div class="os-empty">選擇場次與報名方案後，這裡會顯示你要繳的金額。</div>'; }
        else {
          card.innerHTML='<div class="os-head">報名費用確認</div>'+
            '<div class="os-row"><span>課程</span><b>'+(C.courseName||'')+'</b></div>'+
            '<div class="os-row"><span>場次</span><b>'+a.session+'</b></div>'+
            '<div class="os-row"><span>報名方案</span><b>'+a.plan+'</b></div>'+
            '<div class="os-row"><span>適用價格</span><b>'+TN[a.tier]+'</b></div>'+
            (P.regular?'<div class="os-row"><span>定價</span><b>'+nt(P.regular)+'</b></div>':'')+
            '<div class="os-total"><span>應繳金額'+(a.plan==='團體報名'?'（每人）':'')+'</span><strong>'+(a.amount?nt(a.amount):money(a.tier))+'</strong></div>'+
            (a.save>0?'<div class="os-save">比定價省 '+nt(a.save)+'</div>':'')+
            '<p class="os-note">'+a.reason+'。送出後協會寄送繳費連結（線上刷卡或匯款），請於 3 天內完成繳費。</p>';
        }
      }
      if(btn && !btn.disabled){ btn.textContent = a&&a.amount ? '確認送出報名（應繳 '+nt(a.amount)+(a.plan==='團體報名'?'／人':'')+'）' : '送出報名'; }
      var mb=$('.mbar .p b'); if(mb && a && a.amount){ mb.textContent='你的價格 '+nt(a.amount); }
    };
    $$('input[name="plan"],input[name="session"]',form).forEach(function(r){r.addEventListener('change',priceUpd)}); priceUpd();

    // UTM / 來源追蹤
    var q=new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','ref'].forEach(function(k){
      var h=form.querySelector('input[name="'+k+'"]'); if(h) h.value=q.get(k)||'';
    });
    // 推薦連結：網址帶 ?ref=推薦人姓名（可加 &refc=手機或推薦碼）會自動帶入推薦人欄位
    if(q.get('ref') && $('#f-referrer') && !$('#f-referrer').value) $('#f-referrer').value=q.get('ref');
    if(q.get('refc') && $('#f-referrer-phone') && !$('#f-referrer-phone').value) $('#f-referrer-phone').value=q.get('refc');

    var rules = {
      name: function(v){return v.trim().length>=2},
      mobile: function(v){return /^09\d{8}$/.test(v.replace(/[\s-]/g,''))},
      email: function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())},
      taxId: function(v){return /^\d{8}$/.test(v.trim())}
    };
    var check = function(el){
      var f=el.closest('.field'); if(!f) return true;
      var ok = el.checkValidity();
      if(ok && rules[el.name] && (el.required || el.value)) ok = rules[el.name](el.value);
      f.classList.toggle('invalid', !ok); return ok;
    };
    $$('input,select,textarea',form).forEach(function(el){
      el.addEventListener('blur',function(){ if(el.type!=='radio'&&el.type!=='checkbox') check(el)});
      if(el.type==='radio') el.addEventListener('change',function(){ var f=el.closest('.field'); if(f) f.classList.remove('invalid'); });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok=true, first=null;
      $$('input,select,textarea',form).forEach(function(el){
        if(el.type==='hidden'||el.closest('.hidden')) return;
        var good = (el.type==='radio'||el.type==='checkbox') ? el.checkValidity() : check(el);
        if(el.type==='radio' && el.closest('.field')) el.closest('.field').classList.toggle('invalid', !good);
        if(!good){ ok=false; if(!first) first=el; }
      });
      if(!ok){ alertBox('請檢查標示紅字的欄位，以及是否已勾選同意事項。'); (first.closest('.field')||first).scrollIntoView({behavior:'smooth',block:'center'}); return; }

      var btn=$('#submit-btn'); btn.disabled=true; btn.textContent='送出中…';
      var fd=new FormData(form);
      fd.append('course', C.courseName||'');
      var ap=applied(); fd.append('priceApplied', ap?ap.text:'');
      fd.append('submittedAt', new Date().toLocaleString('zh-TW',{hour12:false}));
      fd.append('page', location.href);
      var body=new URLSearchParams(fd);

      var done=function(){
        form.classList.add('hidden');
        var t=$('#thanks'); t.classList.remove('hidden');
        $('#thanks-name').textContent = fd.get('name');
        $('#thanks-session').textContent = fd.get('session');
        if($('#thanks-price')) $('#thanks-price').textContent = fd.get('priceApplied')||'';
        var chosen = form.querySelector('input[name="session"]:checked');
        var isTbd = chosen && chosen.getAttribute('data-tbd')==='1';
        $('#thanks-steps').classList.toggle('hidden', isTbd);
        $('#thanks-tbd').classList.toggle('hidden', !isTbd);
        t.scrollIntoView({behavior:'smooth',block:'start'});
        if(window.gtag) gtag('event','generate_lead',{course:C.courseName});
        if(window.fbq) fbq('track','Lead');
      };
      if(!C.endpoint){ console.warn('[報名表] 尚未設定 COURSE.endpoint，資料未送出（展示模式）。'); setTimeout(done,500); return; }
      fetch(C.endpoint,{method:'POST',mode:'no-cors',body:body})
        .then(done)
        .catch(function(){ btn.disabled=false; priceUpd(); alertBox('網路連線異常，請稍後再試，或直接聯繫協會。'); });
    });
  }
  function alertBox(msg){
    var b=$('#form-msg'); if(!b) return; b.textContent=msg; b.classList.remove('hidden');
    setTimeout(function(){b.classList.add('hidden')},6000);
  }

  /* ---- 手機底部 CTA：滑過 Hero 出現，進入報名區隱藏 ---- */
  var bar=$('.mbar'), hero=$('.hero'), sign=$('#signup');
  if(bar && 'IntersectionObserver' in window){
    var heroOut=false, signIn=false;
    var upd=function(){bar.classList.toggle('show', heroOut && !signIn)};
    new IntersectionObserver(function(es){heroOut=!es[0].isIntersecting;upd()}).observe(hero);
    new IntersectionObserver(function(es){signIn=es[0].isIntersecting;upd()},{threshold:0.05}).observe(sign);
  }

  /* ---- 學員影片：正式網站（https）在頁面內播放；本機檔案或預覽環境 YouTube 不允許內嵌，改開新分頁到 YouTube 播放 ---- */
  var canEmbed = location.protocol==='https:' && (function(){ try{ return window.self===window.top; }catch(e){ return false; } })();
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt'), url='https://www.youtube.com/watch?v='+id;
    v.setAttribute('role','button'); v.setAttribute('tabindex','0'); v.setAttribute('aria-label','播放學員影片');
    var play=function(){
      if(!canEmbed){ window.open(url,'_blank','noopener'); return; }
      if(v.classList.contains('on')) return;
      v.classList.add('on');
      v.innerHTML='<iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="學員影片"></iframe>';
    };
    v.addEventListener('click',play);
    v.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); play(); } });
  });

  /* ---- 進場動畫 ---- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    $$('.reveal').forEach(function(el){io.observe(el)});
  } else { $$('.reveal').forEach(function(el){el.classList.add('in')}); }
})();
