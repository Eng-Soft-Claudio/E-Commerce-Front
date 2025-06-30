"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// -------------------------------------------------------------------------- #
//                                SCHEMA DE VALIDAÇÃO (ZOD)                   #
// -------------------------------------------------------------------------- #

const passwordSchema = z.object({
    current_password: z.string().min(1, { message: "A senha atual é obrigatória." }),
    new_password: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
    confirm_password: z.string()
}).refine(data => data.new_password === data.confirm_password, {
    message: "As novas senhas não coincidem.",
    path: ["confirm_password"], 
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// -------------------------------------------------------------------------- #
//                                TIPAGEM DO COMPONENTE                       #
// -------------------------------------------------------------------------- #

interface ChangePasswordFormProps {
    onSubmit: (data: PasswordFormValues) => void;
    isLoading: boolean;
}

// -------------------------------------------------------------------------- #
//                            COMPONENTE DO FORMULÁRIO                       #
// -------------------------------------------------------------------------- #
export const ChangePasswordForm = ({ onSubmit, isLoading }: ChangePasswordFormProps) => {
    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="current_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl><Input type="password" placeholder="Sua senha atual" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirme a Nova Senha</FormLabel>
                            <FormControl><Input type="password" placeholder="Repita a nova senha" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full mt-6">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</> : 'Alterar Senha'}
                </Button>
            </form>
        </Form>
    )
};