import React, { useState, useEffect } from 'react';
import formData1 from './mva.json';

const DynamicForm = () => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        setFormData(formData1);
    }, []);

    const renderFormField = (field) => {
        switch (field['@type']) {
            case 'TEXT_AREA':
                return <textarea name={field["@ref"]} placeholder={field.c} />;
            case 'MENU_MULTI_SELECT':
                return (
                    <select multiple name={field["@ref"]} required={field["@required"]}>
                        {field.choices.choice.map((option, index) => (
                            <option key={index} value={option["@val"]}>
                                {option["@val"]}
                            </option>
                        ))}
                    </select>
                );
            case 'MENU':
                return (
                    <select name={field["@ref"]} required={field["@required"]}>
                        {field.choices.choice.map((option, index) => (
                            <option key={index} value={option["@val"]}>
                                {option["@val"]}
                            </option>
                        ))}
                    </select>
                );

            case 'DATE':
                return <input type="date" name={field["@ref"]} />;
            case 'CHECKBOX':
                return (
                    <div key={field["@ref"]}>
                        <input type="checkbox" name={field["@ref"]} id={field["@ref"]} />
                        <label htmlFor={field["@ref"]}>{field.c}</label>
                    </div>
                );
            case 'TEXT_FIELD':
                return (
                    <div key={field["@ref"]}>
                        <label>{field.c}</label>
                        <input type="text" name={field["@ref"]} />
                    </div>
                );
            case 'PROPOSITION':
                return (
                    <div key={field["@ref"]}>
                        <label>{field.c}</label>
                        <div>
                            <label>
                                <input type="radio" name={field["@ref"]} value="true" />
                                {field.posNote}
                            </label>
                            <label>
                                <input type="radio" name={field["@ref"]} value="false" />
                                {field.negNote}
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    const renderFormItems = (items) => {
        if (!items) return null;

        // Check if items is an array
        if (Array.isArray(items)) {
            return items.map((item, index) => {
                return (
                    <div key={index}>
                        {/* Render item content here */}
                    </div>
                );
            });
        } else {
            // Convert items object to array and then map over it
            return Object.keys(items).map((key, index) => {
                return (
                    <div key={index}>
                        {/* Render item content here */}
                    </div>
                );
            });
        }
    };

    const renderSection0 = (section) => {
        return (
            <div key={section["@ref"]}>
                {section.items && section.items.section && Object.keys(section.items.section).map((key, index) => (
                    <div key={index}>
                        {section.items.section[key].item
                            ? renderFormField(section.items.section[key].item)
                            : renderSection(section.items.section[key].section)}
                    </div>
                ))}
            </div>
        );
    };


    const renderSection1 = (section) => {
        return (
            <div key={section["@ref"]}>
                {Array.isArray(section.items.section.items) ?
                    section.items.section.items.map((item, index) => (
                        <div key={item["@ref"] ?? index}>
                            {item.item ? renderFormField(item.item) : renderSection(item.section)}
                        </div>
                    )) :
                    Object.keys(section.items.section.items).map((key, index) => (
                        <div key={index}>
                            {renderSection({ "@ref": key, items: section.items.section.items[key] })}
                        </div>
                    ))
                }

            </div>
        );
    };


    const renderSection2 = (section) => {
        if (!section || !section.items) return null;
    
        return (
            <div key={section["@ref"]}>
                {Array.isArray(section.items) ?
                    section.items.map((itemOrSection, index) => (
                        <div key={itemOrSection["@ref"] ?? index}>
                            {itemOrSection.item ? renderFormField(itemOrSection.item) : renderSection(itemOrSection.section)}
                        </div>
                    )) :
                    Object.keys(section.items).map((key, index) => (
                        <div key={key}>
                            {renderSection({ "@ref": key, items: section.items[key] })}
                        </div>
                    ))
                }
            </div>
        );
    };
    const renderSection = (section) => {
        if (!section || !section.items) return null;

        return (
            <div key={section["@ref"]}>
                {section.items.map((itemOrSection, index) => (
                    <div key={index}>
                        {itemOrSection.item ? renderFormField(itemOrSection.item) : renderSection(itemOrSection.section)}
                    </div>
                ))}
            </div>
        );
    };
    

    const renderForm = (form) => {
        if (!form || !form.sections) return null;

        const stack = [...form.sections];

        const renderNextItem = () => {
            if (stack.length === 0) return null;

            const item = stack.pop();

            if (item.item) {
                return renderFormField(item.item);
            } else if (item.section && item.section.items) {
                stack.push(...item.section.items);
            }

            return renderNextItem();
        };

        return (
            <div>
                {renderNextItem()}
            </div>
        );
    };



    return (
        <div>
            {formData && (
                <form>
                    <h2>{formData.eform["@title"]}</h2>
                    {renderSection(formData.eform.mainSection.item.section)}
                    {/* {renderForm(formData.eform.mainSection)} */}
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default DynamicForm;
