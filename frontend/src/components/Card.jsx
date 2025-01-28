import  {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
} from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { BsCardText } from 'react-icons/bs';
import { MdOutlinePayments } from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import {useMutation} from "@apollo/client";
import {DELETE_TRANSACTION} from "../graphql/mutations/transaction.mutation.js";
import {toast} from "react-hot-toast";

const MouseEnterContext = createContext(undefined);

const categoryColorMap = {
    saving: 'bg-green-500',
    expense: 'bg-red-500',
    investment: 'bg-blue-500',
};

const CardContainer = ({ children, className, containerClassName }) => {
    const containerRef = useRef(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseEnter = () => {
        setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        setIsMouseEntered(false);
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };

    return (
        <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
            <div
                className={`py-20 flex items-center justify-center ${containerClassName}`}
                style={{ perspective: '1000px' }}
            >
                <div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center justify-center relative transition-all duration-200 ease-linear ${className}`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {children}
                </div>
            </div>
        </MouseEnterContext.Provider>
    );
};

const CardBody = ({ children, className }) => {
    return (
        <div
            className={`h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}
        >
            {children}
        </div>
    );
};

const CardItem = ({
    as: Tag = 'div',
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    ...rest
}) => {
    const ref = useRef(null);
    const [isMouseEntered] = useMouseEnter();

    useEffect(() => {
        handleAnimations();
    }, [isMouseEntered]);

    const handleAnimations = () => {
        if (!ref.current) return;
        if (isMouseEntered) {
            ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        } else {
            ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        }
    };

    return (
        <Tag
            ref={ref}
            className={`w-full transition duration-200 ease-linear ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
};

const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);
    if (context === undefined) {
        throw new Error(
            'useMouseEnter must be used within a MouseEnterProvider'
        );
    }
    return context;
};

const Card = ({
    id,
    category,
    description,
    paymentType,
    amount,
    location,
    date,
    authUser,
}) => {
    const categoryClass = categoryColorMap[category];

    description = description[0]?.toUpperCase() + description.slice(1);
    category = category[0]?.toUpperCase() + category.slice(1);
    paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);


    const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
        refetchQueries: ['GetTransactions', 'GetCategoryStatistics'],
    });

    const handleDelete = async() => {
        try {
            await deleteTransaction({
                variables: {
                    transactionID: id
                }
            });
            toast.success("Transaction deleted successfully")
        } catch (error) {
         console.error("Error deleting transaction",error)
         toast.error("Error deleting transaction")   
        }
    }

    return (
        <CardContainer>
            <CardBody className="rounded-xl p-6 bg-white bg-opacity-10 backdrop-blur-2xl shadow-lg border border-white border-opacity-30">
                <div className="flex flex-col h-full">
                    <CardItem
                        className="flex justify-between items-center mb-4"
                        translateZ={20}
                    >
                        <div
                            className={`${categoryClass} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                        >
                            {category}
                        </div>
                        <div className="flex items-center gap-2">
                            {!loading ? <FaTrash className="cursor-pointer text-white hover:text-red-500 transition-colors" onClick={handleDelete} /> : 
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                }
                            <Link to={`/transaction/${id}`}>
                                <HiPencilAlt
                                    className="cursor-pointer text-white hover:text-blue-500 transition-colors"
                                    size={20}
                                />
                            </Link>
                        </div>
                    </CardItem>
                    <CardItem translateZ={30} className="mb-4">
                        <p className="text-2xl font-bold text-white">
                            ${amount}
                        </p>
                    </CardItem>
                    <CardItem translateZ={40} className="flex-grow">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <BsCardText className="mr-2 text-gray-300" />
                                <p className="text-white">{description}</p>
                            </div>
                            <div className="flex items-center">
                                <MdOutlinePayments className="mr-2 text-gray-300" />
                                <p className="text-white">{paymentType}</p>
                            </div>
                            <div className="flex items-center">
                                <FaSackDollar className="mr-2 text-gray-300" />
                                <p className="text-white">${amount}</p>
                            </div>
                            <div className="flex items-center">
                                <FaLocationDot className="mr-2 text-gray-300" />
                                <p className="text-white">{location || 'N/A'}</p> 
                            </div>
                        </div>
                    </CardItem>
                    <CardItem className="mt-4 flex justify-between items-center" translateZ={50}>
                        <p className="text-sm text-gray-500">{date}</p>
                        <img src={authUser.profilePicture} alt="transaction user image" className="w-10 h-10 rounded-full" />
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
};

export default Card;
