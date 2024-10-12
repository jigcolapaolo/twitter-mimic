import CharacterLimit from "@/ui/components/composeTweet/CharacterLimit/CharacterLimit";
import { render, screen } from "@testing-library/react";

describe("CharacterLimit component", () => {
  it("should render 0/MAX_CHARS when message is empty", () => {
    render(<CharacterLimit message="" MAX_CHARS={100} />);

    expect(screen.getByText(`0/100`)).toBeInTheDocument();
  });

  it("should show correct count of message.length", () => {
    render(<CharacterLimit message="Hi" MAX_CHARS={100} />);

    expect(screen.getByText(`2/100`)).toBeInTheDocument();
  });

  it("should show max characters reach message when message.length is equal to MAX_CHARS", () => {
    render(<CharacterLimit message="Hello" MAX_CHARS={5} />);

    expect(
      screen.getByText("Ha alcanzado el límite de caracteres.")
    ).toBeInTheDocument();
  });

  it("should show warning message when message.length is close to MAX_CHARS", () => {
    render(
      <CharacterLimit
        message="Hello, how are you? Welcome to Tweet Mimic!"
        MAX_CHARS={45}
      />
    );

    expect(
      screen.getByText("Cerca del límite de caracteres.")
    ).toBeInTheDocument();
  });
});
