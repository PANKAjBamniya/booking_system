import React from "react";
import { InputField } from "../mobile/ui";
import { Search } from "lucide-react";

const HomeSearch = () => {
  return (
    <div className="px-5 mb-5">
      <InputField
        icon={<Search className="h-4 w-4" />}
        placeholder="Search services, artists..."
      />
    </div>
  );
};

export default HomeSearch;
