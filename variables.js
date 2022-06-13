const coverDetection = '‏';
const coverDetectionRegex = new RegExp(/[‏].*?[‏]/, 'g');

const hideMessageClass = 'decensured-hide-message';
const displayMessageClass = 'decensured-display-message';
const decryptedMessageClass = 'decensured-decrypted-message';

const messageContents = new Map();

const bolshevikRegex = new RegExp(/^193\.36\.45\.\d{1,3}$/);
const externalIpUrl = 'https://myexternalip.com/raw';

const bolshevikList = ["YWthemFu", "YWx2aW5fc3RpY2s=", "YW5hZ3VuZA==", "YW50aXN0YXI=", "YXlkZW5f", "YXltZXJpY2xhbGxlZQ==", "YmVubnV0czc3", "Yml4eDIy", "Y2FybmJlZQ==", "Y2VyemF0NDM=", "Y2xlbWVudG9zcw==", "Y3RodWxodXM=", "Zmt6", "Z2VrdXJp", "aW5kZWU=", "aW5mZXJub2dz", "aXpva2F5", "amVyb21lam9mZmFyZA==", "amlpa2Fh", "am9wYXBwZQ==", "anZfcGxhbnRl", "a2FtaXNhbWFib2I=", "a2FuYW1l", "bGFwZXRpdGVwZWxsZQ==", "bGV2aWF0aGFu", "bGlnaHRtYW4=", "bWFsbG9kZWxpYw==", "bWlkbmFpbGFo", "bXhncmVlbg==", "bmFnbGFnbGFzc29u", "bmF1Z2h0eWdvZA==", "b2xpdmVyb2lkdWJvY2Fs", "cGFudGhhYQ==", "cGdfYmFzdGllbg==", "cmFuZG9jYW4=", "cmlyaV8xNQ==", "cm9tYWluLWp2Yy0=", "c2lsZW50X2pheQ==", "c3RvdWI=", "c3VwZXJwYW5kYQ==", "c3V1bWFz", "dGhlX3NvcnJvdw==", "dGlyYXhh", "dXVuc3VzdGFpbmFibGU=", "eHNhYmxl", "W2ZpcmV3b3JrXQ==", "W2Zsb18wNl0=", "XWZhdXN0aW5lWw==", "YXNhcF9zdmVu", "ZGFrb3RhLTQ3", "ZGVhZC1uaWdodA==", "ZHVrZTNk", "ZW5kb3JwaFstaW5lXQ==", "ZXZpbGFzaDA4", "Z2FiaXZlbg==", "Z2FtZXNvZmxvdmU=", "a3JheXplbA==", "bF9n", "bGF0aW9zW2p2XQ==", "bGVpcm9r", "bGlrZWdvZA==", "bG92ZS1uLXBlYWNl", "bWFteXVtZQ==", "bWFubw==", "b2RlbGxiZWNraGFt", "b2Rva2k=", "b25pLWtlbno=", "cHVpc3NhbmNpZXI=", "cHVtYXp6eno=", "cmVmb250ZQ==", "cmVteXNhbmdmYW15", "c2FuZ293c2tp", "c2F1bW9uYXJjZW5jaWVs", "dG9teS1mZXR0", "dm9ydGV4NjQ2", "eWFndWFyYQ==", "eWFtYWNoYW4=", "eW9kYV9zb2Z0d2FyZQ=="];

