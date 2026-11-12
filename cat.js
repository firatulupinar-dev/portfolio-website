/* Footer easter egg: Muffin, a fluffy calico Persian, peeks over the footer line.
   Her ears show at rest, she peeks when the footer scrolls into view,
   rises on hover and answers when clicked. Motion is skipped for people who prefer reduced motion. */
(function(){
  var footer = document.querySelector('footer');
  if(!footer || footer.querySelector('.fcat')) return;

  var css =
    'footer{position:relative;}' +
    '.fcat{position:absolute;bottom:100%;right:max(32px,calc((100% - 1120px)/2 + 40px));width:60px;height:60px;overflow:hidden;pointer-events:none;}' +
    '.fcat-btn{position:absolute;left:0;bottom:0;width:60px;height:60px;padding:0;border:0;background:none;cursor:pointer;pointer-events:auto;transform:translateY(45px);transition:transform .45s cubic-bezier(.34,1.56,.64,1);}' +
    '.fcat.is-peek .fcat-btn{transform:translateY(31px);}' +
    '.fcat-btn:hover,.fcat-btn:focus-visible,.fcat.is-up .fcat-btn{transform:translateY(0);}' +
    '.fcat-btn:focus-visible{outline:2px solid var(--accent);outline-offset:-2px;border-radius:8px;}' +
    '.fcat svg{display:block;width:60px;height:60px;}' +
    '.fcat-eye{transform-box:fill-box;transform-origin:center;animation:fcat-blink 5s infinite;}' +
    '.fcat-tail{transform-origin:44px 56px;}' +
    '.fcat-btn:hover .fcat-tail,.fcat.is-up .fcat-tail{animation:fcat-swish .9s ease-in-out infinite alternate;}' +
    '.fcat-say{position:absolute;bottom:calc(100% + 66px);right:max(18px,calc((100% - 1120px)/2 + 26px));padding:5px 10px;border:1px solid var(--line);border-radius:10px 10px 2px 10px;background:var(--paper);font-family:var(--font-sans,Inter,sans-serif);font-size:12px;font-weight:600;color:var(--ink);white-space:nowrap;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;pointer-events:none;}' +
    '.fcat-say.is-on{opacity:1;transform:translateY(0);}' +
    '@keyframes fcat-blink{0%,93%,100%{transform:scaleY(1);}96%{transform:scaleY(.12);}}' +
    '@keyframes fcat-swish{from{transform:rotate(-7deg);}to{transform:rotate(9deg);}}' +
    '@media (prefers-reduced-motion:reduce){.fcat-btn{transition:none;}.fcat-eye,.fcat-tail{animation:none!important;}}' +
    '@media print{.fcat,.fcat-say{display:none;}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* Muffin: dark brown face mask with an orange blaze, big amber eyes, white muzzle, chest and paws,
     orange and dark patches on her fluffy body and tail, and a slightly grumpy Persian expression */
  var mask = '#2E2320', orange = '#D8913F', white = '#FBF5EA';
  var wrap = document.createElement('div');
  wrap.className = 'fcat';
  wrap.innerHTML =
    '<button type="button" class="fcat-btn" aria-label="Pet Muffin, the footer cat">' +
    '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      /* fluffy tail */
      '<g class="fcat-tail"><path d="M43 57c8 1 13-4 12-11-1-4-4-5-3-9" fill="none" stroke="' + orange + '" stroke-width="7" stroke-linecap="round"/>' +
      '</g>' +
      /* body, chest, dark flank patch and paws */
      '<path d="M9 60c-2-15 6-26 21-26s23 11 21 26z" fill="' + orange + '"/>' +
      '<path d="M43 44c4 2 6.5 7 6.5 12l-5.5 1c0-5-1.5-9-3.5-11z" fill="' + mask + '"/>' +
      '<path d="M15 60c-1-12 5-22 15-22s16 10 15 22z" fill="' + white + '"/>' +
      '<ellipse cx="23" cy="58.5" rx="4.6" ry="2.6" fill="' + white + '"/>' +
      '<ellipse cx="35" cy="58.5" rx="4.6" ry="2.6" fill="' + white + '"/>' +
      '<path d="M19 57.5c1-1.6 3-2 4.5-1.6l-.5 2.6z" fill="' + mask + '"/>' +
      /* small, wide-set rounded ears (left one orange) */
      '<path d="M13 17c-1-5 0-10 2-12 3 1 7 4 9 7z" fill="' + orange + '"/>' +
      '<path d="M47 17c1-5 0-10-2-12-3 1-7 4-9 7z" fill="' + mask + '"/>' +
      /* round, flat Persian head with the dark mask */
      '<ellipse cx="30" cy="23" rx="16" ry="13.5" fill="' + mask + '"/>' +
      /* orange blaze down the forehead and a patch over the left brow */
      '<path d="M27.6 9.6c1.5-.5 3.3-.5 4.8 0l-1.2 13h-2.4z" fill="' + orange + '"/>' +
      '<ellipse cx="19" cy="14.5" rx="4.5" ry="3" fill="' + orange + '" opacity=".85"/>' +
      /* white muzzle and chin fluff */
      '<path d="M18 30c3 6 7 8.5 12 8.5s9-2.5 12-8.5c-3 2-7 3-12 3s-9-1-12-3z" fill="' + white + '"/>' +
      '<ellipse cx="30" cy="29.5" rx="6.5" ry="5" fill="' + white + '"/>' +
      '<ellipse cx="30" cy="27" rx="2.2" ry="1.6" fill="' + orange + '" opacity=".75"/>' +
      /* big amber eyes with a grumpy lid line */
      '<g class="fcat-eye"><circle cx="22.5" cy="22" r="3.6" fill="#F2A31B"/><ellipse cx="22.5" cy="22.2" rx="1.3" ry="2.5" fill="#15100E"/><circle cx="23.6" cy="20.9" r=".7" fill="#fff"/></g>' +
      '<g class="fcat-eye"><circle cx="37.5" cy="22" r="3.6" fill="#F2A31B"/><ellipse cx="37.5" cy="22.2" rx="1.3" ry="2.5" fill="#15100E"/><circle cx="38.6" cy="20.9" r=".7" fill="#fff"/></g>' +
      '<path d="M18.4 17.6 26.4 20v-3.2z" fill="' + mask + '"/>' +
      '<path d="M41.6 17.6 33.6 20v-3.2z" fill="' + mask + '"/>' +
      /* tiny nose, small frown and whiskers */
      '<path d="M28.7 25.3h2.6l-1.3 1.5z" fill="#B97C72"/>' +
      '<path d="M28.3 31c1.1-.7 2.3-.7 3.4 0" fill="none" stroke="#B9998C" stroke-width=".7" stroke-linecap="round"/>' +
      '<path d="M24 28.5 13 26.5M24 30 13 31.5M36 28.5l11-2M36 30l11 1.5" stroke="#fff" stroke-opacity=".75" stroke-width=".5" stroke-linecap="round"/>' +
    '</svg></button>';
  var say = document.createElement('span');
  say.className = 'fcat-say';
  say.setAttribute('role', 'status');
  footer.appendChild(wrap);
  footer.appendChild(say);

  /* peek when the footer comes into view */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){ wrap.classList.toggle('is-peek', e.isIntersecting); });
    }, {threshold:.4}).observe(footer);
  } else { wrap.classList.add('is-peek'); }

  var lines = ['Hi, I’m Muffin.', 'mrrp?', 'Muffin approves this portfolio.', 'Thanks for scrolling all the way down', 'Book a call. Muffin will supervise.'];
  var n = 0, timer;
  wrap.querySelector('.fcat-btn').addEventListener('click', function(){
    say.textContent = lines[n % lines.length]; n++;
    say.classList.add('is-on'); wrap.classList.add('is-up');
    clearTimeout(timer);
    timer = setTimeout(function(){ say.classList.remove('is-on'); wrap.classList.remove('is-up'); }, 2200);
  });
})();
