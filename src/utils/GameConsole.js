class GameConsole {
    constructor() {
        this.logs = ["游戏开始！祝各位好运~"];
    }
    log(msg) {
        this.logs.push(msg);
    }
    success(msg) {
        msg = `<span style="color: #40b883">${msg}</span>`;
        this.logs.push(msg);
    }
    error(msg) {
        msg = `<span style="color: tomato">${msg}</span>`;
        this.logs.push(msg);
    }
}
const gameConsole = new GameConsole();
export default gameConsole;