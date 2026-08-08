/* ============================================================
   FantasyTrader — shared company-logo tiles (TradingView style)
   Tiny standalone file: safe to load on ANY page.
   Provides:
     window.stockLogo(sym)      → primary logo URL
     window.stockLogoAlt(sym)   → fallback logo URL
     window.logoHtml(sym, sector, cls) → ready-to-inject HTML
   Fallback chain: parqet → financialmodelingprep → colored monogram.
   The <img> is stacked ABOVE the monogram, so initials are only
   ever visible when both image sources fail.
   ============================================================ */
(function () {
    'use strict';

    var clean = function (sym) {
        return encodeURIComponent(String(sym || '').trim().toUpperCase().replace('.', '-'));
    };

    // Don't clobber definitions that draft-universe.js may already have set.
    if (!window.stockLogo) {
        window.stockLogo = function (sym) {
            return 'https://assets.parqet.com/logos/symbol/' + clean(sym) + '?format=png&size=64';
        };
    }
    if (!window.stockLogoAlt) {
        window.stockLogoAlt = function (sym) {
            return 'https://financialmodelingprep.com/image-stock/' + clean(sym) + '.png';
        };
    }

    window.LOGO_SECTOR_COLORS = window.LOGO_SECTOR_COLORS || {
        'Technology': '#5CB88A', 'Communication Services': '#7ACCA3',
        'Consumer Discretionary': '#E0A24C', 'Consumer Staples': '#C9955B',
        'Healthcare': '#9DB8D2', 'Financials': '#6aa08d', 'Energy': '#D9645C',
        'Industrials': '#B7ADA1', 'Materials': '#A88C6B', 'Real Estate': '#8FA9C4',
        'Utilities': '#7FB3A0', 'ETF': '#C4A87A'
    };

    /* One stable colour per ticker even when we have no sector. */
    function tileColor(sym, sector) {
        var map = window.LOGO_SECTOR_COLORS;
        if (sector && map[sector]) return map[sector];
        var pal = ['#5CB88A', '#E0A24C', '#9DB8D2', '#C9955B', '#7ACCA3', '#A88C6B', '#8FA9C4', '#6aa08d'];
        var h = 0, s = String(sym || '');
        for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
        return pal[h % pal.length];
    }

    window.logoHtml = function (sym, sector, cls) {
        var s = String(sym || '').trim();
        var initials = s.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || '?';
        var esc = s.replace(/'/g, '');
        return '<span class="logo-tile ' + (cls || '') + '" style="background:' + tileColor(s, sector) + '" title="' + esc + '">' +
               '<span class="logo-mono">' + initials + '</span>' +
               '<img class="logo-img" src="' + window.stockLogo(esc) + '" alt="" loading="lazy" ' +
               'onerror="if(!this.dataset.f){this.dataset.f=1;this.src=window.stockLogoAlt(\'' + esc + '\');}else{this.remove();}">' +
               '</span>';
    };

    /* Inject the styles once, so pages only need the <script> tag. */
    if (!document.getElementById('ft-logo-css')) {
        var css = document.createElement('style');
        css.id = 'ft-logo-css';
        css.textContent = [
            '.logo-tile{width:30px;height:30px;border-radius:7px;flex:0 0 auto;overflow:hidden;',
            'display:inline-flex;align-items:center;justify-content:center;position:relative;vertical-align:middle;}',
            /* monogram sits at the bottom of the stack */
            '.logo-tile .logo-mono{position:absolute;inset:0;z-index:0;display:flex;align-items:center;',
            'justify-content:center;font:800 .66rem Inter,system-ui,sans-serif;color:#14110E;letter-spacing:-.02em;}',
            /* the image is absolutely positioned ON TOP, so it fully hides the initials */
            '.logo-tile .logo-img{position:absolute;inset:0;z-index:1;width:100%;height:100%;',
            'object-fit:contain;background:#fff;display:block;}',
            '.logo-tile.sm{width:22px;height:22px;border-radius:5px;}',
            '.logo-tile.sm .logo-mono{font-size:.55rem;}',
            '.logo-tile.lg{width:38px;height:38px;border-radius:9px;}',
            '.logo-tile.lg .logo-mono{font-size:.8rem;}'
        ].join('');
        (document.head || document.documentElement).appendChild(css);
    }
})();
