"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { CategoryForm } from '@/components/admin/CategoryForm';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface Category {
  id: number;
  title: string;
  description?: string | null;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const AdminCategoriesPage = () => {
  // --- ESTADOS DO COMPONENTE ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FUNÇÕES DE INTERAÇÃO COM A API ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/categories/');
      if (!response.ok) {
        throw new Error(`Falha ao buscar categorias: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erro em fetchData (categorias):", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    const token = Cookies.get('access_token');
    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory 
      ? `http://localhost:8000/categories/${editingCategory.id}` 
      : 'http://localhost:8000/categories/';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error("Falha ao salvar categoria.");
      
      setIsDialogOpen(false);
      setEditingCategory(null);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar categoria.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta categoria? Todos os produtos associados também podem ser afetados.")) return;
    
    const token = Cookies.get('access_token');
    try {
      const response = await fetch(`http://localhost:8000/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao deletar categoria.");
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar categoria.");
    }
  };

  // --- RENDERIZAÇÃO DA UI ---
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditingCategory(null); setIsDialogOpen(isOpen); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              onSubmit={handleFormSubmit} 
              initialData={editingCategory || undefined}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <Table className="min-w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[30%]">Título</TableHead>
                <TableHead className="w-[40%]">Descrição</TableHead>
                <TableHead className="w-[20%] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell className="truncate">{category.title}</TableCell>
                  <TableCell className="truncate">{category.description || 'N/A'}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingCategory(category); setIsDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;