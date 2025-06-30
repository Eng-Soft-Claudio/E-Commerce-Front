"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// 1. Schema de validação
const formSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres."),
  // Permite string, ou opcional (undefined), ou nulo.
  description: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  onSubmit: (values: CategoryFormValues) => void;
  initialData?: Partial<CategoryFormValues>;
  isLoading: boolean;
}

export const CategoryForm = ({ onSubmit, initialData, isLoading }: CategoryFormProps) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { title: '', description: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Categoria</FormLabel>
              <FormControl>
                {/* Garante que o valor nunca seja null */}
                <Input placeholder="Nome" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                {/* CORREÇÃO: Se o valor for null, passa uma string vazia para o input */}
                <Input placeholder="Descrição (opcional)" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Salvando..." : "Salvar Categoria"}
        </Button>
      </form>
    </Form>
  );
};