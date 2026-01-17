import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Supabase configurado automaticamente pelo Figma Make
const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Tipos de usuário do SysConecta
export type UserRole = 'vidraceiro' | 'fornecedor' | 'santa-rita' | 'producao';

// Interface de perfil de usuário
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  nome: string;
  empresa?: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  created_at: string;
}

// Função para criar perfil de usuário após signup
export async function createUserProfile(userId: string, profileData: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }

  return data;
}

// Função para buscar perfil de usuário
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  return data as UserProfile;
}

// Função para salvar na lista de espera
export async function saveToWaitlist(waitlistData: {
  nome: string;
  empresa?: string;
  telefone: string;
  email: string;
  segmento?: string;
  mensagem?: string;
}) {
  const { data, error } = await supabase
    .from('waitlist')
    .insert([
      {
        ...waitlistData,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Erro ao salvar na lista de espera:', error);
    throw error;
  }

  return data;
}

// Função para signup com email
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

// Função para login com email
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Função para login social (Google, Apple, etc)
export async function signInWithProvider(provider: 'google' | 'apple' | 'instagram') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

// Função para recuperar senha
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Função para logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Função para pegar sessão atual
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

// Listener de mudanças de autenticação
export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
