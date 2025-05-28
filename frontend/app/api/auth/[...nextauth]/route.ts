import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    // Provider de teste para desenvolvimento
    ...(process.env.NODE_ENV === 'development' ? [
      CredentialsProvider({
        id: 'demo',
        name: 'Demo User',
        credentials: {
          email: { label: 'Email', type: 'email', placeholder: 'demo@drivetube.com' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          // Usuário demo para testes
          if (credentials?.email === 'demo@drivetube.com' && credentials?.password === 'demo123') {
            return {
              id: 'demo-user-id',
              name: 'Usuário Demo',
              email: 'demo@drivetube.com',
              image: 'https://via.placeholder.com/150'
            }
          }
          return null
        }
      })
    ] : [])
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        // Se for usuário demo, definir permissões especiais
        if (user?.email === 'demo@drivetube.com') {
          token.isAdmin = true;
          token.hasActiveSubscription = true;
          token.isApprovedWaitlist = true;
          token.planId = 'demo-plan';
          token.plan = { name: 'Demo Plan', features: ['Acesso total'] };
          return token;
        }

        // Fetch user subscription status from our API
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${account.access_token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            token.isAdmin = data.user.isAdmin || false;
            token.hasActiveSubscription = data.user.hasActiveSubscription || false;
            token.planId = data.user.planId;
            token.plan = data.user.plan;

            // Check if user is in approved waitlist
            const waitlistResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/waitlist/status?email=${encodeURIComponent(user.email)}`,
              { method: 'GET' }
            );

            if (waitlistResponse.ok) {
              const waitlistData = await waitlistResponse.json();
              token.isApprovedWaitlist = waitlistData.status === 'approved';
            }
          }
        } catch (error) {
          console.error('Error fetching user subscription status:', error);
          // Para usuários não-demo, definir valores padrão em caso de erro
          if (user?.email !== 'demo@drivetube.com') {
            token.isAdmin = false;
            token.hasActiveSubscription = false;
            token.isApprovedWaitlist = false;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.isAdmin = token.isAdmin;
      session.user.hasActiveSubscription = token.hasActiveSubscription;
      session.user.planId = token.planId;
      session.user.plan = token.plan;
      session.user.isApprovedWaitlist = token.isApprovedWaitlist;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };