import React from 'react';
import JsonView from 'react-json-view';

const DynamicForm = ({ jsonData }) => {
    const [formData, setFormData] = React.useState({});

    const handleInputChange = (e, itemRef) => {
        const { name, value, type, checked, selectedIndex } = e.target;
        const newFormData = { ...formData };

        if (type === 'checkbox') {
            newFormData[itemRef][name] = checked;
        } else if (type === 'select-one') {
            newFormData[itemRef][name] = jsonData.choices.choice[selectedIndex]['@val'];
        } else {
            newFormData[itemRef][name] = value;
        }

        setFormData(newFormData);
    };

    return (
        <div>
            <JsonView src={jsonData} displayDataTypes={false} enableClipboard={false} />
            <form>
                {Object.entries(jsonData.eform.mainSection.items.section.items).map(([key, value]) => {
                    if (value.item) {
                        const { ref: itemRef, type, choices } = value.item;
                        return (
                            <div key={key}>
                                {type === 'DATE' && <input type="date" name={itemRef} onChange={(e) => handleInputChange(e, itemRef)} />}
                                {type === 'TEXT_AREA' && <textarea name={itemRef} onChange={(e) => handleInputChange(e, itemRef)} />}
                                {type === 'CHECKBOX' && (
                                    <>
                                        {choices.choice.map((choice, index) => (
                                            <label key={choice['@val']}>
                                                <input type="checkbox" name={itemRef} value={choice['@val']} onChange={(e) => handleInputChange(e, itemRef)} />
                                                {choice.display || choice['@val']}</label>
                                        ))}
                                    </>
                                )}
                                {
                                    type === 'MENU' && (
                                        <select name={itemRef} onChange={(e) => handleInputChange(e, itemRef)}>
                                            <option value=""></option>
                                            {choices.choice.map((choice, index) => (
                                                <option key={choice['@val']} value={choice['@val']}>
                                                    {choice.display || choice['@val']}
                                                </option>
                                            ))}
                                        </select>
                                    )
                                }
                                {
                                    type === 'PROPOSITION' && (
                                        <>
                                            <input type="hidden" name={itemRef} value={value.cNote} readOnly />
                                            <div>
                                                <input
                                                    type="radio"
                                                    name={`${itemRef}Flag`}
                                                    value={value.negFlag || 'GREEN'}
                                                    onChange={(e) => handleInputChange(e, `neg${itemRef}`)}
                                                />
                                                {value.negNote}
                                            </div>
                                            <div>
                                                <input
                                                    type="radio"
                                                    name={`${itemRef}Flag`}
                                                    value={value.flag || 'GREEN'}
                                                    onChange={(e) => handleInputChange(e, `neg${itemRef}`)}
                                                />
                                                {value.posNote}
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        );
                    }

                    if (value.section) {
                        const { ref: sectionRef, items } = value.section;
                        return (
                            <div key={key}>
                                <h3>{value.c}</h3>
                               <DynamicForm jsonData={items} />
                            </div>
                        );
                    }

                    return null;
                })}
            </form>
        </div>
    );
};

export default DynamicForm;