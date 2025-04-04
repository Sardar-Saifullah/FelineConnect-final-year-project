/* eslint-disable react/prop-types */
import StatsCardExported from "../components/About/StatsCard.jsx";
import TeamMembers from "../components/About/TeamMembers";
import Services from "../components/common/components/Services.jsx";
import ActiveLastBreadcrumb from "../components/common/components/Link.jsx";
const About = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-start mt-48 ">
        <div className="md:mx-40">
          <ActiveLastBreadcrumb path={`Home/About`} />
        </div>

        <div className="flex justify-center md:justify-between items-center md:mt-10  my-24 md:mb-36 ">
          <div className="flex flex-col gap-10 items-center md:items-start justify-center max-w-lg mx-8 md:mx-40">
            <h1 className="text-5xl font-bold font-inter">Our Story</h1>
            <p className="text-base text-center md:text-start">
              Established in 2024, FelineConnect has rapidly grown to become one
              of Pakistan's premier online shopping destinations. With a
              commitment to providing a seamless and convenient shopping
              experience, FelineConnect offers a vast selection of products from
              top brands and local artisans.
            </p>
            <p className="text-base text-center md:text-start">
              Our platform connects thousands of sellers with millions of
              customers across Pakistan, fostering a vibrant marketplace that
              caters to diverse needs and preferences. Backed by innovative
              technology and dedicated customer support, FelineConnect is your
              go-to destination for everything from electronics and fashion to
              home goods and groceries.
            </p>
          </div>
          <svg
            className="md:flex hidden"
            width="705"
            height="609"
            viewBox="0 0 705 609"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_226_4548)">
              <path
                d="M0 3.99999C0 1.79085 1.79086 0 4 0H705V609H4.00001C1.79087 609 0 607.209 0 605V3.99999Z"
                fill="#EB7EA8"
              />
            </g>
            <defs>
              <clipPath id="clip0_226_4548">
                <path
                  d="M0 3.99999C0 1.79085 1.79086 0 4 0H705V609H4.00001C1.79087 609 0 607.209 0 605V3.99999Z"
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8">
        <StatsCardExported />
      </div>

      <div className="flex flex-col items-center justify-center gap-8 my-36 ">
        <TeamMembers />
      </div>
      <Services />
    </>
  );
};
export default About;
