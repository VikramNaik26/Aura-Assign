import { Resend } from "resend"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import Mail from "nodemailer/lib/mailer"

const transporter = nodemailer.createTransport({
  // host: process.env.MAILTRAP_HOST,
  // port: Number(process.env.MAILTRAP_PORT),
  // secure: process.env.NODE_ENV !== "development",
  port: 465, 
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
} as SMTPTransport.Options)

type SendEmailDto = {
  sender: Mail.Address,
  recipient: Mail.Address[],
  subject: string,
  message: string
}

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, recipient, subject, message } = dto
  await transporter.sendMail({
    from: sender,
    to: recipient,
    subject,
    html: message
  })
}

// const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await sendEmail({
    sender: {
      name: "Aura Assign",
      address: "aura.assign@gmail.com"
    },
    recipient: [{
      name: email.split("@")[0],
      address: email
    }],
    subject: "Two Factor Authentication",
    message: `<p>Your two factor authentication token is ${token}</p>`
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `http://localhost:3000/user/new-password?token=${token}`

  try {
    await sendEmail({
      sender: {
        name: "Aura Assign",
        address: "aura.assign@gmail.com"
      },
      recipient: [{
        name: email.split("@")[0],
        address: email
      }],
      subject: "Reset your password",
      message: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })
  } catch (error) {
    return error
  }
}

export const sendVerificationEmail = async (
  email: string,
  token: string,
  isOrg?: boolean
) => {
  const confirmLink = isOrg
    ? `http://localhost:3000/org/new-verification?token=${token}`
    : `http://localhost:3000/user/new-verification?token=${token}`

  try {
    /* await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your mail",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    }) */

    await sendEmail({
      sender: {
        name: "Aura Assign",
        address: "aura.assign@gmail.com"
      },
      recipient: [{
        name: email.split("@")[0],
        address: email
      }],
      subject: "Confirm your email",
      message: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    })
  } catch (error) {
    return error
  }
}
