import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/stores/authStore";
import {
  IconChevronsRight,
  IconUser,
  IconLock,
  IconBrandGithub,
} from "@tabler/icons-react";
import styles from "./Login2.module.css";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogIn = async () => {
    try {
      await login(username, password);
      router.push("/");
    } catch (error) {
      setAuthError("Feil brukernavn eller passord.");
    }
  };

  // Extract error from URL on component mount
  useEffect(() => {
    const { error } = router.query;
    if (error) {
      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        OAuthSignin: "Feil ved pålogging.",
        OAuthCallback: "Feil ved kommunikasjon med innloggingstjenesten.",
        OAuthCreateAccount: "Kunne ikke opprette konto.",
        EmailCreateAccount: "Kunne ikke opprette konto med epost.",
        Callback: "Ugyldig tilbakekall fra innloggingstjenesten.",
        OAuthAccountNotLinked:
          "E-posten er allerede i bruk med en annen innloggingsmetode.",
        default: "Det oppstod en feil under innlogging.",
      };

      setAuthError(errorMessages[error as string] || errorMessages.default);
    }
  }, [router.query]);

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLogIn();
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [handleLogIn]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          {authError && <div className={styles.errorMessage}>{authError}</div>}
          <div className={styles.header}>
            <h2 className={styles.title}>Velkommen tilbake</h2>
            <p className={styles.subtitle}>Logg inn for å registrere isbjørn</p>
          </div>

          <form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.label}>
                Brukernavn
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.iconContainer}>
                  <IconUser size={18} className={styles.icon} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.input}
                  placeholder="brahabra"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelContainer}>
                <label htmlFor="password" className={styles.label}>
                  Passord
                </label>
                <a href="#" className={styles.link}>
                  Glemt passord?
                </a>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.iconContainer}>
                  <IconLock size={18} className={styles.icon} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogIn}
              className={styles.button}>
              <span>Logg Inn</span>
              <IconChevronsRight size={16} style={{ marginLeft: "0.5rem" }} />
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine}>
              <div className={styles.dividerLineInner}></div>
            </div>
            <div className={styles.dividerTextContainer}>
              <span className={styles.dividerText}>Eller logg inn med</span>
            </div>
          </div>

          <div className={styles.socialContainer}>
            <button
              type="button"
              onClick={() =>
                signIn("google", { callbackUrl: "/", redirect: true })
              }
              className={styles.socialButton}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                signIn("github", { callbackUrl: "/", redirect: true })
              }
              className={styles.socialButton}>
              <IconBrandGithub size={20} />
            </button>
          </div>

          <p className={styles.registerText}>
            Har du ikke en bruker?{"  "}
            <a href="#" className={styles.registerLink}>
              Registrer deg her
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
