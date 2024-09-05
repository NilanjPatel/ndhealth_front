import formData1 from './test.json';
import React, {useState, useEffect} from 'react';
// import 'react-datepicker/dist/react-datepicker.css'; // Import date picker CSS
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import enLocale from 'date-fns/locale/en-US'; // Example, use appropriate locale for your application

const DynamicForm = () => {
    const [formData, setFormData] = useState(formData1);


    return (
        <div>
            <h2>{formData.title}</h2>
            {formData.sections.map((section, index) => (
                <div key={index}>
                    <h3>{section.title}</h3>
                    <h3>{section.subheading}</h3>
                    {section.items.map((item, idx) => (
                        <div key={idx}>
                            <label>{item.question}</label>
                            {renderInput(item)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const renderInput = (item) => {
    switch (item.type) {
        case 'yesno':
            return (
                <div>
                    <input type="radio" id={`${item.question}-yes`} name={item.question} value="yes"/>
                    <label htmlFor={`${item.question}-yes`}>Yes</label>
                    <input type="radio" id={`${item.question}-no`} name={item.question} value="no"/>
                    <label htmlFor={`${item.question}-no`}>No</label>
                </div>
            );
        case 'text':
            return <input type="text"/>;
        case 'checkbox':
            return (
                <div>
                    {item.options.map((option, index) => (
                        <div key={index}>
                            <input type="checkbox" value={option}/>
                            <label>{option}</label>
                        </div>
                    ))}
                </div>
            );
        case 'radio':
            return (
                <div>
                    {item.options.map((option, index) => (
                        <div key={index}>
                            <input type="radio" id={`${item.question}-${index}`} name={item.question} value={option}/>
                            <label htmlFor={`${item.question}-${index}`}>{option}</label>
                        </div>
                    ))}
                </div>
            );
        case 'select':
            return (
                <select>
                    {item.options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            );
        case 'date':
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                            label="Controlled picker"
                            // value={value}
                            selected={null} // Set selected date state
                            dateFormat={item.format} // Set date format
                            placeholderText={item.format} // Show format as placeholder
                            // onChange={(newValue) => setValue(newValue)}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            );
        case 'time':
            return (
                // <input type="time" step="1" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label={item.question}
                        // value={value}
                        // selected={null} // Set selected date state
                        dateFormat={item.format} // Set date format
                        placeholderText={item.format} // Show format as placeholder
                    />
                </LocalizationProvider>
            );
        default:
            return null;
    }
};

export default DynamicForm;
