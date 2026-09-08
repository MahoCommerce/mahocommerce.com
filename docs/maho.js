/* Run a feature so that its failure cannot take the others down with it.
   Everything on the home page is independent, and the accessibility controls
   must survive a broken decoration. */
function mahoSafe(name, fn) {
    try {
        fn();
    } catch (err) {
        if (window.console && console.warn) console.warn('[maho] ' + name + ' failed:', err);
    }
}

/* YouTube consent: https://github.com/kasnder/youtube-embedding-consent
   Consent is per video. The visitor agreed to this embed, not to every embed
   on the page, and each one loaded is another request to YouTube carrying
   their address. */
function mahoUnblockVideo(wrapper) {
    if (!wrapper) return;
    var trigger = wrapper.querySelector('.video_trigger');
    var layer = wrapper.querySelector('.video_layer');
    var iframe = layer && layer.querySelector('iframe');
    if (!trigger || !layer || !iframe) return;

    /* A bare YouTube id and nothing else. The value comes from authored
       markup, and anything containing ? & or / would rewrite the embed URL
       through its query string. */
    var videoId = trigger.getAttribute('data-source');
    if (!videoId || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
        if (window.console && console.warn) {
            console.warn('[maho] video wrapper has no usable data-source id:', videoId);
        }
        return;
    }

    trigger.style.display = 'none';
    layer.style.display = 'block';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) +
        '?controls=1&showinfo=0&autoplay=1&mute=0';
}

/* Bound per button, and re-bindable: DOMContentLoaded alone would leave these
   dead on any page reached without a full load. */
function mahoSetupVideos() {
    document.querySelectorAll('.video_wrapper .video_trigger .video-btn').forEach(function (btn) {
        if (btn.dataset.mhWired === 'on') return;
        btn.dataset.mhWired = 'on';
        btn.addEventListener('click', function () {
            mahoUnblockVideo(btn.closest('.video_wrapper'));
        });
    });
}


/* ============================================================
   HOME PAGE MOTION
   Terminal "typing" cascade + scroll-reveal for content blocks.
   Pure progressive enhancement: if this never runs, the page is
   fully visible and usable. Honors prefers-reduced-motion.
   ============================================================ */
function mahoReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Pending terminal timers, tracked so we can cancel the loop and avoid
   duplicate cycles across Material "instant" navigations. */
var mahoTermTimers = [];
function mahoClearTerm() {
    mahoTermTimers.forEach(function (id) { clearTimeout(id); });
    mahoTermTimers = [];
}
function mahoTermDelay(fn, ms) {
    var id = setTimeout(fn, ms);
    mahoTermTimers.push(id);
    return id;
}

/* Hide every line of a scene so it can be typed out from blank. */
function mahoBlankScene(scene) {
    var lines = Array.prototype.slice.call(scene.querySelectorAll('.mh-ln'));
    var cursor = scene.querySelector('.mh-cur');
    lines.forEach(function (ln) {
        ln.style.transition = 'none';
        ln.style.opacity = '0';
        ln.style.clipPath = 'inset(0 100% 0 0)';
    });
    if (cursor) cursor.style.opacity = '0';
}

/* Reveal a scene's lines one after another with a left-to-right "typing"
   wipe - command lines take longer than output lines. Calls onDone when the
   last line (and cursor) have settled. */
function mahoTypeScene(scene, onDone) {
    mahoBlankScene(scene);
    var lines = Array.prototype.slice.call(scene.querySelectorAll('.mh-ln'));
    var cursor = scene.querySelector('.mh-cur');

    var t = 0;
    lines.forEach(function (ln) {
        var isCmd = !!ln.querySelector('.p');
        var len = (ln.textContent || '').length;
        var dur = isCmd ? Math.min(900, Math.max(420, len * 16)) : 150;
        mahoTermDelay(function () {
            ln.style.transition = 'clip-path ' + dur + 'ms linear, opacity 120ms ease';
            ln.style.opacity = '1';
            ln.style.clipPath = 'inset(0 0 0 0)';
        }, t);
        t += dur + (isCmd ? 150 : 80);
    });
    if (cursor) mahoTermDelay(function () { cursor.style.opacity = ''; }, t);
    if (onDone) mahoTermDelay(onDone, t);
}

