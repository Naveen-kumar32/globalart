"""Assemble the Globalart pages: inject shared head/header/footer and snippets into src/*.html."""
import json, pathlib, re, sys

SRC = pathlib.Path(__file__).parent / "src"
OUT = pathlib.Path(sys.argv[1])

NAV = [("about.html", "About"), ("courses.html", "Courses"), ("centres.html", "Find a Centre"),
       ("stories.html", "Stories"), ("faq.html", "FAQs"), ("contact.html", "Contact")]
MOBILE = [("index.html", "🏠", "Home"), ("about.html", "🌏", "About Us"), ("courses.html", "🎨", "Courses"),
          ("centres.html", "📍", "Find a Centre"), ("franchise.html", "🤝", "Franchise"), ("stories.html", "💬", "Parent Stories"),
          ("faq.html", "❓", "FAQs"), ("contact.html", "📞", "Contact")]

GLOBIE = """<svg viewBox="0 0 240 240" aria-hidden="true">
  <g class="globie__all">
    <path class="globie__arm" d="M196 150 C 214 140, 222 120, 226 100" />
    <g class="globie__brushg"><rect class="globie__brush" x="219" y="52" width="14" height="52" rx="7" transform="rotate(14 226 78)"/><path class="globie__tip" d="M226 34 C 240 44, 238 56, 232 58 L 220 55 C 214 52, 214 42, 226 34Z"/></g>
    <path class="globie__body" d="M120 34 C 176 34, 206 74, 206 128 C 206 182, 170 214, 120 214 C 70 214, 34 182, 34 128 C 34 74, 64 34, 120 34Z"/>
    <path class="globie__shine" d="M70 84 C 80 64, 100 54, 118 54 C 98 62, 84 74, 78 96Z"/>
    <path class="globie__beret" d="M66 66 C 70 34, 160 22, 178 56 C 150 52, 100 52, 66 66Z"/>
    <circle cx="124" cy="28" r="8" class="globie__beret"/>
    <g class="globie__eyes">
      <ellipse class="globie__eye" cx="92" cy="118" rx="20" ry="23"/>
      <ellipse class="globie__eye" cx="150" cy="118" rx="20" ry="23"/>
      <circle class="globie__pupil" data-cx="92" data-cy="120" cx="92" cy="120" r="9"/>
      <circle class="globie__pupil" data-cx="150" data-cy="120" cx="150" cy="120" r="9"/>
      <circle cx="95" cy="114" r="3" fill="#fff" class="globie__glint"/>
      <circle cx="153" cy="114" r="3" fill="#fff" class="globie__glint"/>
    </g>
    <ellipse class="globie__cheek" cx="70" cy="152" rx="12" ry="8"/>
    <ellipse class="globie__cheek" cx="172" cy="152" rx="12" ry="8"/>
    <path class="globie__mouth" d="M100 156 C 108 178, 134 178, 142 156 Z"/>
  </g>
</svg>"""

WAVE_TOP = '<svg class="wave wave--top" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 L1440,0 L1440,40 C1200,85 960,5 720,45 C480,85 240,5 0,45 Z"/></svg>'
WAVE_BOTTOM = '<svg class="wave wave--bottom" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 L1440,0 L1440,40 C1200,85 960,5 720,45 C480,85 240,5 0,45 Z"/></svg>'
MARK = '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C 50 4, 100 4, 150 10 S 190 16, 196 7"/></svg>'

