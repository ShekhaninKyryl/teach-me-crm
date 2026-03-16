import type { AvatarUploadPresignResponse } from "api/tutors";
import { _ } from "@/translates";

export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png"] as const;

type AllowedAvatarType = (typeof ALLOWED_AVATAR_TYPES)[number];

export const validateAvatarFile = (file: File) => {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type as AllowedAvatarType)) {
    throw new Error(_("Avatar must be JPG or PNG"));
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    throw new Error(_("Avatar must be 2MB or less"));
  }
};

export const toAvatarPresignPayload = (file: File) => {
  validateAvatarFile(file);

  return {
    contentType: file.type as AllowedAvatarType,
    sizeBytes: file.size,
  };
};

export const uploadAvatarToPresignedUrl = async (
  presign: AvatarUploadPresignResponse,
  file: File
): Promise<void> => {
  const response = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: presign.headers,
    body: file,
  });

  if (!response.ok) {
    throw new Error(_("Failed to upload avatar to storage"));
  }
};

