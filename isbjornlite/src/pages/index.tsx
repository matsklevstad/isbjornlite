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
