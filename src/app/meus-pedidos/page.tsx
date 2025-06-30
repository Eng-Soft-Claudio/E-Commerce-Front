"use client";

import React, { useEffect, useState, useCallback } from 'react';
import UserAccountLayout from '@/components/user/UserAccountLayout';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Loader2, PackageSearch, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
// Reutilizamos as tipagens do painel de admin, mas em um projeto maior,
// poderíamos ter tipos específicos para a visão do cliente.

interface ProductInOrderItem {
    id: number;
    name: string;
}

interface OrderItem {
    quantity: number;
    price_at_purchase: number;
    product: ProductInOrderItem | null;
}

interface Order {
    id: number;
    created_at: string;
    total_price: number;
    status: string;
    items: OrderItem[];
    discount_amount: number;
    coupon_code_used: string | null;
}

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const MeusPedidosPage = () => {
    // --- HOOKS E ESTADOS ---
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- FUNÇÕES DE INTERAÇÃO COM A API ---
    const fetchOrders = useCallback(async () => {
        setPageLoading(true);
        setError(null);
        const token = Cookies.get('access_token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/orders/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Falha ao buscar pedidos.');
            }
            const data = await response.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setPageLoading(false);
        }
    }, [router]);

    useEffect(() => {
        // Só busca os pedidos quando a autenticação estiver resolvida e houver um usuário
        if (!authLoading && user) {
            fetchOrders();
        } else if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, fetchOrders, router]);

    // --- FUNÇÕES AUXILIARES DE RENDERIZAÇÃO ---
    const renderStatus = (status: string) => {
        const statusConfig: Record<string, { label: string, className: string }> = {
            paid: { label: "Pago", className: "bg-green-100 text-green-800 border-green-300" },
            pending_payment: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
            cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-300" },
            shipped: { label: "Enviado", className: "bg-blue-100 text-blue-800 border-blue-300" },
            delivered: { label: "Entregue", className: "bg-purple-100 text-purple-800 border-purple-300" },
        }
        const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };
        return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
    };

    // --- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ---
    if (authLoading || pageLoading) {
        return (
            <UserAccountLayout>
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </UserAccountLayout>
        );
    }

    // --- RENDERIZAÇÃO PRINCIPAL ---
    return (
        <UserAccountLayout>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                Meus Pedidos
            </h2>
            {error && <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">{error}</div>}

            {orders.length === 0 && !error ? (
                <div className="text-center py-10">
                    <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">Você ainda não fez nenhuma compra conosco.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">Pedido #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        Realizado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {renderStatus(order.status)}
                                    <p className="font-bold text-xl mt-1 font-mono">
                                        R$ {order.total_price.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Ver Detalhes</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                                        </DialogHeader>
                                        {/* Conteúdo do Modal com os detalhes */}
                                        <div className="mt-4">
                                            <Table>
                                                <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead className='text-center'>Qtd</TableHead><TableHead className="text-right">Preço</TableHead></TableRow></TableHeader>
                                                <TableBody>
                                                    {order.items.map((item, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell>{item.product?.name || "[Produto Removido]"}</TableCell>
                                                            <TableCell className='text-center'>{item.quantity}</TableCell>
                                                            <TableCell className="text-right font-mono">R$ {item.price_at_purchase.toFixed(2).replace('.', ',')}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <div className='mt-4 pt-4 border-t text-right space-y-1'>
                                                {order.coupon_code_used && <p className='text-sm'>Desconto ({order.coupon_code_used}): <span className='font-mono'>- R$ {order.discount_amount.toFixed(2).replace('.', ',')}</span></p>}
                                                <p className='font-bold text-lg'>Total: <span className='font-mono'>R$ {order.total_price.toFixed(2).replace('.', ',')}</span></p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </UserAccountLayout>
    );
};

export default MeusPedidosPage;