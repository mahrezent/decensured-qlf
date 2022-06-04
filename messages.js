
function fixMessageUrls(messageContent) {
    if (!messageContent) return;

    function parseElement(element, regex, replaceCallback) {
        getParagraphChildren(element).forEach(child => parseElement(child, regex, replaceCallback));

        const textChildren = getTextChildren(element);
        textChildren.forEach(textNode => {
            if (!textNode.textContent?.length || !textNode.parentElement) return;
            const newText = textNode.textContent?.replaceAll(regex, replaceCallback);
            if (textNode.textContent === newText) return;

            let newNode = document.createElement('a');
            textNode.parentElement.insertBefore(newNode, textNode);
            textNode.remove(); // Toujours remove avant de changer l'outerHTML pour éviter le bug avec Chrome
            newNode.outerHTML = newText;
        });
    }

    // On traite d'abord les images car c'est des urls aussi
    const imageUrlRegex = new RegExp(/\bhttps:[/.\w\s-]*\.(?:jpg|jpeg|gif|png|svg|bmp|tif|tiff)\b/, 'gi');
    parseElement(
        messageContent,
        imageUrlRegex,
        (m) => `<a href="${m}" target="_blank" class="xXx"><img class="img-shack" src="${buildNoelshackMiniUrl(m)}" alt="${m}" width="68" height="51"></a>`);

    // Puis on traite les urls normales
    const urlRegex = new RegExp(/\b(?:https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+/, 'gi');
    parseElement(
        messageContent,
        urlRegex,
        (m) => `<a class="xXx" href="${m}" title="${m}" target="_blank">${m}</a>`);
}

function getAllMessages() {
    const messages = document.querySelectorAll('.txt-msg.text-enrichi-forum');
    return messages;
}

function decryptMessages() {
    const allMessages = getAllMessages();
    if (!allMessages?.length) return;
    //console.log(allMessages);

    allMessages.forEach(message => {
        const content = message.textContent.trim();
        //console.log('content.includes(coverRaw) : %s', content.includes(coverRaw));
        if (!content.includes(coverRaw)) return;

        console.log('content : %s', content);
        const decryptedContent = revealText(content);
        console.log('decryptedContent : %s', decryptedContent);
        message.innerHTML = `<p>${decryptedContent}</p>`;
        fixMessageUrls(message);
    });
}

function postEncryptedMessage(postButtonElement, textArea) {
    const value = textArea.value.trim();
    console.log('value=%s', value);
    const encrypted = hideText(value);
    textArea.value = encrypted;
    console.log('new textArea.value : %s', encrypted);
    console.log('decrypted : %s', revealText(encrypted));
    postButtonElement.click();
}
