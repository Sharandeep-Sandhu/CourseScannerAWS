import React from "react";
import Link from "next/link";
import Image from 'next/image';

function Navbar() {
    return (
        <header className="bg-black text-white py-4 px-6 md:px-8 lg:px-10">
            <div className="mx-auto flex items-center justify-between space-x-2">
                <Link href="/" className="font-bold text-3xl flex items-center">
                    <Image
                        src="/Logo1.png"
                        alt="Logo"
                        width={200}
                        height={200}
                        className="mr-2"
                    />
                </Link>
                
                <div className="fixed top-4 right-4">
                    <Link href="/contact_us" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ddbd48] text-white shadow-lg hover:bg-blue-400 transition-colors duration-300" prefetch={false}>
                        <span className="text-lg font-bold text-center">Contact us</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
