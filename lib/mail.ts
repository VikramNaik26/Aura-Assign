'use server'

import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import Mail from "nodemailer/lib/mailer"
import { Status, User } from "@prisma/client"
import { OrgEvent } from "@/actions/event"
import { format } from "date-fns"
import { ExtendedUserWithProfile } from "@/actions/enrollment"

const transporter = nodemailer.createTransport({
  port: process.env.MAILTRAP_PORT,
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

const getStatusMessage = (status: Status, eventName: string) => {
  switch (status) {
    case "APPROVED":
      return `We're excited to inform you that your enrollment for "${eventName}" has been approved!`;
    case "REJECTED":
      return `We regret to inform you that your enrollment for "${eventName}" could not be approved at this time.`;
    default:
      return "";
  }
};

const getEventDetailsHTML = (event: OrgEvent) => {
  const dateStr = format(new Date(event.date), "MMMM dd, yyyy");
  const timeStr = format(new Date(event.time), "hh:mm a");
  const location = event.location
    ? `<p>📍 Location: ${event.location.address}</p>`
    : "";

  return `
    <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0;">Event Details:</h3>
      <p>🎯 Event: ${event.name}</p>
      ${event.description ? `<p>📝 Description: ${event.description}</p>` : ""}
      <p>📅 Date: ${dateStr}</p>
      <p>⏰ Time: ${timeStr}</p>
      ${location}
    </div>
  `;
};

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, recipient, subject, message } = dto
  await transporter.sendMail({
    from: sender,
    to: recipient,
    subject,
    html: message
  })
}

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
  const resetLink = `https://aura-assign.vercel.app/user/new-password?token=${token}`
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
    ? `https://aura-assign.vercel.app/org/new-verification?token=${token}`
    : `https://aura-assign.vercel.app/user/new-verification?token=${token}`
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
      subject: "Confirm your email",
      message: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    })
  } catch (error) {
    return error
  }
}

export const sendEnrollmentStatusMail = async (
  status: Status,
  enrolledEvent: OrgEvent,
  user: ExtendedUserWithProfile
) => {
  if (!user.name || !user.email) {
    return
  }

  const statusMessage = getStatusMessage(status, enrolledEvent.name);
  const eventDetails = getEventDetailsHTML(enrolledEvent);

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${user.name},</h2>
      
      <p style="font-size: 16px; color: #555;">
        ${statusMessage}
      </p>

      ${eventDetails}
      
      ${status === "APPROVED" ? `
        <div style="margin-top: 20px;">
          <p>Please make sure to:</p>
          <ul>
            <li>Arrive 15 minutes before the event starts</li>
            <li>Bring any required identification</li>
            <li>Save this email for your reference</li>
          </ul>
        </div>

        <p>If you have any questions or need to make changes, please don't hesitate to contact us.</p>
      ` : `
        <p>We understand this may be disappointing. Here are a few possible reasons for non-approval:</p>
        <ul>
          <li>Event capacity reached</li>
          <li>Eligibility criteria not met</li>
          <li>Missing required information</li>
        </ul>

        <p>Feel free to apply for future events or contact us if you have any questions.</p>
      `}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 14px;">
          Best regards,<br>
          Aura Assign Team
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      sender: {
        name: "Aura Assign",
        address: "aura.assign@gmail.com"
      },
      recipient: [{
        name: user.name,
        address: user.email
      }],
      subject: `Event Enrollment ${status === "APPROVED" ? "Approved" : "Update"} - ${enrolledEvent.name}`,
      message: emailTemplate
    })
  } catch (error) {
    return error
  }
}

export const sendEventCancellationEmail = async (
  event: OrgEvent,
  user: ExtendedUserWithProfile
) => {
  if (!user.name || !user.email) {
    return;
  }

  const dateStr = format(new Date(event.date), "MMMM dd, yyyy");
  const timeStr = format(new Date(event.time), "hh:mm a");

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Hello ${user.name},</h2>
      
      <p style="font-size: 16px; color: #555;">
        We regret to inform you that the following event has been cancelled:
      </p>

      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0;">Event Details:</h3>
        <p>🎯 Event: ${event.name}</p>
        ${event.description ? `<p>📝 Description: ${event.description}</p>` : ""}
        <p>📅 Originally Scheduled Date: ${dateStr}</p>
        <p>⏰ Originally Scheduled Time: ${timeStr}</p>
        ${event.location ? `<p>📍 Location: ${event.location.address}</p>` : ""}
      </div>

      <p>We apologize for any inconvenience this may cause. If you have any questions or concerns, please don't hesitate to contact us.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #777; font-size: 14px;">
          Best regards,<br>
          Aura Assign Team
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      sender: {
        name: "Aura Assign",
        address: "aura.assign@gmail.com"
      },
      recipient: [{
        name: user.name,
        address: user.email
      }],
      subject: `Event Cancelled - ${event.name}`,
      message: emailTemplate
    });
  } catch (error) {
    return error;
  }
};
