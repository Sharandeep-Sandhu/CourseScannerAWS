"use client";

import Image from 'next/image';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";


// Define Course type/interface
interface Course {
    course_id: string;
    coursename: string;
    brandname: string;
    price: number;
    region: string;
    duration: string;
    start_date: string;
    url: string;
    // Add other properties as per your actual data structure
}

// Define the type for the data returned from API
interface BrandName {
    brandname: string;
    // Add other properties if present in your actual API response
}


export function Component() {
    // export function Index = () => {
    const BASE_URL = 'https://backend-jet-nine.vercel.app';
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const [brandNames, setBrandNames] = useState<string[]>([]);
    // const [selectedBrandName, setSelectedBrandName] = useState<string | null>(null);
    const [selectedBrandName, setSelectedBrandName] = useState<string>('');

    const [courseNames, setCourseNames] = useState<Course[]>([]);
    const [today, setToday] = useState('');

    const [courseName, setCourseName] = useState('');
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        fetch(`${BASE_URL}/brandnames`)
            .then(response => response.json())
            .then((data: BrandName[]) => setBrandNames(data.map(item => item.brandname)))
            .catch(error => console.error('Error fetching brand names:', error));
    }, []);


    useEffect(() => {
        // Fetch course names based on selected brand name
        if (selectedBrandName) {
            fetch(`${BASE_URL}/coursename/${selectedBrandName}`)
                .then(response => response.json())
                .then((data: Course[]) => {
                    const uniqueCourses = Array.from(new Set(data.map((item: Course) => item.coursename)))
                        .map(name => data.find(course => course.coursename === name))
                        .filter((course): course is Course => course !== undefined); // Filter out undefined values and assert type

                    // Sort courses by start_date
                    const sortedCourses = uniqueCourses.sort((a, b) => {
                        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
                    });

                    setCourseNames(sortedCourses);
                })
                .catch(error => console.error('Error fetching course names:', error));
        } else {
            setCourseNames([]);
        }
    }, [selectedBrandName]);



    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0];
        setToday(todayDate);
    }, []);





    const topCourses = [
        { coursename: 'Designing and Implementing a Microsoft Azure AI Solution (AI-102)', brandname: 'CompTIA', region: 'USA', url: '/searchcourse?course_name=AI-102' },
        { coursename: 'CompTIA Security+', brandname: 'CompTIA', region: 'USA', url: '/searchcourse?course_name=CompTIA Security+' },
        { coursename: 'Engineering Cisco Meraki Solutions', brandname: 'Cisco', region: 'USA', url: '/searchcourse?course_name=Engineering Cisco Meraki Solutions' },
        { coursename: 'Practical Data Science with Amazon SageMaker', brandname: 'Aws', region: 'USA', url: '/searchcourse?course_name=Amazon SageMaker' },
        { coursename: 'Google Cloud Fundamentals: Big Data & Machine Learning', brandname: 'GoogleCloud', region: 'USA', url: '/searchcourse?course_name=Google Cloud Fundamentals' },
        { coursename: 'Certified Ethical Hacker (CEH) v12', brandname: 'EC-Council', region: 'USA', url: '/searchcourse?course_name=CEH' },
        { coursename: 'Designing and Implementing a Microsoft Azure AI Solution', brandname: 'Microsoft', region: 'USA', url: '/searchcourse?course_name=Designing and Implementing a Microsoft Azure AI Solution' },
        { coursename: 'Implementing Automation for Cisco Enterprise Solutions', brandname: 'Cisco', region: 'USA', url: '/searchcourse?course_name=Implementing Automation for Cisco Enterprise Solutions' },
        { coursename: 'Data Engineering on Microsoft Azure (DP-203T00)', brandname: 'Microsoft', region: 'USA', url: '/searchcourse?course_name=Data Engineering on Microsoft Azure (DP-203T00)' },

    ];

 
 //   const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>, courseName: string) => {
    const handleLinkClick = async (e: MouseEvent<HTMLButtonElement>, courseName: string) => {
        e.preventDefault();
        // Redirect to the search page with the course name as a query parameter
        await router.push(`/searchcourse?course_name=${encodeURIComponent(courseName)}`);
    };



    const handleBrandNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBrandName(event.target.value);
        setSelectedCourseId(''); // Reset course selection when brand changes
    };

    const capitalize = (str: string): string => {
        return str
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/-\w/g, (char) => char.toUpperCase());
    };

    const handleCourseNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourseId(event.target.value);
    };


   

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            brandname: selectedBrandName,
            course_id: selectedCourseId,
            start_date: (e.currentTarget.querySelector('input[name="start_date"]') as HTMLInputElement)?.value || '',
            region: (e.currentTarget.querySelector('select[name="region"]') as HTMLSelectElement)?.value || '',
        };

        const queryString = new URLSearchParams(formData as Record<string, string>).toString();
        const url = `${BASE_URL}/search?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSearchResults(data);
            if (data.length === 0) {
                setShowPopup(true); // Show popup for no data found
            } else {
                setShowPopup(false);
                router.push(`/search?${queryString}`);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setShowPopup(true); // Show popup for errors
        }
    };



    return (
        <div className="flex flex-col min-h-screen mt-10 bg-black">
            <main className="flex-1">
                <section className="">
                    <div className="">
                        <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center text-white">
                            Helping You Find the <span className="text-[#ddbd48]">Best Course</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white-600 mb-8 text-center text-white">Compare course prices across multiple websites and find the best deal.</p>

                        <div className="text-white p-12">
                            <form className="mt-4 flex flex-col md:flex-row bg-white justify-between p-4 text-black rounded space-y-4 md:space-y-0" onSubmit={handleSubmit}>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="brand-name" className="text-sm font-bold">Brand Name</label>
                                    <select
                                        id="brand-name"
                                        name="brand-name"
                                        value={selectedBrandName}
                                        onChange={handleBrandNameChange}
                                        className="w-full bg-transparent focus:outline-none"
                                        autoComplete="brand-name"
                                    >
                                        <option value="">Select Brand Name</option>
                                        {brandNames.map((brandName, index) => (
                                            <option key={index} value={brandName}>
                                                {capitalize(brandName.toLowerCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="border-l border-gray-300 mx-4 hidden md:block"></div>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="course-id" className="text-sm font-bold">Course Name</label>
                                    <select id="course-id" name="course-id" value={selectedCourseId} onChange={handleCourseNameChange} className="w-full bg-transparent focus:outline-none" autoComplete="course-id">
                                        <option value="">Select Course Name</option>
                                        {courseNames.map((course, index) => (
                                            <option key={index} value={course.course_id}>
                                                {course.coursename.includes('\n')
                                                    ? course.coursename.substring(0, course.coursename.indexOf('\n'))
                                                    : course.coursename}
                                            </option>
                                        ))}
                                    </select>


                                </div>
                                <div className="border-l border-gray-300 mx-4 hidden md:block"></div>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="start_date" className="text-sm font-bold">Start Date</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        className="w-full bg-transparent focus:outline-none"
                                        autoComplete="start-date"
                                        min={today}
                                    />
                                </div>
                                <div className="border-l border-gray-300 mx-4 hidden md:block"></div>
                                <div className="flex flex-col w-full md:w-1/5">
                                    <label htmlFor="region" className="text-sm font-bold">Region</label>
                                    <select id="region" name="region" className="w-full bg-transparent focus:outline-none" autoComplete="region">
                                        <option value="">Select Region</option>
                                        <option value="UK">UK</option>
                                        <option value="USA">USA</option>
                                    </select>
                                </div>
                                <div className="border-l border-gray-300 mx-4 hidden md:block"></div>
                                <div className="flex flex-col w-full md:w-1/5 justify-end">
                                    <button type="submit" className="w-full text-black bg-[#ddbd48] py-2 px-4 font-bold rounded">Search</button>
                                </div>
                            </form>

                            {/* Pop-up for no data found */}
                            {searchResults.length === 0 && showPopup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out">
                                   <div className="bg-gradient-to-r bg-[#ddbd48] p-8 rounded-lg shadow-lg text-center transform transition-transform duration-300 ease-in-out scale-100 hover:scale-105">
                                        <p className="text-lg font-bold mb-4 text-white">No data found for the requested criteria.</p>
                                        <button
                                            onClick={() => setShowPopup(false)}
                                            className="bg-gradient-to-r bg-white  hover:bg-[#ddbd48] text-black px-6 py-2 rounded-full focus:outline-none shadow-md transition-shadow duration-300 ease-in-out"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </section>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 mt-24 text-center text-white">About</h1><br />
                <div className="flex h-80 bg-black">
                    {/* Image covering half of the window */}
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="max-w-md mx-auto" style={{ marginLeft: "15%" }}>
                            <p className="font-bold text-white text-left text-2xl mb-2">
                                Tired of searching high and low for the best price on the <span className="text-[#ddbd48]">latest technical training</span>?
                            </p>
                            <p className="text-white text-left mb-2">
                                ----------------------
                            </p>
                            <p className="text-left mb-4 text-white">
                                We understand your struggle. With the ever-growing landscape of IT courses, navigating the pricing maze can be overwhelming. We use cutting-edge technology to analyze course listings across a vast network of learning platforms. This allows you to:
                            </p>
                        </div>
                    </div>

                    {/* Content on the right side */}
                    {/* <div className="w-1/2 flex items-center justify-center">
                        <div className="max-w-md mx-auto">
                            <p className="font-bold text-white text-left text-2xl mb-2">
                                Tired of searching high and low for the best price on the latest technical training?
                            </p>
                            <p className="text-white text-left mb-2">
                                ----------------------
                            </p>
                            <p className="text-left mb-4">
                                We understand your struggle. With the ever-growing landscape of IT courses, navigating the pricing maze can be overwhelming. We use cutting-edge technology to analyze course listings across a vast network of learning platforms. This allows you to:
                            </p>
                        </div>
                    </div> */}
                    <div className="w-1/2 flex">
                        <Image
                            src="/bg.jpg"
                            alt="Sunset"
                            className="object-cover object-center w-full h-80"
                            width={1280}
                            height={720}
                        />
                    </div>

                </div>
                <br /><br />

                  <h2 className="text-2xl md:text-4xl font-bold mt-12 mb-4 text-center text-white">Top Popular Courses</h2>
                        <div className="flex flex-wrap justify-center mt-4 p-4 text-black">
                            {topCourses.map((course, index) => (
                                <div key={index} className="w-full md:w-1/3 p-4">
                                    <Card className="h-full flex flex-col justify-between">
                                        <CardContent className="mt-5 flex flex-col flex-grow">
                                            <Image
                                                src={`/brands/${course.brandname.toLowerCase()}.png`}
                                                alt={`${course.brandname} logo`}
                                                width={200}
                                                height={100}
                                                className="mx-auto"
                                            />
                                            <h2 className="text-xl font-bold mt-4">{course.coursename}</h2>
                                            <br />
                                            <p className="text-sm text-gray-600 font-bold">Technology: {course.brandname}</p>
                                            <p className="text-sm text-gray-600 font-bold">Region: {course.region}</p>
                                            <br />
                                            <div className="text-center mt-auto">
						<button
						     onClick={(e) => handleLinkClick(e, course.coursename)}
						     className="inline-block bg-[#ddbd48] hover:bg-yellow-500 text-white p-2 rounded"
						>
						  View Course
						</button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
            </main>
        </div>
    );
};

export default Component;
