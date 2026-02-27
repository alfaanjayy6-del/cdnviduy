import '../styles/globals.css'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* --- KODE HISTATS START --- */}
      <Script id="histats-script" strategy="afterInteractive">
        {`
           var _Hasync= _Hasync|| [];
           _Hasync.push(['Histats.start', '1,5011326,4,0,0,0,00010000']);
           _Hasync.push(['Histats.fasi', '1']);
           _Hasync.push(['Histats.track_hits', '']);
           (function() {
             var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
             hs.src = ('//s10.histats.com/js15_as.js');
             (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
           })();
        `}
      </Script>
      <noscript>
        <a href="/" target="_blank">
          <img src="//sstatic1.histats.com/0.gif?5011326&101" alt="stats" border="0" />
        </a>
      </noscript>
      {/* --- KODE HISTATS END --- */}

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
