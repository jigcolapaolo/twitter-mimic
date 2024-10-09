import Image from "next/image";

import styles from "./tweetImages.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function TweetImages({ img }: { img: string[] | string }) {
  const isSingleImg =
    typeof img === "string" || (Array.isArray(img) && img.length < 2);
  const settings = {
    infinite: !isSingleImg,
    speed: 500,
    arrows: !isSingleImg,
    className: styles.slider,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: !isSingleImg ? <CustomNextArrow /> : undefined,
    prevArrow: !isSingleImg ? <CustomPrevArrow /> : undefined,
  };

  const imageArray = Array.isArray(img) ? img : [img];

  return (
      <Slider {...settings}>
        {imageArray.map((url, index) => (
          <div
            key={index}
            className={styles.imgContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              priority
              placeholder="blur"
              blurDataURL={url}
              className={styles.img}
              width={300}
              height={300}
              src={url}
              alt={`Tweet Image ${index + 1}`}
            />
          </div>
        ))}
      </Slider>
  );
}

function CustomNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: "15px",
        zIndex: 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
}

function CustomPrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: "15px",
        zIndex: 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
}
