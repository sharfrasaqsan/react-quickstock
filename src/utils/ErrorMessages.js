const getFirebaseErrorMessage = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    case "auth/invalid-credential":
      return "Incorrect email or password. Try again.";
    case "auth/too-many-requests":
      return "Too many login attempts. Try again later.";
    case "auth/user-disabled":
      return "Your account has been disabled. Contact support.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export default getFirebaseErrorMessage;
