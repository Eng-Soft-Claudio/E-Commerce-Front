"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Loader2, CreditCard, Ticket, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';

// -------------------------------------------------------------------------- #
//                             COMPONENTE DA PÁGINA                            #
// -------------------------------------------------------------------------- #
const CartPage = () => {
  // --- ESTADOS E HOOKS ---
  const { user, cart, fetchCart, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const couponInputRef = useRef<HTMLInputElement>(null);

  // --- EFEITO PARA BUSCA DE DADOS INICIAIS ---
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // --- FUNÇÕES DE INTERAÇÃO COM A API ---

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      if (window.confirm("Tem certeza que deseja remover este item do carrinho?")) {
        await handleRemoveItem(productId);
      }
      return;
    }
    const token = Cookies.get('access_token');
    await fetch(`http://localhost:8000/cart/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ quantity: newQuantity })
    });
    await fetchCart();
  };

  const handleRemoveItem = async (productId: number) => {
    const token = Cookies.get('access_token');
    await fetch(`http://localhost:8000/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await fetchCart();
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    setIsCouponLoading(true);
    setError(null);
    const token = Cookies.get('access_token');
    try {
      const response = await fetch(`http://localhost:8000/cart/apply-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: couponCode })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail);
      }
      setCouponCode('');
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCouponLoading(false);
    }
  }

  const handleRemoveCoupon = async () => {
    setIsCouponLoading(true);
    setError(null);
    const token = Cookies.get('access_token');
    try {
      await fetch(`http://localhost:8000/cart/apply-coupon`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCouponLoading(false);
    }
  }

  const handleCheckout = async () => {
    setIsUpdating(true);
    setError(null);
    const token = Cookies.get('access_token');
    if (!token) { router.push('/login'); return; }

    try {
      const orderResponse = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!orderResponse.ok) {
        const err = await orderResponse.json();
        throw new Error(err.detail || "Não foi possível criar o pedido.");
      }

      const orderData = await orderResponse.json();
      const stripeResponse = await fetch(`http://localhost:8000/payments/create-checkout-session/${orderData.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!stripeResponse.ok) throw new Error("Não foi possível iniciar o pagamento.");

      const stripeData = await stripeResponse.json();
      window.location.href = stripeData.checkout_url;

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio.</h1>
        <Link href="/" className="text-white bg-black hover:bg-gray-800 font-semibold py-3 px-6 rounded-lg mt-6 inline-block">
          Continue Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Seu Carrinho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <ul className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.product.image_url && <Image src={item.product.image_url} alt={item.product.name} fill style={{ objectFit: 'cover' }} />}
                </div>
                <div className="flex-grow">
                  <Link href={`/product/${item.product.id}`} className="font-semibold text-gray-800 hover:underline">{item.product.name}</Link>
                  <p className="text-sm text-gray-500 font-mono">R$ {item.product.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200"><Minus size={16} /></button>
                  <span className="w-10 text-center font-semibold text-gray-800">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-full text-gray-600 hover:bg-gray-200"><Plus size={16} /></button>
                </div>
                <p className="font-semibold w-24 text-right text-gray-800 font-mono">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
                <button onClick={() => handleRemoveItem(item.product.id)} className="ml-4 text-gray-400 hover:text-red-500"><X size={20} /></button>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28 space-y-4">
              <h2 className="text-xl font-bold border-b pb-4 text-gray-900">Resumo</h2>

              {/* Cupom de Desconto */}
              <div>
                {!cart.coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      ref={couponInputRef}
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Código do Cupom"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <button type="submit" className="bg-gray-200 text-gray-800 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center" disabled={isCouponLoading}>
                      {isCouponLoading ? <Loader2 className='animate-spin h-5 w-5' /> : <Ticket size={20} />}
                    </button>
                  </form>
                ) : (
                  <div className='flex justify-between items-center bg-green-100 text-green-800 p-2 rounded-md'>
                    <p className='text-sm font-semibold'>Cupom aplicado: <span className='font-mono'>{cart.coupon.code}</span></p>
                    <button onClick={handleRemoveCoupon} disabled={isCouponLoading}>
                      {isCouponLoading ? <Loader2 className='animate-spin h-4 w-4' /> : <Trash2 className='h-4 w-4' />}
                    </button>
                  </div>
                )}
                {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <p>Subtotal</p>
                  <p className='font-mono'>R$ {cart.subtotal.toFixed(2).replace('.', ',')}</p>
                </div>
                {cart.discount_amount > 0 &&
                  <div className="flex justify-between text-green-600">
                    <p>Desconto ({cart.coupon?.code})</p>
                    <p className='font-mono'>- R$ {cart.discount_amount.toFixed(2).replace('.', ',')}</p>
                  </div>
                }
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
                  <p>Total</p>
                  <p className='font-mono'>R$ {cart.final_price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isUpdating}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 flex items-center justify-center disabled:bg-gray-500"
              >
                {isUpdating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                {isUpdating ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;