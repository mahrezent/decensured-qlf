
function buildEncryptMessageButton() {
    const postButtonElement = document.querySelector('.btn-poster-msg');
    if (!postButtonElement) return false;
    console.log(postButtonElement);

    const textArea = document.querySelector('textarea#message_topic');
    if (!textArea) return false;
    console.log(textArea);

    const encryptedPostButton = document.createElement('div');
    //encryptedPostButton.type = 'submit';
    encryptedPostButton.className = 'btn btn-poster-msg datalayer-push js-post-message decensured-post-button';
    encryptedPostButton.style.background = 'var(--jv-text-primary)';
    encryptedPostButton.style.lineHeight = '2rem';
    encryptedPostButton.style.padding = '0 1rem';
    //encryptedPostButton.setAttribute('data-push', 'post_forum');
    encryptedPostButton.textContent = 'POST DÉCENSURED';
    postButtonElement.insertAdjacentElement('afterend', encryptedPostButton);
    encryptedPostButton.onclick = () => postEncryptedMessage(postButtonElement, textArea);
    return true;
}

async function entryPoint() {
    initCharMap();
    buildEncryptMessageButton();
    decryptMessages();
}

entryPoint();
