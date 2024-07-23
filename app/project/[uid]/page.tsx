import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/app/components/Bounded";
import { ContainerScroll } from "@/app/components/ui/container-scroll-animation";
import Image from "next/image";
import { PrismicNextImage } from "@prismicio/next";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return (
    <Bounded>
      <ContainerScroll titleComponent={<h1 className="text-4xl font-bold mb-4">{page.data.title}</h1>}>
        <div className="h-full w-full overflow-y-auto flex flex-col">
          {page.data.hover_image && (
            <div className="w-full h-64 relative mb-4">
              <PrismicNextImage
                field={page.data.hover_image}
                className="rounded-t-lg object-cover "
              />
            </div>
          )}
        </div>
      </ContainerScroll>
      <SliceZone slices={page.data.slices} components={components} />
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}