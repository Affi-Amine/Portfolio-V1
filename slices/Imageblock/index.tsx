import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Imageblock`.
 */
export type ImageblockProps = SliceComponentProps<Content.ImageblockSlice>;

/**
 * Component for "Imageblock" Slices.
 */
const Imageblock = ({ slice }: ImageblockProps): JSX.Element => {
  return (
  <PrismicNextImage field={slice.primary.image} imgixParams={{w:600}} />
  )
};

export default Imageblock;
