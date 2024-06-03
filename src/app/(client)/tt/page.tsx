import Head from 'next/head';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Game Menu</title>
        <meta name="description" content="Game Menu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.menuContainer}>
          <div className={styles.accountSection}>
            <button className={`${styles.button} ${styles.accountButton}`}>
              ACCOUNT
            </button>
          </div>
          <div className={styles.friendsSection}>
            <button className={`${styles.button} ${styles.friendsButton}`}>
              FRIENDS LIST
            </button>
          </div>
          <div className={styles.hostSection}>
            <button className={`${styles.button} ${styles.hostButton}`}>
              Create Game
            </button>
          </div>
          <div className={styles.publicSection}>
            <button className={`${styles.button} ${styles.publicButton}`}>
              Find Game
            </button>
          </div>
          <div className={styles.privateSection}>
            <button className={`${styles.button} ${styles.privateButton}`}>
              Enter Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
