import { Transaction } from './transaction'

const scenario = [
    {
        index: 1,
        meta: {
            title: 'Read popular customers',
            description: 'This action is responsible for reading the most popular customers'
        },
        // callback for main execution
        call: async (store) => {
            // console.log(store)
            store.lasha = 'lash'
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
        console.log(transaction.logs)
    } catch (err) {
        // Send email about broken transaction
        console.log(err)
    }
})();