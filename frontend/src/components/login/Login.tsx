import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/stores/authStore";
import {
  IconChevronsRight,
  IconUserFilled,
  IconLockFilled,
  IconBrandGithub,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import styles from "./Login.module.css";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogIn = useCallback(async () => {
    try {
      await login(username, password);
      router.push("/");
    } catch (error) {
      setAuthError("Feil brukernavn eller passord.");
    }
  }, [login, username, password, router]);

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
        <div className={styles.topSection}>
          {authError && <div className={styles.errorMessage}>{authError}</div>}
          <div className={styles.header}>
            <h2 className={styles.title}>Velkommen tilbake</h2>
            <p className={styles.subtitle}>På tide å drikke isbjørn?</p>
          </div>

          <form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.label}>
                Brukernavn
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.iconContainer}>
                  <IconUserFilled size={18} className={styles.icon} />
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
                  <IconLockFilled size={18} className={styles.icon} />
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
              <IconChevronsRight size={20} style={{ marginLeft: "0.5rem" }} />
            </button>
          </form>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.divider}>
            <div className={styles.dividerLine}>
              <div className={styles.dividerLineInner}></div>
            </div>
            <div className={styles.dividerTextContainer}>
              <span className={styles.dividerText}>eller logg inn med</span>
            </div>
          </div>

          <div className={styles.socialContainer}>
            <button
              type="button"
              onClick={() =>
                signIn("google", { callbackUrl: "/", redirect: true })
              }
              className={styles.socialButtonGoogle}>
              <IconBrandGoogleFilled size={20} color="white" />
            </button>
            <button
              type="button"
              onClick={() =>
                signIn("github", { callbackUrl: "/", redirect: true })
              }
              className={styles.socialButtonGithub}>
              <IconBrandGithub size={20} color="white" />
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
