"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

interface Course {
    brandname: string;
    coursename: string;
    duration: string;
    price: number;
    region: string;
    start_date: string;
    brand_image: string;
    url: string;
    course_id: string;
}

interface SearchComponentProps {
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    setFilteredCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function SearchComponent({ setCourses, setFilteredCourses }: SearchComponentProps) {
    const BASE_URL = 'https://backend-jet-nine.vercel.app';
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchCourses() {
            try {
                if (!searchParams) {
                    console.error('searchParams is null.');
                    return;
                }

                const brandname = searchParams.get('brandname');
                const course_id = searchParams.get('course_id');
                const start_date = searchParams.get('start_date');
                const region = searchParams.get('region');

                if (!brandname || !course_id || !start_date || !region) {
                    console.error('Required query parameters are missing.');
                    return;
                }

                const searchParamsObj = {
                    brandname,
                    course_id,
                    start_date,
                    region
                };
                const searchUrl = `${BASE_URL}/search?${new URLSearchParams(searchParamsObj).toString()}`;

                const response = await fetch(searchUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const rawData = await response.json();

                const extractedData: Course[] = rawData.map((course: any) => ({
                    brandname: course.brandname,
                    coursename: course.coursename,
                    duration: course.duration,
                    price: course.price,
                    region: course.region,
                    start_date: course.start_date,
                    brand_image: course.brand_image,
                    url: course.url,
                    course_id: course.course_id
                }));

                setCourses(extractedData || []);
                setFilteredCourses(extractedData || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
                setFilteredCourses([]);
            }
        }

        if (searchParams && searchParams.toString()) {
            fetchCourses();
        }
    }, [searchParams, setCourses, setFilteredCourses]);

    return null;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [selectedPriceOrder, setSelectedPriceOrder] = useState<string | undefined>(undefined);
    const [selectedDateOrder, setSelectedDateOrder] = useState<string | undefined>(undefined);
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    const applyFilters = () => {
        let filtered = [...courses];

        if (selectedPriceOrder) {
            filtered.sort((a, b) => selectedPriceOrder === 'low-to-high' ? a.price - b.price : b.price - a.price);
        }
        if (selectedDateOrder) {
            filtered.sort((a, b) => selectedDateOrder === 'newest' ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime() : new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        }
        if (selectedRegion && selectedRegion !== 'all') {
            filtered = filtered.filter(course => course.region.toLowerCase() === selectedRegion.toLowerCase());
        }

        setFilteredCourses(filtered);
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 grid md:grid-cols-[1fr_300px] gap-8">
            <div className="ml-[10%]">
                <h1 className="text-3xl font-bold mb-8">All Courses</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div key={course.course_id} className="w-72 bg-card rounded-lg overflow-hidden shadow-md bg-[#18181b]">
                                <div className="h-48">
                                    <Image
                                        src={course.brand_image || '/bg.png'}
                                        alt={course.brandname || 'Course Image'}
                                        width={500} // Replace with your desired width
                                        height={300} // Replace with your desired height
                                        objectFit="cover" // Adjust as needed, e.g., "contain", "fill", etc.
                                    />
                                </div>
                                <div className="p-6">
#                                    <h2 className="text-xl font-bold mb-2">{course.coursename}</h2>
                                    <h2 className="text-xl font-bold">{course.coursename.substring(0, course.coursename.indexOf('\n') + 1)}</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Duration: {course.duration}
                                    </p>
                                    <p className="text-muted-foreground mb-4">
                                        Start Date: {course.start_date}
                                    </p>
                                    <p className="text-muted-foreground mb-4">
                                        Company: {course.duration}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">${course.price}</span>
                                        <Link href={course.url} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm">Enroll</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xl font-semibold text-gray-600">No courses available</p>
                    )}
                </div>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="price" className="text-sm font-medium">
                            Price
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    Price
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={selectedPriceOrder} onValueChange={setSelectedPriceOrder}>
                                    <DropdownMenuRadioItem value="low-to-high">Low to High</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="high-to-low">High to Low</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <Label htmlFor="date" className="text-sm font-medium">
                            Date
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    Date
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={selectedDateOrder} onValueChange={setSelectedDateOrder}>
                                    <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
                </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchComponent setCourses={setCourses} setFilteredCourses={setFilteredCourses} />
            </Suspense>
        </div>
    );
}
