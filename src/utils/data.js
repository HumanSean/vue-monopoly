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
    src: "salary"
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
    src: "fate"
  },
  {
    name: "白云机场",
    type: "air",
    owner: "system",
    value: 800,
    src: "airport"
  },
  {
    name: "交所得税",
    type: "bad",
    owner: "system",
    value: 500,
    src: "tax"
  },
  {
    name: "机会",
    type: "chance",
    owner: "system",
    value: 0,
    src: "chance"
  },
  {
    name: "监狱",
    type: "jail",
    owner: "system",
    value: 0,
    src: "jail"
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
    src: "shop"
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
    src: "chance"
  },
  {
    name: "捡到钱",
    type: "good",
    owner: "system",
    value: 500,
    src: "gold"
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
    src: "fate"
  },
  {
    name: "伦敦机场",
    type: "air",
    owner: "system",
    value: 800,
    src: "airport"
  },
  {
    name: "医院",
    type: "hospital",
    owner: "system",
    value: 0,
    src: "hospital"
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

let seq = [
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  15,
  13,
  11,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
  0,
  10,
  12,
  14
];
const maps = {
  classic
};

export { characters, maps, seq };
