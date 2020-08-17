import { Message, MessageBox } from "element-ui";

class GameConsole {
  constructor() {
    this.logs = ["游戏开始！祝各位好运~"];
  }
  initiate(name, chr) {
    this.log(`${name}选择了角色${chr}`);
  }
  log(msg) {
    this.logs.push(msg);
  }
}
let gameLog = new GameConsole();

// 角色
class Player {
  constructor(props) {
    // 注入props
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
  initiate(map) {
    map[this.position].node.append(this.node);
    gameLog.initiate(this.name, this.chr);
  }
  move(num) {
    gameLog.log(this.chr + "掷出了点数" + num);
    for (let i = 0; i < num; i++) {
      setTimeout(() => {
        if (this.direction === 0) {
          this.position++;
          if (this.position === 26) {
            this.position = 0;
            // 这里触发发工资
            this.getPaid();
          }
        } else {
          this.position--;
          if (this.position === -1) {
            this.position = 25;
            // 发工资
            this.getPaid();
          }
        }
        this.map[this.position].node.append(this.node);
        if (i === num - 1) {
          switch (this.map[this.position].type) {
            case "land":
              gameLog.log(
                ` ${this.chr} 来到了${this.map[this.position].name}。`
              );
              break;
            case "fate":
              gameLog.log(` ${this.chr} 准备接受命运的审判。`);
              break;
            case "chance":
              gameLog.log(`会有怎样的机会在等着 ${this.chr} 呢？`);
              break;
            case "bad":
              gameLog.log(` ${this.chr} 终究还是逃不过纳税的。`);
              break;
            case "good":
              gameLog.log(` ${this.chr} 走了狗屎运。`);
              break;
            case "air":
              gameLog.log(` ${this.chr} 来到了飞机场。`);
              break;
            case "jail":
              gameLog.log(` ${this.chr} 似乎做了不好的事情。`);
              break;
            case "hospital":
              gameLog.log(` ${this.chr} 感到有点不舒服。`);
              break;
            case "card":
              gameLog.log(`欢迎 ${this.chr} 来到道具商城！`);
              break;

            default:
              break;
          }
          setTimeout(() => {
            // 这里执行动作，传入回调来执行之后操作
            this.map[this.position].activate(this, this.checkNext.bind(this));
          }, this.v);
        }
      }, this.v * i);
    }
  }
  pay(value) {
    this.money -= value;
    if (this.money < 0) {
      this.bankrupt();
    }
  }
  bankrupt() {
    for (let i = this.lands.length - 1; i >= 0; i--) {
      this.lands[i].unpurchase();
    }
    Message.error(
      `很遗憾， ${this.chr} 已无力经营下去，宣告破产，所有地产充公处理！`
    );
    this.state = "bankrupt";
    this.node.remove();
  }
  getPaid() {
    // 发工资啦
    this.money += this.salary;
    gameLog.log(this.chr + "获得了本月薪水$" + this.salary);
    Message.success(this.chr + "获得了本月薪水$" + this.salary);
  }
  checkNext() {
    if (this.next.state === "bankrupt") {
      this.next = this.next.next;
    }
    this.cur = false;
    this.next.cur = true;
    if (this.next.stop) {
      this.next.checkStop();
    }
  }
  checkStop() {
    this.stop--;
    if (this.state === "jail") {
      Message(`离 ${this.chr} 出狱还有${this.stop}天！`);
    }
    if (this.state === "hospital") {
      Message(`离 ${this.chr} 出院还有${this.stop}天！`);
    }
    if (!this.stop) {
      this.getActive();
    }
    setTimeout(() => {
      this.checkNext();
    }, 1000);
  }
  getSick() {
    this.position = this.map.findIndex(land => land.type === "hospital");
    this.map[this.position].node.append(this.node);
    this.state = "hospital";
  }
  getBusted() {
    this.position = this.map.findIndex(land => land.type === "jail");
    this.map[this.position].node.append(this.node);
    this.state = "jail";
  }
  getActive() {
    this.state = "active";
  }
}

// 棋格
class Box {
  constructor(props) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
  append(node) {
    this.node.append(node);
  }
  activate(player, cb) {
    // 空地没有动作
    setTimeout(() => {
      cb();
    }, 800);
  }
}
// 不同的棋格均继承自box
class LandBox extends Box {
  constructor(props) {
    super(props);
    this.level = 0;
    this.priceList = [
      this.value / 5,
      this.value / 2,
      this.value,
      this.value * 2
    ];
    this.price = this.value / 5;
    this.img = document.createElement("img");
  }
  activate(player, cb) {
    if (!this.owner) {
      if (player.money < this.value) {
        Message("金钱不足，无法购买！");
        setTimeout(() => {
          cb();
        }, 1000);
        return;
      }
      // 购买地产动作
      MessageBox.confirm(
        `请问是否要花费$${this.value}来购买${this.name}`,
        "购买地产",
        {
          closeOnClickModal: false
        }
      )
        .then(() => {
          // 支付
          player.pay(this.value);
          this.purchase(player);
          // 打印日志
          Message.success("购买成功！");
          gameLog.log(`${player.chr}花费$${this.value}购买了${this.name}！`);
          setTimeout(() => {
            cb();
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            cb();
          }, 1000);
        });
      return;
    }
    if (player.chr === this.owner.chr) {
      if (this.level === 3) {
        setTimeout(() => {
          cb();
        }, 1000);
        return;
      }
      if (player.money < this.value / 2) {
        Message("金钱不足，无法升级！");
        setTimeout(() => {
          cb();
        }, 1000);
        return;
      }
      // 升级动作
      MessageBox.confirm(
        `请问是否要花费$${this.value / 2}来升级${this.name}`,
        "升级地产",
        {
          closeOnClickModal: false
        }
      )
        .then(() => {
          // 支付
          player.pay(this.value / 2);
          this.upgrade();
          // 打印日志
          gameLog.log(
            `${player.chr}花费$${this.value / 2}升级了${this.name}！`
          );
          Message.success("升级成功！");
          setTimeout(() => {
            cb();
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            cb();
          }, 1000);
        });
    } else {
      // 入住动作
      if (this.owner.state === "active") {
        this.checkIn(player);
      } else {
        Message(` ${this.owner.chr} 不在家，免收 ${player.chr} 租金一晚！`);
      }
      setTimeout(() => {
        cb();
      }, 1000);
    }
  }
  purchase(player) {
    // 签合同
    this.owner = player;
    player.lands.push(this);
    // 划地界
    this.img.src = require(`../assets/${player.chr}.png.png`);
    this.img.style.width = "40%";
    this.img.style.left = "50%";
    this.img.style.top = "60%";
    this.img.style.transform = "translate(-50%, -50%)";
    this.node.append(this.img);
    this.node.style.border = "1px solid " + player.color;
    this.node.firstElementChild.style.background = player.color;
    this.node.firstElementChild.style.borderColor = player.color;
  }
  unpurchase() {
    // 撕毁合同
    this.owner.lands.splice(this.owner.lands.indexOf(this), 1);
    // 移去标志
    if (!this.level) {
      this.img.remove();
      this.img = document.createElement("img");
    }
    // 划公共地界
    this.node.style.border = "1px solid #454545";
    this.node.firstElementChild.style.background = "#454545";
    this.node.firstElementChild.style.borderColor = "#454545";
    this.owner = "";
  }
  upgrade() {
    // 升级
    this.level++;
    this.price = this.priceList[this.level];
    // 造房子
    if (this.level === 1) {
      this.img.style.width = "80%";
      this.img.style.top = "70%";
    }
    this.img.src = require(`../assets/house${this.level}.png`);
  }
  downgrade(explode) {
    // 降级
    if (explode) {
      // 爆破效果
      this.level = 0;
    } else {
      this.level--;
    }
    this.price = this.priceList[this.level];
    // 毁房子
    if (this.level === 0) {
      this.img.style.width = "40%";
      this.img.style.top = "60%";
      this.img.src = require(`../assets/${this.owner.chr}.png.png`);
    } else {
      this.img.src = require(`../assets/house${this.level}.png`);
    }
  }
  checkIn(player) {
    let map = ["地盘", "小房子", "大豪宅", "大酒店"];
    Message(
      `${player.chr}花费$${this.price}在${this.owner.chr}的${
        map[this.level]
      }入住一晚！`
    );
    gameLog.log(
      `${player.chr}花费$${this.price}在${this.owner.chr}的${
        map[this.level]
      }入住一晚！`
    );
    // 付钱
    player.pay(this.price);
    this.owner.money += this.price;
  }
}

class FateBox extends Box {
  // 获得/失去地产，房子升级/降级，住院/入牢，获得/失去金钱，被拐卖至某地
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    if (Math.random() < player.luck) {
      this.goodLuck(player);
    } else {
      this.badLuck(player);
    }
    setTimeout(() => {
      cb();
    }, 800);
  }
  goodLuck(player) {
    const num = Math.random();
    switch (true) {
      case num < 0.1:
        this.getLand(player);
        break;
      case num < 0.3:
        this.upgradeLand(player);
        break;
      default:
        this.getMoney(player);
        break;
    }
  }
  badLuck(player) {
    const num = Math.random();
    switch (true) {
      case num < 0.1:
        this.loseLand(player);
        break;
      case num < 0.2:
        this.downgradeLand();
        break;
      case num < 0.3:
        this.getSick(player);
        break;
      case num < 0.4:
        this.getBusted(player);
        break;
      default:
        this.loseMoney(player);
        break;
    }
  }
  // goodEvents
  getLand(player) {
    const emptyLands = player.map.filter(box => !box.owner);
    if (!emptyLands.length) {
      this.goodLuck(player);
      return;
    } else {
      const land = emptyLands[Math.floor(Math.random() * emptyLands.length)];
      land.purchase(player);
      Message.success(`恭喜 ${player.chr} 获得了${land.name}！`);
      gameLog.log(`恭喜 ${player.chr} 获得了${land.name}！`);
    }
  }
  upgradeLand(player) {
    if (!player.lands.length) {
      this.goodLuck(player);
      return;
    }
    const availableLands = player.lands.filter(land => land.level < 3);
    const land =
      availableLands[Math.floor(Math.random() * availableLands.length)];
    land.upgrade();
    Message.error(
      ` ${player.chr} 在${land.name}的房子被政府扶持免费加盖了一层！`
    );
    gameLog.log(
      ` ${player.chr} 在${land.name}的房子被政府扶持免费加盖了一层！`
    );
  }
  getMoney(player) {
    const goodFates = [
      {
        content: "抽中了最新款iPhone，转手一卖得了$1000！",
        value: 1000
      },
      {
        content: "周末辛勤兼职，收获$1300！",
        value: 1300
      },
      {
        content: "加班费$1500到账了，辛苦了！",
        value: 1500
      },
      {
        content: "发工资啦！！！获得$2000！",
        value: 2000
      },
      {
        content: "中彩票啦！！！获得$3000！",
        value: 3000
      }
    ];
    const fate = goodFates[Math.floor(Math.random() * goodFates.length)];
    Message.success(fate.content);
    gameLog.log(` ${player.chr} 的今日份好运：${fate.content}`);
    player.money += fate.value;
  }
  // badEvents
  loseLand(player) {
    if (!player.lands.length) {
      this.badLuck(player);
      return;
    }
    const land = player.lands[Math.floor(Math.random() * player.lands.length)];
    land.unpurchase();
    Message.error(
      ` ${player.chr} 因违规用地失去了在${land.name}的土地使用权！`
    );
    gameLog.log(` ${player.chr} 因违规用地失去了在${land.name}的土地使用权！`);
  }
  downgradeLand(player) {
    const availableLands = player.lands.filter(land => land.level > 0);
    if (!availableLands.length) {
      this.badLuck(player);
      return;
    }
    const land =
      availableLands[Math.floor(Math.random() * availableLands.length)];
    land.downgrade();
    Message.error(` ${player.chr} 在${land.name}的房子因违建被拆除了一层！`);
    gameLog.log(` ${player.chr} 在${land.name}的房子因违建被拆除了一层！`);
  }
  getSick(player) {
    const num = Math.ceil(Math.random() * 3);
    const events = [
      "被狗咬伤了",
      "被外星人蹂躏了",
      "得了流感",
      "摔了一跤",
      "晕了过去",
      "吃菌菇中毒了"
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    player.stop = num;
    player.getSick();
    Message.error(` ${player.chr} 不幸${event}, 住院治疗${num}天`);
    gameLog.log(` ${player.chr} 不幸${event}, 住院治疗${num}天`);
  }
  getBusted(player) {
    const num = Math.ceil(Math.random() * 5);
    const events = ["逃税", "违章建筑", "不诚信经营", "偷渡", "逃狱"];
    const event = events[Math.floor(Math.random() * events.length)];
    player.stop = num;
    player.getBusted();
    Message.error(` ${player.chr} 因${event}被抓捕入狱, 收监${num}天`);
    gameLog.log(` ${player.chr} 因${event}被抓捕入狱, 收监${num}天`);
  }
  loseMoney(player) {
    const badFates = [
      {
        content: "被电信诈骗坑了$1000！",
        value: 1000
      },
      {
        content: "支付房屋保养费，共$1300！",
        value: 1300
      },
      {
        content: "买最新出的iPhone，花费$1500！",
        value: 1500
      },
      {
        content: "股票市场大跌，损失了$2000！",
        value: 2000
      },
      {
        content: "误入传销组织，破财免灾，损失$3000",
        value: 3000
      }
    ];
    const fate = badFates[Math.floor(Math.random() * badFates.length)];
    Message.error(fate.content);
    gameLog.log(` ${player.chr} 的今日份霉运：${fate.content}`);
    player.pay(fate.value);
  }
}
class ChanceBox extends Box {
  // 获得/失去卡片，获得/失去金钱，加薪/减薪
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    if (Math.random() < player.luck) {
      this.goodLuck(player);
    } else {
      this.badLuck(player);
    }
    setTimeout(() => {
      cb();
    }, 1000);
  }
  goodLuck(player) {
    const num = Math.random();
    switch (true) {
      case num < 0.2:
        this.increaseSalary(player);
        break;
      case num < 0.6:
        this.getCard(player);
        break;
      default:
        this.getMoney(player);
        break;
    }
  }
  badLuck(player) {
    const num = Math.random();
    switch (true) {
      case num < 0.2:
        this.decreaseSalary(player);
        break;
      case num < 0.4:
        this.lostCard(player);
        break;
      default:
        this.loseMoney(player);
        break;
    }
  }
  increaseSalary(player) {
    Message(`恭喜 ${player.chr} 升职加薪，工资增加$1000！`);
    gameLog.log(`恭喜 ${player.chr} 升职加薪，工资增加$1000！`);
    player.salary += 1000;
  }
  getCard(player) {
    let shop = player.map.find(land => land.type === "card");
    shop.getCard(player);
  }
  decreaseSalary(player) {
    Message(` ${player.chr} 受到处罚，工资减少$1000！`);
    gameLog.log(` ${player.chr} 受到处罚，工资增加$1000！`);
    player.salary -= 1000;
  }
  lostCard(player) {
    let card = player.cards.pop();
    Message(` ${player.chr} 手滑遗失${card}一张！`);
    gameLog.log(` ${player.chr} 手滑遗失${card}一张！`);
  }
  getMoney(player) {
    const goodFates = [
      {
        content: "小黄车退押金了！获得$99！",
        value: 99
      },
      {
        content: "被拼多多大红包砸中了，获得$300！",
        value: 300
      },
      {
        content: "在支付宝花呗锦鲤活动白嫖了$500！",
        value: 500
      },
      {
        content: "获得了公司年度绩效奖，奖金$800！",
        value: 800
      },
      {
        content: "突然发现钱包夹层里面还有$800现金！",
        value: 800
      }
    ];
    const fate = goodFates[Math.floor(Math.random() * goodFates.length)];
    Message.success(fate.content);
    gameLog.log(` ${player.chr} 的今日份好运：${fate.content}`);
    player.money += fate.value;
  }
  loseMoney(player) {
    const badFates = [
      {
        content: "花了$99去抽奖，结果啥都没有！",
        value: 99
      },
      {
        content: "往群里发了个大红包，$300没了",
        value: 300
      },
      {
        content: "花了$500办健身卡，记得多去！",
        value: 500
      },
      {
        content: "去旅游度假花了$800！",
        value: 800
      },
      {
        content: "花$800孝顺长辈",
        value: 800
      }
    ];
    const fate = badFates[Math.floor(Math.random() * badFates.length)];
    Message.error(fate.content);
    gameLog.log(` ${player.chr} 的今日份剁手：${fate.content}`);
    player.pay(fate.value);
  }
}
class JailBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    Message.error(` ${player.chr} 因逃税收监1天！`);
    gameLog.log(` ${player.chr} 因逃税收监1天！`);
    player.stop = 1;
    player.getBusted();
    setTimeout(() => {
      cb();
    }, 1000);
  }
}
class HospitalBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    Message.error(` ${player.chr} 进医院全身大体检1天！`);
    gameLog.log(` ${player.chr} 进医院全身大体检1天！`);
    player.stop = 1;
    player.getSick();
    setTimeout(() => {
      cb();
    }, 1000);
  }
}
class GoodBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    let price = Math.ceil(Math.random() * 5) * 500;
    Message.success(` ${player.chr} 在路边捡到了$${price}！`);
    gameLog.log(` ${player.chr} 在路边捡到了$${price}！`);
    player.money += price;
    setTimeout(() => {
      cb();
    }, 1000);
  }
}
class BadBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    let price = Math.ceil(Math.random() * 5) * 500;
    Message.error(` ${player.chr} 向政府交纳所得税$${price}！`);
    gameLog.log(` ${player.chr} 向政府交纳所得税$${price}！`);
    player.pay(price);
    setTimeout(() => {
      cb();
    }, 1000);
  }
}
class AirportBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    if (player.money >= this.value) {
      // 寻找目标机场
      let airports = player.map.filter(land => land.type === "air");
      airports.splice(airports.indexOf(this), 1);
      let target = airports[0];
      this.fly(player, target);
    }
    setTimeout(() => {
      cb();
    }, 1000);
  }
  fly(player, target) {
    target.node.append(player.node);
    let index = player.map.indexOf(target);
    player.position = index;
    Message(` ${player.chr} 花费$${this.value}前往${target.name}！`);
    gameLog.log(` ${player.chr} 花费$${this.value}前往${target.name}！`);
    player.pay(this.value);
  }
}
class CardBox extends Box {
  constructor(props) {
    super(props);
    this.items = [
      {
        name: "停留卡",
        percentage: 8
      },
      {
        name: "随心卡",
        percentage: 10
      },
      {
        name: "转向卡",
        percentage: 8
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
        percentage: 2
      }
    ];
    this.allItems = [];
    this.items.forEach(item => {
      for (let i = 0; i < item.percentage; i++) {
        this.allItems.push(item.name);
      }
    });
  }
  activate(player, cb) {
    this.getCard(player);
    setTimeout(() => {
      cb();
    }, 1000);
  }
  getCard(player) {
    let card = this.allItems[Math.floor(Math.random() * this.allItems.length)];
    player.cards.push(card);
    Message.success(` ${player.chr} 获得了${card}！`);
    gameLog.log(` ${player.chr} 获得了${card}！`);
  }
}

