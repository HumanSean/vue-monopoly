import { Message, MessageBox } from "element-ui";
import { cardsMap, cardsChance } from "./data";
import Cards from "./Card";
import gameConsole from "./GameConsole";

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
      // 玩家
      if (player.control) {
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
            gameConsole.success(
              `【${player.chr}】花费$${this.value}购买了${this.name}的地盘！`
            );
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
        // 电脑
        if (player.money / 1.5 > this.value) {
          // 支付
          player.pay(this.value);
          this.purchase(player);
          // 打印日志
          Message.success("购买成功！");
          gameConsole.success(
            `【${player.chr}】花费$${this.value}购买了${this.name}的地盘！`
          );
          setTimeout(() => {
            cb();
          }, 1000);
        } else {
          setTimeout(() => {
            cb();
          }, 1000);
        }
      }
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
      // 玩家
      if (player.control) {
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
            gameConsole.success(
              `【${player.chr}】花费$${this.value / 2}升级了${
                this.name
              }的地盘！`
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
        // 电脑
        if (player.money / 2 >= this.value / 2) {
          // 支付
          player.pay(this.value / 2);
          this.upgrade();
          // 打印日志
          gameConsole.success(
            `【${player.chr}】花费$${this.value / 2}升级了${this.name}的地盘！`
          );
          Message.success("升级成功！");
          setTimeout(() => {
            cb();
          }, 1000);
        } else {
          setTimeout(() => {
            cb();
          }, 1000);
        }
      }
    } else {
      // 入住动作
      if (this.owner.state === "active") {
        this.checkIn(player);
      } else {
        Message(`【${this.owner.chr}】不在家，免收【${player.chr}】租金一晚！`);
        gameConsole.log(
          `【${this.owner.chr}】不在家，免收【${player.chr}】租金一晚！`
        );
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
    if (!this.img.src) {
      this.img.src = require(`../assets/${player.chr}.png.png`);
      this.img.style.width = "40%";
      this.img.style.left = "50%";
      this.img.style.bottom = "50%";
      this.img.style.transform = "translate(-50%, 80%)";
      this.node.append(this.img);
    }
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
    this.node.style.border = "1px solid #333335";
    this.node.firstElementChild.style.background = "#333335";
    this.node.firstElementChild.style.borderColor = "#333335";
    this.owner = "";
  }
  upgrade() {
    // 升级
    this.level++;
    this.price = this.priceList[this.level];
    // 造房子
    if (this.level === 1) {
      this.img.style.width = "80%";
      this.img.style.bottom = "10%";
      this.img.style.transform = "translateX(-50%)";
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
      this.img.style.bottom = "50%";
      this.img.style.transform = "translate(-50%, 80%)";
      this.img.src = require(`../assets/${this.owner.chr}.png.png`);
    } else {
      this.img.src = require(`../assets/house${this.level}.png`);
    }
  }
  checkIn(player) {
    let map = ["地盘", "小房子", "大豪宅", "大酒店"];
    Message(
      `【${player.chr}】花费$${this.price}在【${this.owner.chr}】的${
        map[this.level]
      }入住一晚！`
    );
    gameConsole.log(
      `【${player.chr}】花费$${this.price}在【${this.owner.chr}】的${
        map[this.level]
      }入住一晚！`
    );
    // 付钱
    player.pay(this.price);
    this.owner.money += this.price;
  }
}

