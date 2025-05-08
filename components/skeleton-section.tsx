import React, { Fragment } from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonSection = () => {
  return (
    <Fragment>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[50%]" />
      <Skeleton className="h-4 w-[70%]" />
      <Skeleton className="h-4 w-full" />
    </Fragment>
  );
};

export default SkeletonSection;
