// eslint-disable-next-line no-extend-native
export function isEmptyStr(str){
    return (str.length === 0 || !str.trim());
}

export function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

export function intensifyHSLBy(hsl, value) {
    let applied = hsl[2] - value;
    hsl[2] = Math.max(0, Math.min(applied, 100));
    return hsl;
}

export function formatHsLStr(H) {
     let h = H[0];
     let s = H[1];
     let l = H[2];
    return "hsl(" + h + "," + s + "%," + l + "%)";
}

export function enhanceHexBy(hex, intensity) {
    return formatHsLStr(intensifyHSLBy(hexToHSL(hex), intensity));
}

export function interpretDeltaE(outcome) {
    if (outcome <= 1.0) {
        return "diff not perceptible by human eyes.";
    }
    else if (outcome > 1 && outcome < 2) {
        return "diff perceptible through close observation.";
    }
    else if (outcome >= 2 && outcome <= 10) {
        return "diff perceptible at a glance";
    }
    else if (outcome >= 11 && outcome <= 49) {
        return "colors are more similar than opposite";
    }
    else if (outcome === 100) {
        return "colors are exact opposite";
    } else {
        return "colors are different";
    }
}

export function hasAlphaChannel(color) {
    return ["rgba, hsla"].includes(color.toLowerCase());
}

export function blendAlpha(src) {
    const Source = {R: src.red/255, G: src.green/255, B: src.blue/255, A: src.alpha};
    let Target = {};
    const BGColor = {R: 1, G: 1, B:1}
    Target.r = parseInt(255 * (((1 - Source.A) * BGColor.R) + (Source.A * Source.R)));
    Target.g = parseInt(255 * (((1 - Source.A) * BGColor.G) + (Source.A * Source.G)));
    Target.b = parseInt(255 * (((1 - Source.A) * BGColor.B) + (Source.A * Source.B)));
    return Target;
}

export function isColorValid(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
}