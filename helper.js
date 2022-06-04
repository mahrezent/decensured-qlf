
const isUpperCase = (c) => c === c.toUpperCase() && c !== c.toLowerCase();

function getTextChildren(contentElement) {
    return [...contentElement.childNodes].filter(c => c.nodeType === Node.TEXT_NODE && c.textContent.trim() !== '');
}

function getParagraphChildren(element, allowBlockQuote = false) {
    if (!element?.children?.length) return [];
    const allowedTags = ['P', 'STRONG', 'U', 'I', 'EM', 'B'];
    if (allowBlockQuote) allowedTags.push('BLOCKQUOTE');
    return [...element.children].filter(c => allowedTags.includes(c.tagName) && c.textContent.trim() !== '');
}

function buildNoelshackMiniUrl(noelshackUrl) {
    const matchRegex = new RegExp(/https:\/\/www\.noelshack\.com\/(\d+)-(\d+)-(\d+)-(.*)/, 'i');
    const replacement = 'https://image.noelshack.com/minis/$1/$2/$3/$4';
    return noelshackUrl.replace(matchRegex, replacement);
}
