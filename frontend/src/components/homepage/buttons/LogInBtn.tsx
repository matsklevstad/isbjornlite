import { useRouter } from "next/router";
import { Title } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import styles from "./styles/LogInBtn.module.css";

export default function LogInBtn() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <Title size={26} c={"white"}>Har du drukket isbjørn?</Title>
      <button onClick={handleLoginClick} className={styles.button}>
        <span>
          Logg Inn
          <IconLogin2 className={styles.icon} />
        </span>
      </button>
    </div>
  );
}
