import { useRouter } from "next/router";
import { Title } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import styles from "./styles/LogInBtn.module.css";
import { motion } from "framer-motion";

export default function LogInBtn() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={styles.title}>
        <Title size={26} c={"white"}>
          Har du drukket isbjørn?
        </Title>
      </motion.div>
      <motion.button
        initial={{ scale: 1, opacity: 0, x: -50 }}
        whileInView={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4, delay: 0.2 }}
        onClick={handleLoginClick}
        className={styles.button}>
        <span>
          Logg Inn
          <IconLogin2 className={styles.icon} />
        </span>
      </motion.button>
    </div>
  );
}
