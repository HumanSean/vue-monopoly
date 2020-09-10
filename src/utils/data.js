const characters = {};
const names = [
  "Aquaman",
  "Batgirl",
  "Batman",
  "Batwoman",
  "Black Canary",
  "Brainiac",
  "Captain Cold",
  "Catwoman",
  "Cyborg",
  "Deadshot",
  "Deathstroke",
  "Firestorm",
  "Flash",
  "General Zod",
  "Green Arrow",
  "Green Lantern",
  "Harley Quinn",
  "Joker",
  "Killer Frost",
  "Lex Luthor",
  "Martian Manhunter",
  "Nightwing",
  "Penguin",
  "Poison Ivy",
  "Red Hood",
  "Reverse Flash",
  "Robin",
  "Starfire",
  "Supergirl",
  "Superman",
  "Two Face",
  "Wonder Woman"
];
var mainColorScheme = [
  "seagreen",
  "darkslateblue",
  "#999",
  "crimson",
  "#4FA4DC",
  "#AFDB08",
  "#468EC2",
  "#954140",
  "#A9A9A9",
  "firebrick",
  "#DE5902",
  "#F2C100",
  "#EE2F23",
  "#1C1C1C",
  "#005C19",
  "#007E47",
  "palevioletred",
  "#463282",
  "#8EC5DF",
  "#0A0135",
  "#0051D1",
  "#171819",
  "#555",
  "#20844E",
  "#800000",
  "#EEA90E",
  "#DC2D19",
  "#DC4F93",
  "lightblue",
  "dodgerblue",
  "#FE8736",
  "#E43731"
];

names.forEach((name, index) => {
  characters[name] = {
    color: mainColorScheme[index]
  };
});

const classic = [
  {
    name: "发薪日",
    type: "empty",
    owner: "system",
    value: 0,
    src: "salary",
    detail: "这里游戏的起点，每次经过都有工资可以领取哦！"
  },
  {
    name: "中国",
    type: "land",
    owner: "",
    value: 5000,
    bg: "#E7485D"
  },
  {
    name: "新加坡",
    type: "land",
    owner: "",
    value: 2600,
    bg: "#E7485D"
  },
  {
    name: "韩国",
    type: "land",
    owner: "",
    value: 1300,
    bg: "#E7485D"
  },
  {
    name: "日本",
    type: "land",
    owner: "",
    value: 3000,
    bg: "#E7485D"
  },
  {
    name: "命运",
    type: "fate",
    owner: "system",
    value: 0,
    src: "fate",
    detail:
      "房产？金钱？厄运？到底有什么在命运之格等着你呢？（幸运值越大，遇见好事情的概率越大！）"
  },
  {
    name: "白云机场",
    type: "air",
    owner: "system",
    value: 800,
    src: "airport",
    detail:
      "坐落在广州白云区的白云机场，每天迎接着四面八方到来的人，你想去哪里呢？（飞机票$800一张）"
  },
  {
    name: "交所得税",
    type: "bad",
    owner: "system",
    value: 500,
    src: "tax",
    detail: "依法纳税是每位公民应尽的义务，今天你纳税了吗？"
  },
  {
    name: "机会",
    type: "chance",
    owner: "system",
    value: 0,
    src: "chance",
    detail:
      "升职加薪？卡片道具？到底有什么机会在前方等着你呢？（幸运值越大，遇见好事情的概率越大！）"
  },
  {
    name: "监狱",
    type: "jail",
    owner: "system",
    value: 0,
    src: "jail",
    detail: "关押犯人的地方。这年头越来越多的人偷税漏税被抓了。"
  },
  {
    name: "巴西",
    type: "land",
    owner: "",
    value: 2000,
    bg: "#0072BB"
  },
  {
    name: "阿根廷",
    type: "land",
    owner: "",
    value: 2200,
    bg: "#0072BB"
  },
  {
    name: "墨西哥",
    type: "land",
    owner: "",
    value: 2400,
    bg: "#0072BB"
  },
  {
    name: "道具商",
    type: "card",
    owner: "system",
    value: 0,
    src: "shop",
    detail: "这里更是考验你人品的地方！每花费$1000皆有可能抽中一张道具卡片！"
  },
  {
    name: "美国",
    type: "land",
    owner: "",
    value: 4500,
    bg: "#1FB25A"
  },
  {
    name: "加拿大",
    type: "land",
    owner: "",
    value: 4000,
    bg: "#1FB25A"
  },
  {
    name: "机会",
    type: "chance",
    owner: "system",
    value: 0,
    src: "chance",
    detail:
      "升职加薪？卡片道具？到底有什么机会在前方等着你呢？（幸运值越大，遇见好事情的概率越大！）"
  },
  {
    name: "捡到钱",
    type: "good",
    owner: "system",
    value: 500,
    src: "gold",
    detail: "快看！飞机！"
  },
  {
    name: "意大利",
    type: "land",
    owner: "",
    value: 3000,
    bg: "#D93A94"
  },
  {
    name: "西班牙",
    type: "land",
    owner: "",
    value: 2800,
    bg: "#D93A94"
  },
  {
    name: "命运",
    type: "fate",
    owner: "system",
    value: 0,
    src: "fate",
    detail:
      "房产？金钱？厄运？到底有什么在命运之格等着你呢？（幸运值越大，遇见好事情的概率越大！）"
  },
  {
    name: "伦敦机场",
    type: "air",
    owner: "system",
    value: 800,
    src: "airport",
    detail: "远渡重洋的你，是否想坐一趟飞机回国了呢？（飞机票$800一张）"
  },
  {
    name: "医院",
    type: "hospital",
    owner: "system",
    value: 0,
    src: "hospital",
    detail: "体检住院一条龙服务，客官还需要些啥呢？"
  },
  {
    name: "英国",
    type: "land",
    owner: "",
    value: 3600,
    bg: "#F7941D"
  },
  {
    name: "德国",
    type: "land",
    owner: "",
    value: 3400,
    bg: "#F7941D"
  },
  {
    name: "法国",
    type: "land",
    owner: "",
    value: 3200,
    bg: "#F7941D"
  }
];

