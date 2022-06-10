
const coverDetection = '‏';
const coverDetectionRegex = new RegExp(/[‏].*?[‏]/, 'g');

const hideMessageClass = 'decensured-hide-message';
const displayMessageClass = 'decensured-display-message';
const decryptedMessageClass = 'decensured-decrypted-message';

const messageContents = new Map();

const bolshevikRegex = new RegExp(/^193\.36\.45\.\d{1,3}$/);
const externalIpUrl = 'https://myexternalip.com/raw';

const platitudeMessages = [
    "J'apprécie ce forum", "Je ne sais pas quoi en penser", "Je te retourne la question", "Cette communauté est incroyable", "Que pensez-vous de l'actualité ?",
    "A titre personnel j'hésite", "Oui et non", "C'est étonnant", "Ma réaction à chaud ? ent", "C'est un peu décevant", "Je garde la tête haute", "Pourquoi ?",
    "Je préfère m'abstenir", "Que répondre à ça !", "Dans la vie c'est tout ou rien", "Je préfère en rire", "Il vaut mieux rester concentré et attentif",
    "Il faut se battre pour réussir", "La roue finira par tourner pour tout le monde !", "La chance peut te sourire à n'importe quel moment",
    "Je ne sais pas trop de quel côté me ranger", "ça reste à débattre nonobstant.", "En dépit des mesures sanitaires je reste vigilant", "Une de perdue dix de retrouvées",
    "Mieux vaut tard que jamais", "ça reste à confirmer", "Je condamne fermement", "Pourquoi tu dis ça ?", "Le destin en décidera.", "Tout est relatif tu sais...",
    "Chacun fait ce qu'il veut", "Le pollen gratte les yeux en ce moment", "Un week-end de 3 jours ça fait toujours du bien", "C'est dur le lundi :(",
    "Les prix de l'essence aident pas à se détendre non plus", "Je ronge trop souvent mes ongles", "beaucoup de monde à la pompe à essence ce matin !",
    "Il y a des chances qu'on soit pas seul dans l'univers selon moi !", "Mon eau préférée c'est la cristalline et vous ?", "Y'a plus de saisons de toute manière...",
    "On vit en démocratie ne l'oubliez pas les kheys !", "la politique ne m'intéresse pas trop de toute facon", "C'est peu ou prou la même chose",
    "l'important c'est de participer", "Il pleut vraiment très souvent en ce moment vous trouvez pas ?", "C'est comme chiens et chats", "bientôt mon anniversaire faut le savoir",
    "Les goûts et les couleurs hein...", "Savoir rester ouvert d'esprit c'est le plus important", "Quel temps il va faire demain déjà ?", "J'aime bien Star Wars persoent",
    "Drôle d'idée !", "Selon toi il faudrait faire quoi ?", "Peut-être pas aujourd'hui mais à réfléchir", "ta reacprout ?", "ça marche", "d'accord",
    "L'amour te tombera dessus au moment où tu t'y attendras le moins crois moi", "Garde l'oeil ouvert, et le bon !", "Protégez-vous les kheys",
    "Prenez soin de vos proches les kheys", "Les bouchons près de Paris on en parle ?", "Le principal c'est de protéger les autres avant soi-même",
    "le week-end est passé tellement vite", "C'est lequel votre sticker préféré ? Moi c'est ", "Franchement je préfère pas y penser", "ça veut dire quoi pnj ?",
    "Son point de vue est à considérer, mais restons prudents", "up", "je up", "hophophop on up le topic", "perso ça m'est égal", "peut-être pas qui sait",
    "Le travail paie", "Mangez 5 fruits et légumes par jour les kheys", "La musique de nos jours tu sais", "Ca parait peu probable en dépit de", "Faut voir",
    "A voir", "Ca permet de respirer j'avoue", "Le mieux étant de rester nuancé", "J'hésite à le dire mais bon", "Sérieux ?", "Sérieusement ?", "Non mais allo quoi",
    "Pfff de toute manière c'est inévitable khey", "Peut être un jour oui mais la j'ai la flemme", "Honnêtement c'est pas si simple", "Plus compliqué que ça",
    "Ca me rappelle Zizou en 98 ça", "D'accord mais qui l'a dit ?", "J'en reviens pas si nofake", "Je re, je dois aller manger", " Aidez moi pour mes devoirs en MP svp",
    "Faut aller voter c'est important pour la démocratie", "Allez les bleus !", "Mon voisin me regarde pas la fenêtre chelou non ?", "Rien de nouveau, toujours le boulot",
    "Votre youtubeur préféré c'est qui ? J'aime bien Squeezie", "J'ai renversé mon café l'autre jour", "Le ciel est grisatre aujourd'hui non ?", "Les oiseaux chantent ou crient ?",
    "J'aimerais bien voir ça", "Plutôt deux fois qu'une", "Le lièvre ou la tortue ?", "Petit à petit quoi", "Boucle", "Boucled", "Malaise", "Gros malaise", "Enorme malaise",
    "Ok khey", "Depuis quand ?", "Y'a pas à dire l'evian est délicieuse", "Harry Potter vous aimez ?", "Je préfère être sur téléphone perso", "Je préfère être sur pc perso",
    "Y'a pas à dire, Zidane il était bon hein", ":(", ":ouch:", ":ouch2:", ":-(", ":noel:", ":play:", "Je go toilettes attendez moi", "Le topic bug non ?", "J'aurais pas dit ça moi",
    "si tu le dis...", "personne te croit mais bon...", "c'est pas si sûr", "explique un peu plus si tu veux nous convaincre", "je ne sais pas quoi en penser",
    "ça se tente", "Il faut toujours croire en ses rêves", "Tellement content d'être ici", "Vive la république !", "Profitez bien de la vie les kheys",
    "du coup je ne sais qui écouter", "Ce topic est étonnant", "Je dis ça je dis rien", "Restons courtois svp", "Attendez j'écris un gros pavé pour expliquer",
    "Source ?", "Ca a été debunk y'a longtemps", "Euh pardon ?", "Pffff même pas", "Rien compris", "Rien compris l'op", "rien compris à ton message", "qui me cite la ?"];

