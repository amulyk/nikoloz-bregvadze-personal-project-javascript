// const Scenario = require('./scenario')



export class Transaction {
    constructor() {
        this.logs = []
        this.store = {}
    }

    // get store(){

    // }

    // set store(value){

    // }

    async dispatch(scenario) {
        for (let step of scenario) {

            try {
                let storeBefore = { ...this.store }
                await step.call(this.store)
                let storeAfter = { ...this.store }
                this.updateLogs(step, null, storeBefore, storeAfter)
            } catch (error) {
                this.updateLogs(step, error)
            }
        }
    }

    updateLogs(step, error, storeBefore, storeAfter) {
        let errored = !(storeBefore && storeAfter)
        delete step.call
        delete step.restore
        if (!errored) {
            this.logs.push({ ...step, storeBefore, storeAfter, error })
        } else {
            this.logs.push({
                ...step,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            })
        }
    }

}