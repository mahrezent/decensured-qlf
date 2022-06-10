
function getAllMessages() {
    const messages = [...document.querySelectorAll('.conteneur-messages-pagi > div.bloc-message-forum')];
    return messages;
}

function displayOrHideMessage(messageElement, messageContentElement, messageId, button) {
    if (!messageContents.has(messageId)) return;
    const messageContent = messageContents.get(messageId);
    if (button.classList.contains(hideMessageClass)) { // On affiche le message bidon
        button.classList.replace(hideMessageClass, displayMessageClass);
        button.title = 'Afficher le message déchiffré';

        messageContentElement.innerHTML = messageContent.cryptedHtml;

        messageElement.classList.toggle(decryptedMessageClass, false);
    } else { // On affiche le vrai message
        button.classList.replace(displayMessageClass, hideMessageClass);
        button.title = 'Afficher le message chiffré';

        messageContentElement.innerHTML = messageContent.decryptedHtml;

        messageElement.classList.toggle(decryptedMessageClass, true);
    }
}

function preventDdb(messageElement) {
    const ddbButton = messageElement.querySelector('.picto-msg-exclam');
    if (!ddbButton) return;
    ddbButton.remove();
}

function buildDisplayHideMessageButton(messageElement, messageContentElement, messageId) {
    const blocOptionsElement = messageElement.querySelector('.bloc-options-msg');
    const displayHideMessageButton = document.createElement('span');
    displayHideMessageButton.title = 'Afficher le message chiffré';
    displayHideMessageButton.className = `decensured-option-button decensured-font-icon ${hideMessageClass}`;
    blocOptionsElement.prepend(displayHideMessageButton);

    displayHideMessageButton.onclick = () => displayOrHideMessage(
        messageElement,
        messageContentElement,
        messageId,
        displayHideMessageButton);
}

function enhanceMessage(messageElement, messageContentElement, messageId) {
    fixMessageJvCare(messageElement);
    fixNestedQuotes(messageElement);
    preventDdb(messageElement);
    buildDisplayHideMessageButton(messageElement, messageContentElement, messageId);
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

        messageContents.set(messageId, {
            cryptedHtml: messageContentElement.innerHTML,
            decryptedHtml: newHtml,
            decryptedRaw: decryptedMessages.get(messageId)
        });

        messageContentElement.innerHTML = newHtml;
        message.classList.add(decryptedMessageClass);

        enhanceMessage(message, messageContentElement, messageId);
    });
}

function buildQuoteButton() {
    const quoteButton = document.createElement('span');
    quoteButton.className = 'decensured-quote-button';
    quoteButton.title = 'Citer';
    return quoteButton;
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
        if (!decryptedContent.length) return;

        decryptedMessages.set(messageId, decryptedContent);

        const quoteButtonElement = message.querySelector('.picto-msg-quote');
        if (quoteButtonElement) {
            const newQuoteButton = buildQuoteButton();
            newQuoteButton.onclick = () => quoteMessage(message);
            quoteButtonElement.insertAdjacentElement('beforebegin', newQuoteButton);
            quoteButtonElement.remove(); // jvc rajoute les events plus tard
        }
    });

    if (decryptedMessages.size) await beautifyMessages(allMessages, decryptedMessages);
}

function decryptTopicTitle() {
    const topicTitle = document.querySelector('#bloc-title-forum');

    const decryptedContent = revealText(topicTitle.textContent);
    if (!decryptedContent.length || topicTitle === decryptedContent) return;

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

function quoteMessage(messageElement) {
    const textAreaElement = document.querySelector('textarea#message_topic');
    if (!textAreaElement) return;

    const messageId = parseInt(messageElement.getAttribute('data-id'));
    if (!messageId || !messageContents.has(messageId)) return;

    const getAuthorFromCitationBtn = (e) => e.querySelector('.bloc-pseudo-msg.text-user').textContent.trim();
    const getDateFromCitationBtn = (e) => e.querySelector('.bloc-date-msg').textContent.trim();
    const getQuoteHeader = (e) => `> Le ${getDateFromCitationBtn(e)} '''${getAuthorFromCitationBtn(e)}''' a écrit : `;

    let newValue = getQuoteHeader(messageElement);
    newValue = `${newValue}\n> ${messageContents.get(messageId).decryptedRaw.split('\n').join('\n> ')}`; // add quote character at each line
    newValue = `${newValue}\n\n`;

    textAreaElement.value = newValue;
    textAreaElement.dispatchEvent(new Event('change'));
    textAreaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textAreaElement.focus({ preventScroll: true });
    textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);
}