const platitudeStickers = [
    'https://image.noelshack.com/fichiers/2018/29/6/1532128784-risitas33.png', 'https://image.noelshack.com/fichiers/2017/39/3/1506524542-ruth-perplexev2.png',
    'https://image.noelshack.com/fichiers/2017/39/3/1506463228-risibg.png', 'https://image.noelshack.com/fichiers/2017/31/5/1501862610-jesus56bestreup.png',
    'https://image.noelshack.com/fichiers/2016/47/1480081450-ris42.png', 'https://image.noelshack.com/fichiers/2017/30/4/1501187858-risitassebestreup.png',
    'https://image.noelshack.com/fichiers/2016/47/1480092147-1477945635-1465556572-elrisitassticker3-copy.png', 'https://image.noelshack.com/fichiers/2017/22/1496491923-jesusperplex2.png',
    'https://image.noelshack.com/fichiers/2017/02/1484127482-jesusah2.png', 'https://image.noelshack.com/fichiers/2016/47/1480081469-ris6.png',
    'https://image.noelshack.com/fichiers/2016/36/1473137273-up.png', 'https://image.noelshack.com/fichiers/2016/50/1481994659-mathematicienrisitas.png',
    'https://image.noelshack.com/fichiers/2017/15/1491776892-bloggif-58eab299b8692.png', 'https://image.noelshack.com/fichiers/2016/42/1476947003-risitas-lunettes-main.png',
    'https://image.noelshack.com/fichiers/2016/30/1469539438-zperplexe.png', 'https://image.noelshack.com/fichiers/2018/13/6/1522514760-jesusz.png',
    'https://image.noelshack.com/fichiers/2017/30/4/1501186885-risitasueurbestreup.png', 'https://image.noelshack.com/fichiers/2017/30/4/1501185683-jesusjournalbestreup.png',
    'https://image.noelshack.com/fichiers/2017/18/1494048058-pppppppppppppppppppp.png', 'https://image.noelshack.com/fichiers/2017/04/1485259037-bloggif-588741091e719.png',
    'https://image.noelshack.com/fichiers/2018/10/1/1520255849-risitasse.png', 'https://image.noelshack.com/fichiers/2017/15/1492340491-jesus32.png',
    'https://image.noelshack.com/fichiers/2021/18/7/1620572127-jesus-barbe-serein.png', 'https://image.noelshack.com/fichiers/2017/05/1485800183-2588741.png',
    'https://image.noelshack.com/fichiers/2017/08/1487984196-789797987987464646468798798.png', 'https://image.noelshack.com/fichiers/2017/14/1491249193-risitasg16462.png',
    'https://image.noelshack.com/fichiers/2018/13/6/1522514564-risitasperplexeb.png', 'https://image.noelshack.com/fichiers/2016/24/1466366261-risitas51.png',
    'https://image.noelshack.com/fichiers/2017/05/1486215313-sans-titre-20-5.png', 'https://image.noelshack.com/fichiers/2018/13/6/1522514698-risitassueurz.png',
    'https://image.noelshack.com/fichiers/2017/05/1485878723-risitas-reflechis.png', 'https://image.noelshack.com/fichiers/2017/20/1495181295-risitasvieux2.png',
    'https://image.noelshack.com/fichiers/2017/03/1484841031-bloggif-5880e02573f79.png', 'https://image.noelshack.com/fichiers/2016/38/1474755095-risitas719.png',
    'https://image.noelshack.com/fichiers/2016/38/1474552335-1474295636-1472310133-picsart-08-27-04-31-36.png', 'https://image.noelshack.com/fichiers/2017/15/1492267199-jesus18.png',
    'https://image.noelshack.com/fichiers/2020/52/6/1608985783-ahi-triangle.png', 'https://image.noelshack.com/fichiers/2022/21/4/1653554488-ahi-wonki-tison.png',
    'https://image.noelshack.com/fichiers/2021/43/4/1635454847-elton-john-tison-golem.png', 'https://image.noelshack.com/fichiers/2018/27/4/1530827992-jesusreup.png',
    'https://image.noelshack.com/fichiers/2018/26/7/1530476579-reupjesus.png', 'https://image.noelshack.com/fichiers/2016/26/1467335935-jesus1.png',
    'https://image.noelshack.com/fichiers/2019/32/1/1564966469-ent.png', 'https://image.noelshack.com/fichiers/2017/13/1490886827-risibo.png',
    'https://image.noelshack.com/fichiers/2018/10/1/1520256134-risitasue2.png', 'https://image.noelshack.com/fichiers/2018/25/2/1529422413-risitaszoom.png',
    'https://image.noelshack.com/fichiers/2018/10/1/1520260980-risitas94.png', 'https://image.noelshack.com/fichiers/2022/18/5/1651860152-65851-full.png',
    'https://image.noelshack.com/fichiers/2017/39/3/1506463227-risitaspeur.png', 'https://image.noelshack.com/fichiers/2016/30/1469541952-risitas182.png',
    'https://image.noelshack.com/fichiers/2020/51/2/1607997474-ayaoo.png', 'https://image.noelshack.com/fichiers/2017/30/4/1501186981-risimixbestreup.png',
    'https://image.noelshack.com/fichiers/2020/50/2/1607386908-enxt.png', 'https://image.noelshack.com/fichiers/2017/02/1484173541-cc-risitas596.png'];

