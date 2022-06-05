
function buildEncryptMessageButton() {
    const postButtonElement = document.querySelector('.btn-poster-msg');
    if (!postButtonElement) return false;

    const textArea = document.querySelector('textarea#message_topic');
    if (!textArea) return false;

    const encryptedPostButton = document.createElement('div');
    encryptedPostButton.className = 'btn btn-poster-msg datalayer-push js-post-message decensured-post-button';
    encryptedPostButton.textContent = 'POST DÉCENSURED';
    postButtonElement.insertAdjacentElement('afterend', encryptedPostButton);
    encryptedPostButton.onclick = () => postEncryptedMessage(postButtonElement, textArea);
    return true;
}

async function entryPoint() {
    addStyles();
    initCharMap();
    buildEncryptMessageButton();
    decryptMessages();
}

entryPoint();
