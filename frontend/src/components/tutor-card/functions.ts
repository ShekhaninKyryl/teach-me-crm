import type { Tutor } from "@shared/types/tutor";
import { _ } from "@/translates";

export const isValidTutorProfile = (profile: Partial<Tutor>): boolean => {
  return Boolean(profile.name) && Array.isArray(profile.subjects) && Boolean(profile.format);
};

export const getTutorData = (tutor: Partial<Tutor>) => {
  return {
    name: tutor.name || _("Unknown Tutor"),
    email: tutor.email || "",
    subjects: tutor.subjects || [],
    format: tutor.format || [],
    rating: tutor.rating || 0,
    price: tutor.price || 0,
    location: tutor.location,
    avatar: tutor.avatar || "",
    bio: tutor.bio || "",
    availability: tutor.availability || [],
    phone: tutor.phone || "",
    viber: tutor.viber || "",
    telegram: tutor.telegram || "",
    whatsapp: tutor.whatsapp || "",
  };
};
