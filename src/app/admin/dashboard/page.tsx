"use client";

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Cookies from 'js-cookie';
import { CreditCard, ShoppingBag, Users, Package, PieChart, Percent, BarChartHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// -------------------------------------------------------------------------- #
//                                TIPOS DE DADOS                              #
// -------------------------------------------------------------------------- #
interface FinancialSummary {
  total_sales: number;
  total_orders: number;
  average_ticket: number;
  total_discount: number;
}
interface SalesOverTimePoint { date: string; total_sales: number; }
interface PaymentStatusDist { [key: string]: number; }
interface CouponPerformance { code: string; times_used: number; total_discount: number; }

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const DashboardPage = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [salesChartData, setSalesChartData] = useState<SalesOverTimePoint[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<PaymentStatusDist>({});
  const [couponPerformance, setCouponPerformance] = useState<CouponPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      const token = Cookies.get('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [summaryRes, salesChartRes, statusRes, couponRes] = await Promise.all([
          fetch('http://localhost:8000/admin/dashboard/financial/summary', { headers }),
          fetch('http://localhost:8000/admin/dashboard/financial/sales-over-time?period=monthly', { headers }),
          fetch('http://localhost:8000/admin/dashboard/financial/payment-status', { headers }),
          fetch('http://localhost:8000/admin/dashboard/financial/coupon-performance', { headers })
        ]);

        if (!summaryRes.ok) throw new Error("Falha ao buscar resumo financeiro.");

        const summaryData = await summaryRes.json();
        const salesChartData = await salesChartRes.json();
        const statusData = await statusRes.json();
        const couponData = await couponRes.json();

        setSummary(summaryData);
        setSalesChartData(salesChartData);
        setStatusDistribution(statusData);
        setCouponPerformance(couponData);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  const paymentStatusChartData = useMemo(() => {
    const statusLabels: Record<string, string> = {
      pending_payment: 'Pendente',
      paid: 'Pago',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return Object.entries(statusDistribution)
      .map(([status, count]) => ({
        name: statusLabels[status] || status,
        value: count,
      }))
      .filter(item => item.value > 0); 
  }, [statusDistribution]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Financeiro</h1>

      {loading ? (
        <p>Carregando dados do dashboard...</p>
      ) : summary ? (
        <>
          {/* PAINEL DE MÉTRICAS PRINCIPAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={CreditCard} title="Vendas Totais (pagas)" value={`R$ ${summary.total_sales.toFixed(2).replace('.', ',')}`} color="green" />
            <StatCard icon={ShoppingBag} title="Total de Pedidos (pagos)" value={summary.total_orders} color="blue" />
            <StatCard icon={Users} title="Ticket Médio" value={`R$ ${summary.average_ticket.toFixed(2).replace('.', ',')}`} color="purple" />
            <StatCard icon={Percent} title="Total de Descontos" value={`R$ ${summary.total_discount.toFixed(2).replace('.', ',')}`} color="yellow" />
          </div>

          {/* GRÁFICOS */}
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vendas no Mês</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total_sales" name="Vendas" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Status de Pedidos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentStatusChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value: number) => [value, "Pedidos"]} />
                  <Bar dataKey="value" name="Total de Pedidos" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4 text-red-600">Não foi possível carregar as estatísticas financeiras.</p>
      )}
    </AdminLayout>
  );
};


// -------------------------------------------------------------------------- #
//                          SUBCOMPONENTE REUTILIZÁVEL                       #
// -------------------------------------------------------------------------- #
const StatCard = ({ icon: Icon, title, value, color = 'gray' }: { icon: React.ElementType; title: string; value: string | number, color: string }) => {
  const colorClasses: Record<string, string> = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default DashboardPage;