/* Case study roadmap: the workstream nav follows the reader.
   As each section reaches the middle of the screen, its workstream becomes active.
   Links jump directly to each area of the marketing system. */
(function(){
  var nav = document.querySelector('.rm-nav');
  if(!nav || !('IntersectionObserver' in window)) return;
  var isWorkstreams = nav.classList.contains('rm-nav-workstreams');
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });

  function activate(id){
    var hit = -1;
    links.forEach(function(a, i){
      var on = a.getAttribute('href') === '#' + id;
      if(on) hit = i;
      a.classList.toggle('is-active', on);
      if(on) a.setAttribute('aria-current', isWorkstreams ? 'location' : 'step'); else a.removeAttribute('aria-current');
      if(on && a.parentNode.parentNode.scrollWidth > a.parentNode.parentNode.clientWidth){ var ol = a.parentNode.parentNode; ol.scrollTo({ left: a.parentNode.offsetLeft - (ol.clientWidth - a.parentNode.offsetWidth) / 2, behavior: 'smooth' }); }
    });
    links.forEach(function(a, i){ a.classList.toggle('is-passed', !isWorkstreams && hit > -1 && i < hit); });
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) activate(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(function(t){ if(t) io.observe(t); });
  activate(targets[0] && targets[0].id);
})();
