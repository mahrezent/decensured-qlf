
function buildJvChatEncryptMessageButton() {
    const postButtonElement = document.querySelector('button#jvchat-post');
    if (!postButtonElement) return false;

    const textAreaElement = document.querySelector('textarea#message_topic');
    if (!textAreaElement) return false;

    const encryptedPostButton = document.createElement('button');
    encryptedPostButton.id = "jvchat-post-decensured";
    encryptedPostButton.tabindex = "5";
    encryptedPostButton.type = "button";
    encryptedPostButton.className = 'jvchat-button-top icon-reply decensured-post-button';
    encryptedPostButton.title = "Envoyer le message Décensured";
    postButtonElement.insertAdjacentElement('afterend', encryptedPostButton);

    encryptedPostButton.onclick = () => postEncryptedMessage(postButtonElement, textAreaElement);

    return true;
}

async function handleLiveMessage(messageElement, event) { // eslint-disable-line no-unused-vars
    const decryptedMessage = decryptMessage(messageElement);
    if (!decryptedMessage?.messageId || !decryptedMessage?.decryptedContent) return;
    await beautifyMessage(messageElement, decryptedMessage.decryptedContent, decryptedMessage.messageId);
}

function enableJvChatAndTopicLiveEvents(handleCallback) {
    // JvChat
    addEventListener('jvchat:newmessage', async function (event) {
        const messageElement = document.querySelector(`.jvchat-message[jvchat-id="${event.detail.id}"]`);
        if (!messageElement) return;
        await handleCallback(messageElement, event);
    });
    addEventListener('jvchat:activation', function () {
        buildJvChatEncryptMessageButton();
    });


    // TopicLive
    addEventListener('topiclive:newmessage', async function (event) {
        const messageElement = document.querySelector(`.bloc-message-forum[data-id="${event.detail.id}"]`);
        if (!messageElement) return;
        await handleCallback(messageElement, event);
    });
}
