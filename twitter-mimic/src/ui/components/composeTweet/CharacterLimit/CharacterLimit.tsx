export default function CharacterLimit({
  message,
  MAX_CHARS,
}: {
  message?: string;
  MAX_CHARS: number;
}) {
  return (
    <section className="text-gray-400 flex flex-col gap-1">
      <span>
        {message ? message.length : 0}/{MAX_CHARS}
      </span>
      <span
        style={{ fontFamily: "system-ui" }}
        className={
          message && message.length >= MAX_CHARS
            ? "text-red-500"
            : message && message.length >= MAX_CHARS - 30
            ? "text-orange-400"
            : "opacity-0"
        }
      >
        {message && message.length >= MAX_CHARS
          ? "Ha alcanzado el límite de caracteres."
          : message && message.length >= MAX_CHARS - 30
          ? "Cerca del límite de caracteres."
          : "Placeholder"}
      </span>
    </section>
  );
}
