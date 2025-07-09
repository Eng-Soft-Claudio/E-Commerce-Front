/**
 * @file Formulário reutilizável para criar e editar banners.
 * @description Utiliza react-hook-form e Zod para validação.
 */

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Banner } from '@/types';

/**
 * Schema de validação Zod para os dados do formulário do banner.
 * Esta versão é mais estrita e segura.
 */
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  image_url: z
    .string()
    .min(1, { message: 'A URL da imagem é obrigatória.' })
    .url({ message: 'Por favor, insira uma URL válida.' }),
  link_url: z.string().url().or(z.literal('')).nullable(),
  position: z.coerce.number().int().nonnegative({ message: 'A posição não pode ser negativa.' }),
  is_active: z.boolean(),
});

export type BannerFormValues = z.infer<typeof formSchema>;

interface BannerFormProps {
  onSubmit: (values: BannerFormValues) => void;
  initialData?: Partial<Banner>;
  isLoading: boolean;
}

/**
 * Valores padrão para o formulário, garantindo a conformidade com o schema.
 */
const defaultFormValues: BannerFormValues = {
  title: '',
  image_url: '',
  link_url: '',
  position: 0,
  is_active: true,
};

/**
 * Componente do formulário de banner, para criação ou edição.
 */
export const BannerForm = ({ onSubmit, initialData, isLoading }: BannerFormProps) => {
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultFormValues,
      ...initialData,
    },
  });

  /**
   * Reseta o formulário quando initialData muda, populando os campos corretamente.
   * Isso é crucial ao alternar entre criar um novo e editar um existente.
   */
  useEffect(() => {
    const valuesToReset = initialData
      ? { ...defaultFormValues, ...initialData }
      : defaultFormValues;
    form.reset(valuesToReset);
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <fieldset disabled={isLoading} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título (para Alt Text)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Promoção de Dia dos Pais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input placeholder="https://servidor.com/imagem.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de Destino (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="/category/123 ou https://externo.com"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center space-x-2 pt-2">
                    <FormControl>
                      <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor={field.name} className="font-normal">
                      {field.value ? 'Ativo' : 'Inativo'}
                    </Label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Banner'
          )}
        </Button>
      </form>
    </Form>
  );
};
