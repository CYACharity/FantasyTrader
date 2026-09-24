/* ============================================================
 *  FT ILLUSTRATIONS — inline SVG art for the academy.
 *
 *  Deliberately not image files: these are drawn from the app's
 *  CSS variables, so they theme correctly, scale to any size,
 *  never 404, and add nothing to page weight beyond the markup.
 *
 *  Usage:  FTArt.get('bull')          -> svg string
 *          FTArt.node('candles', 220) -> svg string at a size
 * ============================================================ */
(function (global) {
    'use strict';

    const C = {
        sage:  '#5CB88A', sageD: '#3E8C65',
        honey: '#E0A24C', honeyD: '#B37C33',
        red:   '#D9645C', redD:  '#A6443D',
        blue:  '#9DB8D2', violet: '#A98BD0',
        ink:   '#F4EEE6', ink2:  '#B7ADA1', ink3: '#7D746A',
        surf:  '#221D19', surf2: '#2A241F', bg: '#14100E',
    };

    const wrap = (vb, body, size) =>
        '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg"' +
        (size ? ' width="' + size + '" height="' + size + '"' : '') +
        ' fill="none">' + body + '</svg>';

    const ART = {

        /* ── mascots ─────────────────────────────────────────── */
        bull: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="86" fill="' + C.sage + '" opacity="0.10"/>' +
            '<path d="M52 84c-9-16-6-30 2-34 9-5 19 3 24 12" stroke="' + C.sage + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M148 84c9-16 6-30-2-34-9-5-19 3-24 12" stroke="' + C.sage + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M63 78c0-19 16-30 37-30s37 11 37 30v26c0 25-17 42-37 42S63 129 63 104z" fill="' + C.sage + '"/>' +
            '<ellipse cx="100" cy="122" rx="21" ry="15" fill="' + C.sageD + '"/>' +
            '<circle cx="90" cy="118" r="3.4" fill="' + C.bg + '"/><circle cx="110" cy="118" r="3.4" fill="' + C.bg + '"/>' +
            '<circle cx="82" cy="93" r="7" fill="' + C.bg + '"/><circle cx="118" cy="93" r="7" fill="' + C.bg + '"/>' +
            '<circle cx="84" cy="91" r="2.4" fill="' + C.ink + '"/><circle cx="120" cy="91" r="2.4" fill="' + C.ink + '"/>' +
            '<path d="M150 150l16-16m-16 16l-3-11m3 11l11-3" stroke="' + C.sage + '" stroke-width="5" stroke-linecap="round"/>'),

        bear: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="86" fill="' + C.red + '" opacity="0.10"/>' +
            '<circle cx="62" cy="66" r="19" fill="' + C.red + '"/><circle cx="138" cy="66" r="19" fill="' + C.red + '"/>' +
            '<circle cx="62" cy="66" r="9" fill="' + C.redD + '"/><circle cx="138" cy="66" r="9" fill="' + C.redD + '"/>' +
            '<path d="M60 96c0-21 18-34 40-34s40 13 40 34v18c0 25-18 42-40 42s-40-17-40-42z" fill="' + C.red + '"/>' +
            '<ellipse cx="100" cy="126" rx="23" ry="17" fill="' + C.redD + '"/>' +
            '<ellipse cx="100" cy="118" rx="7" ry="5" fill="' + C.bg + '"/>' +
            '<path d="M100 123v8m0 0l-7 5m7-5l7 5" stroke="' + C.bg + '" stroke-width="3" stroke-linecap="round"/>' +
            '<circle cx="83" cy="97" r="6.5" fill="' + C.bg + '"/><circle cx="117" cy="97" r="6.5" fill="' + C.bg + '"/>' +
            '<path d="M52 148l16 16m-16-16l11-3m-11 3l3 11" stroke="' + C.red + '" stroke-width="5" stroke-linecap="round"/>'),

        /* ── core finance concepts ───────────────────────────── */
        candles: () => wrap('0 0 200 200',
            '<rect x="16" y="150" width="168" height="3" rx="1.5" fill="' + C.ink3 + '" opacity="0.4"/>' +
            '<g stroke-linecap="round">' +
            '<path d="M38 112v-26" stroke="' + C.sage + '" stroke-width="3"/><rect x="30" y="86" width="16" height="34" rx="3" fill="' + C.sage + '"/>' +
            '<path d="M70 132v-22" stroke="' + C.red + '" stroke-width="3"/><rect x="62" y="104" width="16" height="30" rx="3" fill="' + C.red + '"/>' +
            '<path d="M102 96v-30" stroke="' + C.sage + '" stroke-width="3"/><rect x="94" y="66" width="16" height="44" rx="3" fill="' + C.sage + '"/>' +
            '<path d="M134 120v-24" stroke="' + C.red + '" stroke-width="3"/><rect x="126" y="94" width="16" height="32" rx="3" fill="' + C.red + '"/>' +
            '<path d="M166 78v-26" stroke="' + C.sage + '" stroke-width="3"/><rect x="158" y="52" width="16" height="40" rx="3" fill="' + C.sage + '"/>' +
            '</g>'),

        growth: () => wrap('0 0 200 200',
            '<path d="M22 168V38" stroke="' + C.ink3 + '" stroke-width="3" stroke-linecap="round" opacity="0.5"/>' +
            '<path d="M22 168h156" stroke="' + C.ink3 + '" stroke-width="3" stroke-linecap="round" opacity="0.5"/>' +
            '<path d="M32 152c26 0 42-8 58-30s28-56 76-72" stroke="' + C.sage + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M32 152c26 0 42-8 58-30s28-56 76-72v100z" fill="' + C.sage + '" opacity="0.13"/>' +
            '<circle cx="166" cy="50" r="9" fill="' + C.sage + '"/>' +
            '<path d="M150 44l16-6 4 17" stroke="' + C.sage + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),

        risk: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="72" stroke="' + C.honey + '" stroke-width="8" opacity="0.28"/>' +
            '<path d="M100 28a72 72 0 0 1 62 108" stroke="' + C.honey + '" stroke-width="8" stroke-linecap="round"/>' +
            '<circle cx="100" cy="100" r="13" fill="' + C.ink + '"/>' +
            '<path d="M100 100L152 62" stroke="' + C.ink + '" stroke-width="8" stroke-linecap="round"/>' +
            '<text x="38" y="176" font-family="Inter,sans-serif" font-size="15" font-weight="700" fill="' + C.sage + '">LOW</text>' +
            '<text x="136" y="176" font-family="Inter,sans-serif" font-size="15" font-weight="700" fill="' + C.red + '">HIGH</text>'),

        diversify: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="66" fill="' + C.surf2 + '"/>' +
            '<path d="M100 34a66 66 0 0 1 57 33l-57 33z" fill="' + C.sage + '"/>' +
            '<path d="M157 67a66 66 0 0 1-8 72l-49-39z" fill="' + C.honey + '"/>' +
            '<path d="M149 139a66 66 0 0 1-98 0l49-39z" fill="' + C.blue + '"/>' +
            '<path d="M51 139a66 66 0 0 1 49-105v66z" fill="' + C.violet + '"/>' +
            '<circle cx="100" cy="100" r="26" fill="' + C.bg + '"/>'),

        compound: () => wrap('0 0 200 200',
            '<rect x="26" y="132" width="24" height="36" rx="4" fill="' + C.sage + '" opacity="0.45"/>' +
            '<rect x="60" y="112" width="24" height="56" rx="4" fill="' + C.sage + '" opacity="0.6"/>' +
            '<rect x="94" y="82" width="24" height="86" rx="4" fill="' + C.sage + '" opacity="0.78"/>' +
            '<rect x="128" y="40" width="24" height="128" rx="4" fill="' + C.sage + '"/>' +
            '<path d="M30 140c30-6 62-30 122-96" stroke="' + C.honey + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 7"/>' +
            '<circle cx="152" cy="44" r="8" fill="' + C.honey + '"/>'),

        dividend: () => wrap('0 0 200 200',
            '<rect x="44" y="52" width="112" height="76" rx="10" fill="' + C.surf2 + '" stroke="' + C.line || C.ink3 + '" stroke-width="2" opacity="0.9"/>' +
            '<circle cx="100" cy="90" r="24" fill="' + C.honey + '"/>' +
            '<text x="100" y="99" text-anchor="middle" font-family="Inter,sans-serif" font-size="26" font-weight="800" fill="' + C.bg + '">$</text>' +
            '<path d="M74 140v14m26-14v22m26-22v14" stroke="' + C.honey + '" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="74" cy="162" r="6" fill="' + C.honey + '"/><circle cx="100" cy="170" r="6" fill="' + C.honey + '"/><circle cx="126" cy="162" r="6" fill="' + C.honey + '"/>'),

        balance: () => wrap('0 0 200 200',
            '<path d="M100 32v120" stroke="' + C.ink2 + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M100 152h-34m34 0h34" stroke="' + C.ink2 + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M40 56h120" stroke="' + C.ink2 + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M40 56l-18 34a20 20 0 0 0 36 0z" fill="' + C.sage + '"/>' +
            '<path d="M160 56l-18 34a20 20 0 0 0 36 0z" fill="' + C.red + '"/>' +
            '<circle cx="100" cy="32" r="9" fill="' + C.honey + '"/>'),

        bond: () => wrap('0 0 200 200',
            '<rect x="26" y="54" width="148" height="94" rx="10" fill="' + C.surf2 + '" stroke="' + C.blue + '" stroke-width="3"/>' +
            '<path d="M26 82h148" stroke="' + C.blue + '" stroke-width="2.5" opacity="0.6"/>' +
            '<text x="44" y="74" font-family="Inter,sans-serif" font-size="13" font-weight="800" fill="' + C.blue + '">BOND</text>' +
            '<path d="M46 104h50m-50 16h74m-74 16h38" stroke="' + C.ink3 + '" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="142" cy="118" r="22" fill="' + C.blue + '" opacity="0.2"/>' +
            '<text x="142" y="127" text-anchor="middle" font-family="Inter,sans-serif" font-size="19" font-weight="800" fill="' + C.blue + '">%</text>'),

        market: () => wrap('0 0 200 200',
            '<rect x="18" y="96" width="34" height="72" rx="5" fill="' + C.surf2 + '"/>' +
            '<rect x="60" y="66" width="34" height="102" rx="5" fill="' + C.surf2 + '"/>' +
            '<rect x="102" y="86" width="34" height="82" rx="5" fill="' + C.surf2 + '"/>' +
            '<rect x="144" y="46" width="34" height="122" rx="5" fill="' + C.surf2 + '"/>' +
            '<g fill="' + C.sage + '"><rect x="26" y="106" width="8" height="8" rx="1.5"/><rect x="38" y="106" width="8" height="8" rx="1.5"/>' +
            '<rect x="68" y="76" width="8" height="8" rx="1.5"/><rect x="80" y="76" width="8" height="8" rx="1.5"/>' +
            '<rect x="110" y="96" width="8" height="8" rx="1.5"/><rect x="152" y="56" width="8" height="8" rx="1.5"/>' +
            '<rect x="164" y="56" width="8" height="8" rx="1.5"/></g>' +
            '<g fill="' + C.honey + '"><rect x="26" y="124" width="8" height="8" rx="1.5"/><rect x="68" y="94" width="8" height="8" rx="1.5"/>' +
            '<rect x="122" y="96" width="8" height="8" rx="1.5"/><rect x="152" y="74" width="8" height="8" rx="1.5"/></g>' +
            '<path d="M8 168h184" stroke="' + C.ink3 + '" stroke-width="4" stroke-linecap="round"/>'),

        supply: () => wrap('0 0 200 200',
            '<path d="M28 160h144M28 160V36" stroke="' + C.ink3 + '" stroke-width="3" stroke-linecap="round" opacity="0.5"/>' +
            '<path d="M40 148L164 52" stroke="' + C.sage + '" stroke-width="6" stroke-linecap="round"/>' +
            '<path d="M40 52l124 96" stroke="' + C.red + '" stroke-width="6" stroke-linecap="round"/>' +
            '<circle cx="102" cy="100" r="10" fill="' + C.honey + '"/>' +
            '<circle cx="102" cy="100" r="18" stroke="' + C.honey + '" stroke-width="3" opacity="0.45"/>'),

        clock: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="70" fill="' + C.surf2 + '" stroke="' + C.blue + '" stroke-width="5"/>' +
            '<path d="M100 56v46l32 20" stroke="' + C.blue + '" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="100" cy="100" r="7" fill="' + C.ink + '"/>' +
            '<path d="M100 26v10m0 128v10M174 100h-10M36 100H26" stroke="' + C.blue + '" stroke-width="5" stroke-linecap="round"/>'),

        shield: () => wrap('0 0 200 200',
            '<path d="M100 24l62 24v52c0 40-26 62-62 76-36-14-62-36-62-76V48z" fill="' + C.sage + '" opacity="0.16" stroke="' + C.sage + '" stroke-width="5"/>' +
            '<path d="M72 100l20 20 38-40" stroke="' + C.sage + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'),

        warning: () => wrap('0 0 200 200',
            '<path d="M100 30l72 128H28z" fill="' + C.red + '" opacity="0.16" stroke="' + C.red + '" stroke-width="6" stroke-linejoin="round"/>' +
            '<path d="M100 78v38" stroke="' + C.red + '" stroke-width="11" stroke-linecap="round"/>' +
            '<circle cx="100" cy="136" r="7" fill="' + C.red + '"/>'),

        trophy: () => wrap('0 0 200 200',
            '<path d="M62 36h76v46c0 21-17 38-38 38s-38-17-38-38z" fill="' + C.honey + '"/>' +
            '<path d="M62 48H42v14c0 12 9 21 20 22M138 48h20v14c0 12-9 21-20 22" stroke="' + C.honey + '" stroke-width="7" stroke-linecap="round"/>' +
            '<path d="M100 120v26m-24 0h48" stroke="' + C.honey + '" stroke-width="9" stroke-linecap="round"/>' +
            '<rect x="60" y="152" width="80" height="16" rx="6" fill="' + C.honeyD + '"/>' +
            '<path d="M88 62l8 10 18-20" stroke="' + C.bg + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'),

        brokenheart: () => wrap('0 0 200 200',
            '<path d="M100 168S30 126 30 78a34 34 0 0 1 60-22l10 12-16 22 24 16-18 24" fill="' + C.red + '" opacity="0.35"/>' +
            '<path d="M100 168s70-42 70-90a34 34 0 0 0-60-22l-10 12 16 22-24 16 18 24" fill="' + C.red + '"/>'),

        streak: () => wrap('0 0 200 200',
            '<path d="M104 22c4 30-16 40-24 58-10 22 4 44 20 44 14 0 24-10 24-26 0-8-4-14-4-14 22 10 34 30 34 50 0 30-24 52-54 52S46 164 46 132c0-44 40-58 58-110z" fill="' + C.honey + '"/>' +
            '<path d="M100 106c8 12 18 22 18 38 0 14-8 24-18 24s-18-10-18-24c0-16 10-26 18-38z" fill="' + C.ink + '" opacity="0.85"/>'),

        gem: () => wrap('0 0 200 200',
            '<path d="M62 40h76l32 44-70 80-70-80z" fill="' + C.blue + '"/>' +
            '<path d="M62 40l-32 44h140l-32-44z" fill="' + C.blue + '" opacity="0.6"/>' +
            '<path d="M100 164L30 84h140z" fill="' + C.blue + '" opacity="0.85"/>' +
            '<path d="M62 40l38 124 38-124" stroke="' + C.bg + '" stroke-width="3" opacity="0.35" fill="none"/>'),

        book: () => wrap('0 0 200 200',
            '<path d="M30 44h56c12 0 22 8 22 18v96c0-8-10-14-22-14H30z" fill="' + C.sage + '" opacity="0.75"/>' +
            '<path d="M170 44h-56c-12 0-22 8-22 18v96c0-8 10-14 22-14h56z" fill="' + C.sage + '"/>' +
            '<path d="M100 62v96" stroke="' + C.bg + '" stroke-width="4"/>' +
            '<path d="M44 76h40M44 96h40M116 76h40M116 96h40" stroke="' + C.bg + '" stroke-width="5" stroke-linecap="round" opacity="0.55"/>'),

        star: () => wrap('0 0 200 200',
            '<path d="M100 26l22 46 50 7-36 35 9 50-45-24-45 24 9-50-36-35 50-7z" fill="' + C.honey + '"/>'),

        lock: () => wrap('0 0 200 200',
            '<rect x="46" y="88" width="108" height="82" rx="14" fill="' + C.ink3 + '"/>' +
            '<path d="M70 88V66a30 30 0 0 1 60 0v22" stroke="' + C.ink3 + '" stroke-width="13" stroke-linecap="round"/>' +
            '<circle cx="100" cy="122" r="11" fill="' + C.bg + '"/>' +
            '<path d="M100 130v14" stroke="' + C.bg + '" stroke-width="8" stroke-linecap="round"/>'),

        check: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="76" fill="' + C.sage + '"/>' +
            '<path d="M64 102l24 26 50-58" stroke="' + C.bg + '" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'),

        target: () => wrap('0 0 200 200',
            '<circle cx="100" cy="100" r="72" stroke="' + C.red + '" stroke-width="9"/>' +
            '<circle cx="100" cy="100" r="46" stroke="' + C.ink + '" stroke-width="9"/>' +
            '<circle cx="100" cy="100" r="20" fill="' + C.red + '"/>' +
            '<path d="M140 60l30-30m0 0h-16m16 0v16" stroke="' + C.sage + '" stroke-width="7" stroke-linecap="round"/>'),

        wallet: () => wrap('0 0 200 200',
            '<rect x="26" y="56" width="148" height="98" rx="16" fill="' + C.surf2 + '" stroke="' + C.sage + '" stroke-width="4"/>' +
            '<path d="M26 86h148" stroke="' + C.sage + '" stroke-width="3" opacity="0.5"/>' +
            '<rect x="118" y="98" width="70" height="34" rx="12" fill="' + C.sage + '"/>' +
            '<circle cx="140" cy="115" r="7" fill="' + C.bg + '"/>'),

        /* boss-node glyph: drawn dark so it reads on any coloured disc */
        castle: () => wrap('0 0 200 200',
            '<g fill="#1B1207">' +
            '<rect x="36" y="92" width="128" height="76" rx="6"/>' +
            '<rect x="26" y="70" width="34" height="98" rx="5"/>' +
            '<rect x="140" y="70" width="34" height="98" rx="5"/>' +
            '<rect x="24" y="58" width="10" height="16" rx="2"/><rect x="38" y="58" width="10" height="16" rx="2"/><rect x="52" y="58" width="10" height="16" rx="2"/>' +
            '<rect x="138" y="58" width="10" height="16" rx="2"/><rect x="152" y="58" width="10" height="16" rx="2"/><rect x="166" y="58" width="10" height="16" rx="2"/>' +
            '<rect x="66" y="80" width="10" height="14" rx="2"/><rect x="82" y="80" width="10" height="14" rx="2"/>' +
            '<rect x="98" y="80" width="10" height="14" rx="2"/><rect x="114" y="80" width="10" height="14" rx="2"/><rect x="126" y="80" width="8" height="14" rx="2"/>' +
            '</g>' +
            '<path d="M100 132a12 14 0 0 1 24 0v36h-24z" fill="' + C.honey + '" opacity="0.9"/>' +
            '<rect x="70" y="108" width="16" height="16" rx="3" fill="' + C.honey + '" opacity="0.55"/>' +
            '<path d="M43 70V40m0 0h20l-6 7 6 7H43" fill="' + C.red + '" stroke="' + C.red + '" stroke-width="3" stroke-linejoin="round"/>' +
            '<path d="M157 70V40m0 0h-20l6 7-6 7h20" fill="' + C.sage + '" stroke="' + C.sage + '" stroke-width="3" stroke-linejoin="round"/>'),

        chest: () => wrap('0 0 200 200',
            '<rect x="34" y="86" width="132" height="76" rx="12" fill="#8A5A2B"/>' +
            '<rect x="34" y="86" width="132" height="20" fill="#6E4520"/>' +
            '<path d="M34 90c0-26 26-44 66-44s66 18 66 44v10H34z" fill="#A06A34"/>' +
            '<rect x="28" y="88" width="144" height="14" rx="7" fill="' + C.honey + '"/>' +
            '<rect x="88" y="80" width="24" height="42" rx="6" fill="' + C.honey + '"/>' +
            '<circle cx="100" cy="102" r="6" fill="' + C.bg + '"/>' +
            '<path d="M46 56l6-10m96 10l-6-10" stroke="#A06A34" stroke-width="5" stroke-linecap="round"/>'),

        chestOpen: () => wrap('0 0 200 200',
            '<path d="M36 66c0-22 26-38 64-38s64 16 64 38l-10 12H46z" fill="#A06A34" ' +
                'transform="rotate(-14 100 60)"/>' +
            '<rect x="34" y="92" width="132" height="70" rx="12" fill="#8A5A2B"/>' +
            '<rect x="30" y="88" width="140" height="14" rx="7" fill="' + C.honey + '"/>' +
            '<circle cx="76" cy="84" r="8" fill="' + C.blue + '"/>' +
            '<circle cx="100" cy="76" r="10" fill="' + C.honey + '"/>' +
            '<circle cx="124" cy="84" r="8" fill="' + C.sage + '"/>' +
            '<path d="M66 60l-8-14m84 14l8-14m-46-4v-16" stroke="' + C.honey + '" ' +
                'stroke-width="4" stroke-linecap="round" opacity="0.7"/>'),

        scale: () => wrap('0 0 200 200',
            '<rect x="24" y="120" width="66" height="48" rx="8" fill="' + C.sage + '" opacity="0.85"/>' +
            '<rect x="110" y="72" width="66" height="96" rx="8" fill="' + C.honey + '" opacity="0.85"/>' +
            '<text x="57" y="150" text-anchor="middle" font-family="Inter,sans-serif" font-size="19" font-weight="800" fill="' + C.bg + '">$</text>' +
            '<text x="143" y="128" text-anchor="middle" font-family="Inter,sans-serif" font-size="19" font-weight="800" fill="' + C.bg + '">$$</text>' +
            '<path d="M24 44h152" stroke="' + C.ink3 + '" stroke-width="5" stroke-linecap="round"/>'),
    };

    const FTArt = {
        colors: C,
        has(k) { return !!ART[k]; },
        get(k) { return ART[k] ? ART[k]() : ART.book(); },
        node(k, size) {
            const svg = this.get(k);
            return size ? svg.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ') : svg;
        },
        keys() { return Object.keys(ART); },
    };

    global.FTArt = FTArt;
    if (typeof module !== 'undefined' && module.exports) module.exports = FTArt;
})(typeof window !== 'undefined' ? window : this);
