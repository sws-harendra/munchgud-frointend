import React from "react";

const Heading = ({ title }: { title: string }) => {
  return (
    <div className="text-sm md:text-xl font-bold font-serif text-center mt-2 py-2 tracking-wide">
      {title}
    </div>
  );
};

export default Heading;
