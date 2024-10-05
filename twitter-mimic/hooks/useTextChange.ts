import { ChangeEvent, useState } from "react";

export const TEXT_STATES = {
  NONE: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
};

export const MAX_CHARS = 280;

export default function useTextChange() {
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<number>(TEXT_STATES.NONE);
  const isButtonDisabled =
    !message || message.length === 0 || status === TEXT_STATES.LOADING;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length <= MAX_CHARS) setMessage(value);
  };
  
  return {
    message,
    status,
    isButtonDisabled,
    setMessage,
    setStatus,
    handleChange,
  };
}
