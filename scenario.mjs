module.exports = class Scenario {
    constructor(index, title, description, call, restore) {
        this.index = index;
        this.meta = { title, description }
        this.call = call
        this.restore = restore
    }
}
