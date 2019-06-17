import { Transaction } from '../transaction'

const scenario = [
    {
        index: 1,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async (store) => {
            store.count += 1
        },
        // callback for rollback
        restore: async () => { }
    },
    {
        index: 2,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async (store) => {
            store.count += 1
            throw new Error()
        },
        // callback for rollback
        restore: async () => { }
    }
];

const transaction = new Transaction();


(async () => {
    try {
        await transaction.dispatch(scenario);
        const store = transaction.store; // {} | null
        const logs = transaction.logs; // []
        console.log(logs)
        console.log(store)
    } catch (err) {
        // Send email about broken transaction
        console.log(err)
    }
})();