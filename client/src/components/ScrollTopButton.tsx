import { FaCircleArrowUp } from "react-icons/fa6";


const ScrollTopButton = () => {
    return (
        <div
            className="fixed p-1 rounded-full flex bottom-20 shadow-md sm:right-16 right-6 bg-green-500 text-white justify-center items-center cursor-pointer hover:bg-white hover:text-green-500"
            onClick={() => window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            })
}
    >
    <FaCircleArrowUp className="sm:text-5xl text-3xl font-bold" />
    </div >
  )
}

export default ScrollTopButton