const platitudeMessages = [
    "Que la famille personne nous inquiète jusqu'au dernier gramme", 
    "Y'a pas de cinéma j'ai pas de temps pas de temps à donner ou à perdre", 
    "J'veux du L j'veux du V j'veux du G", 
    "comme ton ennemi qui vit ton rêve le jour de ta fête",
    "j'me sens mutant tant différent dans la ville",
    "j'veux pas de ton facebook rrrh tfou",
    "RDV sur Saturne",
    "et j'crois bien qu'ils sont pas humain ou c'est peut etre moi qui suis pas humain",
    "OUUUUUUUUUH ONIZUKA", 
    "encore un qui chauffe ma mamie",
    "ouai igo a l'aller j'ai de la money",
    "au retour le coffre et chargé comme un poney",
    "j'viens faire mon beurre mer de billets j'fais des longueurs",
    "J'sais pas ce qu'on sera dans 10 ans mais disons que pour l'instant J'fais tomber mes zitounes en pissant",
    "J'suis dans le four j'ai chaud j'ai la dalle",
    "Ma frappe y'a personne qui l'arrête penalty je souris au gardien", 
    "DA, DA, DA",
    "Ouais c'est le désert dans la te-tê", 
    "Pourquoi t'as dis je t'aime au pif",
    "Et toute la journée je pense à tous ces Calimero", 
    "chico chico hola hola hello girl",
    "j'dois charbonner j'suis abonné",
    "A A Abonné",
    "le prends pas mal mais j'ai pas d'amour",
    "j'met les crampons j'ai les dents longues",
    "ounga ounga man que pasa",
    "mowgli jongle dans la jungle",
    "j'ai la haine comme a mexico",
    "j'marche comme a mexico",
    "la dégaine a la mexico",
    "dans la tête c'est mexico",
    "tous les jours c'est la guerre mais on doit le faire a la mexico",
    "toujours le doigt en l'air arriba arriba mexico",
    "Algérie Corsica rapelle nous dans 10k",
    "La première fois j'suis bétom j'ai laissé le terrain à Nabil", 
    "ok j'ai compris on s'en sort pas comme ça",
    "sauvage un animal au millieu des hommes",
    "Mowgli fait ses premiers pas dans la nature",
    "J'sais très bien que mon vécu n'est qu'un leurre",
    "Au DD",
    "Naha Naha mmmmhhh",
    "Laisse Laisse Laisse PNL gère gère gère",
    "Igo m'demandent tous de l'aide",
    "Seul sous la capuuuuche",
    "J'aimes pas tes rêves",
    "la mif va bien pas s'embarasser",
    "toujours le doigt en l'air arriba arriba Mexico",
    "coup du sombrero a la Mexico",
    "2 3 4 5 barres",
    "6 7 8 Cliquos",
    "pas maintenant qu'on se barre",
    "pas de rêves que des doss",
    "j'papote avec ma pocket",
    "khey khey khey khey",
    "le sommeil d'une plume le bruit des portières qui claquent sur le parking", 
    "ce soir j'suis dans la ville a miami", 
    "ce soir j'suis little spoon comme ma chebi", 
    "dernier charbon sous cagoule teint pale", 
    "igo j'sors mon cul du rainté",
    "j'suis de la jungle apelle moi Mowgli",
    "guapa sheitana dans la villa"];

const platitudeStickers = ['https://image.noelshack.com/fichiers/2016/50/1482086657-pnlademorire.png', 
                           'https://image.noelshack.com/fichiers/2017/14/1491521773-img-20170407-013554.png', 
                           'https://image.noelshack.com/fichiers/2017/11/1489849680-img-20170318-160705.png', 
                           'https://image.noelshack.com/fichiers/2016/50/1481665326-pnl2.png', 
                           'https://image.noelshack.com/fichiers/2017/11/1489850421-img-20170318-161731.png', 
                           'https://image.noelshack.com/fichiers/2017/11/1489945807-img-20170319-184623.png', 
                           'https://image.noelshack.com/fichiers/2021/09/7/1615073676-ronaldo-cigarette-hd.jpg', 
                           'https://image.noelshack.com/fichiers/2017/11/1489945807-img-20170319-184623.png', 
                           'https://image.noelshack.com/fichiers/2017/14/1491522200-img-20170407-014306.png', 
                           'https://image.noelshack.com/fichiers/2017/11/1489836788-img-20170318-123229.png', 
                           'https://image.noelshack.com/fichiers/2017/11/1489949358-img-20170319-194401.png', 
                           'https://image.noelshack.com/fichiers/2018/52/1/1545642362-cr7ds.png', 
                           'https://image.noelshack.com/fichiers/2019/24/2/1560277733-peau2genou-dz3.png', 
                           'https://image.noelshack.com/fichiers/2019/02/2/1546976853-snapchat20190108.jpg',
                           'https://image.noelshack.com/fichiers/2019/32/1/1564966469-ent.png',
                           'https://image.noelshack.com/fichiers/2021/16/2/1618877900-ronaldomain4khd-min.jpg', 
                           'https://image.noelshack.com/fichiers/2019/12/6/1553370870-snapchat205153.jpg',
                           'https://image.noelshack.com/fichiers/2019/12/6/1553352567-nos-df.png',
                           'https://image.noelshack.com/fichiers/2019/21/3/1558562022-deux-freres.png',
                           'https://image.noelshack.com/fichiers/2019/27/2/1562098170-dll.jpg',
                           'https://image.noelshack.com/fichiers/2017/06/1486924454-pnl-nuage.png',
                           'https://image.noelshack.com/fichiers/2017/49/6/1512859316-leszitounes.png',
                           'https://image.noelshack.com/fichiers/2017/25/6/1498307820-nos-fume.png',
                           'https://image.noelshack.com/fichiers/2019/32/7/1565530192-drapeau-algerie.png',
                           'https://image.noelshack.com/fichiers/2017/49/7/1512860722-pnlpaixsurvous.png'];

const platitudeTopics = platitudeMessages
