// import React, { useEffect, useState } from 'react';
// import API_BASE_PATH from '../../../../apiConfig';

// const ClinicSettingsComponent = ({ clinicSlug, clinicId }) => {
//     const [clinicSettings, setClinicSettings] = useState({});
//     const [formData, setFormData] = useState({});
//     const [characterItems, setCharacterItems] = useState([]);

//     useEffect(() => {
//         // Fetch clinic settings
//         // fetchClinicSettings();
//         // fetchCharacterItems();  // Fetch character items for dropdowns

//     }, []);

//     const fetchClinicSettings = async () => {
//         try {
//             const response = await fetch(`${API_BASE_PATH}/clinic/settings/`,);
//             const data = await response.json();
//             setClinicSettings(data);
//             setFormData(data); // Set form data to pre-fill input fields
//         } catch (error) {
//             console.error('Error fetching clinic settings:', error);
//         }
//     };

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await fetch(`${API_BASE_PATH}/clinic/settings/`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });
//             const data = await response.json();
//             setClinicSettings(data);
//         } catch (error) {
//             console.error('Error updating clinic settings:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Clinic Settings</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Time Threshold:
//                     <input type="number" name="timeThreshold" value={formData.timeThreshold || ''} onChange={handleInputChange} />
//                 </label>
//                 <label>
//                     Book Code:
//                     <input type="text" name="bookCode" value={formData.bookCode || ''} onChange={handleInputChange} />
//                 </label>
//                 <label>
//                     Cancel Code:
//                     <input type="text" name="cancelCode" value={formData.cancelCode || ''} onChange={handleInputChange} />
//                 </label>
//                 {/* Add input fields for other settings */}
//                 <button type="submit">Save</button>
//             </form>
//         </div>
//     );
// };

// export default ClinicSettingsComponent;
