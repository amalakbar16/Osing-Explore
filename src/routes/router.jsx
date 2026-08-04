import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import AppShell from '../components/layout/AppShell';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Skeleton from '../components/ui/Skeleton';

const PageFallback = () => (
  <div className="p-6 pt-20 animate-fade-in flex flex-col gap-4 w-full min-h-[70vh]">
    <Skeleton className="w-2/3 h-8 mb-4" />
    <Skeleton className="w-full h-32" />
    <Skeleton className="w-full h-32" />
  </div>
);

const BerandaPage = lazy(() => import('../pages/beranda/BerandaPage'));
const PetaRutePage = lazy(() => import('../pages/peta-rute/PetaRutePage'));
const DetailDestinasiPage = lazy(() => import('../pages/detail-destinasi/DetailDestinasiPage'));
const KulinerPage = lazy(() => import('../pages/kuliner/KulinerPage'));
const PenginapanPage = lazy(() => import('../pages/penginapan/PenginapanPage'));
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'));
const RuteSayaPage = lazy(() => import('../pages/rute-saya/RuteSayaPage'));
const SemuaDestinasiPage = lazy(() => import('../pages/semua-destinasi/SemuaDestinasiPage'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <BerandaPage />
          </Suspense>
        ),
      },
      {
        path: "rute/:destinationId",
        element: (
          <Suspense fallback={<PageFallback />}>
            <PetaRutePage />
          </Suspense>
        ),
      },
      {
        path: "destinasi/:id",
        element: (
          <Suspense fallback={<PageFallback />}>
            <DetailDestinasiPage />
          </Suspense>
        ),
      },
      {
        path: "rute-saya",
        element: (
          <Suspense fallback={<PageFallback />}>
            <RuteSayaPage />
          </Suspense>
        ),
      },
      {
        path: "kuliner",
        element: (
          <Suspense fallback={<PageFallback />}>
            <KulinerPage />
          </Suspense>
        ),
      },
      {
        path: "penginapan",
        element: (
          <Suspense fallback={<PageFallback />}>
            <PenginapanPage />
          </Suspense>
        ),
      },
      {
        path: "semua-destinasi",
        element: (
          <Suspense fallback={<PageFallback />}>
            <SemuaDestinasiPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      }
    ]
  },
]);
