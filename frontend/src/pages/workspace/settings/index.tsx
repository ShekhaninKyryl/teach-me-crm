import { useEffect, useState } from "react";
import type { Tutor, TutorWithPassword } from "@shared/types/tutor";
import tutorsApi from "api/tutors";
import { useAuth } from "@/contexts/auth-context";
import { TutorEditForm } from "components/tutor-edit-form";
import { Loading } from "components/common/loading";

export const SettingsPage = () => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    tutorsApi.getTutorById(user?.id).then((tutor: Tutor) => {
      setTutor(tutor);
      setLoading(false);
    });
  }, [user?.id]);

  const handleSubmit = async (data: Partial<TutorWithPassword>) => {
    if (!tutor) return;
    try {
      setLoading(true);
      const updatedTutor = await tutorsApi.updateTutorProfile(tutor.id, data);
      setTutor(updatedTutor);
      setError(null);
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  if (!tutor || loading) {
    return <Loading size={20} />;
  }

  return <TutorEditForm tutorData={tutor} onSubmit={handleSubmit} />;
};