const platitudeTopics = [
    "J'apprécie ce forum", "Cette communauté est incroyable", "Que pensez-vous de l'actualité ?", "Je garde la tête haute", "Dans la vie c'est tout ou rien", "Je préfère en rire",
    "Il faut se battre pour réussir", "La roue finira par tourner", "La chance peut te sourire aussi", "Une de perdue dix de retrouvées", "Mieux vaut tard que jamais",
    "Je condamne fermement", "Chacun fait ce qu'il veut", "Le pollen gratte trop les yeux", "Week-end de 3 jours enfin", "C'est dur le lundi :(", "Les prix de l'essence",
    "Je ronge mes ongles", "Trop de monde à la station", "On est pas seuls dans l'univers", "Votre eau préférée ?", "Y'a plus de saisons", "L'important c'est de participer",
    "Il pleut trop en ce moment", "Bientôt mon anniversaire", "Rester ouvert d'esprit", "Quel temps pour demain ?", "J'aime bien Star Wars", "L'amour nous tombera dessus",
    "Protégez-vous les kheys", "Prenez soin de vos proches les kheys", "Les bouchons à Paris on en talk", "Le week-end est passé vite", "Votre sticker préféré ?",
    "Ici on dit des banalités", "Ici on raconte des banalités", "Les platitudes", "Mes platitudes/20", "Plus PNJ que ça ?", "Être un PNJ", "Les golems ayaaa",
    "Votre plat préféré?", "Votre série préférée c quoi ?", "Les aya je fais l'appel", "Les issou je fais la pelle", "Les KJ je fais l'appel", "Les QLF je fais l'appel",
    "Ton ent de poche : prout", "Ton père : ok", "Ta mère : bah sors", "Ton patron : au boulot", "Le travail paie", "Manger 5 fruits/jour", "Cette meuf a la POSTE",
    "Votre café préféré ?", "Plutôt thé ou café ?", "Votre film préféré", "J'ai go muscu", "Quel clavier acheter ?", "TPMP c tjrs pareil"];
