import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two Factor Authentication",
    html: `<p>Your two factor authentication token is ${token}</p>`
  })
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `http://localhost:3000/user/new-password?token=${token}`

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
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
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your mail",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    })
  } catch (error) {
    return error
  }
}
