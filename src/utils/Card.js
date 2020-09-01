import { Message } from "element-ui";
import gameConsole from "./GameConsole";

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
    this.name = "停留卡";
    this.detail = "在当前位置多停留一回合。";
  }
  activate(player) {
    Message.success(`【${player.chr}】使用了停留卡，今天是快乐肥宅的一天。`);
    gameConsole.success(
      `【${player.chr}】使用了停留卡，今天是快乐肥宅的一天。`
    );
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
    this.name = "转向卡";
    this.detail = "调转角色前进方向。";
  }
  activate(player) {
    Message.success(`【${player.chr}】使用了转向卡，调转了前进方向。`);
    gameConsole.success(`【${player.chr}】使用了转向卡，调转了前进方向。`);
    player.direction = player.direction ? 0 : 1;
  }
}
class DiceCard extends Card {
  constructor(props) {
    super(props);
    this.type = "dice";
    this.move = false;
    this.src = "dice";
    this.name = "随心卡";
    this.detail = "掷出你想要的点数。";
  }
  activate(player, val) {
    Message.success(`【${player.chr}】使用了随心卡，许愿了点数${val}。`);
    gameConsole.success(`【${player.chr}】使用了随心卡，许愿了点数${val}。`);
    player.diceNum = val;
  }
}
class SalaryCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "salary";
    this.name = "工资卡";
    this.detail = "立即发放一个月的工资。";
  }
  activate(player) {
    Message.success(
      `【${player.chr}】使用了工资卡，获得了本月薪水$${player.salary}。`
    );
    gameConsole.success(
      `【${player.chr}】使用了工资卡，获得了本月薪水$${player.salary}。`
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
    this.name = "加薪卡";
    this.detail = "自身薪水增加$1000。";
  }
  activate(player) {
    Message.success(`【${player.chr}】使用了加薪卡，薪水提升$1000。`);
    gameConsole.success(`【${player.chr}】使用了加薪卡，薪水提升$1000。`);
    player.salary += 1000;
  }
}
class PoliceCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "police";
    this.name = "坐牢卡";
    this.detail = "送目标玩家到监狱坐牢。";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    let num = Math.ceil(Math.random() * 3);
    selectedPlayer.stop = 3;
    selectedPlayer.getBusted();
    Message.success(
      `【${activePlayer.chr}】使用了坐牢卡，举报揭发【${selectedPlayer.chr}】逃税，导致【${selectedPlayer.chr}】被收监反省${num}天，同时【${activePlayer.chr}】获得赏金$1000！`
    );
    gameConsole.success(
      `【${activePlayer.chr}】使用了坐牢卡，举报揭发【${selectedPlayer.chr}】逃税，导致【${selectedPlayer.chr}】被收监反省${num}天，同时【${activePlayer.chr}】获得赏金$1000！`
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
    this.name = "住院卡";
    this.detail = "送目标玩家到医院住院。";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    let num = Math.ceil(Math.random() * 3);
    selectedPlayer.stop = 3;
    selectedPlayer.getSick();
    Message.success(
      `【${activePlayer.chr}】使用了住院卡，在混乱中打伤了【${selectedPlayer.chr}】，导致${selectedPlayer.chr}入院治疗${num}天，同时【${activePlayer.chr}】需赔偿医药费$1000！`
    );
    gameConsole.success(
      `【${activePlayer.chr}】使用了住院卡，在混乱中打伤了【${selectedPlayer.chr}】，导致${selectedPlayer.chr}入院治疗${num}天，同时【${activePlayer.chr}】需赔偿医药费$1000！`
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
    this.name = "爆破卡";
    this.detail = "将当前位置的房子夷为平地。";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      `【${player.chr}】使用了爆破卡，把【${land.owner.chr}】在${land.name}的房子炸得渣都不剩。`
    );
    gameConsole.success(
      `【${player.chr}】使用了爆破卡，把【${land.owner.chr}】在${land.name}的房子炸得渣都不剩。`
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
    this.name = "升级卡";
    this.detail = "升级当前位置你的地产。";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      `【${player.chr}】使用了升级卡，给${land.name}的地盘加盖了一层房子。`
    );
    gameConsole.success(
      `【${player.chr}】使用了升级卡，给${land.name}的地盘加盖了一层房子。`
    );
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
    this.name = "降级卡";
    this.detail = "使当前位置地产降级一层。";
  }
  activate(player) {
    const land = player.map[player.position];
    Message.success(
      `【${player.chr}】使用了降级卡，给【${land.owner.chr}】在${land.name}的房子拆了一层。`
    );
    gameConsole.success(
      `【${player.chr}】使用了降级卡，给【${land.owner.chr}】在${land.name}的房子拆了一层。`
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
    this.name = "抢劫卡";
    this.detail = "抢夺目标玩家的一张卡片。";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    if (!selectedPlayer.cards.length) {
      Message.error(
        `【${activePlayer.chr}】掏出了手枪准备抢劫却发现【${selectedPlayer.chr}】口袋里一张卡片都没有！`
      );
      gameConsole.error(
        `【${activePlayer.chr}】掏出了手枪准备抢劫却发现【${selectedPlayer.chr}】口袋里一张卡片都没有！`
      );
      return;
    }
    let index = Math.floor(Math.random() * selectedPlayer.cards.length);
    let card = selectedPlayer.cards[index];
    selectedPlayer.cards.splice(index, 1);
    activePlayer.cards.push(card);
    Message.success(
      `【${activePlayer.chr}】使用了抢劫卡，抢走了【${selectedPlayer.chr}】口袋里的一张${card.name}！`
    );
    gameConsole.success(
      `【${activePlayer.chr}】使用了抢劫卡，抢走了【${selectedPlayer.chr}】口袋里的一张${card.name}！`
    );
  }
}
class TaxCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "tax";
    this.name = "查税卡";
    this.detail = "让目标玩家补交自身20%现金的税额。";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    Message.success(
      `【${activePlayer.chr}】使用了查税卡，【${
        selectedPlayer.chr
      }】被查税后补缴纳了税额$${selectedPlayer.money / 5}！`
    );
    gameConsole.success(
      `【${activePlayer.chr}】使用了查税卡，【${
        selectedPlayer.chr
      }】被查税后补缴纳了税额$${selectedPlayer.money / 5}！`
    );
    selectedPlayer.pay(selectedPlayer.money / 5);
  }
}
class SellCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "sell";
    this.name = "卖地卡";
    this.detail = "强行拍卖当前位置地产。";
  }
  activate(player) {
    const land = player.map[player.position];
    const price = land.value + land.price;
    Message.success(
      `【${player.chr}】使用了卖地卡，以售价$${price}卖掉了【${land.owner.chr}】在${land.name}的地盘。`
    );
    gameConsole.success(
      `【${player.chr}】使用了卖地卡，以售价$${price}卖掉了【${land.owner.chr}】在${land.name}的地盘。`
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
    return `是否以$${price}卖掉【${land.owner.chr}】在${land.name}的地盘？`;
  }
}
class BuyCard extends Card {
  constructor(props) {
    super(props);
    this.type = "normal";
    this.move = false;
    this.src = "buy";
    this.name = "买地卡";
    this.detail = "强行买下当前位置地产。";
  }
  activate(player) {
    const land = player.map[player.position];
    const price = land.owner ? land.value + land.price : land.value;
    let msg = land.owner ? `【${land.owner.chr}】在` : "";
    Message.success(
      `【${player.chr}】使用了买地卡，花费了$${price}买下了${msg}${land.name}的地盘。`
    );
    gameConsole.success(
      `【${player.chr}】使用了买地卡，花费了$${price}买下了${msg}${land.name}的地盘。`
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
      return `强行盘下【${land.owner.chr}】在${land.name}的地盘需花费$${price}，是否确定？`;
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
    this.name = "幸运卡";
    this.detail = "自身幸运值提升10%。";
  }
  activate(player) {
    if (player.luck == 1) {
      player.money += 10000;
      Message.success(
        `【${player.chr}】使用了幸运卡，但自身幸运值满了，转换为$10000现金`
      );
      gameConsole.success(
        `【${player.chr}】使用了幸运卡，但自身幸运值满了，转换为$10000现金`
      );
    } else {
      player.luck += 0.1;
      Message.success(
        `【${player.chr}】使用了幸运卡，自身幸运值提升了10%，达到了${Math.round(
          player.luck * 100
        )}%`
      );
      gameConsole.success(
        `【${player.chr}】使用了幸运卡，自身幸运值提升了10%，达到了${Math.round(
          player.luck * 100
        )}%`
      );
    }
  }
}
class BadluckCard extends Card {
  constructor(props) {
    super(props);
    this.type = "chr";
    this.move = false;
    this.src = "badluck";
    this.name = "霉运卡";
    this.detail = "使目标玩家的幸运值降低10%。";
    this.check = true;
  }
  activate(selectedPlayer, activePlayer) {
    if (selectedPlayer.luck < 0.1) {
      Message.error(
        `【${activePlayer.chr}】使用了霉运卡，但是【${selectedPlayer.chr}】已经够倒霉了，霉运卡都无效了。`
      );
      gameConsole.error(
        `【${activePlayer.chr}】使用了霉运卡，但是【${selectedPlayer.chr}】已经够倒霉了，霉运卡都无效了。`
      );
      return;
    }
    selectedPlayer.luck -= 0.1;
    Message.success(
      `【${activePlayer.chr}】使用了霉运卡，【${
        selectedPlayer.chr
      }】的幸运值下降了10%，现在为${Math.round(selectedPlayer.luck * 100)}%。`
    );
    gameConsole.error(
      `【${activePlayer.chr}】使用了霉运卡，【${
        selectedPlayer.chr
      }】的幸运值下降了10%，现在为${Math.round(selectedPlayer.luck * 100)}%。`
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

export default Cards;
