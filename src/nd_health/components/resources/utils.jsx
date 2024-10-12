import API_BASE_PATH from "../../../apiConfig";
import axios from "axios";

export const redirectHomeM = (clinicSlug) => {
    window.location.href = `/clinic/${clinicSlug}/`;
};

export const formatTime = (timeString) => {
    const formattedTime = new Date(`2000-01-01T${timeString}`);
    return formattedTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

// Add more utility functions as needed

// Helper function to format DOB with slashes
export const formatDob = (input) => {
    // Allow only numeric characters
    const numericInput = input.replace(/\D/g, "");
    const truncatedInput = numericInput.slice(0, 8);

    // Add slashes after the 4th and 6th characters
    let formattedDob;
    if (truncatedInput.length >= 6) {
        formattedDob = `${truncatedInput.slice(0, 4)}-${truncatedInput.slice(4, 6)}-${truncatedInput.slice(6)}`;
    } else if (truncatedInput.length >= 4) {
        formattedDob = `${truncatedInput.slice(0, 4)}-${truncatedInput.slice(4)}`;
    } else {
        formattedDob = truncatedInput;
    }

    // Remove trailing hyphen if present
    if (formattedDob.endsWith('-')) {
        formattedDob = formattedDob.slice(0, -1);
    }

    return formattedDob;
};

export const uppercaseInputChange = (e) => {
    // Convert input value to uppercase
    const uppercasedValue = e.target.value.toUpperCase();
    return uppercasedValue;
};

// Helper function to format HIN with hyphens
export const formatHin = (input) => {
    // Allow only numeric characters
    const numericInput = input.replace(/\D/g, "");

    // Truncate input if it exceeds 10 digits
    const truncatedInput = numericInput.slice(0, 10);

    // Add hyphens after the 4th and 7th characters
    let formattedHin;
    if (truncatedInput.length > 6) {
        formattedHin = `${truncatedInput.slice(0, 4)}-${truncatedInput.slice(4, 7)}-${truncatedInput.slice(7)}`;
    } else if (truncatedInput.length > 3) {
        formattedHin = `${truncatedInput.slice(0, 4)}-${truncatedInput.slice(4)}`;
    } else {
        formattedHin = truncatedInput;
    }

    // Remove trailing hyphen if present
    if (formattedHin.endsWith('-')) {
        formattedHin = formattedHin.slice(0, -1);
    }

    return formattedHin;
};

// Helper function to format HIN with hyphens
export const formatPhone = (input) => {
    // Allow only numeric characters
    const numericInput = input.replace(/\D/g, "");

    // Truncate input if it exceeds 12 digits
    const truncatedInput = numericInput.slice(0, 10);

    // Add hyphens after the 3rd and 6th characters+
    if (truncatedInput.length > 6) {
        return `${truncatedInput.slice(0, 3)}-${truncatedInput.slice(3, 6)}-${truncatedInput.slice(6)}`;
    } else if (truncatedInput.length > 3) {
        return `${truncatedInput.slice(0, 3)}-${truncatedInput.slice(3)}`;
    } else {
        return truncatedInput;
    }
};

export function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
    // Regular expression for validating phone number in the format "123-456-7890"
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    // Test the phone number against the regular expression
    return phoneRegex.test(phoneNumber);
}

export function isValidPostalCode(postalCode) {
    // Regular expression for validating postal code in the format "M1B 2R9"
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

    // Test the postal code against the regular expression
    return postalCodeRegex.test(postalCode);
}

export const formatPostalCode = (input) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const formattedInput = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Add a space after the 3rd character
    let result = formattedInput.slice(0, 3);
    if (formattedInput.length > 3) {
        result += " " + formattedInput.slice(3);
    }

    // Allow up to 7 characters (including space)
    if (formattedInput.length > 7) {
        result = result.slice(0, 7);
    }

    return result;
};

export const checkAppStatus = async (id) => {
    try {
        const response = await fetch.get(`${API_BASE_PATH}/appointment-status/${id}/`);
        const clinic = await response.data;
        return clinic;
    } catch (error) {
        return false;
    }
};

export const validatePassword = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (password !== confirmPassword) {
        return false;
    } else if (!passwordRegex.test(password)) {
        return false;
    } else {
        return true;
    }
};

export const isValidOhipNumber = (input) => {
    // Regular expression to match six digits starting with 0
    const sixDigitRegex = /^0\d{5}$/;
    return sixDigitRegex.test(input);
};

export const checkUsername = async (username) => {
    try {
        const response = await axios.post(`${API_BASE_PATH}/check-username/`, {
            username: username,
        });
        return response;
    } catch (error) {
        return false;
    }
};

export const sendCheckEmailSms = async (newid) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_PATH}/notify-sms/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${accessToken}`,
            },
            body: JSON.stringify({
                newid: newid,
            }),
        });

        return response;
    } catch (e) {
        return false;
    }
};

export const getTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
