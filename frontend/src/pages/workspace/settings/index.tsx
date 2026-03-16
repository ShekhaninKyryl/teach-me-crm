import { useEffect, useState } from "react";
import type { Tutor, TutorWithPassword } from "@shared/types/tutor";
import tutorsApi from "api/tutors";
import { useAuth } from "@/contexts/auth-context";
import { TutorEditForm, type TutorFormSubmitData } from "components/tutor-edit-form";
import { Loading } from "components/common/loading";
import { toAvatarPresignPayload, uploadAvatarToPresignedUrl } from "@/lib/avatar-upload";
import { _ } from "@/translates";

export const SettingsPage = () => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (!user) {
      setError(_("User not authenticated"));
      setLoading(false);
      return;
    }

    tutorsApi.getTutorById(user?.id).then((tutor: Tutor) => {
      setTutor(tutor);
      setLoading(false);
    });
  }, [user?.id]);

  const handleSubmit = async (data: TutorFormSubmitData) => {
    if (!tutor) return;
    try {
      setLoading(true);

      const {
        avatarFile,
        passwordConfirmation: _passwordConfirmation,
        password,
        currentPassword,
        ...payload
      } = data;
      const updatePayload: Partial<TutorWithPassword> = { ...payload };

      if (password) {
        updatePayload.password = password;
        updatePayload.currentPassword = currentPassword;
      }

      if (avatarFile) {
        const presign = await tutorsApi.createAvatarUploadUrl(
          tutor.id,
          toAvatarPresignPayload(avatarFile)
        );
        await uploadAvatarToPresignedUrl(presign, avatarFile);
        updatePayload.avatar = presign.avatarUrl;
      }

      const updatedTutor = await tutorsApi.updateTutorProfile(tutor.id, updatePayload);
      setTutor(updatedTutor);
      await refreshUser();
      setError(null);
    } catch {
      setError(_("Failed to update profile"));
    } finally {
      setLoading(false);
    }
  };

  if (!tutor || loading) {
    return <Loading size={20} />;
  }

  return <TutorEditForm tutorData={tutor} onSubmit={handleSubmit} />;
};
