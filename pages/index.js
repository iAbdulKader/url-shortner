import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import { Icon } from '@iconify/react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate");
  
  const notify = () => toast.success("Copied");
  
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
  
    if(url.length > 4){
      try {
        const res = await axios.post("/api/shorten", { url, slug });
        
        setShortUrl(res.data.shortUrl);
        setLoading(false);
        setButtonText("Generated")
        
        setTimeout(function() {
          setButtonText("Generate")
        }, 2000);
      } catch (e) {
        setShortUrl(e.code);
        setLoading(false);
        toast.error("Something Went Wrong")
      }
    } else {
      setShortUrl('Enter Valid URL First')
      setLoading(false)
    }
  }
  
  return (
    <div className={styles.container}>
      <Toaster />
      <Head>
        <title>A Link | Link Shortner</title>
        <meta name="description" content="Simple, Easy, Fast and Efficient Link Shortner.
        
        Shorten Your Links Easily With Custom Short Url" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://abdulkader.tk">aLink!</a><span className={styles.koma}>,</span><br />Link Shortner
        </h1>

      
      <div>
         <form onSubmit={(e) => submit(e)}>
           <input type="text" name="url" placeholder="Url" value={url} onInput={(e)=>setUrl(e.target.value)} />
           <input type="text" name="slug" placeholder="Slug (Optional)" value={slug} onInput={(e)=>setSlug(e.target.value)} />
           <button type="submit">{loading ? (<svg className={styles.loader} width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx="50" cy="50" fill="none" stroke="#0070f3" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
          </circle>
          </svg>):
          `${buttonText}` }</button>
         </form>
      </div>
        { shortUrl != "" ? <div className={styles.shortUrlHolder}>
         <input name="shortUrl" value={shortUrl} readOnly />
           <CopyToClipboard text={shortUrl} >
             <div onClick={notify}>
              <Icon className={styles.copyBtn} icon="uil:file-copy-alt" width="25" height="25" />
             </div>
           </CopyToClipboard>
        </div> : null}
      </main>
    </div>
  )
}
