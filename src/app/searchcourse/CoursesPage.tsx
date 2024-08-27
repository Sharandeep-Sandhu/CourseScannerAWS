// src/app/searchcourse/CoursesPage.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

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

const CourseList = ({
  courses,
  filteredCourses,
  applyFilters,
  selectedPriceOrder,
  selectedDateOrder,
  selectedRegion,
}: {
  courses: Course[];
  filteredCourses: Course[];
  applyFilters: (coursesToFilter: Course[]) => void;
  selectedPriceOrder: string | undefined;
  selectedDateOrder: string | undefined;
  selectedRegion: string;
}) => {
  useEffect(() => {
    applyFilters(courses);
  }, [selectedPriceOrder, selectedDateOrder, selectedRegion, courses, applyFilters]);

  return (
    <div className="ml-[10%] bg-black">
      <h1 className="text-3xl font-bold mb-8">All Searched Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.course_id} className="w-72 bg-card rounded-lg overflow-hidden shadow-md bg-[#18181b]">
              <div className="h-48">
                <Image
                  src={course.brand_image || '/bg.png'}
                  alt={course.brandname || 'Course Image'}
                  width={500}
                  height={300}
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
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
  );
}

const Filters = ({
  selectedPriceOrder,
  setSelectedPriceOrder,
  selectedDateOrder,
  setSelectedDateOrder,
  handleFilterChange
}: {
  selectedPriceOrder: string | undefined;
  setSelectedPriceOrder: (value: string | undefined) => void;
  selectedDateOrder: string | undefined;
  setSelectedDateOrder: (value: string | undefined) => void;
  handleFilterChange: () => void;
}) => {
  return (
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
        <Button className="w-full" onClick={handleFilterChange}>Apply Filters</Button>
      </div>
    </div>
  );
}

const CoursesPage = () => {
  const BASE_URL = 'https://backend-jet-nine.vercel.app';
  const searchParams = useSearchParams();
  const courseName = searchParams ? searchParams.get('course_name') || '' : '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedPriceOrder, setSelectedPriceOrder] = useState<string | undefined>(undefined);
  const [selectedDateOrder, setSelectedDateOrder] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const applyFilters = useCallback((coursesToFilter: Course[]) => {
    let filtered = [...coursesToFilter];

    if (selectedPriceOrder) {
      filtered.sort((a, b) => selectedPriceOrder === 'low-to-high' ? a.price - b.price : b.price - a.price);
    }
    if (selectedDateOrder) {
      filtered.sort((a, b) => selectedDateOrder === 'newest' ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime() : new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    }
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(course => course.region === selectedRegion);
    }
    setFilteredCourses(filtered);
  }, [courses, selectedPriceOrder, selectedDateOrder, selectedRegion]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/searchcourse?course_name=${encodeURIComponent(courseName)}`);
        const data = await response.json();
        setCourses(data);
        applyFilters(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [courseName, BASE_URL, applyFilters]);

  const handleFilterChange = () => {
    applyFilters(courses);
  };

  return (
    <div className="flex flex-col lg:flex-row p-4">
      <Filters
        selectedPriceOrder={selectedPriceOrder}
        setSelectedPriceOrder={setSelectedPriceOrder}
        selectedDateOrder={selectedDateOrder}
        setSelectedDateOrder={setSelectedDateOrder}
        handleFilterChange={handleFilterChange}
      />
      <CourseList
        courses={courses}
        filteredCourses={filteredCourses}
        applyFilters={applyFilters}
        selectedPriceOrder={selectedPriceOrder}
        selectedDateOrder={selectedDateOrder}
        selectedRegion={selectedRegion}
      />
    </div>
  );
};

export default CoursesPage;
