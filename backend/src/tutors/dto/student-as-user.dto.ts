export type StudentAsUserDto = {
  id: string;
  name: string;
  email: string | null;
  color: string | null;

  avatar: string | null;

  phone: string | null;
  viber: string | null;
  telegram: string | null;
  whatsapp: string | null;
};

export type CreateStudentAsUserDto = {
  id?: string;
  userId?: string;
  name: string;
  color?: string;
};
