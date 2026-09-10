export class AuthDto {
  phone: string;
  password: string;
  username?: string; // Необов'язкове поле при реєстрації
}