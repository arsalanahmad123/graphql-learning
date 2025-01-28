import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Cards from '../components/Cards';
import TransactionForm from '../components/TransactionForm';

import { MdLogout } from 'react-icons/md';
import { useMutation, useQuery } from '@apollo/client';
import {toast} from "react-hot-toast"
import { LOGOUT } from '../graphql/mutations/user.mutation';
import { GET_CATEGORY_STATISTICS } from '../graphql/queries/transaction.query';
import { CURRENT_USER } from '../graphql/queries/user.query';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {

    const {data} = useQuery(GET_CATEGORY_STATISTICS);
    const {data: authUserData} = useQuery(CURRENT_USER);



    const [logout, { loading, client }] = useMutation(LOGOUT, {
        refetchQueries: ['GetCurrentUser'],
    });


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '$',
                data: [13, 8, 3],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                borderRadius: 30,
                spacing: 10,
                cutout: 130,
            },
        ],
    });

    useEffect(() => {

        if(data?.categoryStatistics){
            const categories = data?.categoryStatistics.map((category) => {
                return category._id;
            })
            const totalAmounts = data?.categoryStatistics.map((category) => {
                return category.totalAmount;
            })

            const backgroundColors = [];
            const borderColors = [];

            const categoryColorMap = {
                saving: '#32CD32',
                expense: '#FF6347',
                investment: '#1E90FF',
            };

            categories.forEach(c => {
                const color = categoryColorMap[c] || '#000000';
                backgroundColors.push(color);
                borderColors.push(color);
            });

            setChartData(prev => ({
                labels: categories,
                datasets: [
                    {
                        ...prev.datasets[0],
                        data: totalAmounts,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        
                    },
                ],
            }))
        }

    },[data])


    const handleLogout = async() => {
        try {
            await logout();
            client.resetStore();
        } catch (error) {
            console.error("Error logging out",error)
            toast.error(error.message)
        }
    };


    return (
        <>
            <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
                <div className="flex items-center">
                    <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
                        Spend wisely, track wisely
                    </p>
                    <img
                        src={authUserData?.authUser.profilePicture}
                        className="w-11 h-11 rounded-full border cursor-pointer"
                        alt="Avatar"
                    />
                    {!loading && (
                        <MdLogout
                            className="mx-2 w-5 h-5 cursor-pointer text-white"
                            onClick={handleLogout}
                        />
                    )}
                    {/* loading spinner */}
                    {loading && (
                        <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
                    )}
                </div>
                <div className="flex  w-full justify-center items-center gap-6">
                { data?.categoryStatistics.length > 0 &&  
                    <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
                        <Doughnut data={chartData} />
                    </div>
                    }

                    <TransactionForm />
                </div>
                <Cards />
            </div>
        </>
    );
};
export default HomePage;
