"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';

const PaymentSuccessPage = () => {
  // O hook useSearchParams é usado para ler parâmetros da URL (ex: ?session_id=...)
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Um efeito simples para simular uma verificação
  useEffect(() => {
    if (!sessionId) {
      setError("ID da sessão de pagamento não encontrado.");
    }
    // Uma aplicação real poderia enviar o sessionId para o backend para verificação
    console.log("Verificando sessão de pagamento:", sessionId);
    
    // Simula um pequeno atraso para dar a impressão de processamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado

  }, [sessionId]);

  
  // Renderização condicional com base no estado
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
            <h1 className="text-2xl font-bold">Verificando seu pagamento...</h1>
        </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;
  }
  
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-900">
            Pagamento Aprovado!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado. Você receberá uma confirmação por e-mail em breve.
          </p>
          <div className="mt-10">
            {/* 
              Você pode adicionar aqui um resumo do pedido se quiser fazer
              uma chamada à API para buscar os detalhes do pedido usando
              o sessionId ou um ID de pedido salvo anteriormente.
            */}
          </div>
          <div className="mt-8">
            <Link 
              href="/" 
              className="text-white bg-black hover:bg-gray-800 font-semibold py-3 px-8 rounded-lg inline-block transition-transform transform hover:scale-105"
            >
              Voltar para a Loja
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            ID da Sessão: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;