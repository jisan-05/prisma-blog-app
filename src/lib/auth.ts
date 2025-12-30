import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import { request } from "node:http";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp:true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const htmlTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Verify Your Email</h1>
      </div>
      <div style="padding: 30px;">
        <p>Hello, ${user.name}</p>
        <p>Thank you for signing up for <strong>Prisma Blog</strong>! To get started, please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="font-size: 0.9em; color: #666;">This link will expire in 24 hours. If you did not create an account, no further action is required.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #999;">
          If the button above doesn't work, copy and paste this URL into your browser: <br />
          <a href="${verificationUrl}" style="color: #4f46e5;">${verificationUrl}</a>
        </p>
      </div>
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 0.8em; color: #999;">
        &copy; ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </div>
    </div>
  `;
      const info = await transporter.sendMail({
        from: '"Prisma Blog" <prismablog@ph.com>',
        to: user.email,
        subject: "Verify your email for Prisma Blog",
        text: `Please verify your email by clicking here: ${verificationUrl}`, // Plain-text fallback
        html: htmlTemplate,
      });

      console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log(error)
        throw error;
      }
    },
  },
});
