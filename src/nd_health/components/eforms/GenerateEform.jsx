import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const DynamicFormBuilder = () => {
    const [formData, setFormData] = useState({
        title: "Sample e-form title",
        sections: [
            {
                title: "1st Section",
                items: [
                    { type: "text", question: "Sample question" },
                    { type: "date", question: "Date of Birth", format: "YYYY-mm-dd", required: true },
                ]
            }
        ]
    });

    const updateFormTitle = (title) => {
        setFormData(prevState => ({
            ...prevState,
            title
        }));
    };

    const addSection = () => {
        setFormData(prevState => ({
            ...prevState,
            sections: [...prevState.sections, { title: '', items: [] }]
        }));
    };

    const deleteSection = (index) => {
        setFormData(prevState => ({
            ...prevState,
            sections: prevState.sections.filter((_, i) => i !== index)
        }));
    };

    const updateSectionTitle = (index, title) => {
        setFormData(prevState => ({
            ...prevState,
            sections: prevState.sections.map((section, i) => i === index ? { ...section, title } : section)
        }));
    };

    const addItem = (sectionIndex) => {
        setFormData(prevState => {
            const updatedSections = [...prevState.sections];
            updatedSections[sectionIndex].items.push({ type: '', question: '' });
            return { ...prevState, sections: updatedSections };
        });
    };

    const deleteItem = (sectionIndex, itemIndex) => {
        setFormData(prevState => {
            const updatedSections = [...prevState.sections];
            updatedSections[sectionIndex].items.splice(itemIndex, 1);
            return { ...prevState, sections: updatedSections };
        });
    };

    const updateItem = (sectionIndex, itemIndex, key, value) => {
        setFormData(prevState => {
            const updatedSections = [...prevState.sections];
            updatedSections[sectionIndex].items[itemIndex][key] = value;
            return { ...prevState, sections: updatedSections };
        });
    };

    const typeOptions = ["select", "text", "time", "date", "radio"];
    const formatOptions = ["default","YYYY-mm-dd", "hh:mm P"];

    return (
        <Container>
            <Box mb={4}>
                <TextField
                    fullWidth
                    label="Form Title"
                    value={formData.title}
                    onChange={(e) => updateFormTitle(e.target.value)}
                    variant="outlined"
                    margin="normal"
                />
            </Box>
            {formData.sections.map((section, sectionIndex) => (
                <Box key={sectionIndex} mb={4}>
                    <TextField
                        fullWidth
                        label="Section Title"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <IconButton onClick={() => deleteSection(sectionIndex)} color="secondary">
                        <Delete />
                    </IconButton>
                    <Box mt={2}>
                        {section.items.map((item, itemIndex) => (
                            <Box key={itemIndex} mb={2} display="flex" alignItems="center">
                                <TextField
                                    label="Question"
                                    value={item.question}
                                    onChange={(e) => updateItem(sectionIndex, itemIndex, 'question', e.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                    style={{ marginRight: 8 }}
                                />
                                <FormControl variant="outlined" margin="normal" style={{ marginRight: 8, minWidth: 120 }}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={item.type}
                                        onChange={(e) => updateItem(sectionIndex, itemIndex, 'type', e.target.value)}
                                        label="Type"
                                    >
                                        {typeOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" margin="normal" style={{ marginRight: 8, minWidth: 120 }}>
                                    <InputLabel>Format</InputLabel>
                                    <Select
                                        value={item.format}
                                        onChange={(e) => updateItem(sectionIndex, itemIndex, 'format', e.target.value)}
                                        label="Format"
                                    >
                                        {formatOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={item.required || false}
                                            onChange={(e) => updateItem(sectionIndex, itemIndex, 'required', e.target.checked)}
                                        />
                                    }
                                    label="Required"
                                    style={{ marginRight: 8 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={item.hidden || false}
                                            onChange={(e) => updateItem(sectionIndex, itemIndex, 'hidden', e.target.checked)}
                                        />
                                    }
                                    label="Hidden"
                                    style={{ marginRight: 8 }}
                                />
                                <TextField
                                    label="Options (comma-separated)"
                                    value={item.options ? item.options.join(', ') : ''}
                                    onChange={(e) => updateItem(sectionIndex, itemIndex, 'options', e.target.value.split(',').map(option => option.trim()))}
                                    variant="outlined"
                                    margin="normal"
                                    style={{ marginRight: 8 }}
                                />
                                <IconButton onClick={() => deleteItem(sectionIndex, itemIndex)} color="secondary">
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => addItem(sectionIndex)}
                        >
                            Add Item
                        </Button>
                    </Box>
                </Box>
            ))}
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={addSection}
            >
                Add Section
            </Button>
            <Box mt={4}>
                <Typography variant="h6">Form Data</Typography>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </Box>
        </Container>
    );
};

export default DynamicFormBuilder;