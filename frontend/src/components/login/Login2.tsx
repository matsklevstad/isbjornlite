import React, { useState } from "react";
import {
  IconChevronsRight,
  IconUser,
  IconLock,
  IconBrandGithub,
} from "@tabler/icons-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-100">
      <div className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Velkommen tilbake
            </h2>
            <p className="mt-2 text-gray-400">
              Logg inn for å registrere isbjørn
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-300 block">
                Brukernavn
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconUser size={18} className="text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5"
                  placeholder="brahabra"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300 block">
                  Passord
                </label>
                <a
                  href="#"
                  className="text-sm text-cyan-400 hover:text-cyan-300">
                  Glemt passord?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
              <span>Logg Inn</span>
              <IconChevronsRight size={16} className="ml-2" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Eller logg inn med
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium">
                <IconBrandGithub size={20} />
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Har du ikke en bruker?{"  "}
            <a
              href="#"
              className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Registrer deg her
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
