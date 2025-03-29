import { useRouter } from "next/router";

export default function LogInBtn() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      onClick={handleLoginClick}>
      Log In
    </button>
  );
}
