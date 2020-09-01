import { Message, MessageBox } from "element-ui";
import gameConsole from "./GameConsole";
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
    gameConsole.log(`${this.name}选择了【${this.chr}】`);
  }
  move(num) {
    gameConsole.log(`【${this.chr}】掷出了点数${num}。`);
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
              gameConsole.log(
                `【${this.chr}】来到了${this.map[this.position].name}。`
              );
              break;
            case "fate":
              gameConsole.log(`【${this.chr}】准备接受命运的审判。`);
              break;
            case "chance":
              gameConsole.log(`会有怎样的机会在等着【${this.chr}】呢？`);
              break;
            case "bad":
              gameConsole.log(`【${this.chr}】终究还是逃不过纳税的。`);
              break;
            case "good":
              gameConsole.log(`【${this.chr}】走了狗屎运。`);
              break;
            case "air":
              gameConsole.log(`【${this.chr}】来到了飞机场。`);
              break;
            case "jail":
              gameConsole.log(`【${this.chr}】似乎做了不好的事情。`);
              break;
            case "hospital":
              gameConsole.log(`【${this.chr}】感到有点不舒服。`);
              break;
            case "card":
              gameConsole.log(`欢迎【${this.chr}】来到道具商城！`);
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
      `很遗憾，【${this.chr}】已无力经营下去，宣告破产，所有地产充公处理！`
    );
    gameConsole.error(
      `很遗憾，【${this.chr}】已无力经营下去，宣告破产，所有地产充公处理！`
    );
    this.state = "bankrupt";
    this.node.remove();
  }
  getPaid() {
    // 发工资啦
    this.money += this.salary;
    Message.success(`【${this.chr}】获得了本月薪水$${this.salary}！`);
    gameConsole.success(`【${this.chr}】获得了本月薪水$${this.salary}！`);
  }
  checkNext() {
    // 检查天数
    if (this.next.flag) this.map.day++;
    // 检查获胜
    // 普通情况
    if (this.state === "bankrupt" && this.next.next === this) {
      MessageBox.alert(`恭喜【${this.next.chr}】获得最终的胜利！`).then(() => {
        window.location.reload();
      });
    }
    // 达到资产
    if (this.map.goal) {
      let total;
      if (this.lands.length) {
        let landValue = this.lands
          .map(land => land.value + land.price)
          .reduce((acc, cur) => acc + cur);
        total = this.money + landValue;
      } else {
        total = this.money;
      }
      if (total >= this.map.goal) {
        // 胜利！
        MessageBox.alert(
          `恭喜【${this.chr}】资产值达到$${this.map.goal}，获得最终的胜利！`
        ).then(() => {
          window.location.reload();
        });
      }
    }
    // 天数限制
    if (this.map.dayLimit && this.map.dayLimit === this.map.day) {
      let players = [];
      // eslint-disable-next-line no-inner-declarations
      function pushPlayer(player) {
        if (player === players[0]) return;
        players.push(player);
        pushPlayer(player.next);
      }
      pushPlayer(this);
      players.forEach(player => {
        if (player.lands.length) {
          var landValue = player.lands
            .map(land => land.value + land.price)
            .reduce((acc, cur) => acc + cur);
          player.total = player.money += landValue;
        } else {
          player.total = player.money;
        }
      });
      players.sort((a, b) => {
        return b.total - a.total;
      });
      // 胜利！
      MessageBox.alert(
        `${this.map.day}天过去了，恭喜【${players[0].chr}】资产值最多，达到$${players[0].total}，获得最终的胜利！`
      ).then(() => {
        window.location.reload();
      });
    }

    // 检查破产
    // 移动天数旗子
    if (this.state === "bankrupt" && this.flag) {
      this.next.flag = true;
    }
    // 改变下一位玩家指针
    if (this.next.state === "bankrupt") {
      this.next = this.next.next;
    }
    // 交换顺序
    this.cur = false;
    this.next.cur = true;
    if (this.next.stop) {
      this.next.checkStop();
    }
  }
  nextDay() {
    this.map.day++;
  }
  checkStop() {
    if (this.state === "jail") {
      Message(`离【${this.chr}】出狱还有${this.stop}天！`);
      gameConsole.log(`离【${this.chr}】出狱还有${this.stop}天！`);
    }
    if (this.state === "hospital") {
      Message(`离【${this.chr}】出院还有${this.stop}天！`);
      gameConsole.log(`离【${this.chr}】出院还有${this.stop}天！`);
    }
    this.stop--;
    setTimeout(() => {
      if (!this.stop) {
        this.getActive();
      }
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
  useCard(otherActivePlayers) {
    const card = this.cards[Math.floor(Math.random() * this.cards.length)];
    if (card.type === "normal") {
      // 增加两个无法使用卡片的条件
      if (card.checkBan && card.checkBan(this)) {
        return true;
      }
      if (card.checkMoney && card.checkMoney(this) === false) {
        return true;
      }
      // 使用卡片
      card.activate(this);
      this.cards.splice(this.cards.indexOf(card), 1);
      // 移动过了
      if (card.move) {
        return "moved";
      }
    } else if (card.type === "chr") {
      if (!otherActivePlayers.length) {
        return true;
      } else {
        // 使用带目标的卡片
        let otherActivePlayer =
          otherActivePlayers[
            Math.floor(Math.random() * otherActivePlayers.length)
          ];
        card.activate(otherActivePlayer, this);
        this.cards.splice(this.cards.indexOf(card), 1);
      }
    } else {
      return true;
    }
  }
}

export default Player;
