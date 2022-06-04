
let encryptMap = new Map();
let decryptMap = new Map();
const upperCaseCharacter = '؜';

function initCharMap() {
    encryptMap.set('\n', '𝅺');

    /* Double char */
    encryptMap.set('0', '﻿­');
    encryptMap.set('1', '﻿𝅳');
    encryptMap.set('2', '﻿𝅴');
    encryptMap.set('3', '﻿឴');
    encryptMap.set('4', '﻿឵');
    encryptMap.set('5', '﻿᠎');
    encryptMap.set('6', '﻿​');
    encryptMap.set('7', '﻿‌');
    encryptMap.set('8', '﻿𝅹');
    encryptMap.set('9', '﻿𝅵');
    encryptMap.set('-', '﻿𝅶');
    encryptMap.set('/', '﻿⁠');
    encryptMap.set('_', '﻿⁡');
    encryptMap.set('.', '﻿⁢');
    encryptMap.set(',', '﻿⁣');
    encryptMap.set(' ', '﻿⁤');
    encryptMap.set(':', '﻿⁪');
    encryptMap.set('(', '﻿⁫');
    encryptMap.set(')', '﻿⁬');
    encryptMap.set('é', '﻿⁭');
    encryptMap.set('è', '﻿⁮');
    encryptMap.set('?', '﻿⁯');
    encryptMap.set('!', '﻿𝅷');
    encryptMap.set('=', '﻿𝅸');
    encryptMap.set('à', '﻿‍');
    encryptMap.set('\\', '﻿͏');

    /* Double char */
    encryptMap.set('\'', '‎­');
    encryptMap.set('ç', '‎𝅳');
    encryptMap.set('"', '‎𝅴');
    encryptMap.set('#', '‎឴');
    encryptMap.set('&', '‎឵');
    encryptMap.set('{', '‎᠎');
    encryptMap.set('}', '‎​');
    encryptMap.set('[', '‎‌');
    encryptMap.set(']', '‎𝅹');
    encryptMap.set('|', '‎𝅵');
    encryptMap.set('`', '‎𝅶');
    encryptMap.set('@', '‎⁠');
    encryptMap.set('$', '‎⁡');
    encryptMap.set('%', '‎⁢');
    encryptMap.set('*', '‎⁣');
    encryptMap.set(';', '‎⁤');
    /*
    encryptMap.set('', '‎⁪');
    encryptMap.set('', '‎⁫');
    encryptMap.set('', '‎⁬');
    encryptMap.set('', '‎⁭');
    encryptMap.set('', '‎⁮');
    encryptMap.set('', '‎⁯');
    encryptMap.set('', '‎𝅷');
    encryptMap.set('', '‎𝅸');
    encryptMap.set('', '‎‍');
    encryptMap.set('', '‎͏');
    */

    encryptMap.set('a', '­');
    encryptMap.set('b', '𝅳');
    encryptMap.set('c', '𝅴');
    encryptMap.set('d', '឴');
    encryptMap.set('e', '឵');
    encryptMap.set('f', '᠎');
    encryptMap.set('g', '​');
    encryptMap.set('h', '‌');
    encryptMap.set('i', '𝅹');
    encryptMap.set('j', '𝅵');
    encryptMap.set('k', '𝅶');
    encryptMap.set('l', '⁠');
    encryptMap.set('m', '⁡');
    encryptMap.set('n', '⁢');
    encryptMap.set('o', '⁣');
    encryptMap.set('p', '⁤');
    encryptMap.set('q', '⁪');
    encryptMap.set('r', '⁫');
    encryptMap.set('s', '⁬');
    encryptMap.set('t', '⁭');
    encryptMap.set('u', '⁮');
    encryptMap.set('v', '⁯');
    encryptMap.set('w', '𝅷');
    encryptMap.set('x', '𝅸');
    encryptMap.set('y', '‍');
    encryptMap.set('z', '͏');

    for (let [key, value] of encryptMap) decryptMap.set(value, key);
    //encryptMap.forEach((v, k) => console.log('%s : %s', k, v.length));
}

function hideText(str) {
    let res = '';
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (isUpperCase(char)) res += upperCaseCharacter;
        if (encryptMap.has(char.toLowerCase())) res += encryptMap.get(char.toLowerCase());
        else res += char;
    }
    //const textArea = document.querySelector('textarea#message_topic');
    //textArea.value = `${coverRaw}${res}`;
    return `${coverFancy}${res}`;
}

function revealText(str) {
    const strCoverless = [...str.replace(coverRaw, '')]; // en array les surrogate pairs valent 1 et non 2, plus facile à gérer
    //console.log('length str : %i', str.length);
    //console.log('length strCoverless : %i', str.replace(cover, '').length);
    //console.log('length array strCoverless : %i', strCoverless.length);
    let res = '';
    for (let i = 0; i < strCoverless.length; i++) {
        let char = strCoverless[i];
        const upperCase = char === upperCaseCharacter;
        if (upperCase) char = strCoverless[++i];

        if (i < strCoverless.length - 1) {
            const fullChar = `${char}${strCoverless[i + 1]}`;
            if (decryptMap.has(fullChar)) { // caractère spécial
                const decryptedChar = decryptMap.get(fullChar);
                res += upperCase ? decryptedChar.toUpperCase() : decryptedChar;
                i++;
                continue;
            }
        }

        if (decryptMap.has(char)) { // caractère normal
            const decryptedChar = decryptMap.get(char);
            res += upperCase ? decryptedChar.toUpperCase() : decryptedChar;
            continue;
        }

        res += char; // caractère non géré
    }
    //console.log('decryptText res : %s', res);
    return res;
}
