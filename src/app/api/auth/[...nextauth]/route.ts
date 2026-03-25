import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Microsoft 365 / Active Directory Integration
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "mock-secret",
      tenantId: process.env.AZURE_AD_TENANT_ID || "mock-tenant",
    }),
    
    // Fallback Credentials for MVP testing without AD environment variables
    CredentialsProvider({
      name: "Mock Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "admin" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Admin User", email: "admin@vms.local" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" }
});

export { handler as GET, handler as POST };
