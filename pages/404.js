import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Error() {
  const [button, setButton] = useState(false)
  
  useEffect(() => {
    setTimeout(function() {
      setButton(true)
    }, 3000);
  }, [])
  
  return(
    <div className={styles.not__found}>
      <div className={styles.not__found_img}>
        <img src="/404.svg" />
        { button ? 
        (<Link href="/"><button className={styles.not__found__btn}>Home</button></Link>) : null
        }
      </div>
    </div>
    )
}