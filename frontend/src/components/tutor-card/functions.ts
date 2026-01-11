import type { Tutor } from 'types/tutor';
import { _ } from '@/translates';

export const isValidTutorProfile = (profile: Partial<Tutor>): boolean => {
  return (
    Boolean(profile.name) &&
    Array.isArray(profile.subjects) &&
    profile.subjects.length > 0 &&
    Boolean(profile.format) &&
    Boolean(profile.price)
  );
};

export const getTutorData = (tutor: Partial<Tutor>) => {
  return {
    name: tutor.name || _('Unknown Tutor'),
    email: tutor.email || '',
    subjects: tutor.subjects || [],
    format: tutor.format || [],
    rating: tutor.rating || 0,
    price: tutor.price || 0,
    location: tutor.location,
    avatar: tutor.avatar || '',
  };
};
