// HelmetComponent.js
import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ndHealthLogo from "nd_health/assets/images/nd-health-logo.png";

const HelmetComponent = ({tabtitle}) => {
  const [canonicalUrl, setCanonicalUrl] = useState("");

  useEffect(() => {
    setCanonicalUrl(window.location.href);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        {/* Basic Meta Tags */}
        {/*<title>ND Health - Book Appointments with Physicians in Canada</title>*/}
        <title>{tabtitle}</title>
        <meta
          name="description"
          content="ND Health simplifies healthcare operations in Canada by offering efficient
                       appointment booking with physicians, seamless patient communication, and secure
                       record sharing. Enhance patient care and save time with our comprehensive healthcare solutions."
        />
        <meta
          name="keywords"
          content="healthcare, appointment booking, patient communication, secure record sharing,
                      physician appointments, Canada healthcare, online doctor, book doctor appointment,
                      family doctor, medical appointment, doctors appointment near me, doctor near me,
                       virtual appointment, virtual doctor appointment, walk-in clinic, doctor phone appointment,
                       fastest doctor appointment"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph (OG) Meta Tags for Social Media */}
        <meta
          property="og:title"
          content={tabtitle}
        />
        <meta
          property="og:description"
          content="ND Health streamlines healthcare operations in Canada, making it easy to
                      book appointments with physicians, communicate with patients, and securely share records."
        />
        <meta
          property="og:image"
          content="https://instagram.fykz1-1.fna.fbcdn.net/v/t51.2885-19/418997167_1341854483361526_9133516531325557357_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fykz1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=1L_f91fP-foAX8_A5A-&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDx2DfObgLvEj04JJwjicuPOLeiXf7Q3l1r1LM4WkyhuQ&oe=65B58585&_nc_sid=8b3546"
        />
        <meta property="og:url" content="https://nd-health.ca" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags for Social Media */}
        {/* <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="ND Health - Book Appointments with Physicians in Canada" />
                <meta name="twitter:description" content="ND Health streamlines healthcare operations in Canada, making it easy to book appointments with physicians, communicate with patients, and securely share records." />
                <meta name="twitter:image" content="URL_TO_YOUR_SOCIAL_MEDIA_IMAGE" />
                <meta name="twitter:site" content="@your_twitter_handle" />
                <meta name="twitter:creator" content="@your_twitter_handle" /> */}

        {/* Instagram Meta Tags for Social Media */}
        <meta property="instapp:owner" content="@nd.health.ca" />
        <meta property="instapp:owner:id" content="nd.health.ca" />
        <meta
          property="instapp:hashtags"
          content="healthcare, appointment booking, family physician, walk-in physician, doctor, physician, Canada"
        />

        {/* Facebook Meta Tags for Social Media */}
        <meta property="fb:app_id" content="61555491107393" />
        <meta property="og:site_name" content="ND Health - Book Physician Appointments" />
        <meta property="article:author" content="ND Health" />
        <meta property="article:published_time" content="2022-01-01T12:00:00Z" />
        <meta property="article:modified_time" content="2022-01-02T12:00:00Z" />

        {/* Schema.org Markup for Rich Snippets */}
        <script type="application/ld+json">
          {`
                    {
                      "@context": "http://schema.org",
                      "@type": "HealthcareService",
                      "name": "ND Health",
                      "url": "https://nd-health.ca",
                      "logo": "${ndHealthLogo}",
                      "description": "ND Health streamlines healthcare operations for physicians, 
                      admin staff, and patients in Canada. Book appointments, communicate with patients, 
                      and share records securely.",
                      "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "Canada"
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "info@nd-health.ca"
                      }
                    }
                    `}
        </script>

        {/* Canonical Tag */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Robots Meta Tag */}
        <meta name="robots" content="index, follow" />

        {/* Additional Custom Meta Tags */}
        {/* Add any other custom meta tags you may need */}
      </Helmet>
    </HelmetProvider>
  );
};

export default HelmetComponent;
