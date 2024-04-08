import { User } from "./models/User";
import { hideSpinner, showSpinner, toast } from "./utils";

// type
type Response = {
  success: boolean;
  message: string;
};
// main
(async () => {
  const searchParams = new URLSearchParams(location.search);
  try {
    showSpinner();
    const confirm: Response = (await User.confirmRecovey(
      searchParams
    )) as unknown as Response;
    hideSpinner();
    if (confirm.success) {
      toast.success(confirm.message);
      setTimeout(() => {
        window.location.assign("/login.html");
      }, 1500);
    } else {
      toast.error(confirm.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
})();
