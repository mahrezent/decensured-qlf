
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
    const blocOptionsElement = messageElement.querySelector('.bloc-options-msg') ?? messageElement.querySelector('.jvchat-tooltip');
    if (!blocOptionsElement) return;
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

async function beautifyMessage(messageElement, decryptedMessage, messageId) {
    const messageContentElement = messageElement.querySelector('.txt-msg.text-enrichi-forum');
    if (!messageContentElement) return;

    let jvCodeHtml = messageContents.get(messageId)?.decryptedHtml;
    if (!jvCodeHtml?.length) {
        jvCodeHtml = await transformJvcode(decryptedMessage);
        messageContents.set(messageId, {
            cryptedHtml: messageContentElement.innerHTML,
            decryptedHtml: jvCodeHtml,
            decryptedRaw: decryptedMessage
        });
    }

    messageContentElement.innerHTML = jvCodeHtml;
    messageElement.classList.add(decryptedMessageClass);

    enhanceMessage(messageElement, messageContentElement, messageId);
}

async function beautifyMessagesCluster(messageElements, decryptedMessages) {
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

        const messageElement = messageElements.find(m => {
            const mId = parseInt(m.getAttribute('data-id'));
            return mId === messageId;
        });
        if (!messageElement) return;

        const messageContentElement = messageElement.querySelector('.txt-msg.text-enrichi-forum');
        if (!messageContentElement) return;

        messageContents.set(messageId, {
            cryptedHtml: messageContentElement.innerHTML,
            decryptedHtml: newHtml,
            decryptedRaw: decryptedMessages.get(messageId)
        });

        messageContentElement.innerHTML = newHtml;
        messageElement.classList.add(decryptedMessageClass);

        enhanceMessage(messageElement, messageContentElement, messageId);
    });
}

function buildQuoteButton() {
    const quoteButton = document.createElement('span');
    quoteButton.className = 'decensured-quote-button';
    quoteButton.title = 'Citer';
    return quoteButton;
}

function decryptMessage(messageElement) {
    const messageId = parseInt(messageElement.getAttribute('data-id') ?? messageElement.getAttribute('jvchat-id'));
    if (!messageId) return;

    if (messageContents.has(messageId)) {
        return { messageId: messageId, decryptedContent: messageContents.get(messageId).decryptedRaw };
    }

    const messageContentElement = messageElement.querySelector('.txt-msg.text-enrichi-forum');
    if (!messageContentElement) return;

    const content = messageContentElement.textContent.trim();
    if (!content.match(coverDetectionRegex)) return;


    const decryptedContent = revealText(content);
    if (!decryptedContent.length) return;

    const quoteButtonElement = messageElement.querySelector('.picto-msg-quote');
    if (quoteButtonElement) {
        const newQuoteButton = buildQuoteButton();
        newQuoteButton.onclick = () => quoteDecensuredMessage(messageElement);
        quoteButtonElement.insertAdjacentElement('beforebegin', newQuoteButton);
        quoteButtonElement.remove(); // jvc rajoute les events plus tard
    }

    return { messageId: messageId, decryptedContent: decryptedContent };
}

async function decryptMessages() {
    const allMessages = getAllMessages();
    if (!allMessages.length) return;

    decryptTopicTitle();

    // D'abord on déchiffre tous les messages
    const decryptedMessages = new Map();
    allMessages.forEach((messageElement) => {
        const decryptedMessage = decryptMessage(messageElement);
        if (!decryptedMessage?.messageId || !decryptedMessage?.decryptedContent) return;
        decryptedMessages.set(decryptedMessage.messageId, decryptedMessage.decryptedContent);
    });

    if (decryptedMessages.size) await beautifyMessagesCluster(allMessages, decryptedMessages);
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

    postButtonElement.removeAttribute('disabled');
    postButtonElement.click();
}

function quoteDecensuredMessage(messageElement) {
    const textAreaElement = document.querySelector('textarea#message_topic');
    if (!textAreaElement) return;

    const messageId = parseInt(messageElement.getAttribute('data-id') ?? messageElement.getAttribute('jvchat-id'));
    if (!messageId || !messageContents.has(messageId)) return;

    const getAuthorFromCitationBtn = (e) => (e.querySelector('.bloc-pseudo-msg.text-user') ?? e.querySelector('.jvchat-author'))?.textContent?.trim();
    const getDateFromCitationBtn = (e) => (e.querySelector('.bloc-date-msg') ?? e.querySelector('.jvchat-date'))?.textContent?.trim();
    const getQuoteHeader = (e) => `> Le ${getDateFromCitationBtn(e)} '''${getAuthorFromCitationBtn(e)}''' a écrit : `;

    let newValue = getQuoteHeader(messageElement);
    newValue = `${newValue}\n> ${messageContents.get(messageId).decryptedRaw.split('\n').join('\n> ')}`; // add quote character at each line
    newValue = `${newValue}\n\n`;

    textAreaElement.value = newValue;
    textAreaElement.dispatchEvent(new Event('change'));
    textAreaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textAreaElement.focus({ preventScroll: true });
    textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);

    const postButtonElement = document.querySelector('.btn-poster-msg');
    if (!postButtonElement) return;
    postButtonElement.disabled = true;
}
