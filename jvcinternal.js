
function decryptJvCare(jvCareClass) {
    let base16 = '0A12B34C56D78E9F', url = '', s = jvCareClass.split(' ')[1];
    for (let i = 0; i < s.length; i += 2) {
        url += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
    }
    return url;
}

async function transformJvcode(rawMessage) {
    var params = new URLSearchParams();
    params.append('texte', rawMessage);
    const resHtml = await fetch('https://www.jeuxvideo.com/jvcode/forums.php?stickers=on', {
        method: 'POST',
        body: params
    }).then(function (response) {
        if (!response.ok) throw Error(response.statusText);
        return response.text();
    }).catch(function (err) {
        console.error(err);
    });
    return resHtml;
}

function fixMessageJvCare(messageElement) {
    messageElement.querySelectorAll('.JvCare').forEach(function (m) {
        let anchor = document.createElement('a');
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('href', decryptJvCare(m.getAttribute('class')));
        anchor.className = m.className.split(' ').splice(2).join(' ');
        anchor.innerHTML = m.innerHTML;
        m.outerHTML = anchor.outerHTML;
    });
    return messageElement;
}

function fixNestedQuotes(messageElement) {
    const nestedQuote = messageElement.querySelector('blockquote > blockquote');
    if (!nestedQuote) return;
    const nestedToggleElement = document.createElement('div');
    nestedToggleElement.className = 'nested-quote-toggle-box';
    nestedToggleElement.onclick = () => {
        nestedQuote.toggleAttribute('data-visible');
        if (nestedQuote.hasAttribute('data-visible')) nestedQuote.setAttribute('data-visible', '1');
    }
    nestedQuote.prepend(nestedToggleElement);
}

function getUserPseudo() {
    const pseudoElem = document.querySelector('.headerAccount__pseudo');
    if (!pseudoElem) return undefined;

    const pseudo = pseudoElem.textContent.trim();
    if (pseudo.toLowerCase() === 'mon compte' || pseudo.toLowerCase() === 'connexion') return undefined;

    const linkAccountElem = document.querySelector('.headerAccount__link')
    if (!linkAccountElem || !linkAccountElem.hasAttribute('data-account-id')) return undefined;

    return pseudo;
}
