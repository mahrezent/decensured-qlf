
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

function displayOrHideMessage(messageElement, messageContentElement, messageId, button) {
    if (!messageContents.has(messageId)) return;
    const messageContent = messageContents.get(messageId);
    if (button.classList.contains(hideMessageClass)) { // On affiche le message bidon
        messageContentElement.innerHTML = messageContent.crypted;
        button.classList.replace(hideMessageClass, displayMessageClass);
        messageElement.classList.toggle(decryptedMessageClass, false);
    } else { // On affiche le vrai message
        messageContentElement.innerHTML = messageContent.decrypted;
        button.classList.replace(displayMessageClass, hideMessageClass);
        messageElement.classList.toggle(decryptedMessageClass, true);
    }
}

function enhanceMessage(messageElement, messageContentElement, messageId) {
    fixMessageJvCare(messageElement);

    const blocOptionsElement = messageElement.querySelector('.bloc-options-msg');
    const displayHideMessageButton = document.createElement('span');
    displayHideMessageButton.title = 'Masquer le message';
    displayHideMessageButton.className = `decensured-option-button decensured-font-icon ${hideMessageClass}`;
    blocOptionsElement.prepend(displayHideMessageButton);

    displayHideMessageButton.onclick = () => displayOrHideMessage(
        messageElement,
        messageContentElement,
        messageId,
        displayHideMessageButton);
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

        const newHtml = match.groups?.html.trim();
        if (!newHtml?.length) return;

        const message = elementMessages.find(m => {
            const mId = parseInt(m.getAttribute('data-id'));
            return mId === messageId;
        });
        if (!message) return;

        const messageContentElement = message.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        messageContents.set(messageId, { crypted: messageContentElement.innerHTML, decrypted: newHtml });

        messageContentElement.innerHTML = newHtml;
        message.classList.add(decryptedMessageClass);

        enhanceMessage(message, messageContentElement, messageId);
    });
}

async function decryptMessages() {
    const allMessages = getAllMessages();
    if (!allMessages.length) return;

    decryptTopicTitle();

    // D'abord on déchiffre tous les messages
    const decryptedMessages = new Map();
    allMessages.forEach(async (message) => {
        const messageContentElement = message.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        const content = messageContentElement.textContent.trim();
        if (!content.match(coverDetectionRegex)) return;

        const messageId = parseInt(message.getAttribute('data-id'));
        if (!messageId) return;

        const decryptedContent = revealText(content);
        if (!decryptedContent.trim().length) return;

        decryptedMessages.set(messageId, decryptedContent);
    });

    if (decryptedMessages.size) await beautifyMessages(allMessages, decryptedMessages);
}

function decryptTopicTitle() {
    const topicTitle = document.querySelector('#bloc-title-forum');

    const decryptedContent = revealText(topicTitle.textContent);
    if (!decryptedContent.trim().length || topicTitle === decryptedContent) return;

    topicTitle.textContent = decryptedContent;
    document.title = revealText(document.title);
}

function postEncryptedMessage(postButtonElement, textAreaElement, newTopicTitleElement) {
    const messageValue = textAreaElement.value.trim();
    const encryptedMessage = hideText(messageValue);
    textAreaElement.value = encryptedMessage;

    if (newTopicTitleElement) {
        const titleValue = newTopicTitleElement.value.trim();
        const encryptedTitle = hideText(titleValue, true);
        newTopicTitleElement.value = encryptedTitle;
    }

    postButtonElement.click();
}
