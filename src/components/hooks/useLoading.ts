import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const loadingTrue = () => {
    setLoading(true);
  };

  const loadingFalse = () => {
    setLoading(false);
  };

  return { loading, loadingFalse, loadingTrue };
};
