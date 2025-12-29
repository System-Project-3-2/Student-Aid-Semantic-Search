export const detectRoleFromEmail = (email) => {
  if (!email) return null;

  email = email.toLowerCase();

  if (email.endsWith("@stud.kuet.ac.bd")) {
    return "student";
  }

  if (email.endsWith("@kuet.ac.bd") && !email.endsWith("@stud.kuet.ac.bd")) {
    return "teacher";
  }
  return null;
};