DOODLES = {
    "STAR": '<svg viewBox="0 0 100 100"><path d="M50 6 61 37 94 38 68 58 77 91 50 72 23 91 32 58 6 38 39 37Z" fill="#FFD43B" stroke="#1E1B4B" stroke-width="4" stroke-linejoin="round"/></svg>',
    "SWIRL": '<svg viewBox="0 0 120 60"><path class="dd-stroke" d="M6 40 C 20 6, 44 6, 46 30 C 48 52, 24 52, 30 30 C 38 4, 76 6, 80 30 S 108 50, 114 20" stroke="#FF6FAE" stroke-width="5"/></svg>',
    "HEART": '<svg viewBox="0 0 100 90"><path d="M50 84 C 10 56, 4 34, 16 18 C 28 4, 46 10, 50 26 C 54 10, 72 4, 84 18 C 96 34, 90 56, 50 84Z" fill="#FF6FAE" stroke="#1E1B4B" stroke-width="4"/></svg>',
    "CLOUD": '<svg viewBox="0 0 140 80"><path d="M30 70 C 8 70, 6 44, 26 40 C 24 16, 56 10, 66 28 C 74 8, 110 12, 108 38 C 130 38, 134 70, 110 70Z" fill="#fff" stroke="#1E1B4B" stroke-width="4"/></svg>',
    "SUN": '<svg viewBox="0 0 100 100"><g stroke="#1E1B4B" stroke-width="4" stroke-linecap="round"><path d="M50 4v12M50 84v12M4 50h12M84 50h12M17 17l9 9M74 74l9 9M17 83l9-9M74 26l9-9"/></g><circle cx="50" cy="50" r="22" fill="#FFD43B" stroke="#1E1B4B" stroke-width="4"/></svg>',
    "SQUIGGLE": '<svg viewBox="0 0 160 30"><path class="dd-stroke" d="M4 16 Q 16 2, 28 16 T 52 16 T 76 16 T 100 16 T 124 16 T 148 16" stroke="#0095DA" stroke-width="5"/></svg>',
    "PENCIL": '<svg viewBox="0 0 60 160"><g stroke="#1E1B4B" stroke-width="4" stroke-linejoin="round"><rect x="14" y="20" width="32" height="104" fill="#22C58B"/><rect x="14" y="8" width="32" height="16" rx="6" fill="#FF6FAE"/><path d="M14 124 L30 154 L46 124Z" fill="#FFDCD2"/><path d="M25 144 L30 154 L35 144Z" fill="#1E1B4B"/></g></svg>',
    "BLOB": '<svg viewBox="0 0 100 100"><path d="M52 6 C 78 6, 96 26, 92 52 C 88 80, 66 96, 42 92 C 16 88, 4 66, 8 42 C 12 18, 30 6, 52 6Z" fill="#8B5CF6" stroke="#1E1B4B" stroke-width="4"/></svg>',
    "DOTS": '<svg viewBox="0 0 80 80"><g fill="#1E1B4B"><circle cx="10" cy="10" r="5"/><circle cx="40" cy="10" r="5"/><circle cx="70" cy="10" r="5"/><circle cx="10" cy="40" r="5"/><circle cx="40" cy="40" r="5"/><circle cx="70" cy="40" r="5"/><circle cx="10" cy="70" r="5"/><circle cx="40" cy="70" r="5"/><circle cx="70" cy="70" r="5"/></g></svg>',
}


def head(meta):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{meta['title']}</title>
  <meta name="description" content="{meta['desc']}" />
  <meta name="theme-color" content="#FFD43B" />
  <meta property="og:title" content="{meta['title']}" />
  <meta property="og:description" content="{meta['desc']}" />
  <link rel="icon" href="assets/globie-fav-icon-02.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Gochi+Hand&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <script>document.documentElement.classList.add('js');try{{if(sessionStorage.getItem('ga-trans')==='1')document.documentElement.classList.add('is-entering')}}catch(e){{}}setTimeout(function(){{document.documentElement.classList.remove('is-entering')}},3000)</script>
</head>
<body data-page="{meta['page']}">
<a class="sr-only" href="#main">Skip to content</a>
<div class="ptrans" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
<img class="ptrans__logo" src="assets/globie-fav-icon-02.png" alt="" aria-hidden="true" />
"""


def header(page):
    active = ' class="is-active" aria-current="page"'
    links = "".join('<a href="%s"%s>%s</a>' % (h, active if h.split(".")[0] == page else "", t) for h, t in NAV)
    mob = "".join(f'<a href="{h}" style="--i:{i}"><span>{e}</span>{t}</a>' for i, (h, e, t) in enumerate(MOBILE))
    return f"""<div class="topbar">
  <div class="wrap">
    <p class="topbar__msg">🎉 <span>Celebrating 21 years of nurturing creativity in India · <a href="https://www.globalart.in/kreativestar/" target="_blank" rel="noopener">Kreative Star ’26 is live →</a></span></p>
    <div class="topbar__links"><a href="franchise.html">Become a Franchisee</a><a href="https://www.sipacademysoftware.com/fa-ga/login" target="_blank" rel="noopener">Login</a></div>
  </div>
</div>
<header class="header" id="header">
  <div class="wrap">
    <div class="header__bar">
      <a href="index.html" class="logo" aria-label="Globalart home"><img src="assets/globalart-abacus.png" alt="globalart — Think Creative" width="150" height="42" /></a>
      <nav class="nav" aria-label="Main">{links}</nav>
      <div class="header__cta">
        <a href="franchise.html" class="btn btn--white btn--sm btn--hide-md">🤝 Franchise</a>
        <a href="contact.html#book" class="btn btn--pink btn--sm">✏️ Free Trial</a>
        <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="mmenu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu">
  <div class="mmenu__bg"></div>
  <nav aria-label="Mobile">{mob}</nav>
  <div class="mmenu__cta"><a href="contact.html#book" class="btn btn--pink btn--lg">✏️ Book a Free Trial Class</a><a href="tel:04442023331" class="btn btn--white">📞 044-42023331</a></div>
