import TweetImages from "@/ui/components/TweetImages/TweetImages";
import { render, screen } from "@testing-library/react";

jest.mock("react-slick", () => {
  const MockReactSlick = ({ children }: any) => {
    return <div>{children}</div>;
  };
  MockReactSlick.displayName = "MockReactSlick";
  return MockReactSlick;
});

describe("TweetImages component", () => {
  it("should render a single image", () => {
    const image = "image1.png";

    render(<TweetImages img={image} />);

    expect(screen.getByAltText("Tweet Image 1")).toBeInTheDocument();
  });

  it("should render multiple images", () => {
    const images = ["image1.png", "image2.png"];

    render(<TweetImages img={images} />);

    expect(screen.getByAltText("Tweet Image 1")).toBeInTheDocument();
    expect(screen.getByAltText("Tweet Image 2")).toBeInTheDocument();
  });

  // npm test "TweetImages.test.tsx"
});
