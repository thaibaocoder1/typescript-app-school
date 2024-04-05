import { User } from "./models/User";
import { toast } from "./utils";

// type
export type ApiResponseAuth = {
  success: boolean | string;
  data?: any;
  message: string;
};
// main
(async () => {
  const searchParams = new URLSearchParams(location.search);
  const activeID = searchParams.get("id");
  if (activeID && activeID !== null) {
    const res = await User.active(activeID);
    const active: ApiResponseAuth = await res.json();
    if (active.success) {
      toast.success("Active thành công");
      setTimeout(() => {
        window.location.assign("/login.html");
      }, 500);
    } else {
      toast.error(active.message);
      return;
    }
  } else {
    window.location.assign("/login.html");
  }
})();
