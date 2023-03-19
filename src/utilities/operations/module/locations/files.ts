import localLocations from "locations_local";
import { writeFileSync } from "fs";
import { format } from "prettier";

export const writeToLocationBlogPath = async (
  location: keyof typeof localLocations,
  toWrite: string,
  shouldFormat: boolean = true
) => {
  try {
    const foundLocation = localLocations[location];

    if (!foundLocation) {
      throw new Error("Location not found");
    }

    const blogOutputPath = foundLocation.options.blog_output_path;

    if (!blogOutputPath) {
      throw new Error("Blog output path not found");
    }

    if (shouldFormat) {
      toWrite = format(toWrite);
    }

    writeFileSync(blogOutputPath, toWrite);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
