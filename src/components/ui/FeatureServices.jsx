import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const FeatureServices = ({ featuredServices }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 px-5">
      {featuredServices.map((item) => (
        <Link
          key={item.title}
          to="/book"
          className="group relative overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-white via-rose-50/40 to-pink-100/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          {/* Book Button */}
          <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all duration-300 group-hover:scale-110">
            <ArrowUpRight size={18} />
          </button>

          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-md">
            {item.icon}
          </div>

          {/* Content */}
          <div className="mt-5">
            <h3 className="mt-2 text-lg font-bold text-gray-800">
              {item.title}
            </h3>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">Starting From</p>
                <h2 className="text-xl font-bold text-accent">₹{item.price}</h2>
              </div>
            </div>
          </div>

          {/* Decoration */}
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/5 transition-all duration-500 group-hover:scale-150" />
        </Link>
      ))}
    </div>
  );
};

export default FeatureServices;
