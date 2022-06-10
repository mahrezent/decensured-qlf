
const isUpperCase = (c) => c === c.toUpperCase() && c !== c.toLowerCase();

function addStyles() {
    const decensuredCss = GM_getResourceText('DECENSURED_CSS');
    GM_addStyle(decensuredCss);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function upperCaseRandomWords(text) {
    if (!text?.length) return;
    const words = text.split(' ').filter(w => w);
    let totalWordToChange = Math.floor(words.length / 2);
    for (let i = 0; i < totalWordToChange; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        words[randomIndex] = words[randomIndex].toUpperCase();
    }
    return words.join(' ').trim();
}

async function getExternalIp() {
    let res;
    await GM.xmlHttpRequest({
        method: 'GET',
        url: externalIpUrl,
        onload: (response) => { res = response.responseText; },
        onerror: (response) => { console.error("error : %o", response) }
    });
    return res;
}
