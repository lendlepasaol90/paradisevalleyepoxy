(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', function(){ nav.classList.toggle('scrolled', scrollY > 10); }, {passive:true});

  /* services dropdown */
  var dd = document.querySelector('.has-drop'), btn = dd && dd.querySelector('.drop-btn');
  if (dd) {
    var set = function(v){ dd.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); };
    btn.addEventListener('click', function(e){ e.stopPropagation(); set(!dd.classList.contains('open')); });
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var t;
      dd.addEventListener('mouseenter', function(){ clearTimeout(t); set(true); });
      dd.addEventListener('mouseleave', function(){ t = setTimeout(function(){ set(false); }, 180); });
    }
    document.addEventListener('click', function(e){ if (!dd.contains(e.target)) set(false); });
    dd.addEventListener('focusout', function(e){ if (!dd.contains(e.relatedTarget)) set(false); });
  }

  /* mobile menu */
  var burger = document.getElementById('burger');
  var closeMenu = function(){ document.body.classList.remove('menu-open'); if (burger) burger.setAttribute('aria-expanded', false); };
  if (burger) {
    burger.addEventListener('click', function(){
      var o = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', o);
    });
    document.querySelectorAll('.mmenu a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  }
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { closeMenu(); if (dd) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', false); } } });

  /* layer stack */
  document.querySelectorAll('[data-stack]').forEach(function(stack){
    var layers = stack.querySelectorAll('.layer');
    var title = stack.querySelector('[data-stack-title]');
    var text = stack.querySelector('[data-stack-text]');
    function pick(l){
      layers.forEach(function(x){ x.setAttribute('aria-selected', x === l); x.tabIndex = x === l ? 0 : -1; });
      title.textContent = l.dataset.title;
      text.textContent = l.dataset.text;
    }
    layers.forEach(function(l, i){
      l.addEventListener('click', function(){ pick(l); });
      l.addEventListener('keydown', function(e){
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = layers[(i + 1) % layers.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = layers[(i - 1 + layers.length) % layers.length];
        if (n) { e.preventDefault(); pick(n); n.focus(); }
      });
    });
    var start = stack.querySelector('.layer[aria-selected="true"]') || layers[0];
    pick(start);
  });

  /* flake preview */
  var canvas = document.getElementById('flakeCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var plateName = document.getElementById('flakeName');
    var swatches = document.querySelectorAll('.swatch');
    var seed = 7;
    function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function draw(colors, base){
      var r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      var w = canvas.width, h = canvas.height;
      ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
      seed = 11;
      var count = Math.round(w * h / (38 * dpr * dpr));
      for (var i = 0; i < count; i++) {
        var x = rnd() * w, y = rnd() * h, s = (2.2 + rnd() * 4.2) * dpr, a = rnd() * Math.PI;
        ctx.fillStyle = colors[Math.floor(rnd() * colors.length)];
        ctx.beginPath();
        var pts = 5 + Math.floor(rnd() * 3);
        for (var p = 0; p < pts; p++) {
          var ang = a + p / pts * Math.PI * 2, rad = s * (0.55 + rnd() * 0.6);
          var px = x + Math.cos(ang) * rad, py = y + Math.sin(ang) * rad;
          p ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        ctx.closePath(); ctx.fill();
      }
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.35, 'rgba(255,255,255,0)'); g.addColorStop(.7, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    function select(b){
      swatches.forEach(function(s){ s.setAttribute('aria-pressed', s === b); });
      plateName.textContent = b.dataset.name;
      draw(b.dataset.colors.split(','), b.dataset.base);
    }
    swatches.forEach(function(s){ s.addEventListener('click', function(){ select(s); }); });
    var current = function(){ return document.querySelector('.swatch[aria-pressed="true"]') || swatches[0]; };
    select(current());
    var rt; addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ select(current()); }, 150); });
  }

  /* gallery lightbox */
  var lb = document.getElementById('lightbox');
  if (lb && lb.showModal) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery button'));
    var img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), idx = 0;
    function show(i){
      idx = (i + items.length) % items.length;
      var b = items[idx];
      img.src = b.dataset.full; img.alt = b.dataset.alt; cap.textContent = b.dataset.caption;
    }
    items.forEach(function(b, i){ b.addEventListener('click', function(){ show(i); lb.showModal(); }); });
    lb.querySelector('[data-lb="close"]').addEventListener('click', function(){ lb.close(); });
    lb.querySelector('[data-lb="prev"]').addEventListener('click', function(){ show(idx - 1); });
    lb.querySelector('[data-lb="next"]').addEventListener('click', function(){ show(idx + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function(e){ if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  }

  /* copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var v = b.dataset.copy, label = b.textContent;
      var done = function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = label; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function(){});
    });
  });

  /* subnav highlight */
  var sublinks = document.querySelectorAll('.subnav a[href^="#"]:not(.est)');
  if (sublinks.length && 'IntersectionObserver' in window) {
    var map = {};
    sublinks.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { sublinks.forEach(function(a){ a.classList.remove('on'); }); var a = map[en.target.id]; if (a) { a.classList.add('on'); a.scrollIntoView({block:'nearest', inline:'nearest'}); } }
      });
    }, {rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){ var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* forms: open a pre-filled email until a form service is connected */
  document.querySelectorAll('form[data-lead]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      if (!f.reportValidity()) return;
      var d = new FormData(f), lines = [];
      d.forEach(function(v, k){ if (String(v).trim()) lines.push(k + ': ' + v); });
      lines.push('Page: ' + location.href);
      var to = f.dataset.lead;
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Floor visit request') + '&body=' + encodeURIComponent(lines.join('\n'));
      var msg = f.querySelector('.form-msg');
      if (msg) { msg.textContent = 'Your email app should open with your request filled in. Press send there, or call us if it doesn\'t open.'; msg.classList.add('show'); }
    });
  });
})();
