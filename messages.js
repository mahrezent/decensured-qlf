
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

function getAllMessages() {
    const messages = [...document.querySelectorAll('.conteneur-messages-pagi > div.bloc-message-forum')];
    return messages;
}

async function beautifyMessages(elementMessages, decryptedMessages) {
    // On regroupe tout pour ne faire qu'une seule requête
    let joinedMessages = '';
    for (let [key, value] of decryptedMessages) joinedMessages += `\n\nmessageid=${key}\n\n${value}\n`;

    const joinedJvCodeHtml = await transformJvcode(joinedMessages);

    // On découpe la réponse par message
    const splitHtmlRegex = new RegExp(/<p>messageid=(?<messageid>\d+)<\/p>(?<html>[\s\S]*?)(?=<p>messageid=\d+|$)/, 'g');
    const matches = [...joinedJvCodeHtml.matchAll(splitHtmlRegex)];
    if (!matches.length) return;

    matches.forEach(match => {
        const messageId = parseInt(match.groups?.messageid);
        if (!messageId) return;

        const html = match.groups?.html.trim();
        if (!html?.length) return;

        const message = elementMessages.find(m => {
            const mId = parseInt(m.getAttribute('data-id'));
            return mId === messageId;
        });
        if (!message) return;

        const messageContentElement = message.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        messageContentElement.innerHTML = html;
        message.classList.add('decensured-decrypted-message');
        fixMessageJvCare(message);
    });
}

async function decryptMessages() {
    const allMessages = getAllMessages();
    if (!allMessages.length) return;

    // D'abord on déchiffre tous les messages
    const decryptedMessages = new Map();
    allMessages.forEach(async (message) => {
        const messageContentElement = message.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        const content = messageContentElement.textContent.trim();
        if (!content.includes(coverRaw)) return;

        const messageId = parseInt(message.getAttribute('data-id'));
        if (!messageId) return;

        const decryptedContent = revealText(content);
        if (!decryptedContent.trim().length) return;

        decryptedMessages.set(messageId, decryptedContent);
    });

    if (decryptedMessages.size) await beautifyMessages(allMessages, decryptedMessages);
}

function postEncryptedMessage(postButtonElement, textArea) {
    const value = textArea.value.trim();
    const encrypted = hideText(value);
    textArea.value = encrypted;
    postButtonElement.click();
}
