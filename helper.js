
const isUpperCase = (c) => c === c.toUpperCase() && c !== c.toLowerCase();

function addStyles() {
    const decensuredCss = GM_getResourceText('DECENSURED_CSS');
    GM_addStyle(decensuredCss);
}

function decryptJvCare(jvCareClass) {
    let base16 = '0A12B34C56D78E9F', url = '', s = jvCareClass.split(' ')[1];
    for (let i = 0; i < s.length; i += 2) {
        url += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
    }
    return url;
}
