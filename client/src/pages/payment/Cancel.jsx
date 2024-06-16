import React from "react";

const Cancel = () => {
  return (
    <div class="flex items-center justify-center ">
      <div class="bg-white p-6  md:mx-auto">
        <img
          width="64"
          height="64"
          src="https://img.icons8.com/fluency/48/cancel.png"
          alt="cancel"
          className="mx-auto my-4"
        />
        <div class="text-center">
          <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Failed!
          </h3>
          <p class="text-gray-600 my-2">Please try again after some time.</p>
          <p>
            If already debited, refund will be processed within 2 working days.{" "}
          </p>
          <div class="py-10 text-center">
            <a
              href="/"
              class="px-12 bg-accent cursor-pointer text-white font-semibold py-3"
            >
              Go back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
