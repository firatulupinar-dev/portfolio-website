/* Case study template scripts, shared by every case study page.
   1) Stage rail beside the scrollbar: one marker per stage in the system map (.lp-map), placed at the stage's
      real position on the page; the rail fills as you scroll and the current stage shows its label.
   2) Work-sample stepper ([data-jx]): a tab (or the peeking card) brings a sample into focus. */
(function(){
  /* stages come from the system map on case studies, or from sections marked data-rail="Label" on other pages */
  var map = document.querySelector('.lp-map');
  var marked = [].slice.call(document.querySelectorAll('[data-rail]'));
  if(!map && !marked.length) return;
  var items = map
    ? [].map.call(map.querySelectorAll('a[href^="#"]'), function(a){
        var n = a.querySelector('.lp-n'), name = a.querySelector('.lp-name');
        return {id: a.getAttribute('href').slice(1), label: (n ? n.textContent + ' &middot; ' : '') + (name ? name.textContent : '')};
      })
    : marked.map(function(el, i){ return {id: el.id, label: (i < 9 ? '0' : '') + (i + 1) + ' &middot; ' + el.getAttribute('data-rail')}; });
  var rail = document.createElement('div');
  rail.className = 'lp-rail'; rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<div class="lp-rail-track"><div class="lp-rail-fill"></div></div>';
  document.body.appendChild(rail);
  var fill = rail.querySelector('.lp-rail-fill'), track = rail.querySelector('.lp-rail-track');
  var stages = items.map(function(it){
    var el = it.id && document.getElementById(it.id); if(!el) return null;
    var m = document.createElement('a');
    m.className = 'lp-rail-mark'; m.href = '#' + it.id; m.tabIndex = -1;
    m.innerHTML = '<span class="lp-rail-label">' + it.label + '</span>';
    track.appendChild(m);
    return {el: el, mark: m};
  }).filter(Boolean);
  if(!stages.length) return;
  var header = document.querySelector('header');
  function layout(){
    rail.style.top = (header ? header.getBoundingClientRect().height : 62) + 'px';
    var doc = document.documentElement.scrollHeight;
    stages.forEach(function(s){ s.mark.style.top = ((s.el.getBoundingClientRect().top + window.scrollY) / doc * 100) + '%'; });
    update();
  }
  function update(){
    var doc = document.documentElement.scrollHeight, vh = window.innerHeight;
    fill.style.transform = 'scaleY(' + Math.min(1, Math.max(0, window.scrollY / (doc - vh))) + ')';
    var line = vh * 0.4, cur = -1;
    stages.forEach(function(s, i){ if(s.el.getBoundingClientRect().top <= line) cur = i; });
    var last = stages[stages.length - 1].el.getBoundingClientRect();
    if(last.bottom < line) cur = -1;
    stages.forEach(function(s, i){
      s.mark.classList.toggle('is-current', i === cur);
      s.mark.classList.toggle('is-done', cur > -1 ? i < cur : last.bottom < line);
    });
    rail.classList.toggle('is-reading', cur > -1);
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
})();

(function(){
  [].forEach.call(document.querySelectorAll('[data-jx]'), function(box){
    var tabs = [].slice.call(box.querySelectorAll('.jx-tab'));
    var slides = [].slice.call(box.querySelectorAll('.jx-slide'));
    var track = box.querySelector('.jx-track');
    if(!slides.length) return;
    function go(i){
      i = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach(function(s, j){ s.classList.toggle('is-active', j === i); s.setAttribute('aria-hidden', j === i ? 'false' : 'true'); });
      tabs.forEach(function(t, j){ t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      track.style.transform = 'translateX(' + (slides[0].offsetLeft - slides[i].offsetLeft) + 'px)';
      if(tabs[i]){ var row = tabs[i].parentNode; if(row.scrollWidth > row.clientWidth) row.scrollTo({left: tabs[i].offsetLeft - tabs[0].offsetLeft, behavior:'smooth'}); }
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ go(i); });
      t.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){ e.preventDefault(); var n = i + (e.key === 'ArrowRight' ? 1 : -1); if(tabs[n]){ go(n); tabs[n].focus(); } }
      });
    });
    slides.forEach(function(s, i){ s.addEventListener('click', function(){ if(!s.classList.contains('is-active')) go(i); }); });
    window.addEventListener('resize', function(){ var a = slides.findIndex(function(s){ return s.classList.contains('is-active'); }); go(a < 0 ? 0 : a); });
    go(0);
  });
})();

/* shared viewer for [data-ib] samples: one dialog, a dimmed backdrop, close on click outside, the X or Esc.
   Tall samples (emails, pages) open at reading width and scroll; wide ones (ads) fit the screen. */
