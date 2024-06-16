import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
// import Image from "next/image";
import c1 from "../../assets/image/c1.png";
import c2 from "../../assets/image/c2.png";

export default function ProductCarousel() {
  return (
    <Carousel
      autoPlay={true}
      interval={2000}
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
    >
      <div>
        <img
          src={c1}
          alt="image 1"
          className="h-64 md:h-80 xl:h-84 w-full"
          height={400}
          width={500}
        />
      </div>
      <div>
        <img
          src={c2}
          alt="image 2"
          className="h-64 md:h-80 xl:h-84 w-full "
          height={400}
          width={500}
        />
      </div>
    </Carousel>
  );
}
