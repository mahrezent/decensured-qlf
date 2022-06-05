
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
    const messages = document.querySelectorAll('.conteneur-messages-pagi > div.bloc-message-forum');
    return messages;
}

function decryptMessages() {
    const allMessages = getAllMessages();
    if (!allMessages?.length) return;

    allMessages.forEach(async (message) => {
        const messageContentElement = message.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        const content = messageContentElement.textContent.trim();
        if (!content.includes(coverRaw)) return;

        const decryptedContent = revealText(content);
        const html = await transformJvcode(decryptedContent);
        messageContentElement.innerHTML = html ?? `<p>${decryptedContent}</p>`;

        message.classList.add('decensured-decrypted-message');

        fixMessageJvCare(message);
    });
}

function postEncryptedMessage(postButtonElement, textArea) {
    const value = textArea.value.trim();
    const encrypted = hideText(value);
    textArea.value = encrypted;
    postButtonElement.click();
}
