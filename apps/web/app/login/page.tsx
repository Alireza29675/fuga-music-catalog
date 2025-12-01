'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginForm } from './login.schema';
import * as S from './login.styles';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, ErrorText, ErrorBox } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <S.PageContainer>
      <S.StyledCard>
        <CardHeader>
          <CardTitle>Welcome to FUGA</CardTitle>
          <CardDescription>Sign in to manage the music catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@fuga.com" {...register('email')} disabled={isLoading} />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </FormField>

            <FormField>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} disabled={isLoading} />
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </FormField>

            {error && <ErrorBox>{error}</ErrorBox>}

            <S.FullWidthButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </S.FullWidthButton>
          </Form>
        </CardContent>
      </S.StyledCard>
    </S.PageContainer>
  );
}
