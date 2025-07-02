'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { User } from '@/context/AuthContext';
import { formatCPF, formatCEP, formatPhone } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

// -------------------------------------------------------------------------- #
//                                SCHEMA DE VALIDAÇÃO (ZOD)                   #
// -------------------------------------------------------------------------- #
const profileSchema = z.object({
  full_name: z.string().min(3, 'Nome completo é obrigatório.').optional(),
  phone: z.string().min(10, 'Telefone inválido.').optional(),
  address_street: z.string().min(3, 'Endereço é obrigatório.').optional(),
  address_number: z.string().min(1, 'Número é obrigatório.').optional(),
  address_complement: z.string().optional().nullable(),
  address_zip: z.string().min(8, 'CEP inválido.').optional(),
  address_city: z.string().min(2, 'Cidade é obrigatória.').optional(),
  address_state: z.string().length(2, 'Use a sigla do estado (ex: SP).').optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// -------------------------------------------------------------------------- #
//                                TIPAGEM DO COMPONENTE                       #
// -------------------------------------------------------------------------- #
interface UserProfileFormProps {
  user: User;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading: boolean;
}

// -------------------------------------------------------------------------- #
//                            COMPONENTE DO FORMULÁRIO                       #
// -------------------------------------------------------------------------- #
export const UserProfileForm = ({ user, onSubmit, isLoading }: UserProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name || '',
      phone: user.phone || '',
      address_street: user.address_street || '',
      address_number: user.address_number || '',
      address_complement: user.address_complement || '',
      address_zip: user.address_zip || '',
      address_city: user.address_city || '',
      address_state: user.address_state || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h4 className="font-semibold text-lg border-b pb-2">Dados Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-1">
            <Label>Telefone</Label>
            <Input value={formatPhone(user.phone)} disabled className="bg-gray-100" />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={user.email} disabled className="bg-gray-100" />
        </div>
        <div className="space-y-1">
          <Label>CPF</Label>
          <Input value={formatCPF(user.cpf)} disabled className="bg-gray-100" />
        </div>

        <h4 className="font-semibold text-lg border-b pb-2 mt-6">Endereço</h4>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 sm:col-span-2">
            <div className="space-y-1">
              <Label>CEP</Label>
              <Input value={formatCEP(user.address_zip)} disabled className="bg-gray-100" />
            </div>
          </div>
          <div className="col-span-6 sm:col-span-4">
            <FormField
              control={form.control}
              name="address_street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua / Avenida</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <FormField
              control={form.control}
              name="address_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <FormField
              control={form.control}
              name="address_complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <FormField
              control={form.control}
              name="address_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 sm:col-span-2">
            <FormField
              control={form.control}
              name="address_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado (UF)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 pt-4 border-t">
          <strong>Atenção:</strong> Para alterar campos como CPF, CEP e Telefone, por favor, entre
          em contato com nosso suporte. Os campos editáveis aqui são apenas para Nome e Complemento
          de endereço.
        </p>

        <Button type="submit" disabled={isLoading} className="w-full mt-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </form>
    </Form>
  );
};
