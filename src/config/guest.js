export const GUEST_ADMIN = {
  email: "guest@ezbuy.store",
  password: "guest123",
};

export const isPrivileged = (user) =>
  user?.role === "admin" || user?.role === "guestadmin";

export const isGuest = (user) =>
  user?.email?.toLowerCase() === GUEST_ADMIN.email.toLowerCase();