</div>
"""


FOOTER = f"""
<footer class="footer">
  <svg class="wave wave--top" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,50 C240,0 480,90 720,50 C960,10 1200,80 1440,50 L1440,91 L0,91 Z"/></svg>
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a href="index.html" class="footer__logo"><img src="assets/globalart-abacus.png" alt="globalart" width="150" height="42" /></a>
        <p>Using art & drawing to grow creativity, confidence and concentration in children aged 5–15 — since 1999.</p>
        <p>A unit of SIP Academy India Pvt. Ltd.<br/>#1, Ramakrishna Street, Kences Towers, 7th Floor, Off North Usman Road, T. Nagar, Chennai – 600 017</p>
        <div class="socials">
          <a href="https://www.facebook.com/GlobalArt?fref=ts" target="_blank" rel="noopener" aria-label="Facebook"><img src="assets/fb.svg" alt="" /></a>
          <a href="https://www.instagram.com/globalartindia/?hl=en" target="_blank" rel="noopener" aria-label="Instagram"><img src="assets/in.svg" alt="" /></a>
          <a href="https://www.youtube.com/channel/UCr-OUqgG0U6vEycU5cJvYYg" target="_blank" rel="noopener" aria-label="YouTube"><img src="assets/yt.svg" alt="" /></a>
          <a href="https://twitter.com/globalartindia" target="_blank" rel="noopener" aria-label="Twitter / X"><img src="assets/tw.svg" alt="" /></a>
        </div>
      </div>
      <div><h4>Explore</h4><nav><a href="about.html">About Globalart</a><a href="courses.html">Courses & Levels</a><a href="stories.html">Parent Stories</a><a href="faq.html">FAQs</a><a href="https://www.globalart.in/media-gallery/" target="_blank" rel="noopener">Gallery</a></nav></div>
      <div><h4>Join us</h4><nav><a href="contact.html#book">Book a Free Trial</a><a href="centres.html">Find a Centre</a><a href="franchise.html">Become a Franchisee</a><a href="https://www.globalart.in/kreativestar/" target="_blank" rel="noopener">Kreative Star ’26</a><a href="https://www.sipacademysoftware.com/fa-ga/login" target="_blank" rel="noopener">Login</a></nav></div>
      <div><h4>Say hello</h4><nav><a href="tel:04442023331">044-42023331</a><a href="tel:04442605609">044-42605609</a><a href="mailto:sipinfo@sipacademyindia.com">sipinfo@sipacademyindia.com</a><a href="tel:+917845741660">Franchise: 78457 41660</a></nav>
        <a class="footer__sip" href="http://www.sipacademyindia.com/" target="_blank" rel="noopener"><img src="assets/sip-academy-logo1.png" alt="SIP Academy" width="104" height="36" /></a></div>
    </div>
    <div class="footer__bottom"><span>© 2026 SIP Academy India Pvt. Ltd. All rights reserved.</span><span><a href="https://www.globalart.in/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a> · <a href="#main" data-top>Back to top ↑</a></span></div>
  </div>
</footer>
<a href="contact.html#book" class="fab" id="fab"><i>🎨</i>Free Trial Class</a>
"""

SCRIPTS = """<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
{extra}<script src="js/main.js"></script>
</body>
</html>
"""


def doodle(m):
    name, cls, style = m.group(1), m.group(2) or "", m.group(3) or ""
    return f'<div class="doodle" style="{style}" aria-hidden="true" data-depth="{0.6 if "bob" in cls else 0.3}"><div class="{cls}">{DOODLES[name]}</div></div>'


for f in sorted(SRC.glob("*.html")):
    text = f.read_text()
    first, body = text.split("\n", 1)
    meta = json.loads(first.strip()[4:-3])
    body = body.replace("{{GLOBIE}}", GLOBIE).replace("{{WAVE_TOP}}", WAVE_TOP).replace("{{WAVE_BOTTOM}}", WAVE_BOTTOM).replace("{{MARK}}", MARK)
    body = re.sub(r'\{\{D:(\w+)\|([^|}]*)\|([^}]*)\}\}', doodle, body)
    extra = '<script src="data/centres.js"></script>\n' if meta.get("centres") else ""
    html = head(meta) + header(meta["page"]) + '<main id="main">\n' + body + "\n</main>\n" + FOOTER + SCRIPTS.format(extra=extra)
    (OUT / f.name).write_text(html)
    print("built", f.name, len(html))
