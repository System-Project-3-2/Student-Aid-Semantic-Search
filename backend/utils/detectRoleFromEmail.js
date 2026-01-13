// Test emails for development - REMOVE IN PRODUCTION
const TEST_EMAILS = {
  // Add your test emails here
  "teacher@test.com": "teacher",
  "admin@test.com": "admin",
  "student@test.com": "student",
};

export const detectRoleFromEmail = (email) => {
  if (!email) return null;

  email = email.toLowerCase();

  // Check test emails first (for development only)
  if (TEST_EMAILS[email]) {
    return TEST_EMAILS[email];
  }

  if (email.endsWith("@stud.kuet.ac.bd")) {
    return "student";
  }

  if (email.endsWith("@kuet.ac.bd") && !email.endsWith("@stud.kuet.ac.bd")) {
    return "teacher";
  }

  if (email.endsWith("@admin.kuet.ac.bd")) {
    return "admin";
  }

  return null;
};
