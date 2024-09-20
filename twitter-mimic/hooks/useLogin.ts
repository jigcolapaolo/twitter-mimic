import { useEffect, useState } from "react";
import { loginWithGitHub, loginWithGoogle } from "../firebase/client";

export const LOGIN_TYPES = {
  GITHUB: 1,
  GOOGLE: 2,
};

export default function useLogin() {
  const [loginType, setLoginType] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!loginType) return;

    if (loginType === LOGIN_TYPES.GOOGLE) {
      loginWithGoogle().catch((error) => {
        console.log(error);
      });
    }

    if (loginType === LOGIN_TYPES.GITHUB) {
      loginWithGitHub().catch((error) => {
        console.log(error);
      });
    }
  }, [loginType]);

  return {
    setLoginType,
  };
}
