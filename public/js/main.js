// El Jefe — small progressive enhancements. Every page works without this file.
(function () {
  'use strict';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // Sticky header border
  var header = $('[data-header]');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var nav = $('[data-nav]');
  var toggle = $('[data-nav-toggle]');
  if (nav && toggle) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  }

  // Featured carousel arrows
  $$('[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var track = document.getElementById(btn.getAttribute('data-target'));
      if (!track) return;
      var card = track.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 24 : 300;
      track.scrollBy({ left: step * Number(btn.getAttribute('data-scroll')), behavior: 'smooth' });
    });
  });

  // Order list (saved in this browser only)
  var KEY = 'eljefe-order-v1';
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  var save = function (list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: list lives for this page only */ } };
  var order = load();

  var drawer = $('[data-order-drawer]');
  var backdrop = $('[data-order-backdrop]');
  var linesEl = $('[data-order-lines]');
  var totalEl = $('[data-order-total]');
  var countEls = $$('[data-order-count]');
  var toast = $('[data-toast]');
  var lastFocus = null;
  var toastTimer = null;

  var money = function (n) { return '$' + n.toFixed(2); };
  var escapeHtml = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function render() {
    var count = order.reduce(function (n, l) { return n + l.qty; }, 0);
    countEls.forEach(function (el) { el.textContent = count; el.hidden = count === 0; });
    if (!linesEl) return;
    if (!order.length) {
      linesEl.innerHTML = '<p class="drawer__empty">Tap the cart on any dish to start a list.</p>';
    } else {
      linesEl.innerHTML = order.map(function (l, i) {
        var price = l.price ? money(l.price * l.qty) : 'price varies';
        return '<div class="order-line"><span class="order-line__name">' + escapeHtml(l.name) + '</span><span class="order-line__price">' + price + '</span>' +
          '<span class="qty"><button type="button" data-qty="-1" data-i="' + i + '" aria-label="Remove one ' + escapeHtml(l.name) + '">−</button><span>' + l.qty + '</span>' +
          '<button type="button" data-qty="1" data-i="' + i + '" aria-label="Add one ' + escapeHtml(l.name) + '">+</button></span></div>';
      }).join('');
    }
    var total = order.reduce(function (n, l) { return n + (l.price || 0) * l.qty; }, 0);
    if (totalEl) totalEl.textContent = money(total);
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-shown'); }, 2200);
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    var closeBtn = $('[data-close-order]', drawer);
    if (closeBtn) closeBtn.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }

  $$('[data-open-order]').forEach(function (b) { b.addEventListener('click', openDrawer); });
  $$('[data-close-order]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer(); });

  $$('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price')) || 0;
      var line = order.filter(function (l) { return l.name === name; })[0];
      if (line) line.qty += 1; else order.push({ name: name, price: price, qty: 1 });
      save(order);
      render();
      btn.classList.add('is-added');
      setTimeout(function () { btn.classList.remove('is-added'); }, 400);
      showToast(name + ' added to your order list');
    });
  });

  if (linesEl) {
    linesEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qty]');
      if (!b) return;
      var i = Number(b.getAttribute('data-i'));
      order[i].qty += Number(b.getAttribute('data-qty'));
      if (order[i].qty <= 0) order.splice(i, 1);
      save(order);
      render();
    });
  }
  var clearBtn = $('[data-clear-order]');
  if (clearBtn) clearBtn.addEventListener('click', function () { order = []; save(order); render(); });
  render();

  // Reservation form: opens the guest's email app with the request filled in.
  // To use a form service instead (Formspree, Netlify Forms…), set data-endpoint on the form.
  var form = $('[data-reserve-form]');
  if (form) {
    var status = $('[data-form-status]', form);
    var dateInput = $('#r-date', form);
    if (dateInput) {
      var d = new Date();
      dateInput.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = $$('[required]', form).filter(function (f) { return !f.value.trim() || (f.checkValidity && !f.checkValidity()); });
      if (invalid.length) {
        status.className = 'form__status form__status--err';
        status.textContent = 'Please fill in: ' + invalid.map(function (f) { return $('label[for="' + f.id + '"]', form).textContent; }).join(', ') + '.';
        invalid[0].focus();
        return;
      }
      var data = {};
      $$('input, select, textarea', form).forEach(function (f) { data[f.name] = f.value.trim(); });
      var endpoint = form.getAttribute('data-endpoint');
      if (endpoint) {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(); status.className = 'form__status form__status--ok'; status.textContent = 'Thanks! We received your request and will confirm shortly.'; form.reset(); })
          .catch(function () { status.className = 'form__status form__status--err'; status.textContent = 'Sorry, that didn’t send. Please call (515) 232-2778.'; });
        return;
      }
      var body = 'Reservation request\n\nName: ' + data.name + '\nEmail: ' + data.email + '\nPhone: ' + data.phone +
        '\nParty size: ' + data.party + '\nDate: ' + data.date + '\nTime: ' + data.time + (data.message ? '\n\nMessage: ' + data.message : '');
      window.location.href = 'mailto:hi@eljefeauthenticmexicancuisine.com?subject=' + encodeURIComponent('Reservation: ' + data.party + ' on ' + data.date + ' at ' + data.time) + '&body=' + encodeURIComponent(body);
      status.className = 'form__status form__status--ok';
      status.textContent = 'Your email app should open with the request ready to send. No email app? Call (515) 232-2778.';
    });
  }
})();
