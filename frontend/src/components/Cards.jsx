import Card from './Card';
import {useQuery} from "@apollo/client";
import {GET_TRANSACTIONS} from "../graphql/queries/transaction.query.js";
import {CURRENT_USER} from "../graphql/queries/user.query.js";

const Cards = () => {
    const {data,loading,error} = useQuery(GET_TRANSACTIONS);
    const {data: authUser} = useQuery(CURRENT_USER);



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    }


    return (
        <div className="w-full px-10 min-h-[40vh]">
            <p className="text-5xl font-bold text-center my-10 text-white">History</p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
               
                {
                    !loading && data.transactions.map((transaction, index) => (
                        <Card
                            id={transaction._id}
                            key={index}
                            category={transaction.category}
                            description={transaction.description}
                            paymentType={transaction.paymentType}
                            amount={transaction.amount}
                            location={transaction.location}
                            date={formatDate(transaction.date)}
                            authUser={authUser?.authUser}
                        />
                    ))
                }
            </div>
            {
                !loading && data.transactions.length === 0 && (
                    <p className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-500">No transactions yet</p>
                )
            }
        </div>
    );
};
export default Cards;
