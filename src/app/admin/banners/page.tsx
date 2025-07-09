/**
 * @file Página administrativa para gerenciamento de banners.
 * @description Permite que superusuários visualizem, criem, editem e deletem banners.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';

import AdminLayout from '@/components/admin/AdminLayout';
import { BannerForm, BannerFormValues } from '@/components/admin/BannerForm';
import { api } from '@/lib/api';
import { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

/**
 * Componente principal da página de gerenciamento de banners.
 */
const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Busca a lista de banners da API.
   */
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllBanners();
      setBanners(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao carregar banners.';
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  /**
   * Lida com a submissão do formulário para criar ou editar um banner.
   */
  const handleFormSubmit = async (values: BannerFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner.id, values);
      } else {
        await api.createBanner(values);
      }
      setIsDialogOpen(false);
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar.';
      alert(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Lida com a exclusão de um banner.
   */
  const handleDelete = async (bannerId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este banner?')) return;
    try {
      await api.deleteBanner(bannerId);
      await fetchBanners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar.';
      alert(`Erro: ${errorMessage}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-10 text-red-600">
          <p>
            <strong>Erro:</strong> {error}
          </p>
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">Ordem</TableHead>
            <TableHead className="w-[20%]">Imagem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="text-center">Ativo</TableHead>
            <TableHead className="w-[20%] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell className="font-medium text-center">{banner.position}</TableCell>
              <TableCell>
                <div className="relative h-16 w-32 bg-gray-100 rounded">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </TableCell>
              <TableCell className="truncate">{banner.title}</TableCell>
              <TableCell className="text-center">
                <Badge variant={banner.is_active ? 'secondary' : 'outline'}>
                  {banner.is_active ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3 text-green-500" /> Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3 text-red-500" /> Inativo
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingBanner(banner);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gerenciar Banners</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingBanner(null);
            setIsDialogOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={loading || !!error}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}</DialogTitle>
            </DialogHeader>
            <BannerForm
              onSubmit={handleFormSubmit}
              initialData={editingBanner || undefined}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">{renderContent()}</div>
    </AdminLayout>
  );
};

export default AdminBannersPage;
