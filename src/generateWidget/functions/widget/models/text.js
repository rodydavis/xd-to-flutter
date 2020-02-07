const { fixDouble, hexColorToFlutterColor, sz, widthHeight, rotate, constText } = require("../util");
const { Shadow } = require("./submodels/shadow");
var withDivision = require("../main");
var withSimpleCode = require("../main");
var withGoogleFonts = require("../main");

class Text {
  constructor(json) {
    this.type = Text;
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["globalW"]);
    this.gh = parseFloat(json["globalH"]);
    this.type = json['type'];
    this.text = json['text'];
    this.id = this.text;
    this.withAreaBox = json['withAreaBox'];
    this.withColor = json['wcolor'];
    this.rotation = fixDouble(json['rotation']);
    this.opacity = fixDouble(json['opacity']);
    this.color = hexColorToFlutterColor(
      json['color'].toString(), this.withColor ? this.opacity : 0, true, !withDivision.withDivision, withSimpleCode.withSimpleCode);
    this.textAlign = json['textAlign'];
    this.underline = json['underline'];
    this.strikethrough = json['strikethrough'];
    this.fontFamily = json['fontFamily'];
    this.fontWeight = json['fontWeight'];
    this.fontSize = fixDouble(json['fontSize']);
    this.shadow = json['shadow'] != null
      ? new Shadow(json['shadow'], this.withColor)
      : null;
  }

  generateWidget() {
    let widget = withDivision.withDivision ? this._divisionWidget() : this._defaultWidget();
    if (this.withAreaBox && !withDivision.withDivision) {
      return `Container(${widthHeight(this.w, true, false)}${widthHeight(this.h, false, false)}child:${widget},)`
    }
    return widget;
  }

  _decoration() {
    let content;
    if (this.strikethrough && this.underline) {
      content = `TextDecoration.combine(
        [TextDecoration.lineThrough, TextDecoration.underline])`;
    } else if (this.strikethrough) {
      content = "TextDecoration.underline";
    } else if (this.underline) {
      content = "TextDecoration.underline";
    }
    if (content != undefined) {
      if (withDivision.withDivision) {
        return `..textDecoration(${content})`;
      }
      return `decoration: ${content},`;
    }
    return "";
  }

  _align() {
    let textAlign = withDivision.withDivision ? "..textAlign." : "textAlign: TextAlign.";
    let end = (withDivision.withDivision ? '()' : `,`);
    if (this.textAlign == 'right') {
      return `${textAlign}end` + end;
    } else if (this.textAlign == 'center') {
      return `${textAlign}center` + end;
    }
    return "";
  }

  _fontWeight() {
    this.fontWeight = this.fontWeight.toLowerCase().replace("-", "");
    if (this.fontWeight == "thin") {
      this.fontWeight = "100";
    } else if (this.fontWeight == "extraligth") {
      this.fontWeight = "200";
    } else if (this.fontWeight == "light") {
      this.fontWeight = "300";
    } else if (this.fontWeight == "medium") {
      this.fontWeight = "500";
    } else if (this.fontWeight == "semibold") {
      this.fontWeight = "600";
    } else if (this.fontWeight == "bold") {
      this.fontWeight = "700";
      if (withDivision.withDivision) return "..bold()";
      return 'fontWeight: FontWeight.bold,';
    } else if (this.fontWeight == "extrabold") {
      this.fontWeight = "800";
    } else if (this.fontWeight == "black") {
      this.fontWeight = "900";
    } else {
      this.fontWeight = "400";
      return "";
    }
    let content = `FontWeight.w${this.fontWeight}`;
    if (withDivision.withDivision) return `..fontWeight(${content})`;
    return `fontWeight: ${content},`;
  }

  _defaultWidget() {
    let withConst = !withSimpleCode.withSimpleCode;
    let widget = `${constText(withConst)}Text(
      '${this.text}',
      ${this._align()}
      ${this._textStyle()}
    )`;
    return rotate(this.rotation, widget);;
  }

  _textStyle() {
    let family = this.fontFamily.replace(/\s+/g, '');
    family = family[0].toLowerCase() + family.substring(1, family.length);
    console.log(`withGoogleFonts.withGoogleFonts = ${withGoogleFonts.withGoogleFonts}`);
    console.log(` _googleFonts.includes(family) = ${_googleFonts.includes(family)}`);

    if (withGoogleFonts.withGoogleFonts && _googleFonts.includes(family)) {
      return `style: GoogleFonts.${family}(
        fontSize: ${sz(this.fontSize)},
        ${this._fontWeight()}
        ${this.color}
        ${this._decoration()}
        ${this.shadow.print(true)}
      ),`;
    }

    return `style: TextStyle(
      fontFamily: '${this.fontFamily}',
      fontSize: ${sz(this.fontSize)},
      ${this._fontWeight()}
      ${this.color}
      ${this._decoration()}
      ${this.shadow.print(true)}
    ),`;
  }

  _divisionWidget() {
    let widget = `Txt(
      '${this.text}',
        style: TxtStyle()
          ..fontFamily('${this.fontFamily}')
          ..fontSize(${sz(this.fontSize)})
          ${this._align()}
          ${this._fontWeight()}
          ${rotate(this.rotation)}
          ..textColor(${this.color})
          ${this.shadow.print(true)}
          ${this._withAreaBox()}
          ${this._decoration()},
      ) `;
    return widget;
  }

  _withAreaBox() {
    if (this.withAreaBox) {
      return `
      ${widthHeight(this.w, true, true)}${widthHeight(this.h, false, true)}
      `;
    }
    return "";
  }
}

