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
