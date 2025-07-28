import { useState, useEffect } from "react";

import API_BASE_PATH from "apiConfig";

export function useClinicInfo(clinicSlug) {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [locations, setLocations] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [clinicInfoError, setClinicInfoError] = useState(null);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const cached = localStorage.getItem("clinicInfo");

        if (cached) {
          const data = JSON.parse(cached);
          setClinicInfo(data.clinic);
          setLocations(data.locations);
          if (data.notices?.length) {
            const notices = data.notices.filter(Boolean).join(" | ");
            setNotice(notices);
          }
          setLoading(false);
        } else {
          const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
          const data = await response.json();
          localStorage.setItem("clinicInfo", JSON.stringify(data));
          setClinicInfo(data.clinic);
          setLocations(data.locations);
          if (data.notices?.length) {
            const notices = data.notices.filter(Boolean).join(" | ");
            setNotice(notices);
          }
          setLoading(false);
        }
      } catch (error) {
        setClinicInfoError(error.message);
        console.error("Error fetching clinic information:", error);
        setLoading(false);
      }
    };

    fetchClinicInfo().then(r => {});
  }, [clinicSlug]);

  return { clinicInfo, locations, notice, loading, clinicInfoError };
}