class FateBox extends Box {
  // 获得/失去地产，房子升级/降级，住院/入牢，获得/失去金钱
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
        this.downgradeLand(player);
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
      Message.success(`恭喜【${player.chr}】获得了${land.name}的地盘！`);
      gameConsole.success(`恭喜【${player.chr}】获得了${land.name}的地盘！`);
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
    Message.success(
      `【${player.chr}】在${land.name}的房子被政府扶持免费加盖了一层！`
    );
    gameConsole.success(
      `【${player.chr}】在${land.name}的房子被政府扶持免费加盖了一层！`
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
        content: `发工资啦！！！获得$${player.salary}！`,
        value: player.salary
      },
      {
        content: "中彩票啦！！！获得$3000！",
        value: 3000
      }
    ];
    const fate = goodFates[Math.floor(Math.random() * goodFates.length)];
    Message.success(fate.content);
    gameConsole.success(`【${player.chr}】的今日份好运：${fate.content}`);
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
      `【${player.chr}】因违规用地失去了在${land.name}的土地使用权！`
    );
    gameConsole.error(
      `【${player.chr}】因违规用地失去了在${land.name}的土地使用权！`
    );
  }
  downgradeLand(player) {
    console.log(1);

    const availableLands = player.lands.filter(land => land.level > 0);
    if (!availableLands.length) {
      this.badLuck(player);
      return;
    }
    const land =
      availableLands[Math.floor(Math.random() * availableLands.length)];
    land.downgrade();
    Message.error(`【${player.chr}】在${land.name}的房子因违建被拆除了一层！`);
    gameConsole.error(
      `【${player.chr}】在${land.name}的房子因违建被拆除了一层！`
    );
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
    Message.error(`【${player.chr}】不幸${event}, 住院治疗${num}天！`);
    gameConsole.error(`【${player.chr}】不幸${event}, 住院治疗${num}天！`);
  }
  getBusted(player) {
    const num = Math.ceil(Math.random() * 5);
    const events = ["逃税", "违章建筑", "不诚信经营", "偷渡", "逃狱"];
    const event = events[Math.floor(Math.random() * events.length)];
    player.stop = num;
    player.getBusted();
    Message.error(`【${player.chr}】因${event}被抓捕入狱, 收监${num}天！`);
    gameConsole.error(`【${player.chr}】因${event}被抓捕入狱, 收监${num}天！`);
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
        content: "误入传销组织，破财免灾，损失$3000！",
        value: 3000
      }
    ];
    const fate = badFates[Math.floor(Math.random() * badFates.length)];
    Message.error(fate.content);
    gameConsole.error(`【${player.chr}】的今日份霉运：${fate.content}`);
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
    Message(`恭喜【${player.chr}】升职加薪，工资增加$1000！`);
    gameConsole.success(`恭喜【${player.chr}】升职加薪，工资增加$1000！`);
    player.salary += 1000;
  }
  getCard(player) {
    let shop = player.map.find(land => land.type === "card");
    shop.getCard(player);
  }
  decreaseSalary(player) {
    if (player.salary < 1000) {
      this.badLuck();
      return;
    }
    Message.error(`【${player.chr}】受到处罚，工资减少$1000！`);
    gameConsole.error(`【${player.chr}】受到处罚，工资减少$1000！`);
    player.salary -= 1000;
  }
  lostCard(player) {
    if (!player.cards.length) {
      this.badLuck();
      return;
    }
    let card = player.cards.pop();
    Message(`【${player.chr}】手滑遗失${card.name}一张！`);
    gameConsole.error(`【${player.chr}】手滑遗失${card.name}一张！`);
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
    gameConsole.success(`【${player.chr}】的今日份好运：${fate.content}`);
    player.money += fate.value;
  }
  loseMoney(player) {
    const badFates = [
      {
        content: "花了$99去抽奖，结果啥都没有！",
        value: 99
      },
      {
        content: "氪金玩游戏，没了$300！",
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
        content: "花$800孝顺长辈！",
        value: 800
      }
    ];
    const fate = badFates[Math.floor(Math.random() * badFates.length)];
    Message.error(fate.content);
    gameConsole.error(`【${player.chr}】的今日份剁手：${fate.content}`);
    player.pay(fate.value);
  }
}
class JailBox extends Box {
  constructor(props) {
    super(props);
  }
  activate(player, cb) {
    Message.error(`【${player.chr}】因逃税收监1天！`);
    gameConsole.error(`【${player.chr}】因逃税收监1天！`);
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
    Message.error(`【${player.chr}】进医院全身大体检1天！`);
    gameConsole.error(`【${player.chr}】进医院全身大体检1天！`);
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
    Message.success(`【${player.chr}】在路边捡到了$${price}！`);
    gameConsole.success(`【${player.chr}】在路边捡到了$${price}！`);
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
    Message.error(`【${player.chr}】向政府交纳所得税$${price}！`);
    gameConsole.error(`【${player.chr}】向政府交纳所得税$${price}！`);
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
    Message(`【${player.chr}】花费$${this.value}前往${target.name}！`);
    gameConsole.log(`【${player.chr}】花费$${this.value}前往${target.name}！`);
    player.pay(this.value);
  }
}
class CardBox extends Box {
  constructor(props) {
    super(props);
    this.allItems = [];
    cardsChance.forEach(item => {
      for (let i = 0; i < item.percentage; i++) {
        this.allItems.push(item.name);
      }
    });
  }
  activate(player, cb) {
    let price = Math.ceil(Math.random() * 5);
    let num = Math.ceil(Math.random() * price);
    if (player.money > price * 1000) {
      price = price * 1000;
    } else {
      price = player.money;
    }
    player.pay(price);
    Message.success(`【${player.chr}】花费$${price}抽中了${num}张卡片！`);
    gameConsole.success(`【${player.chr}】花费$${price}抽中了${num}张卡片！`);
    console.log(price, num);
    for (let i = 0; i < num; i++) {
      setTimeout(() => {
        this.getCard(player);
      }, i * 500);
      if (i === num - 1) {
        setTimeout(() => {
          cb();
        }, 1000);
      }
    }
  }
  getCard(player) {
    const name = this.allItems[
      Math.floor(Math.random() * this.allItems.length)
    ];
    const card = new Cards[cardsMap[name]]({ name });
    player.cards.push(card);
    Message.success(`恭喜【${player.chr}】获得了一张${card.name}！`);
    gameConsole.success(`恭喜【${player.chr}】获得了一张${card.name}！`);
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

export default Boxes;
