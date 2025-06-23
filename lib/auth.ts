import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { emailOTP } from 'better-auth/plugins'

import prisma from './prisma'
import { resend } from './resend'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: `Questões ENEM <${process.env.RESEND_DOMAIN}>`,
          to: email,
          subject: 'Questões ENEM - Verificação de email',
          html: `<p>Seu código é <strong>${otp}</strong></p>`,
        })
      },
    }),
  ],
})
