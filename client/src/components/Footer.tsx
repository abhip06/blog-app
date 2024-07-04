import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import ScrollTopButton from "./ScrollTopButton";

const Footer = () => {
    return (
        <>
        <div className="flex flex-col py-14 justify-center items-start sm:gap-12 gap-8 sm:px-16 px-5 bg-gray-900 text-white">
            <div className="flex md:flex-row flex-col justify-between items-start gap-7 w-full">
                <div className="flex flex-col gap-5 items-start justify-center">
                    <div className="flex font-bold sm:text-3xl text-2xl gap-2">
                        <span>Blog</span><h3 className="text-green-500">District Co.</h3>
                    </div>
                    <p className="sm:text-sm text-xs text-gray-500">
                        Where Stories Bloom.
                    </p>
                </div>

                <div className="flex flex-col justify-start sm:gap-6 gap-4 text-gray-500">
                    <h3 className="text-lg text-white">Connect with Me</h3>
                    <ul className="flex sm:gap-7 gap-5">
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.linkedin.com/in/abhinav-patel-38480b254/">{<FaLinkedin />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.x.com/abhip006">{<BsTwitterX />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.github.com/abhip06">{<FaGithub />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.instagram.com/">{<FaInstagram />}</a></li>
                    </ul>
                </div>

            </div>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="sm:text-sm text-xs">
                <span>
                    &copy; 2024 - Blog District Co. - All Rights Reserved.
                </span>
            </div>
        </div>
        <ScrollTopButton />
        </>
    )
}

export default Footer;

{/*
     <div className="grid sm:grid-cols-4 justify-between items-start w-full sm:gap-0 gap-10">
                <ul className="flex flex-col sm:gap-5 gap-4 text-gray-500">
                    <h3 className="text-lg text-white">Company</h3>
                    <li className="sm:text-sm text-xs cursor-pointer">License</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Terms of Use</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Support</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Legal</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Careers</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Privacy</li>
                </ul>
                <ul className="flex flex-col sm:gap-5 gap-4 text-gray-500">
                    <h3 className="text-lg text-white">Resources</h3>
                    <li className="sm:text-sm text-xs cursor-pointer">About</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Products</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Services</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Support</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Contact</li>
                </ul>
                <ul className="flex flex-col sm:gap-5 gap-4 text-gray-500">
                    <h3 className="text-lg text-white">Explore</h3>
                    <li className="sm:text-sm text-xs cursor-pointer">What's new</li>
                    <li className="sm:text-sm text-xs cursor-pointer">All Blogs</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Features</li>
                    <li className="sm:text-sm text-xs cursor-pointer">Categories</li>
                </ul>
                <div className="flex flex-col sm:gap-5 gap-4 text-gray-500">
                    <h3 className="text-lg text-white">Connect with us</h3>
                    <ul className="flex gap-5">
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.instagram.com/">{<FaInstagram />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.x.com/abhip006">{<BsTwitterX />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.github.com/abhip06">{<FaGithub />}</a></li>
                        <li className="sm:text-xl text-lg cursor-pointer"><a href="https://www.linkedin.com/">{<FaLinkedin />}</a></li>
                    </ul>
                </div>
            </div> */}