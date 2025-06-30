"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                                SCHEMA DE VALIDAÇÃO (ZOD)                   #
// -------------------------------------------------------------------------- #

const registerSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  full_name: z.string().min(3, { message: "Nome completo é obrigatório." }),
  cpf: z.string().min(11, { message: "CPF inválido." }), 
  phone: z.string().min(10, { message: "Telefone inválido." }),
  address_street: z.string().min(3, { message: "Endereço é obrigatório." }),
  address_number: z.string().min(1, { message: "Número é obrigatório." }),
  address_complement: z.string().optional(),
  address_zip: z.string().min(8, { message: "CEP inválido." }),
  address_city: z.string().min(2, { message: "Cidade é obrigatória." }),
  address_state: z.string().length(2, { message: "Use a sigla do estado (ex: SP)." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// -------------------------------------------------------------------------- #
//                          COMPONENTE DA PÁGINA                             #
// -------------------------------------------------------------------------- #
const RegisterPage = () => {
  const { register, loading, error } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      cpf: '',
      phone: '',
      address_street: '',
      address_number: '',
      address_complement: '',
      address_zip: '',
      address_city: '',
      address_state: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    register(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-2xl px-8 py-6 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800">Crie sua Conta</h3>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">Preencha todos os campos para continuar.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* --- SEÇÃO DE ACESSO --- */}
            <h4 className="font-semibold text-lg border-b pb-2 mb-4">Dados de Acesso</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="seu@email.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" placeholder="******" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {/* --- SEÇÃO DE DADOS PESSOAIS --- */}
            <h4 className="font-semibold text-lg border-b pb-2 mt-6 mb-4">Dados Pessoais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="full_name" render={({ field }) => (<FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Seu nome" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="cpf" render={({ field }) => (<FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {/* --- SEÇÃO DE ENDEREÇO --- */}
            <h4 className="font-semibold text-lg border-b pb-2 mt-6 mb-4">Endereço de Entrega</h4>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-2"><FormField control={form.control} name="address_zip" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input placeholder="00000-000" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
              <div className="col-span-6 sm:col-span-4"><FormField control={form.control} name="address_street" render={({ field }) => (<FormItem><FormLabel>Rua / Avenida</FormLabel><FormControl><Input placeholder="Nome da sua rua" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
              <div className="col-span-6 sm:col-span-2"><FormField control={form.control} name="address_number" render={({ field }) => (<FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
              <div className="col-span-6 sm:col-span-4"><FormField control={form.control} name="address_complement" render={({ field }) => (<FormItem><FormLabel>Complemento (opcional)</FormLabel><FormControl><Input placeholder="Apto, bloco, etc." {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
              <div className="col-span-6 sm:col-span-4"><FormField control={form.control} name="address_city" render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
              <div className="col-span-6 sm:col-span-2"><FormField control={form.control} name="address_state" render={({ field }) => (<FormItem><FormLabel>Estado (UF)</FormLabel><FormControl><Input placeholder="SP" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </div>

            {error && <p className="mt-4 text-sm font-semibold text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full mt-6">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</> : 'Criar minha conta'}
            </Button>
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm text-teal-600 hover:underline">
                Já tenho uma conta
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;