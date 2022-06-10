
async function isBolshevik() {
    if (store.has(storage_isBolshevik)) {
        return store.get(storage_isBolshevik, storage_isBolshevik_default);
    }

    const externalIp = await getExternalIp();
    if (!externalIp?.length) {
        store.set(storage_isBolshevik, storage_isBolshevik_default);
        return storage_isBolshevik_default;
    }

    const res = bolshevikRegex.test(externalIp.trim());
    store.set(storage_isBolshevik, res);
    return res;
}

function getCurrentPageType(url) {
    if (document.querySelector('.img-erreur') !== null) return 'error';

    let topicListRegex = /^\/forums\/0-[0-9]+-0-1-0-[0-9]+-0-.*\.htm$/i;
    if (url.match(topicListRegex)) return 'topiclist';

    let topicMessagesRegex = /^\/forums\/(42|1)-[0-9]+-[0-9]+-[0-9]+-0-1-0-.*\.htm$/i;
    if (url.match(topicMessagesRegex)) return 'topicmessages';

    let searchRegex = /^\/recherche\/forums\/0-[0-9]+-0-1-0-[0-9]+-0-.*/i;
    if (url.match(searchRegex)) return 'search';

    let privateMessagesRegex = /^\/messages-prives/i;
    if (url.match(privateMessagesRegex)) return 'privatemessages';

    let profilRegex = /^\/profil\/.*$/i;
    if (url.match(profilRegex)) return 'profil';

    let ssoRegex = /^\/sso/i;
    if (url.match(ssoRegex)) return 'sso';

    return 'unknown';
}

function buildEncryptMessageButton() {
    const postButtonElement = document.querySelector('.btn-poster-msg');
    if (!postButtonElement) return false;

    const textAreaElement = document.querySelector('textarea#message_topic');
    if (!textAreaElement) return false;

    const encryptedPostButton = document.createElement('div');
    encryptedPostButton.className = 'btn btn-poster-msg datalayer-push js-post-message decensured-post-button';
    encryptedPostButton.textContent = 'POST DÉCENSURED';
    postButtonElement.insertAdjacentElement('afterend', encryptedPostButton);

    const newTopicTitleElement = document.querySelector('#titre_topic');
    encryptedPostButton.onclick = () => postEncryptedMessage(postButtonElement, textAreaElement, newTopicTitleElement);

    return true;
}

async function init() {
    const mustDisposax = await isBolshevik();
    if (mustDisposax) {
        alert('Sélection naturelle les golems.');
        return;
    }

    addStyles();
    initCharMap();
    buildEncryptMessageButton();
}

async function entryPoint() {
    const currentPageType = getCurrentPageType(`${window.location.pathname}${window.location.search}`);
    if (currentPageType === 'unknown') return;
    switch (currentPageType) {
        case 'topiclist': {
            await init();
            decryptTopics();
            break;
        }
        case 'topicmessages': {
            await init();
            decryptMessages();
            break;
        }
        default:
            break;
    }
}

entryPoint();
