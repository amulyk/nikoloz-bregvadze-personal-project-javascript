export class Transaction {
    constructor() {
        this.logs = []
        this.store = {count: 1}
    }

    validStep(step) {
        let isObject = (typeof step == "object")
        let isMetaValid = step.meta && step.meta.title && step.meta.description
        return !!isObject && !!step.index && !!step.call && isMetaValid
    }

    createScenario(...steps) {
        for (let step of steps) {
            if (!this.validStep(step)) {
                throw new Error("Invalid Step!!!")
            }
        }
        // check for duplicate indexes
        let indexes = steps.map(step=>step.index)
        if ((new Set(indexes)).size != indexes.length){
            throw new Error("Duplicate step indexes aren't allowed!")
        }
        // Step order according to their index
        return steps.sort((a, b) => a.index - b.index)
    }

    async dispatch(scenario) {
        scenario = this.createScenario(...scenario)
        for (let step of scenario) {
            try {
                let storeBefore = { ...this.store }
                await step.call(this.store)
                let storeAfter = { ...this.store }
                this.updateLogs(step, null, storeBefore, storeAfter)
            } catch (error) {
                await this.rollback(scenario)
                this.updateLogs(step, error)
            }
        }
    }   

    async rollback(scenario){
        for (let i = scenario.length - 1; i >= 0; --i){
            let step = scenario[i]
            if(step.restore){
                if (i == scenario.length - 1){
                    throw new Error("Last step shouldn't have a restore function!")
                }
                await step.restore()
            }
        }
        this.store = null
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