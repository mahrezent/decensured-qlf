
const coverDetection = 'ﾠ';
const coverDetectionRegex = new RegExp(/ﾠ.*ﾠ/, 'g');

const platitudes = [
    'J\'apprécie ce forum', 'Je ne sais pas quoi en penser', 'Je te retourne la question', 'Cette communauté est incroyable', 'Que pensez-vous de l\'actualité ?',
    'A titre personnel j\'hésite', 'Oui et non', 'C\'est étonnant', 'Ma réaction à chaud ? ent', 'C\'est un peu décevant', 'Je garde la tête haute', 'Pourquoi ?',
    'Je préfère m\'abstenir', 'Que répondre à ça !', 'Dans la vie c\'est tout ou rien', 'Je préfère en rire', 'Il vaut mieux rester concentré et attentif',
    'Il faut se battre pour réussir', 'La roue finira par tourner pour tout le monde !', 'La chance peut te sourire à n\'importe quel moment', 'Je ne sais pas trop de quel côté me ranger',
    'ça reste à débattre nonobstant.', 'En dépit des mesures sanitaires je reste vigilant', 'Une de perdue dix de retrouvées', 'Mieux vaut tard que jamais', 'ça reste à confirmer'];

const platitudeStickers = [
    'https://image.noelshack.com/fichiers/2018/29/6/1532128784-risitas33.png', 'https://image.noelshack.com/fichiers/2017/39/3/1506524542-ruth-perplexev2.png',
    'https://image.noelshack.com/fichiers/2017/39/3/1506463228-risibg.png', 'https://image.noelshack.com/fichiers/2017/31/5/1501862610-jesus56bestreup.png',
    'https://image.noelshack.com/fichiers/2016/47/1480081450-ris42.png', 'https://image.noelshack.com/fichiers/2017/30/4/1501187858-risitassebestreup.png',
    'https://image.noelshack.com/fichiers/2016/47/1480092147-1477945635-1465556572-elrisitassticker3-copy.png', 'https://image.noelshack.com/fichiers/2017/22/1496491923-jesusperplex2.png',
    'https://image.noelshack.com/fichiers/2017/02/1484127482-jesusah2.png', 'https://image.noelshack.com/fichiers/2016/47/1480081469-ris6.png',
    'https://image.noelshack.com/fichiers/2016/36/1473137273-up.png', 'https://image.noelshack.com/fichiers/2016/50/1481994659-mathematicienrisitas.png',
    'https://image.noelshack.com/fichiers/2017/15/1491776892-bloggif-58eab299b8692.png', 'https://image.noelshack.com/fichiers/2016/42/1476947003-risitas-lunettes-main.png',
    'https://image.noelshack.com/fichiers/2016/30/1469539438-zperplexe.png', 'https://image.noelshack.com/fichiers/2018/13/6/1522514760-jesusz.png'];
