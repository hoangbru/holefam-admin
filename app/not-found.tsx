import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  const t = useTranslations("NotFoundPage");
  
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="relative w-full md:w-[80%] h-[50%]">
        <Image
          fill
          src="/images/not-found.png"
          alt="not-found-image"
          className="object-contain"
        />
      </div>
      <div className="w-full h-[15%] flex justify-center items-center p-2">
        <Link
          className="flex justify-center items-center gap-x-2 cursor-pointer p-2"
          href={"/"}
        >
          <p className="text-xl font-medium text-[#240744]">
            {t("do_you_feel_disoriented")}
          </p>
          <div className="relative w-16 h-16">
            <Image
              fill
              src="/images/arrow-back.png"
              alt="arrow-back"
              className="object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