let seq = {
  0: 16,
  1: 17,
  2: 18,
  3: 19,
  4: 20,
  5: 21,
  6: 22,
  7: 23,
  8: 24,
  9: 25,
  10: 15,
  11: 13,
  12: 11,
  13: 9,
  14: 8,
  15: 7,
  16: 6,
  17: 5,
  18: 4,
  19: 3,
  20: 2,
  21: 1,
  22: 0,
  23: 10,
  24: 12,
  25: 14
};
let reverseSeq = {
  16: 0,
  17: 1,
  18: 2,
  19: 3,
  20: 4,
  21: 5,
  22: 6,
  23: 7,
  24: 8,
  25: 9,
  15: 10,
  13: 11,
  11: 12,
  9: 13,
  8: 14,
  7: 15,
  6: 16,
  5: 17,
  4: 18,
  3: 19,
  2: 20,
  1: 21,
  0: 22,
  10: 23,
  12: 24,
  14: 25
};
const maps = {
  classic
};

const cardsMap = {
  停留卡: "StopCard",
  转向卡: "TurnCard",
  随心卡: "DiceCard",
  工资卡: "SalaryCard",
  加薪卡: "PromotionCard",
  查税卡: "TaxCard",
  幸运卡: "GoodluckCard",
  霉运卡: "BadluckCard",
  升级卡: "UpgradeCard",
  降级卡: "DowngradeCard",
  卖地卡: "SellCard",
  买地卡: "BuyCard",
  住院卡: "AmbulanceCard",
  坐牢卡: "PoliceCard",
  爆破卡: "ExplosionCard",
  抢劫卡: "RobCard"
};
const cardsChance = [
  {
    name: "停留卡",
    percentage: 13
  },
  {
    name: "随心卡",
    percentage: 13
  },
  {
    name: "转向卡",
    percentage: 13
  },
  {
    name: "升级卡",
    percentage: 6
  },
  {
    name: "买地卡",
    percentage: 2
  },
  {
    name: "幸运卡",
    percentage: 4
  },
  {
    name: "工资卡",
    percentage: 7
  },
  {
    name: "加薪卡",
    percentage: 7
  },
  {
    name: "抢劫卡",
    percentage: 5
  },
  {
    name: "降级卡",
    percentage: 6
  },
  {
    name: "爆破卡",
    percentage: 3
  },
  {
    name: "住院卡",
    percentage: 5
  },
  {
    name: "坐牢卡",
    percentage: 5
  },
  {
    name: "倒霉卡",
    percentage: 4
  },
  {
    name: "卖地卡",
    percentage: 2
  },
  {
    name: "查税卡",
    percentage: 5
  }
];
export { characters, names, maps, seq, reverseSeq, cardsMap, cardsChance };
