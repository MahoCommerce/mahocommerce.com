// https://github.com/kasnder/youtube-embedding-consent
function unblockVideos() {
    document.querySelectorAll('.video_wrapper .video_trigger').forEach(function(_trigger) {
        _trigger.style.display = 'none';

        // seek video_layer element
        for (var i = 0; i < _trigger.parentNode.childNodes.length; i++) {
            var video_layer = _trigger.parentNode.childNodes[i];
            if (video_layer.className == "video_layer") {
                video_layer.style.display = 'block';

                // seek iframe element
                for (var j = 0; j < video_layer.childNodes.length; j++) {
                    var iframe = video_layer.childNodes[j];
                    if (iframe.tagName.toLowerCase() == 'iframe') {
                        var videoId = _trigger.getAttribute('data-source');
                        iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?controls=1&showinfo=0&autoplay=1&mute=0';
                    }
                }
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelectorAll('.video_wrapper .video_trigger .video-btn').forEach(function(node) {
        node.addEventListener("click", function(event) {
            unblockVideos();
        });
    });
});


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

/* Drive the terminal: type the active scene, hold, flip to the next scene,
   type it, and repeat. A single scene just types once. */
function mahoCycleTerminal(term) {
    if (!term) return;
    var scenes = Array.prototype.slice.call(term.querySelectorAll('.mh-term-scene'));
    if (!scenes.length) return;

    var HOLD = 3400; // dwell on a finished scene before flipping away
    var i = 0;

    function activate(idx) {
        scenes.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
    }

    function typeCurrent() {
        mahoTypeScene(scenes[i], function () {
            if (scenes.length < 2) return; // single scene: type once and stop
            mahoTermDelay(function () {
                mahoFlipTerminal(term, function () {
                    i = (i + 1) % scenes.length;
                    activate(i);
                    mahoBlankScene(scenes[i]); // blank before it flips into view
                }, typeCurrent);
            }, HOLD);
        });
    }

    activate(0);
    mahoBlankScene(scenes[0]);
    mahoTermDelay(typeCurrent, 360); // let the panel slide in first
}

/* Fade/slide content blocks in as they enter the viewport. */
function mahoSetupReveal() {
    var selector = '.mh-proof, .mh-sec-head, .feature-card, .final-cta-inner';
    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    targets.forEach(function (el) {
        // small stagger between siblings sharing a parent
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) {
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

/* Gently auto-advance each feature carousel as a "scrollable" hint.
   Only runs while the carousel is on screen, and backs off completely
   as soon as the visitor interacts with it. */
var mahoCarouselTimers = [];

function mahoClearCarousels() {
    mahoCarouselTimers.forEach(function (id) { clearInterval(id); });
    mahoCarouselTimers = [];
}

function mahoSetupCarousels() {
    var grids = Array.prototype.slice.call(document.querySelectorAll('.features-grid'));
    grids.forEach(function (grid) {
        var cards = grid.querySelectorAll('.feature-card');
        if (cards.length < 2) return;

        var state = { visible: false, paused: false, idle: null };

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { state.visible = e.isIntersecting; });
            }, { threshold: 0.35 }).observe(grid);
        } else {
            state.visible = true;
        }

        // Any genuine user interaction pauses auto-advance for a while.
        function pause() {
            state.paused = true;
            clearTimeout(state.idle);
            state.idle = setTimeout(function () { state.paused = false; }, 7000);
        }
        ['pointerenter', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin']
            .forEach(function (ev) { grid.addEventListener(ev, pause, { passive: true }); });

        var id = setInterval(function () {
            if (!state.visible || state.paused || document.hidden) return;
            var cardList = grid.querySelectorAll('.feature-card');
            var step = cardList.length > 1
                ? (cardList[1].offsetLeft - cardList[0].offsetLeft)
                : cardList[0].offsetWidth;
            var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
            if (atEnd) {
                grid.scrollTo({ left: 0, behavior: 'smooth' });   // loop back
            } else {
                grid.scrollBy({ left: step, behavior: 'smooth' }); // next card
            }
        }, 4500);

        mahoCarouselTimers.push(id);
    });
}

/* ---- Hero admin showcase: lightbulb toggle + prev/next arrows ----
   One screenshot at a time; a lightbulb in the window chrome crossfades
   between the light and dark capture. Big arrows step through the screens
   (wrapping), keeping the current mode: the frame is hidden behind a
   spinner until the next capture decodes, then slides in from the chosen
   direction. Progressive enhancement: without JS the first shot shows. */
function mahoSetupShots() {
    var stage = document.getElementById('mh-shot-stage');
    if (!stage) return;
    var bulb = document.getElementById('mh-bulb');
    var title = document.getElementById('mh-shot-title');
    var frame = document.getElementById('mh-shot-frame');
    var spinner = document.getElementById('mh-shot-spinner');
    var hold = document.getElementById('mh-shot-hold');
    var light = document.getElementById('mh-shot-light');
    var dark = document.getElementById('mh-shot-dark');
    var win = document.getElementById('mh-shot-window');

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

    function decode(img) {
        if (!img.decode) {
            return new Promise(function (res) {
                if (img.complete) { res(); return; }
                img.onload = img.onerror = res;
            });
        }
        return img.decode().catch(function () {});
    }

    function go(step) {
        var token = ++navToken;
        i = (i + step + screens.length) % screens.length;
        var s = screens[i];

        // Keep the current screenshot on screen; preload the next one
        // off-screen and only swap once it's decoded.
        spinner.hidden = false;
        var preL = new Image();
        var preD = new Image();
        preL.src = s.light;
        preD.src = s.dark;

        Promise.all([decode(preL), decode(preD)]).then(function () {
            if (token !== navToken) return;     // a newer navigation superseded this one
            spinner.hidden = true;

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

    document.getElementById('mh-shot-prev').addEventListener('click', function () { go(-1); });
    document.getElementById('mh-shot-next').addEventListener('click', function () { go(1); });

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

function mahoInitHome() {
    var hero = document.querySelector('.mh-hero');
    if (!hero) return;            // only on the home page
    mahoSetupShots();             // works with or without motion
    if (mahoReducedMotion()) return; // CSS keeps everything visible

    mahoClearCarousels(); // avoid duplicate timers across instant navigations
    mahoClearTerm();
    document.documentElement.classList.add('mh-anim');
    mahoCycleTerminal(document.querySelector('.mh-term'));
    mahoSetupReveal();
    mahoSetupCarousels();
}

// Run on first load, and again after Material "instant" navigations.
if (typeof window !== 'undefined' && window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(mahoInitHome);
} else {
    document.addEventListener('DOMContentLoaded', mahoInitHome);
}
