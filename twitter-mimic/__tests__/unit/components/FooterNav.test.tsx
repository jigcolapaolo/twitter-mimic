import FooterNav from "@/ui/components/FooterNav/FooterNav";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("FooterNav", () => {
  it("should render all navigation links", () => {
    (usePathname as jest.Mock).mockReturnValue("/home");

    render(<FooterNav />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /compose/i })).toBeInTheDocument();
  });

  it("should highlight selected link accordingly to current page", () => {
    (usePathname as jest.Mock).mockReturnValue("/search");

    render(<FooterNav />);

    expect(screen.queryByRole("link", { name: /home/i })).not.toHaveClass(
      "selectedNav"
    );
    expect(screen.getByRole("link", { name: /search/i })).toHaveClass(
      "selectedNav"
    );
    expect(screen.getByRole("link", { name: /compose/i })).not.toHaveClass(
      "selectedNav"
    );
  });
});
