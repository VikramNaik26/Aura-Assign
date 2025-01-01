'use server'

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function updateProfile(formData: FormData, userId: string) {
  try {
    // Update user data with Cloudinary URL
    await db.user.update({
      where: { id: userId },
      data: {
        name: formData.get('name') as string,
        image: formData.get('image') as string, // Now stores Cloudinary URL
        email: formData.get('email') as string,
      }
    })

    await db.userProfile.update({
      where: { userId },
      data: {
        phoneNumber: formData.get('phoneNumber') as string,
        dateOfBirth: new Date(formData.get('dateOfBirth') as string),
        gender: formData.get('gender') as string,
        streetAddress: formData.get('streetAddress') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
      }
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile' }
  }
}