/* Flip the whole terminal window backwards: rotate to edge-on, run swap()
   while it's hidden, then flip back in and call done(). */
function mahoFlipTerminal(term, swap, done) {
    var EASE = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)';
    var HALF = 360;
    term.style.animation = 'none'; // release the entrance animation's transform
    term.style.transition = 'transform ' + HALF + 'ms ' + EASE;
    term.style.transform = 'rotateX(-90deg)';

    mahoTermDelay(function () {
        swap(); // swap the visible scene while the panel is edge-on (invisible)
        term.style.transition = 'none';
        term.style.transform = 'rotateX(90deg)';
        void term.offsetWidth; // commit the jump before flipping back in
        term.style.transition = 'transform ' + HALF + 'ms ' + EASE;
        term.style.transform = 'rotateX(0deg)';
        mahoTermDelay(done, HALF);
    }, HALF);
}

/* Show every line of a scene at once, with no typing. Used when the visitor
   pauses: the terminal must stay readable, not freeze half-typed. */
function mahoRevealScene(scene) {
    Array.prototype.slice.call(scene.querySelectorAll('.mh-ln')).forEach(function (ln) {
        ln.style.transition = 'none';
        ln.style.opacity = '1';
        ln.style.clipPath = 'inset(0 0 0 0)';
    });
    var cursor = scene.querySelector('.mh-cur');
    if (cursor) cursor.style.opacity = '';
}

/* Which terminal is running, which scene it is on, and whether the visitor
   stopped it. Module-level so the pause button can act on it. */
var mahoTerm = { el: null, scenes: [], i: 0, paused: false };

/* Drive the terminal: type the active scene, hold, flip to the next scene,
   type it, and repeat. A single scene just types once. */
function mahoRunTerminal() {
    var t = mahoTerm;
    if (!t.el || t.paused || !t.scenes.length) return;

    var HOLD = 3400; // dwell on a finished scene before flipping away

    function activate(idx) {
        t.scenes.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
    }

    function typeCurrent() {
        if (t.paused) return;
        mahoTypeScene(t.scenes[t.i], function () {
            if (t.paused || t.scenes.length < 2) return; // single scene: type once and stop
            mahoTermDelay(function () {
                if (t.paused) return;
                mahoFlipTerminal(t.el, function () {
                    t.i = (t.i + 1) % t.scenes.length;
                    activate(t.i);
                    mahoBlankScene(t.scenes[t.i]); // blank before it flips into view
                }, typeCurrent);
            }, HOLD);
        });
    }

    activate(t.i);
    mahoBlankScene(t.scenes[t.i]);
    mahoTermDelay(typeCurrent, 360); // let the panel slide in first
}

function mahoCycleTerminal(term) {
    if (!term) return;
    var scenes = Array.prototype.slice.call(term.querySelectorAll('.mh-term-scene'));
    if (!scenes.length) return;
    mahoTerm = { el: term, scenes: scenes, i: 0, paused: false };
    mahoRunTerminal();
}

/* Stop the loop and leave the current scene complete, or start it again.
   A flip can be in flight when the visitor hits pause, so the panel's inline
   rotation is cleared too; otherwise it would stay stuck edge-on. */
function mahoTermSetPaused(paused) {
    var t = mahoTerm;
    t.paused = paused;
    if (!t.el) return;
    if (paused) {
        mahoClearTerm();
        t.el.style.transition = 'none';
        t.el.style.transform = 'none';
        if (t.scenes[t.i]) mahoRevealScene(t.scenes[t.i]);
    } else {
        mahoRunTerminal();
    }
}

