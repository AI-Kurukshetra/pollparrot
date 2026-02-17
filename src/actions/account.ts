"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FormState, Profile } from "@/types";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100, "Name too long"),
});

const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Get current user's profile
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

// Update profile name
export async function updateProfile(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const rawData = {
    fullName: formData.get("fullName") as string,
  };

  const validationResult = updateProfileSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: validationResult.data.fullName })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }

  revalidatePath("/dashboard/account");
  return { success: true, message: "Profile updated successfully" };
}

// Upload avatar
export async function uploadAvatar(formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) {
    return { success: false, message: "No file provided" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "File must be an image" };
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, message: "File size must be less than 2MB" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    return { success: false, message: "Failed to upload avatar" };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // Update profile with avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating avatar URL:", updateError);
    return { success: false, message: "Failed to update avatar" };
  }

  revalidatePath("/dashboard/account");
  return { success: true, message: "Avatar uploaded successfully" };
}

// Delete avatar
export async function deleteAvatar(): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Get current avatar URL
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profile?.avatar_url) {
    // Extract file path from URL
    const url = new URL(profile.avatar_url);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(-2).join("/"); // avatars/filename.ext

    // Delete from storage
    await supabase.storage.from("avatars").remove([filePath]);
  }

  // Clear avatar URL in profile
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (error) {
    console.error("Error deleting avatar:", error);
    return { success: false, message: "Failed to delete avatar" };
  }

  revalidatePath("/dashboard/account");
  return { success: true, message: "Avatar deleted successfully" };
}

// Change password
export async function changePassword(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const rawData = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validationResult = changePasswordSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validationResult.data.newPassword,
  });

  if (error) {
    console.error("Error changing password:", error);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Password changed successfully" };
}

// Delete account
export async function deleteAccount(email: string): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Verify email matches
  if (user.email !== email) {
    return { success: false, message: "Email does not match your account" };
  }

  // Delete all user data (surveys, responses, answers cascade via FK)
  const { error: surveysError } = await supabase
    .from("surveys")
    .delete()
    .eq("user_id", user.id);

  if (surveysError) {
    console.error("Error deleting surveys:", surveysError);
    return { success: false, message: "Failed to delete account data" };
  }

  // Delete profile
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    console.error("Error deleting profile:", profileError);
    return { success: false, message: "Failed to delete profile" };
  }

  // Sign out
  await supabase.auth.signOut();

  redirect("/");
}
