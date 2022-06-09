
function getAllTopics() {
    let allTopics = document.querySelectorAll('.topic-list.topic-list-admin > li:not(.dfp__atf):not(.message)');
    return [...allTopics];
}

async function decryptTopics() {
    const allTopics = getAllTopics();
    if (!allTopics.length) return;

    allTopics.forEach(async (topic) => {
        const topicTitleElement = topic.querySelector('.topic-title');
        if (!topicTitleElement) return;

        const content = topicTitleElement.textContent.trim();
        if (!content.match(coverDetectionRegex)) return;

        const decryptedContent = revealText(content);
        if (!decryptedContent.trim().length) return;

        topicTitleElement.textContent = decryptedContent;
        topic.classList.add('decensured-decrypted-topic');
    });
}
