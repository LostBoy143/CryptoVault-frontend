import toast from "react-hot-toast";

let activeToasts = new Set();

export const showToast = (
  id,
  message,
  type = "success"
) => {
  if (activeToasts.has(id)) return; // Prevent duplicates
  activeToasts.add(id);

  const toastFn =
    type === "error"
      ? toast.error
      : type === "loading"
      ? toast.loading
      : toast.success;

  const toastId = toastFn(message);

  // Remove toast ID when dismissed
  toast.promise(Promise.resolve(), {
    success: "",
    error: "",
    loading: "",
  });

  setTimeout(() => {
    activeToasts.delete(id);
    toast.dismiss(toastId);
  }, 4000);
};

export const clearAllToasts = () => {
  toast.dismiss();
  activeToasts.clear();
};
