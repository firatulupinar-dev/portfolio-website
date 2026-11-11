/* Case study work samples: click a sample to see it full size.
   To add a sample, replace an empty slot with:
     <figure class="rm-sample">
       <button type="button" class="rm-sample-frame"><img src="../images/cases/your-file.jpg" alt="What the image shows"></button>
       <figcaption>Short caption</figcaption>
     </figure>
   Arrow keys move between samples, Esc (or a click outside) closes the viewer. */
(function(){
  var buttons = [].slice.call(document.querySelectorAll('.rm-sample:not(.is-empty) .rm-sample-frame'));
  if(!buttons.length || typeof HTMLDialogElement !== 'function') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'rm-lightbox';
  dlg.setAttribute('aria-label', 'Work sample');
  dlg.innerHTML =
    '<figure class="rm-lb-figure"><img class="rm-lb-img" alt=""><figcaption class="rm-lb-bar">' +
    '<span class="rm-lb-caption"></span><span class="rm-lb-count"></span>' +
    '<span class="rm-lb-actions"><button type="button" class="rm-lb-btn" data-go="-1" aria-label="Previous sample">&larr;</button>' +
    '<button type="button" class="rm-lb-btn" data-go="1" aria-label="Next sample">&rarr;</button>' +
    '<button type="button" class="rm-lb-btn rm-lb-close" aria-label="Close">&times;</button></span>' +
    '</figcaption></figure>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('.rm-lb-img'), cap = dlg.querySelector('.rm-lb-caption'), count = dlg.querySelector('.rm-lb-count');
  var current = 0, opener = null;

  function show(i){
    current = (i + buttons.length) % buttons.length;
    var b = buttons[current], thumb = b.querySelector('img'), fig = b.closest('figure');
    img.src = b.dataset.full || thumb.currentSrc || thumb.src;
    img.alt = thumb.alt || '';
    cap.textContent = fig.dataset.lbCaption || ((fig.classList.contains('is-illustration') ? 'Illustration · ' : '') + (fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : ''));
    count.textContent = (current + 1) + ' / ' + buttons.length;
    dlg.querySelectorAll('[data-go]').forEach(function(x){ x.hidden = buttons.length < 2; });
  }

  buttons.forEach(function(b, i){
    var cap = b.closest('figure').querySelector('figcaption');
    if(!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'View larger: ' + (cap ? cap.textContent : 'work sample'));
    b.addEventListener('click', function(){ opener = b; show(i); dlg.showModal(); });
  });
  dlg.addEventListener('click', function(e){
    var go = e.target.closest('[data-go]');
    if(go){ show(current + parseInt(go.dataset.go, 10)); return; }
    if(e.target.closest('.rm-lb-close') || e.target === dlg) dlg.close();
  });
  dlg.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight'){ e.preventDefault(); show(current + 1); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); show(current - 1); }
  });
  dlg.addEventListener('close', function(){ if(opener) opener.focus(); });
})();
