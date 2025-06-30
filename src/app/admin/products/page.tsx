"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Product } from '@/types';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Loader2, PackageSearch } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface Category { id: number; title: string; }

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const AdminProductsPage = () => {
  // --- ESTADOS DO COMPONENTE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FUNÇÕES DE INTERAÇÃO COM A API ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:8000/products/'),
        fetch('http://localhost:8000/categories/')
      ]);
      if (!productsRes.ok || !categoriesRes.ok) throw new Error("Falha ao buscar dados iniciais.");

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Erro em fetchData (produtos):", err);
      setError(err.message);
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
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `http://localhost:8000/products/${editingProduct.id}`
      : 'http://localhost:8000/products/';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Falha ao salvar produto.");
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      await fetchData();
    } catch (error: any) {
      console.error(error);
      alert(`Erro ao salvar produto: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.")) return;

    const token = Cookies.get('access_token');
    try {
      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao deletar produto.");
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar produto.");
    }
  };


  // --- RENDERIZAÇÃO DA UI ---
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditingProduct(null); setIsDialogOpen(isOpen); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            </DialogHeader>
            {/* O formulário agora recebe e preenche todos os campos, incluindo os de logística */}
            <ProductForm
              onSubmit={handleFormSubmit}
              initialData={editingProduct || undefined}
              categories={categories}
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
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo produto.</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[10%]">ID</TableHead>
                <TableHead className="w-[30%]">Nome</TableHead>
                <TableHead className="w-[15%]">Categoria</TableHead>
                <TableHead className="w-[10%] text-center">Estoque</TableHead>
                <TableHead className="w-[15%] text-right">Preço</TableHead>
                <TableHead className="w-[20%] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell className="truncate">{product.name}</TableCell>
                  <TableCell className="truncate">{product.category.title}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-right font-mono">R$ {product.price.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
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

export default AdminProductsPage;