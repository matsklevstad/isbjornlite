import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/authStore";
import {
  IconChevronsRight,
  IconUserFilled,
  IconLockFilled,
  IconMailFilled,
} from "@tabler/icons-react";
import styles from "./Login.module.css";
import SocialLogIn from "./SocialLogIn";
import { errorMessages } from "@/utils/errorMessages";
import { Loader } from "@mantine/core";

const LoginPage = () => {
  const { login, register } = useAuthStore();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogIn = useCallback(async () => {
    if (username.length < 3) {
      setUsernameError(true);
      setAuthError("Brukernavnet må være minst 3 tegn langt.");
      return;
    }
    if (password.length < 6) {
      setPasswordError(true);
      setAuthError("Passordet må være minst 6 tegn langt.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    setUsernameError(false);
    setPasswordError(false);
    try {
      await login(username, password);
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      setAuthError("Feil brukernavn eller passord.");
      setIsLoading(false);
    }
  }, [login, username, password, router]);

  const handleRegister = useCallback(async () => {
    if (username.length < 3) {
      setUsernameError(true);
      setAuthError("Brukernavnet må være minst 3 tegn langt.");
      return;
    }
    if (password.length < 6) {
      setPasswordError(true);
      setAuthError("Passordet må være minst 6 tegn langt.");
      return;
    }
    if (email.length < 5 || !email.includes("@")) {
      setEmailError(true);
      setAuthError("Eposten er ikke gyldig.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setAuthError("Passordene stemmer ikke overens.");
      return;
    }
    setAuthError(null);
    setIsLoading(true);
    setUsernameError(false);
    setPasswordError(false);
    setEmailError(false);
    setConfirmPasswordError(false);
    try {
      const userData = {
        username,
        password,
        email,
      };
      await register(userData);
      router.push("/");
    } catch (error) {
      setAuthError("Noe gikk galt under registreringen.");
    }
  }, [password, confirmPassword, username, email, register, router]);

  // Extract error from URL on component mount
  useEffect(() => {
    const { error } = router.query;
    if (error) {
      setAuthError(errorMessages[error as string] || errorMessages.default);
    }
  }, [router.query]);

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (isRegistering) {
          handleRegister();
        } else {
          handleLogIn();
        }
      }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [handleLogIn, handleRegister, isRegistering]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {isRegistering ? "Opprett konto" : "Velkommen tilbake"}
            </h2>
            <p className={styles.subtitle}>
              {!isRegistering
                ? "På tide med en isbjørn?"
                : "Bli med å drikk isbjørn!"}
            </p>
          </div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
                  onChange={(e) => {
                    setUsername(e.target.value), setUsernameError(false);
                  }}
                  className={usernameError ? styles.inputError : styles.input}
                  placeholder="brahabra"
                />
              </div>
            </div>

            {isRegistering && (
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>
                  Epost
                </label>
                <div className={styles.inputContainer}>
                  <div className={styles.iconContainer}>
                    <IconMailFilled size={18} className={styles.icon} />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value), setEmailError(false);
                    }}
                    className={emailError ? styles.inputError : styles.input}
                    placeholder="brahabra@tourhjelper.no"
                  />
                </div>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <div className={styles.labelContainer}>
                <label htmlFor="password" className={styles.label}>
                  Passord
                </label>
                {!isRegistering && (
                  <a href="#" className={styles.link}>
                    Glemt passord?
                  </a>
                )}
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.iconContainer}>
                  <IconLockFilled size={18} className={styles.icon} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value), setPasswordError(false);
                  }}
                  className={passwordError ? styles.inputError : styles.input}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && (
              <div className={styles.fieldGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Bekreft Passord
                  </label>
                </div>
                <div className={styles.inputContainer}>
                  <div className={styles.iconContainer}>
                    <IconLockFilled size={18} className={styles.icon} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value),
                        setConfirmPasswordError(false);
                    }}
                    className={
                      confirmPasswordError ? styles.inputError : styles.input
                    }
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={isRegistering ? handleRegister : handleLogIn}
              className={styles.button}>
              {isLoading ? (
                <Loader color="white" size="sm" />
              ) : (
                <>
                  <span>{isRegistering ? "Registrer bruker" : "Logg Inn"}</span>
                  <IconChevronsRight
                    size={20}
                    style={{ marginLeft: "0.5rem" }}
                  />
                </>
              )}
            </button>
            {authError && (
              <div className={styles.errorMessage}>{authError}</div>
            )}
          </form>
        </div>

        {!isRegistering && <SocialLogIn setIsRegistering={setIsRegistering} />}
      </div>
    </div>
  );
};

export default LoginPage;
