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
   Scroll-driven hero slides + scroll-reveal for content blocks.
   Pure progressive enhancement: if this never runs, the page is
   fully visible and usable. Honors prefers-reduced-motion.
   ============================================================ */
function mahoReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---- Hero slides ----
   The scroll drives the slides, in two ways. Wide and tall screens (the CSS
   HERO SCROLL MODE query): the hero is a scroll track, its pin sticks, and
   each quarter of the track shows the next slide. One column (up to 1024px):
   the panel sticks under the header, and the step nearest to a line at 10%
   of the space below it is active. A step title scrolls to its slide. Wide
   but short screens: a slideshow on a timer, a title selects, the pause
   button stops it (WCAG 2.2.2). Reduced motion: no timer, no drawing, no
   tilt; the scroll and the titles still select.
   Window listeners outlive a Material "instant" navigation, so each setup
   removes the listeners of the one before. */
var mahoHeroTeardown = null;

function mahoTeardownHero() {
    if (mahoHeroTeardown) mahoHeroTeardown();
    mahoHeroTeardown = null;
}

function mahoOnMedia(mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
}

function mahoOffMedia(mq, fn) {
    if (mq.removeEventListener) mq.removeEventListener('change', fn);
    else if (mq.removeListener) mq.removeListener(fn);
}

