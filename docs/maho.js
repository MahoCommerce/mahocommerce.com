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
    var selector = '.mh-proof, .mh-sec-head, .feature-card, .final-cta-inner';
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

/* ---- Hero admin showcase: lightbulb toggle + prev/next arrows ----
   One screenshot at a time; a lightbulb in the window chrome crossfades
   between the light and dark capture. Big arrows step through the screens
   (wrapping), keeping the current mode: the frame is hidden behind a
   spinner until the next capture decodes, then slides in from the chosen
   direction. Progressive enhancement: without JS the first shot shows. */
function mahoSetupShots() {
    var stage = document.getElementById('mh-shot-stage');
    if (!stage || stage.dataset.mhShots === 'on') return;

    var bulb = document.getElementById('mh-bulb');
    var title = document.getElementById('mh-shot-title');
    var frame = document.getElementById('mh-shot-frame');
    var spinner = document.getElementById('mh-shot-spinner');
    var hold = document.getElementById('mh-shot-hold');
    var light = document.getElementById('mh-shot-light');
    var dark = document.getElementById('mh-shot-dark');
    var win = document.getElementById('mh-shot-window');
    var prevBtn = document.getElementById('mh-shot-prev');
    var nextBtn = document.getElementById('mh-shot-next');

    /* Without any one of these the showcase cannot work. Leave the first
       screenshot on display and stop, rather than throwing part way through
       and leaving the controls half wired. */
    if (!bulb || !frame || !spinner || !hold || !light || !dark || !prevBtn || !nextBtn) {
        if (window.console && console.warn) {
            console.warn('[maho] admin showcase is missing required elements; navigation disabled');
        }
        return;
    }
    stage.dataset.mhShots = 'on';

    var screens = Array.prototype.map.call(
        document.querySelectorAll('#mh-shot-screens > [data-title]'),
        function (el) {
            return {
                light: el.getAttribute('data-light'),
                dark: el.getAttribute('data-dark'),
                title: el.getAttribute('data-title')
            };
        }
    );
    if (!screens.length) return;
    var i = 0;
    var navToken = 0;

    var hintText = document.getElementById('mh-bulb-text');

    function render() {
        var s = screens[i];
        var isDark = stage.classList.contains('is-dark');
        bulb.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        bulb.setAttribute('aria-label', isDark ? 'Switch the screenshot to light mode' : 'Switch the screenshot to dark mode');
        if (title) title.textContent = 'maho-admin · ' + (isDark ? 'dark' : 'light');
        if (hintText) hintText.textContent = isDark ? 'Turn on the lights' : 'Try dark mode';
        light.setAttribute('alt', s.title + ' in the redesigned admin, ' + (isDark ? 'dark' : 'light') + ' mode');
    }

    /* Rejects on failure rather than swallowing it, so go() can tell a
       capture that arrived from one that never will. */
    function decode(img) {
        if (!img.decode) {
            return new Promise(function (res, rej) {
                if (img.complete) { img.naturalWidth ? res() : rej(new Error('load failed')); return; }
                img.onload = res;
                img.onerror = function () { rej(new Error('load failed')); };
            });
        }
        return img.decode();
    }

    /* A capture that never resolves would leave the spinner turning for the
       rest of the session. Bound the wait and report what happened. */
    var LOAD_TIMEOUT = 6000;
    function settleWithin(promise, ms) {
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

    function go(step) {
        var token = ++navToken;
        var from = i;
        i = (i + step + screens.length) % screens.length;
        var s = screens[i];

        // Keep the current screenshot on screen; preload the next one
        // off-screen and only swap once it's decoded.
        spinner.hidden = false;
        var preL = new Image();
        var preD = new Image();
        preL.src = s.light;
        preD.src = s.dark;

        settleWithin(Promise.all([decode(preL), decode(preD)]), LOAD_TIMEOUT).then(function (outcome) {
            if (token !== navToken) return;     // a newer navigation superseded this one
            spinner.hidden = true;

            if (outcome !== 'ok') {
                /* Slow or missing capture. Keep the screenshot already on
                   display instead of swapping in a broken frame, and put the
                   index back so the arrows stay predictable. */
                i = from;
                if (window.console && console.warn) {
                    console.warn('[maho] screenshot "' + s.title + '" did not load (' + outcome + ')');
                }
                return;
            }

            // Park the currently-visible capture on the hold layer so the
            // crossfade reveals it (not the dark stage) behind the new one.
            hold.src = stage.classList.contains('is-dark') ? dark.src : light.src;
            hold.style.opacity = '1';

            light.src = s.light;                // instant: already in cache
            dark.src = s.dark;
            render();                           // update the chrome name to match

            frame.classList.remove('mh-shot-fade');
            void frame.offsetWidth;             // restart the crossfade
            frame.classList.add('mh-shot-fade');
        });
    }

    // Once the new frame has fully faded in, drop the held outgoing image.
    frame.addEventListener('animationend', function () {
        hold.style.opacity = '0';
    });

    function toggleMode() {
        stage.classList.toggle('is-dark');
        if (win) win.classList.add('is-hint-done'); // stop the attention hint
        render();
    }
    bulb.addEventListener('click', toggleMode);
    var hint = document.getElementById('mh-bulb-hint');
    if (hint) hint.addEventListener('click', toggleMode); // the hint label toggles too

    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });

    // Touch: swipe left/right to browse screens (mainly for mobile).
    // Track the first touch, and on release fire a navigation only when the
    // gesture is clearly horizontal so vertical page scrolling stays intact.
    var swipeX = 0, swipeY = 0, swiping = false;
    stage.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) { swiping = false; return; }
        swipeX = e.touches[0].clientX;
        swipeY = e.touches[0].clientY;
        swiping = true;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
        if (!swiping) return;
        swiping = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - swipeX;
        var dy = t.clientY - swipeY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            go(dx < 0 ? 1 : -1);   // swipe left = next, swipe right = previous
        }
    }, { passive: true });

    render();
}

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
    mahoSafe('admin showcase', mahoSetupShots);
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
}

if (typeof window !== 'undefined' && window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(mahoBoot);
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mahoBoot);
} else {
    mahoBoot(); // the script loaded late; the document is already parsed
}
