import { signIn } from "next-auth/react";
import styles from "./Login.module.css";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";

export default function SocialLogIn({
  setIsRegistering,
}: {
  setIsRegistering: (isRegistering: boolean) => void;
}) {
  return (
    <div className={styles.bottomSection}>
      <div className={styles.divider}>
        <div className={styles.dividerLine}>
          <div className={styles.dividerLineInner}></div>
        </div>
        <div className={styles.dividerTextContainer}>
          <span className={styles.dividerText}>eller fortsett med</span>
        </div>
      </div>

      <div className={styles.socialContainer}>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/", redirect: true })}
          className={styles.socialButtonGoogle}>
          <IconBrandGoogleFilled size={20} color="white" />
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/", redirect: true })}
          className={styles.socialButtonGithub}>
          <IconBrandGithub size={20} color="white" />
        </button>
      </div>

      <p className={styles.registerText}>
        Har du ikke en bruker?{"  "}
        <a
          href="#"
          onClick={() => setIsRegistering(true)}
          className={styles.registerLink}>
          Registrer deg her
        </a>
      </p>
    </div>
  );
}