function mahoSetupHeroSlides() {
    mahoTeardownHero();

    var slides = document.getElementById('mh-slides');
    if (!slides) return;
    var hero = slides.closest('.mh-hero');
    var track = hero.querySelector('.mh-hero-track');
    var pin = hero.querySelector('.mh-hero-pin');
    var side = document.getElementById('mh-hero-side');
    var items = Array.prototype.slice.call(slides.querySelectorAll('[data-slide]'));
    var stepList = document.getElementById('mh-hero-steps');
    var steps = stepList ? Array.prototype.slice.call(stepList.querySelectorAll('[data-step]')) : [];
    var pause = document.getElementById('mh-slides-pause');
    var showcase = hero.querySelector('.mh-showcase');
    var header = document.querySelector('.md-header');
    var heroScroll = window.matchMedia('screen and (min-width: 1025px) and (min-height: 720px)');
    var narrowHero = window.matchMedia('screen and (max-width: 64em)');
    var reduceMotion = mahoReducedMotion();
    var HOLD_MS = 6000;
    var current = 0;
    var timer = null;
    var frame = null;

    slides.style.setProperty('--mh-hold', HOLD_MS + 'ms');

    /* Line art draws itself: every stroked shape gets a length of 1 and a
       delay in document order. Flow dashes, the orbit and filled marks keep
       their own look. .is-live lets the terminal slide type its lines. */
    slides.classList.toggle('is-live', !reduceMotion);
    slides.querySelectorAll('.mh-art').forEach(function (art) {
        art.classList.toggle('is-drawable', !reduceMotion);
        if (reduceMotion) return;
        var shapes = Array.prototype.slice.call(art.querySelectorAll('rect, circle, path')).filter(function (el) {
            return !el.matches('.flow, .orbit, .acc-fill, .dot');
        });
        shapes.forEach(function (el, i) {
            el.setAttribute('pathLength', '1');
            el.style.setProperty('--d', (i * 0.035).toFixed(3) + 's');
        });
    });

    function clamp01(v) { return Math.min(1, Math.max(0, v)); }
    function headerHeight() { return header ? header.offsetHeight : 0; }
    function isPaused() { return pause && pause.classList.contains('is-paused'); }
    function timerMode() {
        return !heroScroll.matches && !narrowHero.matches && !reduceMotion && items.length > 1 && !!pause;
    }
    function narrowReference() {
        var bottom = side.getBoundingClientRect().bottom;
        return bottom + (window.innerHeight - bottom) * 0.1;
    }
    function trackRange() { return track.offsetHeight - pin.offsetHeight; }
    /* The end of the track where the screenshots window rises over the
       pinned hero: the CSS pulls the window up by that much */
    function finaleRange() {
        return showcase ? Math.max(0, -parseFloat(window.getComputedStyle(showcase).marginTop) || 0) : 0;
    }
    function stepsRange() { return trackRange() - finaleRange(); }
    // The scroll position where the pin starts to hold
    function trackTop() { return track.getBoundingClientRect().top + window.scrollY - headerHeight(); }
    hero.classList.add('has-finale');

    // Restart the fill of the active step bar from zero
    function restartFill() {
        if (!stepList) return;
        stepList.classList.remove('is-cycling');
        if (!timerMode() || isPaused()) return;
        void stepList.offsetWidth;
        stepList.classList.add('is-cycling');
    }

    function show(index) {
        if (index === current && items[index].classList.contains('is-active')) return;
        current = index;
        items.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
        steps.forEach(function (step, i) {
            step.classList.toggle('is-active', i === index);
            step.classList.toggle('is-done', i < index);
            var button = step.querySelector('[data-step-button]');
            if (i === index) button.setAttribute('aria-current', 'true');
            else button.removeAttribute('aria-current');
        });
        restartFill();
    }

    function stop() { window.clearTimeout(timer); }
    function schedule() {
        stop();
        if (!timerMode() || isPaused() || document.hidden) return;
        timer = window.setTimeout(function () { show((current + 1) % items.length); schedule(); }, HOLD_MS);
    }

    /* --mh-sp: progress through the steps of the track (0 to 1). --mh-fp:
       progress of the finale, the screenshots window rising over the hero.
       --mh-hp: progress of the hero leaving, which tilts the panel back.
       --mh-sub: progress through the active slide, which fills its step
       bar. */
    function setFinale(fp) {
        hero.style.setProperty('--mh-fp', fp.toFixed(4));
        // A few pixels short of the end count as the end: the browser's own
        // focus scroll can stop there, and the window must take the pointer
        hero.classList.toggle('is-rising', fp > 0 && fp < 0.97);
        hero.classList.toggle('is-past', fp > 0.5);
    }

    function sync() {
        frame = null;
        var headerH = headerHeight();
        if (heroScroll.matches) {
            var range = stepsRange();
            var finale = finaleRange();
            var y = headerH - track.getBoundingClientRect().top;
            var p = clamp01(y / range);
            var fp = finale ? clamp01((y - range) / finale) : 0;
            var scaled = p * items.length;
            var index = Math.min(items.length - 1, Math.floor(scaled));
            hero.style.setProperty('--mh-sp', p.toFixed(4));
            hero.style.setProperty('--mh-hp', fp.toFixed(4));
            hero.style.setProperty('--mh-sub', clamp01(scaled - index).toFixed(4));
            setFinale(fp);
            show(index);
            return;
        }
        setFinale(0);
        if (narrowHero.matches && side && steps.length) {
            var ref = narrowReference();
            var rects = steps.map(function (step) { return step.getBoundingClientRect(); });
            var centers = rects.map(function (r) { return r.top + r.height / 2; });
            var nearest = 0;
            centers.forEach(function (c, i) {
                if (Math.abs(c - ref) < Math.abs(centers[nearest] - ref)) nearest = i;
            });
            hero.style.setProperty('--mh-sp', clamp01((ref - centers[0]) / (centers[centers.length - 1] - centers[0])).toFixed(4));
            hero.style.setProperty('--mh-hp', '0');
            hero.style.setProperty('--mh-sub', clamp01((ref - rects[nearest].top) / rects[nearest].height).toFixed(4));
            show(nearest);
        } else {
            hero.style.setProperty('--mh-sp', '0.5');
            hero.style.setProperty('--mh-hp', clamp01((headerH - pin.getBoundingClientRect().top) / pin.offsetHeight).toFixed(4));
        }
    }
    function requestSync() { if (frame === null) frame = window.requestAnimationFrame(sync); }

    /* The open step texts have different heights. The list keeps the
       height of the closed titles plus the tallest text, so the centred
       hero does not move when the active step changes. */
    function fitSteps() {
        if (!stepList) return;
        var closed = 0;
        var tallest = 0;
        steps.forEach(function (step) {
            var text = step.querySelector('.mh-step-text');
            var css = window.getComputedStyle(text);
            // A closed text keeps its padding
            var padding = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
            closed += step.offsetHeight - step.querySelector('.mh-step-body').offsetHeight + padding;
            tallest = Math.max(tallest, text.scrollHeight - padding);
        });
        stepList.style.setProperty('--mh-steps-h', Math.ceil(closed + tallest) + 'px');
    }
    function onResize() {
        fitSteps();
        requestSync();
    }

    function applyMode() {
        fitSteps();
        if (stepList) stepList.classList.toggle('is-scrolling', heroScroll.matches || narrowHero.matches);
        if (pause) pause.hidden = !timerMode();
        restartFill();
        schedule();
        sync();
    }

    var behavior = reduceMotion ? 'auto' : 'smooth';
    var stepClicks = steps.map(function (step, i) {
        var onClick = function () {
            if (heroScroll.matches) {
                window.scrollTo({ top: trackTop() + stepsRange() * (i + 0.1) / items.length, behavior: behavior });
                return;
            }
            if (narrowHero.matches && side) {
                var r = step.getBoundingClientRect();
                window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - narrowReference(), behavior: behavior });
                return;
            }
            show(i);
            schedule();
        };
        step.querySelector('[data-step-button]').addEventListener('click', onClick);
        return onClick;
    });

    function onPause() {
        var paused = pause.classList.toggle('is-paused');
        var label = paused ? 'Resume the slides' : 'Pause the slides';
        pause.setAttribute('aria-label', label);
        pause.setAttribute('title', label);
        if (paused) {
            stop();
            if (stepList) stepList.classList.remove('is-cycling');
        } else {
            show((current + 1) % items.length);
            schedule();
        }
    }
    if (pause) pause.addEventListener('click', onPause);

    // Do not burn cycles in a background tab
    function onVisibility() {
        if (document.hidden) stop();
        else { restartFill(); schedule(); }
    }

    // The stage tilts toward the pointer, and the sheen follows it
    var tilt = side && !reduceMotion && window.matchMedia('(pointer: fine)').matches;
    function onPointerMove(e) {
        var r = side.getBoundingClientRect();
        side.style.setProperty('--mh-hy', (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2) + 'deg');
        side.style.setProperty('--mh-hx', (((e.clientY - r.top) / r.height - 0.5) * -9).toFixed(2) + 'deg');
        var s = slides.getBoundingClientRect();
        slides.style.setProperty('--mh-mx', ((e.clientX - s.left) / s.width * 100).toFixed(1) + '%');
        slides.style.setProperty('--mh-my', ((e.clientY - s.top) / s.height * 100).toFixed(1) + '%');
    }
    function onPointerLeave() {
        side.style.setProperty('--mh-hy', '0deg');
        side.style.setProperty('--mh-hx', '0deg');
    }
    if (tilt) {
        side.addEventListener('pointermove', onPointerMove);
        side.addEventListener('pointerleave', onPointerLeave);
    }

    /* In the finale the hero and the window share the screen, so the browser
       does not scroll to a focused control. Scroll to where that control is
       the one in view: the hero before the window rises, the window after. */
    function onFocusIn(e) {
        if (!heroScroll.matches || !finaleRange()) return;
        var inPin = pin.contains(e.target);
        var inShowcase = showcase && showcase.contains(e.target);
        // After the frame: the browser runs its own focus scroll after this event
        window.requestAnimationFrame(function () {
            var y = headerHeight() - track.getBoundingClientRect().top;
            if (inPin && y > stepsRange()) {
                window.scrollTo({ top: trackTop() + stepsRange(), behavior: 'auto' });
            } else if (inShowcase && y < trackRange()) {
                window.scrollTo({ top: trackTop() + trackRange(), behavior: 'auto' });
            }
        });
    }
    hero.addEventListener('focusin', onFocusIn);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    if (document.fonts) document.fonts.ready.then(fitSteps);
    mahoOnMedia(heroScroll, applyMode);
    mahoOnMedia(narrowHero, applyMode);
    applyMode();

    mahoHeroTeardown = function () {
        stop();
        if (frame !== null) window.cancelAnimationFrame(frame);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('scroll', requestSync);
        window.removeEventListener('resize', onResize);
        if (stepList) stepList.style.removeProperty('--mh-steps-h');
        mahoOffMedia(heroScroll, applyMode);
        mahoOffMedia(narrowHero, applyMode);
        steps.forEach(function (step, i) {
            step.querySelector('[data-step-button]').removeEventListener('click', stepClicks[i]);
        });
        if (pause) pause.removeEventListener('click', onPause);
        hero.removeEventListener('focusin', onFocusIn);
        if (tilt) {
            side.removeEventListener('pointermove', onPointerMove);
            side.removeEventListener('pointerleave', onPointerLeave);
            onPointerLeave();
        }
    };
}