let Boxes = {
  Box,
  LandBox,
  FateBox,
  ChanceBox,
  JailBox,
  HospitalBox,
  GoodBox,
  BadBox,
  AirportBox,
  CardBox
};

// 卡牌道具
class Card {
  constructor(props) {
    Object.keys(props).forEach(key => {
      this[key] = props[key];
    });
  }
}
class StopCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = true;
    this.src = "stop";
  }
  activate(player) {
    Message.success(` ${player.chr} 使用了停留卡，今天是肥宅的一天。`);
    gameLog.log(` ${player.chr} 使用了停留卡，今天是肥宅的一天。`);
    setTimeout(() => {
      player.map[player.position].activate(
        player,
        player.checkNext.bind(player)
      );
    }, player.v);
  }
}
class TurnCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "turn";
  }
  activate(player) {
    Message.success(` ${player.chr} 使用了转向卡，调转了方向。`);
    gameLog.log(` ${player.chr} 使用了转向卡，调转了方向。`);
    player.direction = player.direction ? 0 : 1;
  }
}
class DiceCard extends Card {
  constructor(props) {
    super(props);
    this.type = "dice";
    this.move = false;
    this.src = "dice";
  }
  activate(player, val) {
    Message.success(` ${player.chr} 使用了随心卡，许愿了点数${val}。`);
    gameLog.log(` ${player.chr} 使用了随心卡，许愿了点数${val}。`);
    player.diceNum = val;
  }
}
class SalaryCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "salary";
  }
  activate(player) {
    Message.success(
      ` ${player.chr} 使用了工资卡，获得了本月薪水$${player.salary}。`
    );
    gameLog.log(
      ` ${player.chr} 使用了工资卡，获得了本月薪水$${player.salary}。`
    );
    player.money += player.salary;
  }
}
class PromotionCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "promotion";
  }
  activate(player) {
    Message.success(` ${player.chr} 使用了加薪卡，薪水提升$1000。`);
    gameLog.log(` ${player.chr} 使用了加薪卡，薪水提升$1000。`);
    player.salary += 1000;
  }
}
class PoliceCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "police";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    let num = Math.ceil(Math.random() * 3);
    selectedPlayer.stop = 3;
    selectedPlayer.getBusted();
    Message.success(
      ` ${activePlayer.chr} 举报 ${selectedPlayer.chr} 逃税成功，${selectedPlayer.chr}收监反省${num}天, ${activePlayer.chr}获得赏金$1000！`
    );
    gameLog.log(
      ` ${activePlayer.chr} 举报 ${selectedPlayer.chr} 逃税成功，${selectedPlayer.chr}收监反省${num}天, ${activePlayer.chr}获得赏金$1000！`
    );
    activePlayer.money += 1000;
  }
}
class AmbulanceCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "ambulance";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    let num = Math.ceil(Math.random() * 3);
    selectedPlayer.stop = 3;
    selectedPlayer.getSick();
    Message.success(
      ` ${activePlayer.chr} 在混乱中打伤了 ${selectedPlayer.chr}，${selectedPlayer.chr}住院休养${num}天, ${activePlayer.chr}赔偿医药费$1000！`
    );
    gameLog.log(
      ` ${activePlayer.chr} 在混乱中打伤了 ${selectedPlayer.chr}，${selectedPlayer.chr}住院休养${num}天, ${activePlayer.chr}赔偿医药费$1000！`
    );
    activePlayer.pay(1000);
  }
}
class ExplosionCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "explosion";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      ` ${player.chr} 使用了爆破卡，${land.owner.chr}在${land.name}的房子被炸得渣都不剩。`
    );
    gameLog.log(
      ` ${player.chr} 使用了爆破卡，${land.owner.chr}在${land.name}的房子被炸得渣都不剩。`
    );
    land.downgrade(true);
  }
  checkBan(player) {
    const land = player.map[player.position];
    if (
      land.type === "land" &&
      land.level > 0 &&
      land.owner &&
      land.owner !== player
    ) {
      return false;
    }
    return true;
  }
}
class UpgradeCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "upgrade";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      ` ${player.chr} 使用了升级卡，给${land.name}盖了一层房子。`
    );
    gameLog.log(` ${player.chr} 使用了升级卡，给${land.name}盖了一层房子。`);
    land.upgrade();
  }
  checkBan(player) {
    const land = player.map[player.position];
    if (land.type === "land" && land.level < 3 && land.owner === player) {
      return false;
    }
    return true;
  }
}
class DowngradeCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "downgrade";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      ` ${player.chr} 使用了降级卡，给 ${land.owner.chr} 在${land.name}的房子拆了一层。`
    );
    gameLog.log(
      ` ${player.chr} 使用了降级卡，给 ${land.owner.chr} 在${land.name}的房子拆了一层。`
    );
    land.downgrade();
  }
  checkBan(player) {
    const land = player.map[player.position];
    if (
      land.type === "land" &&
      land.level > 0 &&
      land.owner &&
      land.owner !== player
    ) {
      return false;
    }
    return true;
  }
}
class RobCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "rob";
  }
  activate(selectedPlayer, activePlayer) {
    if (!selectedPlayer.cards.length) {
      Message.error(
        ` ${activePlayer.chr} 掏出了手枪准备抢劫却发现 ${selectedPlayer.chr} 口袋里一张卡片都没有！`
      );
      gameLog.log(
        ` ${activePlayer.chr} 掏出了手枪准备抢劫却发现 ${selectedPlayer.chr} 口袋里一张卡片都没有！`
      );
      return;
    }
    let index = Math.floor(Math.random() * selectedPlayer.cards.length);
    let card = selectedPlayer.cards[index];
    selectedPlayer.cards.splice(index, 1);
    activePlayer.cards.push(card);
    Message.error(
      ` ${activePlayer.chr} 使用了抢劫卡，抢走了 ${selectedPlayer.chr} 口袋里的${card.name}！`
    );
    gameLog.log(
      ` ${activePlayer.chr} 使用了抢劫卡，抢走了 ${selectedPlayer.chr} 口袋里的${card.name}！`
    );
  }
}
class TaxCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "tax";
  }
  activate(player) {
    Message.success(
      ` ${player.chr} 被查税后补缴纳了$${player.money / 5}给政府！`
    );
    gameLog.log(` ${player.chr} 被查税后补缴纳了$${player.money / 5}给政府！`);
    player.pay(player.money / 5);
  }
}
class SellCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "sell";
  }
  activate(player) {
    const land = player.map[player.position];
    const price = land.value + land.price;
    Message.success(
      ` ${player.chr} 使用了卖地卡，以售价$${price}卖掉了 ${land.owner.chr} 在${land.name}的地。`
    );
    gameLog.log(
      ` ${player.chr} 使用了卖地卡，以售价$${price}卖掉了 ${land.owner.chr} 在${land.name}的地。`
    );
    land.owner.money += price;
    land.unpurchase();
  }
  checkBan(player) {
    const land = player.map[player.position];
    if (land.type === "land" && land.owner) {
      return false;
    }
    return true;
  }
  checkMoney(player) {
    const land = player.map[player.position];
    const price = land.value + land.price;
    return `是否以$${price}卖掉$ {land.owner.chr} 在${land.name}的地盘？`;
  }
}
class BuyCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "buy";
  }
  activate(player) {
    const land = player.map[player.position];
    const price = land.owner ? land.value + land.price : land.value;
    let msg = land.owner ? ` ${land.owner.chr} 在` : "";
    Message.success(
      ` ${player.chr} 使用了买地卡，花费了$${price}买下了${msg}${land.name}的地盘。`
    );
    gameLog.log(
      ` ${player.chr} 使用了买地卡，花费了$${price}买下了${msg}${land.name}的地盘。`
    );
    if (land.owner) land.owner.money += price;
    player.pay(price);
    if (land.owner) {
      land.unpurchase();
    }
    land.purchase(player);
  }
  checkBan(player) {
    const land = player.map[player.position];
    if (land.type === "land" && land.owner !== player) {
      return false;
    }
    return true;
  }
  checkMoney(player) {
    const land = player.map[player.position];
    const price = land.owner ? land.value + land.price : land.value;
    if (player.money < price) return false;
    if (land.owner) {
      return `强行盘下 ${land.owner.chr} 在${land.name}的地盘需花费$${price}，是否确定？`;
    } else {
      return `该地盘尚未有主，花费$${price}盘下来？`;
    }
  }
}
class GoodluckCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "goodluck";
  }
  activate(player) {
    player.luck += 0.1;
    Message.success(
      ` ${player.chr} 使用了幸运卡，自身幸运值提升了10%，达到了${player.luck *
        100}%`
    );
    gameLog.log(
      ` ${player.chr} 使用了幸运卡，自身幸运值提升了10%，达到了${player.luck *
        100}%`
    );
  }
}
class BadluckCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "badluck";
  }
  activate(selectedPlayer, activePlayer) {
    if (selectedPlayer.luck < 0.1) {
      Message.success(
        ` ${activePlayer.chr} 使用了霉运卡， 但是 ${selectedPlayer.chr} 已经够倒霉了，霉运卡都无效了。`
      );
      Message.success(
        ` ${activePlayer.chr} 使用了霉运卡， 但是 ${selectedPlayer.chr} 已经够倒霉了，霉运卡都无效了。`
      );
      return;
    }
    selectedPlayer.luck -= 0.1;
    Message.success(
      ` ${activePlayer.chr} 使用了霉运卡， ${
        selectedPlayer.chr
      } 的幸运值下降了10%，现在为${selectedPlayer.luck * 100}%。`
    );
    gameLog.log(
      ` ${activePlayer.chr} 使用了霉运卡， ${
        selectedPlayer.chr
      } 的幸运值下降了10%，现在为${selectedPlayer.luck * 100}%。`
    );
  }
}

const Cards = {
  StopCard,
  TurnCard,
  DiceCard,
  SalaryCard,
  PromotionCard,
  PoliceCard,
  AmbulanceCard,
  ExplosionCard,
  UpgradeCard,
  DowngradeCard,
  RobCard,
  TaxCard,
  SellCard,
  BuyCard,
  GoodluckCard,
  BadluckCard
};
export { Player, Boxes, Cards, gameLog };
