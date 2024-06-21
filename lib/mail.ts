import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `http://localhost:3000/user/new-verification?token=${token}`

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