/* Fade/slide content blocks in as they enter the viewport. */
function mahoSetupReveal() {
    var selector = '.mh-proof, .mh-sec-head, .mh-themes-inner, .feature-card, .mh-cloud-col, .final-cta-inner';
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

/* Wire the sponsor strip pause control. Everything that moves on its own must
   have a control any visitor can reach, not only one who set
   prefers-reduced-motion at the OS level (WCAG 2.2.2, Level A). The hero
   slideshow wires its own control in mahoSetupHeroSlides. */
function mahoSetupMotionControls() {
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
   motion on mid-session keeps the slideshow timer and the line drawing until
   they reload. */
var mahoMotionWatched = false;
function mahoWatchReducedMotion() {
    if (mahoMotionWatched || !window.matchMedia) return;
    mahoMotionWatched = true;
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mahoOnMedia(mq, function () {
        if (mq.matches) document.documentElement.classList.remove('mh-anim');
        if (document.querySelector('.mh-hero')) mahoInitHome();
    });
}

function mahoInitHome() {
    mahoSafe('videos', mahoSetupVideos);   // every page, not only the home page
    mahoWatchReducedMotion();

    var hero = document.querySelector('.mh-hero');
    if (!hero) {
        /* Left the home page. Without this the scroll listeners and the
           slideshow timer keep firing against detached nodes for the rest of
           the session. */
        mahoTeardownHero();
        return;
    }

    /* Each feature is independent, so each one fails alone. The pause controls
       carry a WCAG obligation and must not depend on a decorative showcase. */
    mahoSafe('motion controls', mahoSetupMotionControls);
    mahoSafe('stores carousel', mahoSetupStores);
    mahoSafe('hero slides', mahoSetupHeroSlides); // reduced motion too: the scroll still selects

    if (mahoReducedMotion()) return; // CSS keeps everything visible

    document.documentElement.classList.add('mh-anim');
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

/* ---- Blog, Community & User Guide sidebars: keep their groups expanded ----
   The collapsible sidebar (navigation.sections is off, which keeps the large
   developer docs sidebar short) collapses nested groups by default. On the
   small blog, community and user guide sections we want their groups open, so
   check every nested toggle in the primary sidebar on each load. The path guard
   leaves the big developer docs sidebar collapsible. */
function mahoExpandSectionNav() {
    var p = location.pathname;
    if (p.indexOf('/blog/') === -1 && p.indexOf('/community/') === -1 && p.indexOf('/user-guide/') === -1) return;
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
    function show(next, gate) {
        if (!itemOf(next).dark) next.dark = false;
        var token = ++navToken;
        pending = next;
        var target = srcOf(next);
        if (spinner) spinner.hidden = false;
        var pre = new Image();
        pre.src = target;
        var loaded = mahoSettleWithin(mahoDecodeImage(pre), LOAD_TIMEOUT);
        // an optional gate holds the swap until the window is edge-on (the flip)
        return Promise.all([loaded, gate || Promise.resolve()]).then(function (results) {
            var outcome = results[0];
            if (token !== navToken) return false;
            pending = null;
            if (spinner) spinner.hidden = true;
            if (outcome !== 'ok') {
                if (window.console && console.warn) {
                    console.warn('[maho] capture "' + target + '" did not load (' + outcome + ')');
                }
                return false;
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
            return true;
        });
    }

    /* Switching tabs turns the content over, like looking at the back of the
       shop: the stage rotates edge-on, the capture swaps while nothing is
       visible, and it rotates back in from the other side. The admin is the
       back, so the two directions are opposite. */
    var FLIP = 260;
    var FLIP_EASE = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)';
    var stage = root.querySelector('.mh-shot-stage');
    function flipTo(next) {
        var dir = next.mode === 'admin' ? -1 : 1;
        stage.classList.add('is-flipping');
        stage.style.transition = 'transform ' + FLIP + 'ms ' + FLIP_EASE;
        stage.style.transform = 'rotateY(' + (90 * dir) + 'deg)';
        var edge = new Promise(function (res) { setTimeout(res, FLIP); });
        show(next, edge).then(function (swapped) {
            stage.style.transition = 'none';
            stage.style.transform = swapped ? 'rotateY(' + (-90 * dir) + 'deg)' : stage.style.transform;
            void stage.offsetWidth;
            stage.style.transition = 'transform ' + FLIP + 'ms ' + FLIP_EASE;
            stage.style.transform = 'rotateY(0deg)';
            setTimeout(function () {
                stage.style.transition = '';
                stage.style.transform = '';
                stage.classList.remove('is-flipping');
            }, FLIP);
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
            var next = { mode: m, i: modes[m].i, page: c.page, dark: c.dark };
            if (fade && stage && !stage.classList.contains('is-flipping')) flipTo(next);
            else show(next);
        });
    });
    Object.keys(modes).forEach(function (m) {
        modes[m].items.forEach(function (x, k) {
            x.el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation(); // keep the click from Material's instant navigation
                // a theme pick always opens that theme's home page
                show({ mode: m, i: k, page: 'home', dark: cur().dark });
            });
        });
    });
    pageBtns.forEach(function (el) {
        el.addEventListener('click', function () {
            var c = cur();
            show({ mode: 'store', i: c.mode === 'store' ? c.i : modes.store.i, page: el.getAttribute('data-page'), dark: c.dark });
        });
    });
    /* Full window: the showcase covers the browser window (not the screen),
       the capture fills it and scrolls. Escape and the same button leave it. */
    var full = root.querySelector('.mh-full');
    if (full && win) {
        var setFull = function (on) {
            win.classList.toggle('is-full', on);
            document.documentElement.classList.toggle('mh-full-lock', on);
            full.setAttribute('aria-label', on ? 'Leave full window' : 'Fill the browser window');
            full.setAttribute('title', on ? 'Leave full window' : 'Fill the browser window');
        };
        full.addEventListener('click', function () {
            setFull(!win.classList.contains('is-full'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && win.classList.contains('is-full')) setFull(false);
        });
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
