import {Transaction} from "../models/transaction.model.js"
const transactionResolver = {
    Query: {
        transactions: async(_,__,context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized")
                
                const userId =await context.getUser()._id;
                const transactions = Transaction.find({userId});
                return transactions
            } catch (error) {
                cnsole.error("Error getting transactions",err)
                throw new Error(error.message || "Internal server error");
            }
        },
        transaction: async(_,{transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId).lean();
                if(!transaction){
                    throw new Error("Transaction not found");
                }
                return transaction;
            } catch (error) {
                console.error("Error getting transaction",err)
                throw new Error(error.message || "Internal server error");
            }
        }
    },
    Mutation: {
        createTransaction: async(_,{input},context) => {
            try {
                const {description,paymentType,category,amount,location,date} = input;

                if(!description || !paymentType || !category || !amount  || !date){
                    throw new Error("All fields are required");
                }

                const userId = await context.getUser()._id;
                const newTransaction = new Transaction({
                    description,
                    paymentType,
                    category,
                    amount,
                    location,
                    date,
                    userId
                });

                await newTransaction.save();

                return newTransaction
                
            } catch (error) {
                console.error("Error creating transaction",err)
                throw new Error(error.message || "Internal server error");
            }
        },
        updateTransaction: async(_,{input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});

                if(!updatedTransaction){
                    throw new Error("Transaction not found");
                }
                return updatedTransaction

            } catch (error) {
                console.error("Error updating transaction",err)
                throw new Error(error.message || "Internal server error");
            }
        },
        deleteTransaction: async(_,{transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                if(!deletedTransaction){
                    throw new Error("Transaction not found");
                }
                return deletedTransaction
            } catch (error) {
                console.error("Error deleting transaction",err)
                throw new Error(error.message || "Internal server error");
            }
        }
    },
}

export default transactionResolver;