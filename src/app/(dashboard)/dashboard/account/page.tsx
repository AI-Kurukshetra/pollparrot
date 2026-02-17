"use client";

import { useState, useEffect, useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Trash2, Lock, AlertTriangle, Check, Shield } from "lucide-react";
import { Button, Card, Input, Spinner, Badge } from "@/components/ui";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  deleteAccount,
} from "@/actions/account";
import type { Profile, FormState } from "@/types";

const PLAN_FEATURES = {
  free: [
    "Up to 3 surveys",
    "100 responses per survey",
    "Basic analytics",
    "Email support",
  ],
  pro: [
    "Unlimited surveys",
    "Unlimited responses",
    "Advanced analytics",
    "Priority support",
    "Custom branding",
    "Export to CSV/Excel",
  ],
  enterprise: [
    "Everything in Pro",
    "SSO integration",
    "Dedicated support",
    "Custom integrations",
    "SLA guarantee",
  ],
};

const PLAN_COLORS = {
  free: "draft",
  pro: "active",
  enterprise: "success",
} as const;

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, null);

  useEffect(() => {
    const load = async () => {
      const data = await getProfile();
      setProfile(data);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (profileState?.success) {
      setFeedback({ type: "success", message: profileState.message || "Profile updated" });
      // Reload profile
      getProfile().then(setProfile);
    } else if (profileState?.message) {
      setFeedback({ type: "error", message: profileState.message });
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.success) {
      setFeedback({ type: "success", message: passwordState.message || "Password changed" });
    } else if (passwordState?.message) {
      setFeedback({ type: "error", message: passwordState.message });
    }
  }, [passwordState]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    if (result.success) {
      setFeedback({ type: "success", message: result.message || "Avatar uploaded" });
      const updated = await getProfile();
      setProfile(updated);
    } else {
      setFeedback({ type: "error", message: result.message || "Upload failed" });
    }
    setIsUploadingAvatar(false);
  };

  const handleDeleteAvatar = async () => {
    setIsDeletingAvatar(true);
    const result = await deleteAvatar();
    if (result.success) {
      setFeedback({ type: "success", message: result.message || "Avatar deleted" });
      const updated = await getProfile();
      setProfile(updated);
    } else {
      setFeedback({ type: "error", message: result.message || "Delete failed" });
    }
    setIsDeletingAvatar(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    const result = await deleteAccount(deleteConfirmEmail);
    if (!result.success) {
      setFeedback({ type: "error", message: result.message || "Delete failed" });
      setIsDeletingAccount(false);
    }
    // If successful, user is redirected
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const planType = (profile?.plan || "free") as keyof typeof PLAN_FEATURES;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Account Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile and account preferences.</p>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-success text-white"
              : "bg-error text-white"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Profile Information */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Profile Information</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-background-light flex items-center justify-center overflow-hidden border-2 border-border">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-text-muted" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <Spinner size="sm" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            {profile?.avatar_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAvatar}
                isLoading={isDeletingAvatar}
                className="text-text-muted hover:text-error"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {/* Profile Form */}
          <form action={profileAction} className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Full Name
              </label>
              <Input
                name="fullName"
                defaultValue={profile?.full_name || ""}
                placeholder="Your name"
              />
              {profileState?.errors?.fullName && (
                <p className="text-sm text-error mt-1">{profileState.errors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email Address
              </label>
              <Input
                value={profile?.id ? `User ID: ${profile.id.slice(0, 8)}...` : ""}
                disabled
                className="bg-background-light"
              />
              <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
            </div>

            <Button type="submit" isLoading={profilePending}>
              Save Changes
            </Button>
          </form>
        </div>
      </Card>

      {/* Current Plan */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Current Plan</h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant={PLAN_COLORS[planType] as "draft" | "active" | "success"} size="lg">
              {planType.charAt(0).toUpperCase() + planType.slice(1)}
            </Badge>
            <span className="text-text-muted">
              {profile?.survey_count || 0} surveys created
            </span>
          </div>
          {planType === "free" && (
            <Button variant="outline" onClick={() => router.push("/pricing")}>
              Upgrade
            </Button>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-text-primary mb-2">Plan Features</h4>
          <ul className="space-y-2">
            {PLAN_FEATURES[planType]?.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                <Check className="h-4 w-4 text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Change Password */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Change Password</h2>
        </div>

        <form action={passwordAction} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              New Password
            </label>
            <Input
              name="newPassword"
              type="password"
              placeholder="Min. 8 characters"
            />
            {passwordState?.errors?.newPassword && (
              <p className="text-sm text-error mt-1">{passwordState.errors.newPassword[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Confirm New Password
            </label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />
            {passwordState?.errors?.confirmPassword && (
              <p className="text-sm text-error mt-1">{passwordState.errors.confirmPassword[0]}</p>
            )}
          </div>

          <Button type="submit" isLoading={passwordPending}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg" className="border-error/50">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-5 w-5 text-error" />
          <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
        </div>

        <p className="text-text-muted mb-4">
          Once you delete your account, there is no going back. All your surveys, responses, and data will be permanently deleted.
        </p>

        <Button
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card padding="lg" className="max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-error" />
              <h3 className="text-lg font-semibold text-text-primary">Delete Account</h3>
            </div>

            <p className="text-text-muted mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Type your email to confirm
              </label>
              <Input
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDeleteAccount}
                isLoading={isDeletingAccount}
                disabled={!deleteConfirmEmail}
              >
                Delete Forever
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
