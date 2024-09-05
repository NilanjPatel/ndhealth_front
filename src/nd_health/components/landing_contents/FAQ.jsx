import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StyledTitle from './components/StyledTitle';

const FAQ = () => {
    const [expanded, setExpanded] = useState(null);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const faqData = [
        {
            question: 'How can ND Health benefit my clinic?',
            answer: 'ND Health streamlines clinic operations by automating administrative tasks, enhancing patient communication, and optimizing appointment scheduling. Our platform saves time, reduces workload, and improves overall efficiency, leading to better patient care.',
        },
        {
            question: 'Can ND Health integrate with existing clinic management systems?',
            answer: 'Yes, ND Health is designed to integrate seamlessly with existing clinic management systems, EMRs (Electronic Medical Records) like Oscar and Juno. Our team will work closely with your clinic to ensure a smooth transition and interoperability with your current systems.'
        },
        {
            question: 'Is ND Health suitable for clinics of all sizes?',
            answer: 'Yes, ND Health is designed to cater to clinics of all sizes, from small practices to large healthcare facilities. Our customizable solutions can be tailored to meet the specific needs and preferences of your clinic, regardless of its size or specialty.',
        },
        {
            question: 'How does ND Health improve patient communication?',
            answer: 'Health provides multiple communication channels, including  appointment confirmation, reminders and virtual visits. Patients can easily receive timely updates, leading to improved patient engagement and satisfaction.',
        },
        {
            question: 'What kind of support does ND Health offer?',
            answer: 'ND Health provides comprehensive customer support to ensure a positive user experience. Our dedicated team is available to assist with onboarding, training, technical issues, and ongoing support. We are committed to helping your clinic succeed with our platform.',
        },
        {
            question: 'How can I get started with ND Health?',
            answer: 'Getting started with ND Health is easy! Simply schedule a demo with our team to see our platform in action and learn how it can benefit your clinic. Our team will guide you through the onboarding process and provide the support you need to get started.',
        },

    ];

    return (
        <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>

            <StyledTitle>
                Frequently Asked Questions
            </StyledTitle>
            

            {faqData.map((faq, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`)}
                    style={{ borderRadius: '1rem', backgroundColor: 'white', marginBottom: '0.3rem', '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' } }}

                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}bh-content`}
                        id={`panel${index}bh-header`}
                        sx={{ '&::before': { display: 'none' } }}

                    >
                        {/* <HelpOutlineIcon style={{ marginRight: '8px' }} /> */}
                        <Typography variant="h6">{faq.question}</Typography>
                    </AccordionSummary>
                    {/* <Divider /> */}
                    <AccordionDetails>
                        {/* <Card> */}
                        <CardContent>
                            <Typography>{faq.answer}</Typography>
                        </CardContent>
                        {/* </Card> */}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default FAQ;