/* Fade/slide content blocks in as they enter the viewport. */
function mahoSetupReveal() {
    var selector = '.mh-proof, .mh-sec-head, .mh-themes-inner, .feature-card, .final-cta-inner';
    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    targets.forEach(function (el) {
        // small stagger between siblings sharing a parent
        var parent = el.parentNode;
        if (!parent) return;
        var sibs = Array.prototype.slice.call(parent.children).filter(function (c) {
            return c.matches && c.matches(selector);
        });
        var idx = sibs.indexOf(el);
        if (idx > 0) el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
        el.classList.add('mh-reveal');
    });

    if (!('IntersectionObserver' in window)) {
        // No observer support: just show everything.
        targets.forEach(function (el) { el.classList.add('mh-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('mh-in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
}

/* The feature sections used to auto-advance as a "there is more" hint. That
   was moving content that started on its own and never stopped, which fails
   WCAG 2.2.2 (Pause, Stop, Hide) at Level A. The hint is static now: the next
   card always peeks past the right edge, and Chrome draws scroll markers. From
   tablet up the cards wrap and there is nothing to hint at. */

/* Stores carousel: arrows page the scroll-snap viewport a screen at a time,
   wrapping around at the ends like the admin showcase. */
function mahoSetupStores() {
    var carousel = document.querySelector('.mh-stores-carousel');
    if (!carousel || carousel.dataset.mhStores === 'on') return;
    carousel.dataset.mhStores = 'on';

    var vp = carousel.querySelector('.mh-stores-viewport');
    var prev = carousel.querySelector('.mh-stores-prev');
    var next = carousel.querySelector('.mh-stores-next');
    if (!vp) return;

    var behavior = mahoReducedMotion() ? 'auto' : 'smooth';

    function page(dir) {
        var max = vp.scrollWidth - vp.clientWidth;
        var target = vp.scrollLeft + vp.clientWidth * dir;
        if (dir > 0 && vp.scrollLeft >= max - 4) target = 0;     // wrap to start
        else if (dir < 0 && vp.scrollLeft <= 4) target = max;    // wrap to end
        vp.scrollTo({ left: target, behavior: behavior });
    }

    if (prev) prev.addEventListener('click', function () { page(-1); });
    if (next) next.addEventListener('click', function () { page(1); });
}

/* Wire the two pause controls. Everything that moves on its own must have a
   control any visitor can reach, not only one who set prefers-reduced-motion
   at the OS level (WCAG 2.2.2, Level A). */
function mahoSetupMotionControls() {
    var termBtn = document.getElementById('mh-term-pause');
    if (termBtn && termBtn.dataset.mhWired !== 'on') {
        termBtn.dataset.mhWired = 'on';
        termBtn.addEventListener('click', function () {
            var paused = !termBtn.classList.contains('is-paused');
            mahoTermSetPaused(paused);
            termBtn.classList.toggle('is-paused', paused);
            var label = paused ? 'Play the terminal animation' : 'Pause the terminal animation';
            termBtn.setAttribute('aria-label', label);
            termBtn.setAttribute('title', label);
        });
    }

    var mqBtn = document.getElementById('mh-marquee-pause');
    var marquee = document.querySelector('.mh-funding-marquee');
    if (mqBtn && marquee && mqBtn.dataset.mhWired !== 'on') {
        mqBtn.dataset.mhWired = 'on';
        mqBtn.addEventListener('click', function () {
            var paused = !mqBtn.classList.contains('is-paused');
            marquee.classList.toggle('is-paused', paused);
            mqBtn.classList.toggle('is-paused', paused);
            var label = paused ? 'Resume the scrolling sponsor logos' : 'Pause the scrolling sponsor logos';
            mqBtn.setAttribute('aria-label', label);
            mqBtn.setAttribute('title', label);
        });
    }
}

/* The OS setting can change while the page is open. CSS reacts on its own,
   but the scripted motion has to be told, or a visitor who switches reduce
   motion on mid-session keeps the typing loop until they reload. */
var mahoMotionWatched = false;
function mahoWatchReducedMotion() {
    if (mahoMotionWatched || !window.matchMedia) return;
    mahoMotionWatched = true;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var onChange = function () {
        if (mq.matches) {
            mahoClearTerm();
            if (mahoTerm.el && mahoTerm.scenes.length) mahoRevealScene(mahoTerm.scenes[mahoTerm.i]);
            document.documentElement.classList.remove('mh-anim');
        } else if (document.querySelector('.mh-hero')) {
            mahoInitHome();
        }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
}

function mahoInitHome() {
    mahoSafe('videos', mahoSetupVideos);   // every page, not only the home page
    mahoWatchReducedMotion();

    var hero = document.querySelector('.mh-hero');
    if (!hero) {
        /* Left the home page. Without this the terminal timers keep firing
           against detached nodes for the rest of the session. */
        mahoClearTerm();
        mahoTerm = { el: null, scenes: [], i: 0, paused: false };
        return;
    }

    /* Each feature is independent, so each one fails alone. The pause controls
       carry a WCAG obligation and must not depend on a decorative showcase. */
    mahoSafe('motion controls', mahoSetupMotionControls);
    mahoSafe('stores carousel', mahoSetupStores);

    if (mahoReducedMotion()) return; // CSS keeps everything visible

    mahoSafe('terminal', function () {
        mahoClearTerm(); // avoid duplicate cycles across instant navigations
        document.documentElement.classList.add('mh-anim');
        mahoCycleTerminal(document.querySelector('.mh-term'));

        /* The control keeps its own state, so a re-init must not silently
           restart motion the visitor already stopped. */
        var pauseBtn = document.getElementById('mh-term-pause');
        if (pauseBtn && pauseBtn.classList.contains('is-paused')) mahoTermSetPaused(true);
    });
    mahoSafe('scroll reveal', mahoSetupReveal);
}

/* ---- Sponsors: confetti on the affiliate buttons ----
   This lived in an inline <script> on sponsors.md. Content swapped in by an
   instant navigation never re-runs its inline scripts, so it belonged here,
   behind the same document$ subscription as everything else. party.js is
   loaded once from extra_javascript and survives navigation, but guard for it
   anyway: a missing library must not throw. */
function mahoSetupConfetti() {
    if (typeof party === 'undefined' || !party.confetti) return;
    document.querySelectorAll('.affiliate-button').forEach(function (button) {
        if (button.dataset.mhWired === 'on') return;
        button.dataset.mhWired = 'on';
        button.addEventListener('mouseenter', function () {
            party.confetti(this, {
                count: party.variation.range(30, 40),
                speed: party.variation.range(400, 600)
            });
        });
    });
}

/* ---- Blog & Community sidebars: keep their groups expanded ----
   The collapsible sidebar (navigation.sections is off, which keeps the large
   docs sidebar short) collapses nested groups by default. On the small blog and
   community sections we want their groups open, the way they were before, so
   check every nested toggle in the primary sidebar on each load. The path guard
   leaves the big docs sidebars collapsible. */
function mahoExpandSectionNav() {
    var p = location.pathname;
    if (p.indexOf('/blog/') === -1 && p.indexOf('/community/') === -1) return;
    document.querySelectorAll('.md-sidebar--primary .md-nav__item--nested > input.md-nav__toggle').forEach(function (toggle) {
        toggle.checked = true;
    });
}

/* Run on first load, and again after Material "instant" navigations. Both
   entry points are wrapped: a throw inside a document$ subscriber would
   otherwise break the observable for every later navigation. */
function mahoBoot() {
    mahoSafe('home init', mahoInitHome);
    mahoSafe('section nav', mahoExpandSectionNav);
    mahoSafe('confetti', mahoSetupConfetti);
    mahoSafe('theme stages', mahoSetupThemeStages); // home teaser and about/themes
}

if (typeof window !== 'undefined' && window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(mahoBoot);
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mahoBoot);
} else {
    mahoBoot(); // the script loaded late; the document is already parsed
}

/* ---- Showcase stage: storefront themes and the admin in one window ----
   One browser window with two tabs, Storefront and Admin. The storefront tab
   shows a full-page capture of one of the eleven themes; the swatch strip
   under the window picks the theme, the page toggle steps through home,
   category and product, and the capture scrolls inside the frame like a
   real browser tab. The admin tab shows the admin screens; the chip strip
   picks the screen. The arrows walk the storefront page by page and then on
   to the next theme; in the admin they step through the screens. They wrap
   at both ends, and the lightbulb flips light and dark in both tabs.
   The item lists come from [data-mh-picks="store"] and [data-mh-picks="admin"]:
   visible pills on about/themes, hidden data lists on the home page.
   Progressive enhancement: without JS the first capture shows, the tabs and
   the swatches are plain links, and the script-only controls stay hidden.
   Two themes carry no dark palette; the bulb is disabled on those instead
   of showing a broken frame.
   The same engine drives the comparison window on about/themes, which has
   no tabs and only storefront picks. */
function mahoDecodeImage(img) {
    /* Resolve on load, then give decode() a moment so the swap paints in one
       frame. decode() alone is not enough: Chrome can leave it pending for
       a detached image, and a pending decode would look like a lost capture. */
    var loaded = new Promise(function (res, rej) {
        if (img.complete) { img.naturalWidth ? res() : rej(new Error('load failed')); return; }
        img.onload = res;
        img.onerror = function () { rej(new Error('load failed')); };
    });
    return loaded.then(function () {
        if (!img.decode) return;
        return Promise.race([
            img.decode().catch(function () {}),
            new Promise(function (res) { setTimeout(res, 800); })
        ]);
    });
}

/* A capture that never resolves would leave the spinner turning for the
   rest of the session. Bound the wait and report what happened. */
function mahoSettleWithin(promise, ms) {
    return new Promise(function (resolve) {
        var settled = false;
        var timer = setTimeout(function () {
            if (!settled) { settled = true; resolve('timeout'); }
        }, ms);
        promise.then(
            function () { if (!settled) { settled = true; clearTimeout(timer); resolve('ok'); } },
            function () { if (!settled) { settled = true; clearTimeout(timer); resolve('error'); } }
        );
    });
}

function mahoSetupThemeStage(root) {
    if (root.dataset.mhWired === 'on') return;
    var all = function (sel, el) { return Array.prototype.slice.call((el || root).querySelectorAll(sel)); };

    var img = root.querySelector('.mh-tstage-img');
    var scroller = root.querySelector('.mh-tstage-scroll');
    var win = root.querySelector('.mh-shot-window');
    var title = root.querySelector('.mh-tstage-title');
    var bulb = root.querySelector('.mh-bulb');
    var hint = root.querySelector('.mh-bulb-hint');
    var hintText = root.querySelector('.mh-bulb-text');
    var spinner = root.querySelector('.mh-shot-spinner');
    var prevBtn = root.querySelector('.mh-shot-prev');
    var nextBtn = root.querySelector('.mh-shot-next');
    var tabs = all('.mh-tab[data-mode]');
    var modeEls = all('[data-mh-mode]');
    var pageBtns = all('.mh-tstage-page');
    var demoLinks = all('.mh-tstage-demo');

    if (!img || !scroller) return;

    var base = root.getAttribute('data-src-base') || '';
    var modes = {};

    var storeBox = root.querySelector('[data-mh-picks="store"]');
    var storePicks = storeBox ? all('.mh-tstage-pick', storeBox) : all('.mh-tstage-pick');
    if (storePicks.length) {
        modes.store = {
            i: 0,
            items: storePicks.map(function (el) {
                return {
                    key: el.getAttribute('data-theme'),
                    name: el.getAttribute('data-name') || el.textContent.trim(),
                    dark: el.getAttribute('data-dark') !== 'no',
                    el: el
                };
            })
        };
        modes.store.items.forEach(function (it, k) {
            if (it.key === root.getAttribute('data-theme')) modes.store.i = k;
        });
    }

    var adminBox = root.querySelector('[data-mh-picks="admin"]');
    if (adminBox) {
        var adminPicks = all('.mh-tstage-pick', adminBox);
        if (adminPicks.length) {
            modes.admin = {
                i: 0,
                items: adminPicks.map(function (el) {
                    return {
                        light: el.getAttribute('data-light'),
                        darkSrc: el.getAttribute('data-dark'),
                        name: el.getAttribute('data-title') || el.textContent.trim(),
                        dark: true,
                        el: el
                    };
                })
            };
        }
    }

    var first = root.getAttribute('data-mode');
    if (!modes[first]) first = modes.store ? 'store' : 'admin';
    if (!modes[first]) return;
    root.dataset.mhWired = 'on';

    var state = { mode: first, i: modes[first].i, page: 'home', dark: false };
    var pending = null;   // the state a capture is loading for, so fast clicks chain
    var navToken = 0;
    var LOAD_TIMEOUT = 6000;
    var fade = !mahoReducedMotion();

    // Controls that only work with a script are hidden in the markup.
    all('[data-mh-js]').forEach(function (el) { el.hidden = false; });

    function itemOf(s) { return modes[s.mode].items[s.i]; }
    function cur() { return pending || state; }
    function schemeOf(s) { return s.dark ? 'dark' : 'light'; }
    function srcOf(s) {
        var it = itemOf(s);
        if (s.mode === 'admin') return s.dark ? it.darkSrc : it.light;
        return base + it.key + '-' + s.page + '-' + schemeOf(s) + '.webp';
    }
    function demoUrl(it) {
        return 'https://demo.mahocommerce.com/' + (it.key === 'default' ? '' : it.key + '/');
    }

    function render() {
        var it = itemOf(state);
        var isStore = state.mode === 'store';

        tabs.forEach(function (el) {
            var on = el.getAttribute('data-mode') === state.mode;
            el.setAttribute('aria-selected', on ? 'true' : 'false');
            el.classList.toggle('is-active', on);
        });
        modeEls.forEach(function (el) {
            el.hidden = el.getAttribute('data-mh-mode') !== state.mode;
        });
        Object.keys(modes).forEach(function (m) {
            modes[m].items.forEach(function (x, k) {
                if (m === state.mode && k === state.i) x.el.setAttribute('aria-current', 'true');
                else x.el.removeAttribute('aria-current');
            });
        });
        pageBtns.forEach(function (el) {
            el.setAttribute('aria-pressed', el.getAttribute('data-page') === state.page ? 'true' : 'false');
        });

        if (title) {
            title.textContent = isStore
                ? it.name + ' · ' + state.page.charAt(0).toUpperCase() + state.page.slice(1)
                : it.name;
        }
        if (bulb) {
            bulb.setAttribute('aria-pressed', state.dark ? 'true' : 'false');
            if (it.dark) {
                bulb.removeAttribute('aria-disabled');
                bulb.setAttribute('aria-label', state.dark ? 'Switch the screenshot to light mode' : 'Switch the screenshot to dark mode');
                bulb.setAttribute('title', 'Toggle light / dark');
                if (hintText) hintText.textContent = state.dark ? 'Turn on the lights' : 'Try dark mode';
            } else {
                bulb.setAttribute('aria-disabled', 'true');
                bulb.setAttribute('aria-label', it.name + ' has no dark mode, it is pinned to light');
                bulb.setAttribute('title', it.name + ' is light only');
                if (hintText) hintText.textContent = 'Light only';
            }
        }
        img.setAttribute('alt', isStore
            ? it.name + ' theme, ' + state.page + ' page, ' + schemeOf(state) + ' mode'
            : it.name + ' in the redesigned admin, ' + schemeOf(state) + ' mode');
        if (isStore) {
            demoLinks.forEach(function (a) {
                a.setAttribute('href', demoUrl(it));
                var label = a.querySelector('.mh-tstage-demo-name');
                if (label) label.textContent = it.name;
            });
        }
    }

    /* Keep the current capture on screen, preload the next one, and swap
       only once it has decoded. A capture that fails or stalls leaves the
       stage as it was, so the controls never show a broken frame. */
    function show(next) {
        if (!itemOf(next).dark) next.dark = false;
        var token = ++navToken;
        pending = next;
        var target = srcOf(next);
        if (spinner) spinner.hidden = false;
        var pre = new Image();
        pre.src = target;
        mahoSettleWithin(mahoDecodeImage(pre), LOAD_TIMEOUT).then(function (outcome) {
            if (token !== navToken) return;
            pending = null;
            if (spinner) spinner.hidden = true;
            if (outcome !== 'ok') {
                if (window.console && console.warn) {
                    console.warn('[maho] capture "' + target + '" did not load (' + outcome + ')');
                }
                return;
            }
            state = next;
            modes[state.mode].i = state.i;
            img.src = target;
            scroller.scrollTop = 0;
            render();
            if (fade) {
                scroller.classList.remove('mh-shot-fade');
                void scroller.offsetWidth;
                scroller.classList.add('mh-shot-fade');
            }
        });
    }

    /* The arrows walk the storefront page by page: home, category, product,
       then the next theme's home. In the admin they step through the screens. */
    var PAGES = pageBtns.length
        ? pageBtns.map(function (el) { return el.getAttribute('data-page'); })
        : ['home', 'category', 'product'];
    function step(dir) {
        var c = cur();
        var n = modes[c.mode].items.length;
        if (c.mode === 'store') {
            var p = PAGES.indexOf(c.page) + dir;
            var i = c.i;
            if (p >= PAGES.length) { p = 0; i = (i + 1) % n; }
            else if (p < 0) { p = PAGES.length - 1; i = (i - 1 + n) % n; }
            show({ mode: 'store', i: i, page: PAGES[p], dark: c.dark });
            return;
        }
        show({ mode: c.mode, i: (c.i + dir + n) % n, page: c.page, dark: c.dark });
    }

    function toggleMode() {
        var c = cur();
        if (!itemOf(c).dark) return;
        if (win) win.classList.add('is-hint-done');
        show({ mode: c.mode, i: c.i, page: c.page, dark: !c.dark });
    }

    tabs.forEach(function (el) {
        el.addEventListener('click', function (e) {
            var m = el.getAttribute('data-mode');
            if (!modes[m]) return;
            e.preventDefault();
            e.stopPropagation(); // keep the click from Material's instant navigation
            var c = cur();
            if (m === c.mode) return;
            show({ mode: m, i: modes[m].i, page: c.page, dark: c.dark });
        });
    });
    Object.keys(modes).forEach(function (m) {
        modes[m].items.forEach(function (x, k) {
            x.el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // keep the click from Material's instant navigation
                show({ mode: m, i: k, page: cur().page, dark: cur().dark });
            });
        });
    });
    pageBtns.forEach(function (el) {
        el.addEventListener('click', function () {
            var c = cur();
            show({ mode: 'store', i: c.mode === 'store' ? c.i : modes.store.i, page: el.getAttribute('data-page'), dark: c.dark });
        });
    });
    /* Full screen: the window fills the screen, the capture fills the window.
       Escape and the same button leave it. */
    var full = root.querySelector('.mh-full');
    if (full) {
        var canFull = win && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
        if (!canFull) {
            full.hidden = true;
        } else {
            var isFull = function () {
                var el = document.fullscreenElement || document.webkitFullscreenElement;
                return !!el && el === win;
            };
            var renderFull = function () {
                var on = isFull();
                win.classList.toggle('is-full', on);
                full.setAttribute('aria-label', on ? 'Leave full screen' : 'View full screen');
                full.setAttribute('title', on ? 'Leave full screen' : 'Full screen');
            };
            full.addEventListener('click', function () {
                if (isFull()) {
                    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
                } else {
                    (win.requestFullscreen || win.webkitRequestFullscreen).call(win);
                }
            });
            document.addEventListener('fullscreenchange', renderFull);
            document.addEventListener('webkitfullscreenchange', renderFull);
        }
    }

    if (bulb) bulb.addEventListener('click', toggleMode);
    if (hint) hint.addEventListener('click', toggleMode);
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

    // Swipe on the window steps through the strip (mobile); vertical
    // gestures keep scrolling the capture.
    var swipeX = 0, swipeY = 0, swiping = false;
    scroller.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) { swiping = false; return; }
        swipeX = e.touches[0].clientX;
        swipeY = e.touches[0].clientY;
        swiping = true;
    }, { passive: true });
    scroller.addEventListener('touchend', function (e) {
        if (!swiping) return;
        swiping = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - swipeX;
        var dy = t.clientY - swipeY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* Openers elsewhere on the page (the theme cards on about/themes) select
       a theme in this stage and bring it into view. Without JS they link to
       the full-size capture. */
    if (root.id && modes.store) {
        all('.mh-tstage-open[data-target="' + root.id + '"]', document).forEach(function (el) {
            if (el.dataset.mhWired === 'on') return;
            el.dataset.mhWired = 'on';
            el.addEventListener('click', function (e) {
                var key = el.getAttribute('data-theme');
                var k = -1;
                modes.store.items.forEach(function (it, n) { if (it.key === key) k = n; });
                if (k < 0) return;
                e.preventDefault();
                e.stopPropagation(); // keep the click from Material's instant navigation
                show({ mode: 'store', i: k, page: el.getAttribute('data-page') || cur().page, dark: cur().dark });
                root.scrollIntoView({ behavior: fade ? 'smooth' : 'auto', block: 'start' });
            });
        });
    }

    render();
}

function mahoSetupThemeStages() {
    document.querySelectorAll('.mh-tstage').forEach(function (root) {
        mahoSafe('showcase stage', function () { mahoSetupThemeStage(root); });
    });
}