module.exports = { Text };


let _googleFonts = ["aBeeZee",
  "abel",
  "abhayaLibre",
  "abrilFatface",
  "aclonica",
  "acme",
  "actor",
  "adamina",
  "adventPro",
  "aguafinaScript",
  "akronim",
  "aladin",
  "aldrich",
  "alef",
  "alegreya",
  "alegreyaSC",
  "alegreyaSans",
  "alegreyaSansSC",
  "aleo",
  "alexBrush",
  "alfaSlabOne",
  "alice",
  "alike",
  "alikeAngular",
  "allan",
  "allerta",
  "allertaStencil",
  "allura",
  "almendra",
  "almendraDisplay",
  "almendraSC",
  "amarante",
  "amaranth",
  "amaticSC",
  "amaticaSC",
  "amethysta",
  "amiko",
  "amiri",
  "amita",
  "anaheim",
  "andada",
  "andika",
  "annieUseYourTelescope",
  "anonymousPro",
  "antic",
  "anticDidone",
  "anticSlab",
  "anton",
  "arapey",
  "arbutus",
  "arbutusSlab",
  "architectsDaughter",
  "archivo",
  "archivoBlack",
  "archivoNarrow",
  "arefRuqaa",
  "arimaMadurai",
  "arimo",
  "arizonia",
  "armata",
  "arsenal",
  "artifika",
  "arvo",
  "arya",
  "asap",
  "asar",
  "asset",
  "assistant",
  "astloch",
  "asul",
  "athiti",
  "atma",
  "atomicAge",
  "aubrey",
  "audiowide",
  "autourOne",
  "average",
  "averageSans",
  "averiaGruesaLibre",
  "averiaLibre",
  "averiaSansLibre",
  "averiaSerifLibre",
  "b612",
  "b612Mono",
  "badScript",
  "bahiana",
  "bahianita",
  "baiJamjuree",
  "baloo",
  "balooBhai",
  "balooBhaijaan",
  "balooBhaina",
  "balooChettan",
  "balooDa",
  "balooPaaji",
  "balooTamma",
  "balooTammudu",
  "balooThambi",
  "balthazar",
  "bangers",
  "barlow",
  "barriecito",
  "barrio",
  "basic",
  "baumans",
  "belgrano",
  "bellefair",
  "belleza",
  "benchNine",
  "bentham",
  "berkshireSwash",
  "bethEllen",
  "bevan",
  "bigelowRules",
  "bigshotOne",
  "bilbo",
  "bilboSwashCaps",
  "bioRhyme",
  "biryani",
  "bitter",
  "blackAndWhitePicture",
  "blackHanSans",
  "blackOpsOne",
  "blinker",
  "bonbon",
  "boogaloo",
  "bowlbyOne",
  "bowlbyOneSC",
  "brawler",
  "breeSerif",
  "bubblegumSans",
  "bubblerOne",
  "buda",
  "buenard",
  "bungee",
  "bungeeHairline",
  "bungeeInline",
  "bungeeOutline",
  "bungeeShade",
  "butcherman",
  "butterflyKids",
  "cabin",
  "cabinSketch",
  "caesarDressing",
  "cagliostro",
  "cairo",
  "calligraffitti",
  "cambay",
  "cambo",
  "candal",
  "cantarell",
  "cantataOne",
  "cantoraOne",
  "capriola",
  "cardo",
  "carme",
  "carroisGothic",
  "carroisGothicSC",
  "carterOne",
  "catamaran",
  "caudex",
  "caveat",
  "caveatBrush",
  "cedarvilleCursive",
  "cevicheOne",
  "chakraPetch",
  "changa",
  "changaOne",
  "chango",
  "charm",
  "charmonman",
  "chathura",
  "chauPhilomeneOne",
  "chelaOne",
  "chelseaMarket",
  "cherryCreamSoda",
  "cherrySwash",
  "chewy",
  "chicle",
  "chivo",
  "chonburi",
  "cinzel",
  "cinzelDecorative",
  "clickerScript",
  "coda",
  "codaCaption",
  "codystar",
  "coiny",
  "combo",
  "comfortaa",
  "comingSoon",
  "concertOne",
  "condiment",
  "contrailOne",
  "convergence",
  "cookie",
  "copse",
  "corben",
  "cormorant",
  "cormorantGaramond",
  "cormorantInfant",
  "cormorantSC",
  "cormorantUnicase",
  "cormorantUpright",
  "courgette",
  "cousine",
  "coustard",
  "coveredByYourGrace",
  "craftyGirls",
  "creepster",
  "creteRound",
  "crimsonText",
  "croissantOne",
  "crushed",
  "cuprum",
  "cuteFont",
  "cutive",
  "cutiveMono",
  "dMSans",
  "dMSerifDisplay",
  "dMSerifText",
  "damion",
  "dancingScript",
  "darkerGrotesque",
  "davidLibre",
  "dawningofaNewDay",
  "daysOne",
  "dekko",
  "delius",
  "deliusSwashCaps",
  "deliusUnicase",
  "dellaRespira",
  "denkOne",
  "devonshire",
  "dhurjati",
  "didactGothic",
  "diplomata",
  "diplomataSC",
  "doHyeon",
  "dokdo",
  "domine",
  "donegalOne",
  "doppioOne",
  "dorsa",
  "dosis",
  "drSugiyama",
  "droidSans",
  "droidSansMono",
  "droidSerif",
  "duruSans",
  "dynalight",
  "eBGaramond",
  "eagleLake",
  "eastSeaDokdo",
  "eater",
  "economica",
  "eczar",
  "elMessiri",
  "electrolize",
  "elsie",
  "elsieSwashCaps",
  "emblemaOne",
  "emilysCandy",
  "encodeSans",
  "engagement",
  "englebert",
  "enriqueta",
  "ericaOne",
  "esteban",
  "euphoriaScript",
  "ewert",
  "exo",
  "exo2",
  "expletusSans",
  "fahkwang",
  "fanwoodText",
  "farro",
  "farsan",
  "fascinate",
  "fascinateInline",
  "fasterOne",
  "faunaOne",
  "faustina",
  "federant",
  "federo",
  "felipa",
  "fenix",
  "fingerPaint",
  "firaMono",
  "firaSans",
  "firaSansCondensed",
  "firaSansExtraCondensed",
  "fjallaOne",
  "fjordOne",
  "flamenco",
  "flavors",
  "fondamento",
  "fontdinerSwanky",
  "forum",
  "francoisOne",
  "frankRuhlLibre",
  "freckleFace",
  "frederickatheGreat",
  "fredokaOne",
  "fresca",
  "frijole",
  "fruktur",
  "fugazOne",
  "gFSDidot",
  "gFSNeohellenic",
  "gabriela",
  "gaegu",
  "gafata",
  "galada",
  "galdeano",
  "galindo",
  "gamjaFlower",
  "gayathri",
  "gentiumBasic",
  "gentiumBookBasic",
  "geo",
  "geostar",
  "geostarFill",
  "germaniaOne",
  "gidugu",
  "gildaDisplay",
  "giveYouGlory",
  "glassAntiqua",
  "glegoo",
  "gloriaHallelujah",
  "goblinOne",
  "gochiHand",
  "googleSans",
  "googleSansDisplay",
  "gorditas",
  "gothicA1",
  "goudyBookletter1911",
  "graduate",
  "grandHotel",
  "gravitasOne",
  "greatVibes",
  "grenze",
  "griffy",
  "gruppo",
  "gudea",
  "gugi",
  "gurajada",
  "habibi",
  "halant",
  "hammersmithOne",
  "hanalei",
  "hanaleiFill",
  "handlee",
  "happyMonkey",
  "harmattan",
  "headlandOne",
  "heebo",
  "hennyPenny",
  "herrVonMuellerhoff",
  "hiMelody",
  "hind",
  "hindGuntur",
  "hindMadurai",
  "hindSiliguri",
  "hindVadodara",
  "holtwoodOneSC",
  "homemadeApple",
  "homenaje",
  "iBMPlexMono",
  "iBMPlexSans",
  "iBMPlexSerif",
  "iMFellDWPica",
  "iMFellDWPicaSC",
  "iMFellDoublePica",
  "iMFellDoublePicaSC",
  "iMFellEnglish",
  "iMFellEnglishSC",
  "iMFellFrenchCanon",
  "iMFellFrenchCanonSC",
  "iMFellGreatPrimer",
  "iMFellGreatPrimerSC",
  "iceberg",
  "iceland",
  "imprima",
  "inconsolata",
  "inder",
  "indieFlower",
  "inika",
  "inknutAntiqua",
  "irishGrover",
  "istokWeb",
  "italiana",
  "italianno",
  "itim",
  "jacquesFrancois",
  "jacquesFrancoisShadow",
  "jaldi",
  "jimNightshade",
  "jockeyOne",
  "jollyLodger",
  "jomhuria",
  "josefinSans",
  "josefinSlab",
  "jotiOne",
  "jua",
  "judson",
  "julee",
  "juliusSansOne",
  "junge",
  "jura",
  "justAnotherHand",
  "justMeAgainDownHere",
  "k2D",
  "kadwa",
  "kalam",
  "kameron",
  "kanit",
  "kantumruy",
  "karla",
  "karma",
  "katibeh",
  "kaushanScript",
  "kavivanar",
  "kavoon",
  "kdamThmor",
  "keaniaOne",
  "kellySlab",
  "kenia",
  "khand",
  "khula",
  "kirangHaerang",
  "kiteOne",
  "knewave",
  "koHo",
  "kodchasan",
  "kottaOne",
  "kranky",
  "kreon",
  "kristi",
  "kronaOne",
  "krub",
  "kumarOne",
  "kumarOneOutline",
  "kurale",
  "laBelleAurore",
  "lacquer",
  "laila",
  "lakkiReddy",
  "lalezar",
  "lancelot",
  "lateef",
  "lato",
  "leagueScript",
  "leckerliOne",
  "ledger",
  "lekton",
  "lemon",
  "lemonada",
  "libreBaskerville",
  "libreFranklin",
  "lifeSavers",
  "lilitaOne",
  "lilyScriptOne",
  "limelight",
  "lindenHill",
  "liuJianMaoCao",
  "livvic",
  "lobster",
  "lobsterTwo",
  "londrinaOutline",
  "londrinaShadow",
  "londrinaSketch",
  "londrinaSolid",
  "longCang",
  "lora",
  "loveYaLikeASister",
  "lovedbytheKing",
  "loversQuarrel",
  "luckiestGuy",
  "lusitana",
  "lustria",
  "mPLUSRounded1c",
  "maShanZheng",
  "macondo",
  "macondoSwashCaps",
  "mada",
  "magra",
  "maidenOrange",
  "maitree",
  "majorMonoDisplay",
  "mako",
  "mali",
  "mallanna",
  "mandali",
  "manjari",
  "manuale",
  "marcellus",
  "marcellusSC",
  "marckScript",
  "margarine",
  "markoOne",
  "marmelad",
  "martel",
  "martelSans",
  "marvel",
  "mate",
  "mateSC",
  "mavenPro",
  "mcLaren",
  "meddon",
  "medievalSharp",
  "medulaOne",
  "meeraInimai",
  "megrim",
  "meieScript",
  "merienda",
  "meriendaOne",
  "merriweather",
  "merriweatherSans",
  "metalMania",
  "metamorphous",
  "metrophobic",
  "michroma",
  "milonga",
  "miltonian",
  "miltonianTattoo",
  "mina",
  "miniver",
  "miriamLibre",
  "mirza",
  "missFajardose",
  "mitr",
  "modak",
  "modernAntiqua",
  "mogra",
  "molengo",
  "molle",
  "monda",
  "monofett",
  "monoton",
  "monsieurLaDoulaise",
  "montaga",
  "montez",
  "montserrat",
  "montserratAlternates",
  "montserratSubrayada",
  "mountainsofChristmas",
  "mouseMemoirs",
  "mrBedfort",
  "mrDafoe",
  "mrDeHaviland",
  "mrsSaintDelafield",
  "mrsSheppards",
  "mukta",
  "muktaMahee",
  "muktaMalar",
  "muktaVaani",
  "muli",
  "mysteryQuest",
  "nTR",
  "nanumBrushScript",
  "nanumGothic",
  "nanumGothicCoding",
  "nanumMyeongjo",
  "nanumPenScript",
  "neucha",
  "neuton",
  "newRocker",
  "newsCycle",
  "niconne",
  "niramit",
  "nixieOne",
  "nobile",
  "norican",
  "nosifer",
  "notable",
  "nothingYouCouldDo",
  "noticiaText",
  "notoColorEmojiCompat",
  "notoSans",
  "notoSerif",
  "novaCut",
  "novaFlat",
  "novaMono",
  "novaOval",
  "novaRound",
  "novaScript",
  "novaSlim",
  "novaSquare",
  "numans",
  "nunito",
  "nunitoSans",
  "odorMeanChey",
  "offside",
  "oldStandardTT",
  "oldenburg",
  "oleoScript",
  "oleoScriptSwashCaps",
  "openSans",
  "oranienbaum",
  "orbitron",
  "oregano",
  "orienta",
  "originalSurfer",
  "oswald",
  "overtheRainbow",
  "overlock",
  "overlockSC",
  "overpass",
  "overpassMono",
  "ovo",
  "oxygen",
  "oxygenMono",
  "pTMono",
  "pTSans",
  "pTSansCaption",
  "pTSansNarrow",
  "pTSerif",
  "pTSerifCaption",
  "pacifico",
  "padauk",
  "palanquin",
  "palanquinDark",
  "pangolin",
  "paprika",
  "parisienne",
  "passeroOne",
  "passionOne",
  "pathwayGothicOne",
  "patrickHand",
  "patrickHandSC",
  "pattaya",
  "patuaOne",
  "pavanam",
  "paytoneOne",
  "peddana",
  "peralta",
  "permanentMarker",
  "petitFormalScript",
  "petrona",
  "philosopher",
  "piedra",
  "pinyonScript",
  "pirataOne",
  "plaster",
  "play",
  "playball",
  "playfairDisplay",
  "playfairDisplaySC",
  "podkova",
  "poiretOne",
  "pollerOne",
  "poly",
  "pompiere",
  "pontanoSans",
  "poorStory",
  "poppins",
  "portLligatSans",
  "portLligatSlab",
  "pragatiNarrow",
  "prata",
  "pressStart2P",
  "pridi",
  "princessSofia",
  "prociono",
  "prompt",
  "prostoOne",
  "prozaLibre",
  "puritan",
  "purplePurse",
  "quando",
  "quantico",
  "quattrocento",
  "quattrocentoSans",
  "questrial",
  "quicksand",
  "quintessential",
  "qwigley",
  "racingSansOne",
  "radley",
  "rajdhani",
  "rakkas",
  "raleway",
  "ralewayDots",
  "ramabhadra",
  "ramaraja",
  "rambla",
  "rammettoOne",
  "ranchers",
  "rancho",
  "ranga",
  "rasa",
  "rationale",
  "raviPrakash",
  "redHatDisplay",
  "redHatText",
  "redressed",
  "reemKufi",
  "reenieBeanie",
  "revalia",
  "rhodiumLibre",
  "ribeye",
  "ribeyeMarrow",
  "righteous",
  "risque",
  "roboto",
  "robotoMono",
  "robotoSlab",
  "rochester",
  "rockSalt",
  "rokkitt",
  "romanesco",
  "ropaSans",
  "rosario",
  "rosarivo",
  "rougeScript",
  "rozhaOne",
  "rubik",
  "rubikMonoOne",
  "ruda",
  "rufina",
  "rugeBoogie",
  "ruluko",
  "rumRaisin",
  "ruslanDisplay",
  "russoOne",
  "ruthie",
  "rye",
  "sacramento",
  "sahitya",
  "sail",
  "saira",
  "sairaStencilOne",
  "salsa",
  "sanchez",
  "sancreek",
  "sansita",
  "sarala",
  "sarina",
  "sarpanch",
  "satisfy",
  "sawarabiGothic",
  "sawarabiMincho",
  "scada",
  "scheherazade",
  "schoolbell",
  "scopeOne",
  "seaweedScript",
  "secularOne",
  "sedgwickAve",
  "sedgwickAveDisplay",
  "sevillana",
  "seymourOne",
  "shadowsIntoLight",
  "shadowsIntoLightTwo",
  "shanti",
  "share",
  "shareTech",
  "shareTechMono",
  "shojumaru",
  "shortStack",
  "shrikhand",
  "sigmarOne",
  "signika",
  "signikaNegative",
  "simonetta",
  "sintony",
  "sirinStencil",
  "sixCaps",
  "skranji",
  "slabo13px",
  "slabo27px",
  "slackey",
  "smokum",
  "smythe",
  "sniglet",
  "snippet",
  "snowburstOne",
  "sofadiOne",
  "sofia",
  "songMyung",
  "sonsieOne",
  "sortsMillGoudy",
  "sourceCodePro",
  "sourceSansPro",
  "sourceSerifPro",
  "spaceMono",
  "specialElite",
  "spectral",
  "spectralSC",
  "spicyRice",
  "spinnaker",
  "spirax",
  "squadaOne",
  "sreeKrushnadevaraya",
  "sriracha",
  "srisakdi",
  "staatliches",
  "stalemate",
  "stalinistOne",
  "stardosStencil",
  "stintUltraCondensed",
  "stintUltraExpanded",
  "stoke",
  "strait",
  "stylish",
  "sueEllenFrancisco",
  "suezOne",
  "sumana",
  "sunflower",
  "sunshiney",
  "supermercadoOne",
  "sura",
  "suranna",
  "suravaram",
  "swankyandMooMoo",
  "syncopate",
  "tajawal",
  "tangerine",
  "tauri",
  "taviraj",
  "teko",
  "telex",
  "tenaliRamakrishna",
  "tenorSans",
  "textMeOne",
  "thasadith",
  "theGirlNextDoor",
  "tienne",
  "tillana",
  "timmana",
  "tinos",
  "titanOne",
  "titilliumWeb",
  "tradeWinds",
  "trirong",
  "trocchi",
  "trochut",
  "trykker",
  "tulpenOne",
  "ubuntu",
  "ubuntuMono",
  "ultra",
  "uncialAntiqua",
  "underdog",
  "unicaOne",
  "unifrakturCook",
  "unifrakturMaguntia",
  "unkempt",
  "unlock",
  "unna",
  "vT323",
  "vampiroOne",
  "varela",
  "varelaRound",
  "vastShadow",
  "vesperLibre",
  "vibes",
  "vibur",
  "vidaloka",
  "viga",
  "voces",
  "volkhov",
  "vollkorn",
  "vollkornSC",
  "voltaire",
  "waitingfortheSunrise",
  "wallpoet",
  "walterTurncoat",
  "warnes",
  "wellfleet",
  "wendyOne",
  "wireOne",
  "workSans",
  "yanoneKaffeesatz",
  "yantramanav",
  "yatraOne",
  "yellowtail",
  "yeonSung",
  "yesevaOne",
  "yesteryear",
  "youTubeSans",
  "youTubeSansDark",
  "yrsa",
  "zCOOLKuaiLe",
  "zCOOLQingKeHuangYou",
  "zCOOLXiaoWei",
  "zeyada",
  "zhiMangXing",
  "zillaSlab",
  "zillaSlabHighlight",];