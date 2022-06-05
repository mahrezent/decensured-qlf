
const isUpperCase = (c) => c === c.toUpperCase() && c !== c.toLowerCase();

function addStyles() {
    const decensuredCss = GM_getResourceText('DECENSURED_CSS');
    GM_addStyle(decensuredCss);
}
