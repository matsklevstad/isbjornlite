import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className="bg-blue-100">
      <h1 className="flex items-center text-white">
        <span className="ml-2   text-3xl font-bold">
          Velkommen til Isbjørn Lite
        </span>
      </h1>
      <iframe
        src="https://www.yr.no/nb/innhold/2-6697173/card.html"
        width="100%"
        height="600px"
        style={{ border: "none" }}
        allowFullScreen
      ></iframe>
    </div>
  );
}
