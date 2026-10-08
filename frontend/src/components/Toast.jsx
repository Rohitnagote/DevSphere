import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../utils/toastSlice";

const Toast = () => {
  const toast = useSelector((store) => store.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2" role="status">
      <div
        className={`toast-pop flex items-center gap-2 rounded-full border bg-base-100 px-5 py-2.5 text-sm font-medium shadow-lg ${
          isError ? "border-error" : "border-success"
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isError ? "bg-error" : "bg-success"
          }`}
        ></span>
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;