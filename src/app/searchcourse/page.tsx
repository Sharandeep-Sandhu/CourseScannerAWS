// src/app/searchcourse/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CoursesPage = dynamic(() => import('./CoursesPage'), {
  ssr: false,
});

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesPage />
    </Suspense>
  );
};

export default Page;
