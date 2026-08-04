import React from 'react';
import { useNavigate } from 'react-router';
import EmptyState from '../../components/ui/EmptyState';
import { MapPinOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/layout/PageTransition';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <EmptyState 
        icon={MapPinOff}
        title="Halaman Tidak Ditemukan"
        description="Jejak yang Anda cari mungkin telah tertutup abu vulkanik atau pindah koordinat."
        action={
          <Button variant="primary" className="mt-4" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        }
      />
    </PageTransition>
  );
}
