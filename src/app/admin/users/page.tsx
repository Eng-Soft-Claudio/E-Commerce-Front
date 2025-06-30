"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, Trash2, CheckCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch'; // Novo componente da UI

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface ClientUser {
  id: number;
  email: string;
  full_name: string; // Adicionado
  is_active: boolean; // Adicionado
  is_superuser: boolean;
  orders: { id: number }[]; // Simplificado, só precisamos da contagem
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const AdminUsersPage = () => {
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE DADOS ---
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('access_token');
      const response = await fetch('http://localhost:8000/admin/users/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`Falha ao buscar usuários: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (user: ClientUser) => {
    const token = Cookies.get('access_token');
    // Inverte o estado atual
    const newStatus = !user.is_active;

    try {
      const response = await fetch(`http://localhost:8000/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status do usuário.");
      }
      // Atualiza a lista de usuários para refletir a mudança instantaneamente
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
    } catch (error) {
      alert("Erro ao alterar o status do usuário.");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Tem certeza que deseja DELETAR PERMANENTEMENTE o usuário com ID ${userId}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    const token = Cookies.get('access_token');
    try {
      const response = await fetch(`http://localhost:8000/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Falha ao deletar usuário.");
      }

      alert(data.message); // Exibe a mensagem de sucesso da API
      fetchUsers(); // Recarrega a lista de usuários
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
      console.error(error);
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Clientes</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading ? (<div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>)
          : error ? (<div className="text-red-500 p-10 text-center">{error}</div>)
            : (
              users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Users className="h-12 w-12 text-gray-400 mb-3" />
                  <h2 className="text-xl font-semibold">Nenhum cliente encontrado</h2>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className='text-center'>Pedidos</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className={!user.is_active ? 'bg-red-50' : ''}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className='text-center'>{user.orders?.length || 0}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Switch
                              checked={user.is_active}
                              onCheckedChange={() => handleToggleActive(user)}
                              aria-readonly
                            />
                            <Badge variant={user.is_active ? "secondary" : "destructive"}>
                              {user.is_active ?
                                <><CheckCircle className="h-3 w-3 mr-1" /> Ativo</> :
                                <><Ban className="h-3 w-3 mr-1" />Inativo</>
                              }
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          {/* Botão de Edição - Futura implementação do modal */}
                          {/* <Button variant="outline" size="sm"> <Pencil className="h-4 w-4" /> </Button> */}
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;