var openViewer = (function(){
  var dlg, box, big, cap, opener;
  function build(){
    dlg = document.createElement('dialog'); dlg.className = 'ib-lb';
    dlg.innerHTML = '<div class="ib-lb-box"><p class="ib-lb-cap"></p><img alt=""></div><button type="button" class="ib-lb-x" aria-label="Close">&times;</button>';
    document.body.appendChild(dlg);
    box = dlg.querySelector('.ib-lb-box'); big = dlg.querySelector('img'); cap = dlg.querySelector('.ib-lb-cap');
    dlg.querySelector('.ib-lb-x').addEventListener('click', function(){ dlg.close(); });
    dlg.addEventListener('click', function(e){ if(e.target !== big) dlg.close(); });
    dlg.addEventListener('close', function(){ document.documentElement.classList.remove('ib-lb-open'); if(opener) opener.focus({preventScroll: true}); });
  }
  return function(img, label, from){
    if(!dlg) build();
    opener = from;
    var tall = img.naturalHeight / Math.max(1, img.naturalWidth) > 1.3;
    dlg.classList.toggle('is-tall', tall);
    big.src = img.currentSrc || img.src; big.alt = img.alt; cap.textContent = label;
    dlg.setAttribute('aria-label', label);
    document.documentElement.classList.add('ib-lb-open');
    dlg.showModal(); dlg.scrollTop = 0;
  };
})();
/* 3) Inbox-style email browser ([data-ib]): picking an email in the list swaps it into the scrolling pane. */
(function(){
  [].forEach.call(document.querySelectorAll('[data-ib]'), function(ib){
    var items = [].slice.call(ib.querySelectorAll('.ib-item'));
    var pane = ib.querySelector('.ib-pane'), img = pane.querySelector('img');
    var badge = ib.querySelector('.ib-badge'), title = ib.querySelector('.ib-title');
    function pick(i, focus){
      var it = items[i];
      items.forEach(function(x){ x.setAttribute('aria-selected', x === it ? 'true' : 'false'); x.tabIndex = x === it ? 0 : -1; });
      img.src = it.getAttribute('data-src'); img.alt = it.getAttribute('data-alt');
      badge.textContent = badge.dataset.b = it.getAttribute('data-badge');
      title.textContent = it.getAttribute('data-title') || it.querySelector('b').textContent;
      pane.scrollTop = 0;
      renderJumps(it.getAttribute('data-jumps'));
      if(focus) it.focus();
      if(window.matchMedia('(max-width:820px)').matches) it.scrollIntoView({block:'nearest', inline:'nearest'});
    }

    /* long samples: a reading-progress bar, a back-to-top button, and optional section chips
       (data-jumps="Label:0.25|Label:0.5", positions as a fraction of the image height) */
    var view = ib.querySelector('.ib-view');
    var prog = document.createElement('div'); prog.className = 'ib-prog'; prog.innerHTML = '<span></span>';
    pane.parentNode.insertBefore(prog, pane);
    var jumps = document.createElement('div'); jumps.className = 'ib-jumps'; jumps.setAttribute('aria-label', 'Jump to a section');
    prog.parentNode.insertBefore(jumps, prog);
    var up = document.createElement('button'); up.type = 'button'; up.className = 'ib-top'; up.setAttribute('aria-label', 'Back to the top of the sample'); up.innerHTML = '&uarr;';
    view.appendChild(up);
    up.addEventListener('click', function(){ pane.scrollTo({top: 0, behavior: 'smooth'}); });
    function onScroll(){
      var max = pane.scrollHeight - pane.clientHeight, f = max > 0 ? pane.scrollTop / max : 0;
      prog.firstChild.style.width = (f * 100) + '%';
      up.classList.toggle('is-on', pane.scrollTop > pane.clientHeight);
      var on = null;
      [].forEach.call(jumps.children, function(b){ if(img.offsetHeight * parseFloat(b.dataset.at) <= pane.scrollTop + 40) on = b; });
      [].forEach.call(jumps.children, function(b){ if(b === on && !b.classList.contains('is-on')) jumps.scrollTo({left: Math.max(0, b.offsetLeft - jumps.offsetLeft - 60), behavior: 'smooth'}); b.classList.toggle('is-on', b === on); });
    }
    pane.addEventListener('scroll', onScroll, {passive: true});
    function renderJumps(spec){
      jumps.innerHTML = ''; jumps.hidden = !spec;
      if(spec) spec.split('|').forEach(function(s){
        var p = s.split(':'), b = document.createElement('button');
        b.type = 'button'; b.textContent = p[0]; b.dataset.at = p[1];
        b.addEventListener('click', function(){ pane.scrollTo({top: Math.max(0, img.offsetHeight * parseFloat(p[1]) - 12), behavior: 'smooth'}); });
        jumps.appendChild(b);
      });
      onScroll();
    }
    renderJumps((items.filter(function(x){ return x.getAttribute('aria-selected') === 'true'; })[0] || items[0]).getAttribute('data-jumps'));

    /* click-to-enlarge: clicking the sample opens it bigger over a softly dimmed page */
    var hint = ib.querySelector('.ib-hint');
    if(!hint){ hint = document.createElement('span'); hint.className = 'ib-hint'; ib.querySelector('.ib-bar').appendChild(hint); }
    hint.textContent = (hint.textContent ? hint.textContent + ' \u00b7 ' : '') + 'Click to enlarge';
    img.addEventListener('click', function(){ openViewer(img, title.textContent, pane); });
    pane.addEventListener('keydown', function(e){ if((e.key === 'Enter' || e.key === ' ') && e.target === pane){ e.preventDefault(); openViewer(img, title.textContent, pane); } });
    items.forEach(function(it, i){
      it.tabIndex = i ? -1 : 0;
      it.addEventListener('click', function(){ pick(i); });
      it.addEventListener('keydown', function(e){
        var k = e.key, d = (k === 'ArrowDown' || k === 'ArrowRight') ? 1 : (k === 'ArrowUp' || k === 'ArrowLeft') ? -1 : 0;
        if(d){ e.preventDefault(); pick((i + d + items.length) % items.length, true); }
      });
    });
  });
})();
